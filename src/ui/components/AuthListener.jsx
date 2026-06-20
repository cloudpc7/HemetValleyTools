import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { setAuthUser, clearAuthUser } from '../../redux/slices/auth.slice';

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(clearAuthUser());
        return;
      }
      const tokenResult = await user.getIdTokenResult();
      dispatch(setAuthUser({
        user: { uid: user.uid, email: user.email },
        isAdmin: tokenResult.claims.role === 'admin',
      }));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default AuthListener;