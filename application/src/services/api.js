import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api';
import { getNetworkErrorMessage } from '../utils/device';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header
    const language = await AsyncStorage.getItem('language') || 'ar';
    config.headers['Accept-Language'] = language;
    
    // Log request for debugging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    // Log error for debugging
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      data: error.response?.data,
      request: error.request,
    });
    
    if (error.response?.status === 401) {
      // Unauthorized - Clear token and redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    
    // Handle network errors
    if (!error.response) {
      const networkError = getNetworkErrorMessage(error, error.config?.baseURL || BASE_URL);
      console.error('Network Error - No response from server:', {
        message: error.message,
        code: error.code,
        baseURL: error.config?.baseURL || BASE_URL,
        helpfulMessage: networkError,
      });
      
      // Add helpful message to error object
      error.helpfulMessage = networkError;
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/register', data);
    return response.data;
  },
  
  requestOTP: async (phone) => {
    const response = await api.post('/login', { phone });
    return response.data;
  },
  
  login: async (phone, password) => {
    const response = await api.post('/login', { phone, password });
    return response.data;
  },
  
  verifyPhone: async (phone, code, action = 'login') => {
    const response = await api.post('/verify-phone', { phone, code, action });
    return response.data;
  },
  
  resendVerification: async (phone, action = 'login') => {
    const response = await api.post('/resend-verification', { phone, action });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Profile APIs
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword, newPasswordConfirmation) => {
    const response = await api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
    return response.data;
  },
};

// Store APIs
export const storeAPI = {
  getStores: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },
  
  getStore: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
  
  getStoreProducts: async (storeId, params = {}) => {
    const response = await api.get(`/stores/${storeId}/products`, { params });
    return response.data;
  },
};

// Product APIs
export const productAPI = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

// Category APIs
export const categoryAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// Location APIs
export const locationAPI = {
  getGovernorates: async () => {
    const response = await api.get('/governorates');
    return response.data;
  },
  
  getCities: async (governorateId) => {
    const params = governorateId ? { governorate_id: governorateId } : {};
    const response = await api.get('/cities', { params });
    return response.data;
  },
};

// Cart APIs
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  getCartCount: async () => {
    const response = await api.get('/cart/count');
    return response.data;
  },
  
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },
  
  updateCart: async (productId, quantity) => {
    const response = await api.put('/cart/update', { product_id: productId, quantity });
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// Order APIs
export const orderAPI = {
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  getUserOrders: async (params = {}) => {
    const response = await api.get('/user/orders', { params });
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  cancelOrder: async (id) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
  
  trackOrder: async (id) => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },
};

// Favorite APIs
export const favoriteAPI = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },
  
  addFavorite: async (productId) => {
    const response = await api.post('/favorites', { product_id: productId });
    return response.data;
  },
  
  removeFavorite: async (productId) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  },
};

// Delivery Location APIs
export const deliveryLocationAPI = {
  getLocations: async () => {
    const response = await api.get('/delivery-locations');
    return response.data;
  },
  
  createLocation: async (data) => {
    const response = await api.post('/delivery-locations', data);
    return response.data;
  },
  
  updateLocation: async (id, data) => {
    const response = await api.put(`/delivery-locations/${id}`, data);
    return response.data;
  },
  
  deleteLocation: async (id) => {
    const response = await api.delete(`/delivery-locations/${id}`);
    return response.data;
  },
  
  setDefaultLocation: async (id) => {
    const response = await api.post(`/delivery-locations/${id}/default`);
    return response.data;
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getCustomerStats: async () => {
    const response = await api.get('/dashboard/customer');
    return response.data;
  },
  
  getStoreStats: async () => {
    const response = await api.get('/dashboard/store');
    return response.data;
  },
  
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};

export default api;

