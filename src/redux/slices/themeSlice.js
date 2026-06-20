import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false; // Default to Light Mode (Stark Theme)
  } catch (e) {
    return false;
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      try {
        localStorage.setItem('theme', JSON.stringify(state.isDarkMode));
      } catch (e) {
        // Ignore write errors (e.g. private browsing)
      }
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
      try {
        localStorage.setItem('theme', JSON.stringify(state.isDarkMode));
      } catch (e) {
        // Ignore write errors
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
