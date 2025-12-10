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

export const fetchHomeHighlights = createAsyncThunk(
  'landing/fetchHighlights',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/home/highlights');
      if (!res.ok) {
        return rejectWithValue(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const payload = data?.data || data;
      return {
        totalBrands: payload.totalBrands || 0,
        totalInfluencers: payload.totalInfluencers || 0,
        topInfluencers: payload.topInfluencers || [],
        topBrands: payload.topBrands || [],
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch highlights');
    }
  }
);

const initialState = {
  totalBrands: 0,
  totalInfluencers: 0,
  topInfluencers: [],
  topBrands: [],
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
      })
      .addCase(fetchHomeHighlights.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeHighlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalBrands = action.payload.totalBrands || state.totalBrands;
        state.totalInfluencers = action.payload.totalInfluencers || state.totalInfluencers;
        state.topInfluencers = action.payload.topInfluencers || [];
        state.topBrands = action.payload.topBrands || [];
      })
      .addCase(fetchHomeHighlights.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default landingSlice.reducer;
