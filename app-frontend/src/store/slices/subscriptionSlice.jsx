import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseUrl } from '../../api/ApiUrl';


export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async (makeAuthenticatedRequest, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/subscription`, {
        method: 'GET',
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    data: null,
    loading: false,
    error: null,
    fetchedOnce: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.fetchedOnce = true;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default subscriptionSlice.reducer;