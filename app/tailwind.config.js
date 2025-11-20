/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  darkMode: false, // تعطيل dark mode لتجنب مشكلة color scheme على الويب
  theme: {
    extend: {
      colors: {
        // نظام ألوان احترافي موحد
        primary: {
          50: '#e6f2f4',
          100: '#b3d9df',
          200: '#80c0ca',
          300: '#4da7b5',
          400: '#268ea0',
          500: '#0c6980', // اللون الأساسي
          600: '#0a5669',
          700: '#084352',
          800: '#06303b',
          900: '#041d24',
        },
        secondary: {
          50: '#f0f9e8',
          100: '#d9f0c4',
          200: '#c2e7a0',
          300: '#abde7c',
          400: '#94d558',
          500: '#7cc644', // اللون الثانوي
          600: '#639e36',
          700: '#4a7629',
          800: '#314e1b',
          900: '#18260e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // لون Teal للتصميم (يستخدم primary الآن)
        teal: {
          50: '#e6f2f4',
          100: '#b3d9df',
          200: '#80c0ca',
          300: '#4da7b5',
          400: '#268ea0',
          500: '#0c6980', // نفس اللون الأساسي
          600: '#0a5669',
          700: '#084352',
          800: '#06303b',
          900: '#041d24',
        },
      },
      fontFamily: {
        cairo: ['Cairo_400Regular', 'Cairo', 'system-ui', 'sans-serif'],
        sans: ['Cairo_400Regular', 'Cairo', 'system-ui', 'sans-serif'],
        // الخط الافتراضي لجميع النصوص
        DEFAULT: ['Cairo_400Regular', 'Cairo', 'system-ui', 'sans-serif'],
      },
      // جعل Cairo الخط الافتراضي
      defaultFontFamily: {
        sans: ['Cairo_400Regular'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        medium: ['16px', { lineHeight: '24px' }],
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // NativeWind يدعم RTL تلقائياً عبر React Native
  },
};
