import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  error: null,
  lastPaymentId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPayment(state) {
      state.status = 'idle';
      state.error = null;
      state.lastPaymentId = null;
    },
    paymentIntentLoading(state) {
      state.status = 'intent_loading';
      state.error = null;
    },
    paymentIntentReady(state) {
      state.status = 'ready';
      state.error = null;
    },
    paymentStarted(state) {
      state.status = 'processing';
      state.error = null;
    },
    paymentSucceeded(state, action) {
      state.status = 'success';
      state.error = null;
      state.lastPaymentId = action.payload && action.payload.paymentIntentId ? action.payload.paymentIntentId : null;
    },
    paymentFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});

export const {
  resetPayment,
  paymentIntentLoading,
  paymentIntentReady,
  paymentStarted,
  paymentSucceeded,
  paymentFailed,
} = paymentSlice.actions;

export default paymentSlice.reducer;
