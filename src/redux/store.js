import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import productsReducer from './slices/productsSlice';
import rentalsReducer from './slices/rentalsSlice';
import repairsReducer from './slices/repairsSlice';
import cartReducer from './slices/cartSlice';
import formDraftsReducer from './slices/formDraftsSlice';
import dataReducer from './slices/data.slice';
import authReducer from './slices/auth.slice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    products: productsReducer,
    rentals: rentalsReducer,
    repairs: repairsReducer,
    cart: cartReducer,
    formDrafts: formDraftsReducer,
    data: dataReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off serializable check for simplified custom ISO Dates inside cart
    }),
});

export default store;