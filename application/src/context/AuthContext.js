import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user_data');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login(phone, password);
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        
        await AsyncStorage.setItem('auth_token', authToken);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول',
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        
        // Save token if verification not required
        if (authToken) {
          await AsyncStorage.setItem('auth_token', authToken);
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          
          setToken(authToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
        
        return { success: true, data: response.data, verificationRequired: response.data.verification_required };
      }
      
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء التسجيل',
      };
    }
  };

  const verifyPhone = async (phone, code) => {
    try {
      const response = await authAPI.verifyPhone(phone, code);
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        
        await AsyncStorage.setItem('auth_token', authToken);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message || 'Verification failed' };
    } catch (error) {
      console.error('Verify error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'رمز التحقق غير صحيح',
      };
    }
  };

  const resendVerification = async (phone) => {
    try {
      const response = await authAPI.resendVerification(phone);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء إعادة الإرسال',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    verifyPhone,
    resendVerification,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

