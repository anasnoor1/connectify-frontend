import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLandingCounts = createAsyncThunk(
  'landing/fetchCounts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/counts');
      if (!res.ok) {
        return rejectWithValue(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch');
    }
  }
);

const initialState = {
  totalBrands: 0,
  totalInfluencers: 0,
  status: 'idle',
  error: null,
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingCounts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLandingCounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalBrands = action.payload.totalBrands || 0;
        state.totalInfluencers = action.payload.totalInfluencers || 0;
      })
      .addCase(fetchLandingCounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default landingSlice.reducer;
