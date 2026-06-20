import { createSlice } from '@reduxjs/toolkit';

const repairsSlice = createSlice({
  name: 'repairs',
  initialState: {
    activeTicketId: null,
    activeTicketStatus: null,
    searchHistory: [],
    activeGalleryTab: 'engine',
    showAfterState: true,
    selectedToolClass: 'small-gas',
    formSubmitted: false,
    tracerSearchInput: '',
    tracerError: '',
    isTracing: false,
  },
  reducers: {
    setSearchedTicket: (state, action) => {
      const { ticketId, status } = action.payload;
      state.activeTicketId = ticketId;
      state.activeTicketStatus = status;
    },
    addSearchHistory: (state, action) => {
      const ticketId = action.payload;
      if (ticketId && !state.searchHistory.includes(ticketId)) {
        state.searchHistory.push(ticketId);
      }
    },
    clearSearch: (state) => {
      state.activeTicketId = null;
      state.activeTicketStatus = null;
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    setActiveGalleryTab: (state, action) => {
      state.activeGalleryTab = action.payload;
    },
    setShowAfterState: (state, action) => {
      state.showAfterState = action.payload;
    },
    setSelectedToolClass: (state, action) => {
      state.selectedToolClass = action.payload;
    },
    setRepairFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    setTracerSearchInput: (state, action) => {
      state.tracerSearchInput = action.payload;
    },
    setTracerError: (state, action) => {
      state.tracerError = action.payload;
    },
    setIsTracing: (state, action) => {
      state.isTracing = action.payload;
    }
  }
});

export const {
  setSearchedTicket,
  addSearchHistory,
  clearSearch,
  clearSearchHistory,
  setActiveGalleryTab,
  setShowAfterState,
  setSelectedToolClass,
  setRepairFormSubmitted,
  setTracerSearchInput,
  setTracerError,
  setIsTracing
} = repairsSlice.actions;

export default repairsSlice.reducer;
