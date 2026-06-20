import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : { stagedPurchases: [], stagedRentals: [] };
  } catch (e) {
    return { stagedPurchases: [], stagedRentals: [] };
  }
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      stagedPurchases: state.stagedPurchases,
      stagedRentals: state.stagedRentals,
    }));
  } catch (e) {
    // Ignore write errors
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    stagePurchase: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.stagedPurchases.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
        existing.stagedAt = new Date().toISOString();
      } else {
        state.stagedPurchases.push({
          product,
          quantity,
          stagedAt: new Date().toISOString()
        });
      }
      saveCartToStorage(state);
    },
    removePurchase: (state, action) => {
      const productId = action.payload;
      state.stagedPurchases = state.stagedPurchases.filter(item => item.product.id !== productId);
      saveCartToStorage(state);
    },
    stageRental: (state, action) => {
      const { product, rentalDays, rentDate } = action.payload;
      // Staged rentals can be multiple or combined
      const existing = state.stagedRentals.find(item => item.product.id === product.id);
      if (existing) {
        existing.rentalDays = rentalDays;
        existing.rentDate = rentDate;
        existing.stagedAt = new Date().toISOString();
      } else {
        state.stagedRentals.push({
          product,
          rentalDays,
          rentDate,
          stagedAt: new Date().toISOString()
        });
      }
      saveCartToStorage(state);
    },
    removeRental: (state, action) => {
      const productId = action.payload;
      state.stagedRentals = state.stagedRentals.filter(item => item.product.id !== productId);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.stagedPurchases = [];
      state.stagedRentals = [];
      saveCartToStorage(state);
    }
  }
});

export const {
  stagePurchase,
  removePurchase,
  stageRental,
  removeRental,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
