import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


// Helper function to get stored auth data
const getStoredAuthData = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData) {
      return {
        tokens: {
          access: authData.access,
          refresh: authData.refresh,
        },
        user: authData.user,
      };
    }
    return { tokens: null, user: null };
  } catch (error) {
    console.error("Error parsing auth data from localStorage:", error);
    return { tokens: null, user: null };
  }
};

// Get initial state from localStorage
const storedAuth = getStoredAuthData();

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("login/", credentials);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user,
      };
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data || { detail: err.message || "Login Failed" }
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("register/", userData);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        email: userData.email,
        detail: response.data?.detail || "Registration Successful",
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { detail: err.message || "Registration Failed" }
      );
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      await api.post("/resend-verification/", { email });
      return { email };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    tokens: storedAuth.tokens,
    isAuthenticated: !!storedAuth.tokens?.access,
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth");
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
      
      // Update localStorage with new user data
      const authData = JSON.parse(localStorage.getItem("auth")) || {};
      authData.user = state.user;
      localStorage.setItem("auth", JSON.stringify(authData));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = false;
        state.tokens = action.payload;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: action.payload.access,
            refresh: action.payload.refresh,
            user: action.payload.user,
          })
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload || { detail: "Registration failed" };
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.tokens = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Store in localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: action.payload.access,
            refresh: action.payload.refresh,
            user: action.payload.user,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
