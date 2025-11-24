import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import { getNetworkErrorMessage } from '../../utils/device';
import BASE_URL from '../../config/api';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Request OTP for login
export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async ({ phone }, { rejectWithValue }) => {
    try {
      console.log('Requesting OTP for phone:', phone);
      const response = await authAPI.requestOTP(phone);
      console.log('OTP Response:', response);
      if (response.success) {
        return { phone, message: response.message };
      }
      return rejectWithValue(response.message || 'Failed to send OTP');
    } catch (error) {
      console.error('OTP Request Error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: BASE_URL,
      });
      
      // Better error messages
      if (!error.response) {
        const networkError = getNetworkErrorMessage(error, BASE_URL);
        return rejectWithValue(networkError || 'لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت وإعدادات الـ API');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        `حدث خطأ أثناء إرسال رمز التحقق (${error.response?.status || 'Unknown'})`
      );
    }
  }
);

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(phone, password);
      if (response.success && response.data) {
        const { user, token } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        return { user, token };
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      if (response.success && response.data) {
        const { user, token } = response.data;
        if (token) {
          await AsyncStorage.setItem('auth_token', token);
          await AsyncStorage.setItem('user_data', JSON.stringify(user));
          return { user, token, verificationRequired: response.data.verification_required };
        }
        return { user, token: null, verificationRequired: true };
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async ({ phone, code, action = 'login' }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyPhone(phone, code, action);
      if (response.success && response.data) {
        const { user, token } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        return { user, token };
      }
      return rejectWithValue(response.message || 'Verification failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'رمز التحقق غير صحيح');
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await authAPI.resendVerification(phone);
      if (response.success) {
        return response.message;
      }
      return rejectWithValue(response.message || 'Failed to resend');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'حدث خطأ أثناء إعادة الإرسال');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        return { user: JSON.parse(userData), token };
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to load user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue('Failed to update user');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Request OTP
    builder
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify Phone
    builder
      .addCase(verifyPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Resend Verification
    builder
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Update User
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

