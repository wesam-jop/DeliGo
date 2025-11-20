import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import React, { useEffect } from 'react';
import { I18nManager, StyleSheet, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useFonts, Cairo_300Light, Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold, Cairo_900Black } from '@expo-google-fonts/cairo';

import './global.css';

/**
 * تطبيق خط Cairo على جميع النصوص
 * 
 * ملاحظات:
 * - الخط سيتم تطبيقه عبر className="font-sans" في جميع مكونات Text
 * - أو عبر style={{ fontFamily: 'Cairo_400Regular' }} مباشرة
 * - الأيقونات من @expo/vector-icons لن تتأثر لأنها تستخدم خطوط خاصة
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Cairo_900Black,
  });

  useEffect(() => {
    // تفعيل اتجاه RTL للتطبيق بالكامل
    try {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      
      // إعادة تحميل التطبيق لتطبيق RTL (على Android)
      if (Platform.OS === 'android' && !I18nManager.isRTL) {
        // على Android، قد نحتاج لإعادة تشغيل التطبيق
        // لكن سنحاول forceRTL أولاً
        I18nManager.forceRTL(true);
      }
    } catch (error) {
      console.warn('خطأ في تفعيل RTL:', error);
    }

    // إصلاح مشكلة dark mode على الويب
    // ملاحظة: تم إزالة StyleSheet.setFlag لأنه غير مدعوم في React Native
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
      <StatusBar style="auto" />
    </>
  );
}
