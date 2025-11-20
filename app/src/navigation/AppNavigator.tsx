import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { DoctorLoginScreen } from '../screens/DoctorLoginScreen';
import { DoctorRegisterScreen } from '../screens/DoctorRegisterScreen';
import { SelectPlanScreen } from '../screens/SelectPlanScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { WaitingScreen } from '../screens/WaitingScreen';
import { SubscriptionExpiredScreen } from '../screens/SubscriptionExpiredScreen';
import { DoctorTabNavigator } from './DoctorTabNavigator';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { restoreAuth } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// تعريف أنواع الشاشات للملاحة
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Booking: { doctor: any };
  DoctorLogin: undefined;
  DoctorRegister: undefined;
  SelectPlan: undefined;
  Payment: { plan: any };
  Waiting: undefined;
  SubscriptionExpired: undefined;
  DoctorDashboard: undefined;
};

const Stack = createNativeStackNavigator<any>();

/**
 * المنظم الرئيسي للتطبيق
 * يمكن إضافة المزيد من الشاشات هنا
 */
export const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من تسجيل الدخول المحفوظ
    const checkAuth = async () => {
      try {
        const [token, doctorId] = await Promise.all([
          AsyncStorage.getItem('doctorToken'),
          AsyncStorage.getItem('doctorId'),
        ]);
        
        if (token && doctorId) {
          dispatch(restoreAuth({ token, doctorId }));
        }
      } catch (error) {
        console.error('خطأ في التحقق من تسجيل الدخول:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0c6980" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: '#0c6980',
          background: '#ffffff',
          card: '#ffffff',
          text: '#111827',
          border: '#e5e7eb',
          notification: '#ef4444',
        },
        fonts: {
          regular: {
            fontFamily: 'Cairo_400Regular',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'Cairo_500Medium',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'Cairo_700Bold',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'Cairo_800ExtraBold',
            fontWeight: '800',
          },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          // في RTL، الانتقال يكون من اليمين إلى اليسار
          animation: 'slide_from_right',
          // تحسين animations للانتقال السلس
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: {
            direction: 'rtl',
            backgroundColor: '#f9fafb',
          },
          cardStyle: {
            backgroundColor: '#f9fafb',
            direction: 'rtl',
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            headerShown: false,
            animation: 'none', // بدون animation للشاشة الأولى
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
        <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
        <Stack.Screen name="SelectPlan" component={SelectPlanScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Waiting" component={WaitingScreen} />
        <Stack.Screen name="SubscriptionExpired" component={SubscriptionExpiredScreen} />
        <Stack.Screen name="DoctorDashboard" component={DoctorTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

