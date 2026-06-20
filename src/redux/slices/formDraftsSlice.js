import { createSlice } from '@reduxjs/toolkit';

const initialB2bForm = {
  companyName: '',
  trade: 'Concrete / Masonry',
  spendRange: '$1,000 - $5,000',
  contactName: '',
  phone: '',
  email: '',
  notes: ''
};

const initialBulkForm = {
  name: '',
  company: '',
  phone: '',
  email: '',
  details: ''
};

const initialRepairForm = {
  name: '',
  email: '',
  phone: '',
  modelName: '',
  brand: 'Milwaukee',
  issueDescription: ''
};

const initialServicesForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  serviceType: 'Concrete Pouring & Layout',
  details: ''
};

const initialBookingForm = {
  bookingStep: 1,
  selectedCategory: 'Rentals',
  selectedToolId: 't1',
  selectedDuration: 'Daily',
  selectedDate: '',
  selectedTimeSlot: '',
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    projectNote: ''
  },
  isConfirmed: false
};

const formDraftsSlice = createSlice({
  name: 'formDrafts',
  initialState: {
    b2bForm: initialB2bForm,
    bulkForm: initialBulkForm,
    repairForm: initialRepairForm,
    servicesForm: initialServicesForm,
    bookingForm: initialBookingForm,
    isBulkSubmitting: false,
    bulkSubmitted: false,
    b2bIsSubmitting: false,
    b2bFormSubmitted: false,
    b2bActiveStep: 1,
    b2bUploadedFiles: [],
    b2bIsDragging: false,
    servicesFormSubmitted: false,
  },
  reducers: {
    updateB2bDraft: (state, action) => {
      state.b2bForm = { ...state.b2bForm, ...action.payload };
    },
    updateBulkDraft: (state, action) => {
      state.bulkForm = { ...state.bulkForm, ...action.payload };
    },
    updateRepairDraft: (state, action) => {
      state.repairForm = { ...state.repairForm, ...action.payload };
    },
    updateServicesDraft: (state, action) => {
      state.servicesForm = { ...state.servicesForm, ...action.payload };
    },
    updateBookingDraft: (state, action) => {
      state.bookingForm = { ...state.bookingForm, ...action.payload };
    },
    updateBookingCustomerInfo: (state, action) => {
      state.bookingForm.customerInfo = { ...state.bookingForm.customerInfo, ...action.payload };
    },
    setIsBulkSubmitting: (state, action) => {
      state.isBulkSubmitting = action.payload;
    },
    setBulkSubmitted: (state, action) => {
      state.bulkSubmitted = action.payload;
    },
    setB2bIsSubmitting: (state, action) => {
      state.b2bIsSubmitting = action.payload;
    },
    setB2bFormSubmitted: (state, action) => {
      state.b2bFormSubmitted = action.payload;
    },
    setB2bActiveStep: (state, action) => {
      state.b2bActiveStep = action.payload;
    },
    setB2bUploadedFiles: (state, action) => {
      state.b2bUploadedFiles = action.payload;
    },
    addB2bUploadedFiles: (state, action) => {
      state.b2bUploadedFiles = [...state.b2bUploadedFiles, ...action.payload];
    },
    updateB2bFileProgress: (state, action) => {
      const { name, progress, status } = action.payload;
      state.b2bUploadedFiles = state.b2bUploadedFiles.map(f => 
        f.name === name ? { ...f, progress, ...(status ? { status } : {}) } : f
      );
    },
    removeB2bUploadedFile: (state, action) => {
      state.b2bUploadedFiles = state.b2bUploadedFiles.filter(f => f.name !== action.payload);
    },
    setB2bIsDragging: (state, action) => {
      state.b2bIsDragging = action.payload;
    },
    setServicesFormSubmitted: (state, action) => {
      state.servicesFormSubmitted = action.payload;
    },
    clearB2bDraft: (state) => {
      state.b2bForm = initialB2bForm;
    },
    clearBulkDraft: (state) => {
      state.bulkForm = initialBulkForm;
    },
    clearRepairDraft: (state) => {
      state.repairForm = initialRepairForm;
    },
    clearServicesDraft: (state) => {
      state.servicesForm = initialServicesForm;
    },
    clearBookingDraft: (state) => {
      state.bookingForm = initialBookingForm;
    },
    clearAllDrafts: (state) => {
      state.b2bForm = initialB2bForm;
      state.bulkForm = initialBulkForm;
      state.repairForm = initialRepairForm;
      state.servicesForm = initialServicesForm;
      state.bookingForm = initialBookingForm;
      state.isBulkSubmitting = false;
      state.bulkSubmitted = false;
      state.b2bIsSubmitting = false;
      state.b2bFormSubmitted = false;
      state.b2bActiveStep = 1;
      state.b2bUploadedFiles = [];
      state.b2bIsDragging = false;
      state.servicesFormSubmitted = false;
    }
  }
});

export const {
  updateB2bDraft,
  updateBulkDraft,
  updateRepairDraft,
  updateServicesDraft,
  updateBookingDraft,
  updateBookingCustomerInfo,
  setIsBulkSubmitting,
  setBulkSubmitted,
  setB2bIsSubmitting,
  setB2bFormSubmitted,
  setB2bActiveStep,
  setB2bUploadedFiles,
  addB2bUploadedFiles,
  updateB2bFileProgress,
  removeB2bUploadedFile,
  setB2bIsDragging,
  setServicesFormSubmitted,
  clearB2bDraft,
  clearBulkDraft,
  clearRepairDraft,
  clearServicesDraft,
  clearBookingDraft,
  clearAllDrafts
} = formDraftsSlice.actions;

export default formDraftsSlice.reducer;
