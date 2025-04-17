import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deviceAPI } from '../../utils/api';

const initialState = {
  devices: [],
  loading: false,
  status: 'idle',
  error: null,
  filters: {
    status: 'all',
    fuelType: 'all',
  },
};

export const fetchDeviceById = createAsyncThunk(
  'devices/fetchById',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await deviceAPI.getById(deviceId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchDevices = createAsyncThunk(
  'devices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceAPI.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserDevices = createAsyncThunk(
  'devices/fetchUserDevices',
  async (userId, { rejectWithValue }) => { 
    try {
      const response = await deviceAPI.getUserDevices(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createDevice = createAsyncThunk(
  'devices/create',
  async (deviceData, { rejectWithValue }) => {
    try {
      const response = await deviceAPI.create(deviceData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateDevice1 = createAsyncThunk(
  'devices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Add proper API endpoint formatting
      const response = await deviceAPI.update(id, { data }); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// In deviceSlice.js
export const updateDevice = createAsyncThunk(
  'devices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('Sending update:', data)  // Add this
      const response = await deviceAPI.update(id, data);
      console.log('Update response:', response.data)  // Add this
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async (id, { rejectWithValue, getState }) => {
    try {
      const device = getState().devices.devices.find(d => d.id === id);
      if (['approved', 'rejected'].includes(device.status)) {
        throw new Error('Cannot delete approved/rejected devices');
      }
      await deviceAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Devices
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.devices = action.payload.results;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch devices';
      })
      .addCase(fetchUserDevices.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchUserDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.devices = action.payload.results;
      })
      .addCase(fetchUserDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch devices';
      })
      
      // Create Device
      .addCase(createDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      })
      
      // Update Device
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index === -1) {
          state.devices.push(action.payload);
        } else {
          state.devices[index] = action.payload;
        }
      })
      
      // Delete Device
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(d => d.id !== action.payload);
      })
      
      // Error Handling for all async actions
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload?.error || action.payload || 'Operation failed';
        }
      );
  }
});

export const { setFilter, resetError } = deviceSlice.actions;
export default deviceSlice.reducer;