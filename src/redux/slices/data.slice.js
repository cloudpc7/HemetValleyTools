import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase';

// Helper to wrap the Callable function invocation in a thunk
const makeCallableThunk = (name, functionName) => {
  return createAsyncThunk(
    name,
    async (payload, { rejectWithValue }) => {
      try {
        const callable = httpsCallable(functions, functionName);
        const result = await callable(payload);
        return result.data;
      } catch (error) {
        console.error(`Error executing ${functionName}:`, error);
        return rejectWithValue(error.message || error.toString());
      }
    }
  );
};

export const submitB2BApplicationThunk = makeCallableThunk('data/submitB2BApplication', 'submitB2BApplication');
export const submitServiceRequestThunk = makeCallableThunk('data/submitServiceRequest', 'submitServiceRequest');
export const submitRepairTicketThunk = makeCallableThunk('data/submitRepairTicket', 'submitRepairTicket');
export const traceRepairTicketThunk = makeCallableThunk('data/traceRepairTicket', 'traceRepairTicket');
export const submitBookingThunk = makeCallableThunk('data/submitBooking', 'submitBooking');
export const submitTransactionThunk = makeCallableThunk('data/submitTransaction', 'submitTransaction');
export const submitFeedbackThunk = makeCallableThunk('data/submitFeedback', 'submitFeedback');

export const adminUpdateLeadStatusThunk = makeCallableThunk('data/adminUpdateLeadStatus', 'adminUpdateLeadStatus');
export const adminDeleteRecordThunk = makeCallableThunk('data/adminDeleteRecord', 'adminDeleteRecord');
export const adminUpdateBookingThunk = makeCallableThunk('data/adminUpdateBooking', 'adminUpdateBooking');
export const adminCancelBookingThunk = makeCallableThunk('data/adminCancelBooking', 'adminCancelBooking');
export const adminUpdateTransactionThunk = makeCallableThunk('data/adminUpdateTransaction', 'adminUpdateTransaction');
export const adminCancelTransactionThunk = makeCallableThunk('data/adminCancelTransaction', 'adminCancelTransaction');

const initialState = {
  loading: false,
  error: null,
  success: false,
  repairTraceResult: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    resetDataState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.repairTraceResult = null;
    },
    clearTraceResult: (state) => {
      state.repairTraceResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(traceRepairTicketThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.repairTraceResult = action.payload;
        state.success = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message || "An unexpected error occurred.";
          state.success = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && !action.type.includes('traceRepairTicket'),
        (state) => {
          state.loading = false;
          state.success = true;
        }
      );
  },
});

export const { resetDataState, clearTraceResult } = dataSlice.actions;
export default dataSlice.reducer;