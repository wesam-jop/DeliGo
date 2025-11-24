import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api';
import authReducer from './slices/authSlice';
import storesReducer from './slices/storesSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import dashboardReducer from './slices/dashboardSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authReducer,
    stores: storesReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

// Export types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

