import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../../config/firebase';

const resolveAdminFromUser = async (user) => {
  if (!user) return false;
  const tokenResult = await user.getIdTokenResult();
  return tokenResult.claims.role === 'admin';
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await resolveAdminFromUser(credential.user);
      if (!isAdmin) {
        await firebaseSignOut(auth);
        return rejectWithValue('This account is not authorized for the Pro Portal.');
      }
      return {
        uid: credential.user.uid,
        email: credential.user.email,
        isAdmin: true,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed.');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await firebaseSignOut(auth);
});

const initialState = {
  user: null,
  isAdmin: false,
  initializing: true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
      state.initializing = false;
      state.error = null;
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.initializing = false;
    },
    setAuthInitializing: (state, action) => {
      state.initializing = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAdmin = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign in failed.';
        state.user = null;
        state.isAdmin = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAdmin = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setAuthUser, clearAuthUser, setAuthInitializing, clearAuthError } = authSlice.actions;
export default authSlice.reducer;