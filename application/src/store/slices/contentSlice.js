import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api';

// Extend API slice with content endpoints (Terms, Privacy)
export const contentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: () => '/terms',
      providesTags: ['Content'],
    }),
    getPrivacy: builder.query({
      query: () => '/privacy',
      providesTags: ['Content'],
    }),
  }),
});

export const {
  useGetTermsQuery,
  useGetPrivacyQuery,
} = contentApiSlice;

// Content slice for local state
const initialState = {
  loading: false,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
});

export default contentSlice.reducer;

