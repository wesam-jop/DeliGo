import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// قراءة رابط API من المتغيرات البيئية
// يمكن تعديل الدومين عبر متغير البيئة EXPO_PUBLIC_API_BASE_URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://miaad.site/api';
// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      // إضافة auth token إلى headers
      const token = await AsyncStorage.getItem('doctorToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Doctor', 'Appointment', 'Payment', 'Setting', 'Notification'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<any, { 
      search?: string; 
      category_id?: number | string; 
      area?: string;
    } | void>({
      query: (params) => {
        let url = 'products';
        const queryParams: string[] = [];
        
        if (params) {
          if (params.search) {
            queryParams.push(`search=${encodeURIComponent(params.search)}`);
          }
          if (params.category_id) {
            queryParams.push(`category_id=${encodeURIComponent(String(params.category_id))}`);
          }
          if (params.area) {
            queryParams.push(`area=${encodeURIComponent(params.area)}`);
          }
        }
        
        if (queryParams.length > 0) {
          url += '?' + queryParams.join('&');
        }
        
        return { 
          url, 
          method: 'GET' 
        };
      },
      providesTags: (result) =>
        result?.data?.map?.((p: any) => ({ type: 'Product' as const, id: p.id })) ?? [{ type: 'Product' as const }],
    }),
    getProductAreas: builder.query<any, void>({
      query: () => ({ url: 'products/areas', method: 'GET' }),
      providesTags: [{ type: 'Product' }],
    }),
    getProductStatus: builder.query<any, number | string>({
      query: (id) => ({ url: `products/${id}/status`, method: 'GET' }),
      providesTags: (_res, _err, id) => [{ type: 'Product', id }],
    }),

    // Categories
    getCategories: builder.query<any, void>({
      query: () => ({ url: 'categories', method: 'GET' }),
      providesTags: [{ type: 'Category' }],
    }),

    // Doctor Auth
    doctorLogin: builder.mutation<any, { identifier: string; email: string; password: string }>({
      query: (body) => {
        console.log('RTK Query - إرسال بيانات تسجيل الدخول:', body);
        return { 
          url: 'doctor/login', 
          method: 'POST', 
          body: {
            identifier: body.identifier,
            email: body.email,
            password: body.password,
          },
        };
      },
    }),
    doctorRegister: builder.mutation<any, {
      title: string;
      doctor_email: string;
      doctor_password: string;
      password_confirmation: string;
      category_id: number;
      doctor_area: string;
      doctor_phone: string;
      status?: string;
      has_dashboard_access?: boolean;
      description?: string;
    }>({
      query: (body) => ({ url: 'doctor/register', method: 'POST', body }),
      invalidatesTags: [{ type: 'Doctor' }],
    }),
    doctorMe: builder.query<any, void>({
      query: () => ({ url: 'doctor/me', method: 'GET' }),
      providesTags: [{ type: 'Doctor' }],
    }),
    updateDoctorProfile: builder.mutation<any, { doctorId: number | string; data: { name: string; email: string; phone: string; area: string; category?: string } }>({
      query: ({ doctorId, data }) => ({ 
        url: `doctor/${doctorId}/profile`, 
        method: 'PUT', 
        body: data 
      }),
      invalidatesTags: [{ type: 'Doctor' }],
    }),
    changeDoctorPassword: builder.mutation<any, { doctorId: number | string; current_password: string; new_password: string }>({
      query: ({ doctorId, current_password, new_password }) => ({ 
        url: `doctor/${doctorId}/password`, 
        method: 'PUT', 
        body: { current_password, new_password }
      }),
    }),
    uploadDoctorProfileImage: builder.mutation<any, { doctorId: number | string; image: any }>({
      query: ({ doctorId, image }) => {
        const formData = new FormData();
        
        // React Native FormData format
        const fileUri = image.uri;
        const fileName = image.name || 'profile.jpg';
        const fileType = image.type || 'image/jpeg';
        
        // Extract file extension from URI if needed
        const uriParts = fileUri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        
        formData.append('profile_image', {
          uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
          type: fileType,
          name: fileName,
        } as any);
        
        return {
          url: `doctor/${doctorId}/profile-image`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: [{ type: 'Doctor' }],
    }),
    doctorLogout: builder.mutation<any, void>({
      query: () => ({ url: 'doctor/logout', method: 'POST' }),
    }),

    // Appointments
    createAppointment: builder.mutation<any, any>({
      query: (body) => ({ url: 'appointments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Appointment' }],
    }),
    getDoctorAvailability: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/availability`, method: 'GET' }),
      providesTags: [{ type: 'Appointment' }],
    }),
    getDoctorAvailableSlots: builder.query<
      { success: boolean; date: string; slots: string[] },
      { doctorId: number | string; date: string }
    >({
      query: ({ doctorId, date }) => ({ 
        url: `doctor/${doctorId}/available-slots?date=${date}`, 
        method: 'GET' 
      }),
      providesTags: [{ type: 'Appointment' }],
    }),
    getDoctorAppointments: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/appointments`, method: 'GET' }),
      providesTags: [{ type: 'Appointment' }],
    }),
    getDoctorStats: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/stats`, method: 'GET' }),
    }),
    updateAppointmentStatus: builder.mutation<any, { appointmentId: number | string; status: string }>({
      query: ({ appointmentId, status }) => ({ url: `appointments/${appointmentId}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: [{ type: 'Appointment' }],
    }),
    confirmAppointment: builder.mutation<any, number | string>({
      query: (appointmentId) => ({ url: `appointments/${appointmentId}/confirm`, method: 'POST' }),
      invalidatesTags: [{ type: 'Appointment' }],
    }),

    // Schedule
    getDoctorSchedule: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/schedule`, method: 'GET' }),
      providesTags: [{ type: 'Doctor' }],
    }),
    updateDoctorSchedule: builder.mutation<any, { doctorId: number | string; schedule: any }>(
      {
        query: ({ doctorId, schedule }) => {
          const body = schedule?.schedules
            ? schedule
            : { schedules: Array.isArray(schedule) ? schedule : [schedule] };
          return { url: `doctor/${doctorId}/schedule`, method: 'PUT', body };
        },
        invalidatesTags: [{ type: 'Doctor' }],
      }
    ),

    // Payments
    createPayment: builder.mutation<any, any>({
      query: (body) => ({ url: 'payments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Payment' }],
    }),
    getDoctorPayments: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/payments`, method: 'GET' }),
      providesTags: [{ type: 'Payment' }],
    }),
    getPendingPayments: builder.query<any, void>({
      query: () => ({ url: 'payments/pending', method: 'GET' }),
      providesTags: [{ type: 'Payment' }],
    }),
    uploadPaymentReceipt: builder.mutation<any, { paymentId: number | string; receipt: any }>({
      query: ({ paymentId, receipt }) => {
        const formData = new FormData();
        formData.append('receipt', {
          uri: receipt.uri,
          type: receipt.type || 'image/jpeg',
          name: receipt.name || 'receipt.jpg',
        } as any);
        
        return {
          url: `payments/${paymentId}/receipt`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: [{ type: 'Payment' }],
    }),
    updatePaymentSubscriptionType: builder.mutation<any, { paymentId: number | string; body: { subscription_type: string; subscription_plan_id: number } }>({
      query: ({ paymentId, body }) => ({
        url: `payments/${paymentId}/subscription-type`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Payment' }],
    }),

    // Settings
    getSettings: builder.query<any, void>({
      query: () => ({ url: 'settings', method: 'GET' }),
      providesTags: [{ type: 'Setting' }],
    }),
    getCompanyInfo: builder.query<any, void>({
      query: () => ({ url: 'settings/company-info', method: 'GET' }),
    }),
    getContactInfo: builder.query<any, void>({
      query: () => ({ url: 'settings/contact-info', method: 'GET' }),
    }),

    // Subscriptions
    getSubscriptionPlans: builder.query<any, void>({
      query: () => ({ url: 'subscription-plans', method: 'GET' }),
      providesTags: [{ type: 'Setting' }],
    }),

    // Payment QR Code
    getPaymentQrCode: builder.query<any, void>({
      query: () => ({ url: 'payment-qr-code', method: 'GET' }),
      providesTags: [{ type: 'Setting' }],
    }),

    // Notifications
    getDoctorNotifications: builder.query<any, number | string>({
      query: (doctorId) => ({ url: `doctor/${doctorId}/notifications`, method: 'GET' }),
      providesTags: [{ type: 'Notification' }],
    }),
    markNotificationRead: builder.mutation<any, { doctorId: number | string; notificationId: number | string }>({
      query: ({ doctorId, notificationId }) => ({ url: `doctor/${doctorId}/notifications/${notificationId}/read`, method: 'POST' }),
      invalidatesTags: [{ type: 'Notification' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductAreasQuery,
  useGetProductStatusQuery,
  useGetCategoriesQuery,
  useDoctorLoginMutation,
  useDoctorRegisterMutation,
  useDoctorMeQuery,
  useUpdateDoctorProfileMutation,
  useChangeDoctorPasswordMutation,
  useUploadDoctorProfileImageMutation,
  useDoctorLogoutMutation,
  useCreateAppointmentMutation,
  useGetDoctorAvailabilityQuery,
  useGetDoctorAvailableSlotsQuery,
  useGetDoctorAppointmentsQuery,
  useGetDoctorStatsQuery,
  useUpdateAppointmentStatusMutation,
  useConfirmAppointmentMutation,
  useGetDoctorScheduleQuery,
  useUpdateDoctorScheduleMutation,
  useCreatePaymentMutation,
  useGetDoctorPaymentsQuery,
  useGetPendingPaymentsQuery,
  useUploadPaymentReceiptMutation,
  useUpdatePaymentSubscriptionTypeMutation,
  useGetSettingsQuery,
  useGetCompanyInfoQuery,
  useGetContactInfoQuery,
  useGetSubscriptionPlansQuery,
  useGetDoctorNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetPaymentQrCodeQuery,
} = api;


