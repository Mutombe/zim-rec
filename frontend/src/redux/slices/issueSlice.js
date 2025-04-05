import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { issueRequestAPI } from '../../utils/api';

const initialState = {
  requests: [],
  status: 'idle',
  error: null,
  filters: {
    status: 'all',
    device: 'all',
  },
};

export const createIssueRequest = createAsyncThunk(
  'issueRequests/create',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await issueRequestAPI.create(requestData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitIssueRequest = createAsyncThunk(
  'issueRequests/submit',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await issueRequestAPI.submit(requestId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Add to issueRequestSlice.js
export const updateIssueRequest = createAsyncThunk(
    'issueRequests/update',
    async ({ id, data }, { rejectWithValue, getState }) => {
      try {
        const request = getState().issueRequests.requests.find(r => r.id === id);
        if (['approved', 'rejected'].includes(request.status)) {
          throw new Error('Cannot modify approved/rejected requests');
        }
        const response = await issueRequestAPI.update(id, data);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const deleteIssueRequest = createAsyncThunk(
    'issueRequests/delete',
    async (id, { rejectWithValue, getState }) => {
      try {
        const request = getState().issueRequests.requests.find(r => r.id === id);
        if (['approved', 'rejected'].includes(request.status)) {
          throw new Error('Cannot delete approved/rejected requests');
        }
        await issueRequestAPI.delete(id);
        return id;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

const issueRequestSlice = createSlice({
  name: 'issueRequests',
  initialState,
  reducers: {
    setRequestFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIssueRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createIssueRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests.push(action.payload);
      })
      .addCase(createIssueRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || 'Failed to create request';
      })
      .addCase(submitIssueRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitIssueRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.requests.findIndex(
          req => req.id === action.payload.id
        );
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(submitIssueRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || 'Failed to submit request';
      })
      .addCase(updateIssueRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(
          req => req.id === action.payload.id
        );
        if (index >= 0) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(deleteIssueRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          req => req.id !== action.payload
        );
      });
  },
});

export const { setRequestFilter } = issueRequestSlice.actions;
export default issueRequestSlice.reducer;