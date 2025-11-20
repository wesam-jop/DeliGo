import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  doctorId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  doctorId: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ doctorId: string; token: string }>) => {
      state.isAuthenticated = true;
      state.doctorId = action.payload.doctorId;
      state.token = action.payload.token;
      
      // حفظ في AsyncStorage
      AsyncStorage.setItem('doctorToken', action.payload.token);
      AsyncStorage.setItem('doctorId', action.payload.doctorId);
      AsyncStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.doctorId = null;
      state.token = null;
      
      // حذف من AsyncStorage
      AsyncStorage.removeItem('doctorToken');
      AsyncStorage.removeItem('doctorId');
      AsyncStorage.removeItem('isAuthenticated');
    },
    restoreAuth: (state, action: PayloadAction<{ doctorId: string; token: string }>) => {
      state.isAuthenticated = true;
      state.doctorId = action.payload.doctorId;
      state.token = action.payload.token;
    },
  },
});

export const { login, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;

