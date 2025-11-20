import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * شاشة البداية (Splash Screen)
 * تعرض اللوجو ورسالة ترحيب عند فتح التطبيق
 */
export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Animation للظهور
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // الانتقال إلى الصفحة الرئيسية بعد 2.5 ثانية
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      {/* خلفية متدرجة */}
      <View style={styles.backgroundGradient} />
      
      {/* المحتوى */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* اللوجو */}
        <View style={styles.logoContainer}>
          {!imageError ? (
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
              onError={() => {
                if (__DEV__) {
                  console.warn('⚠️ خطأ في تحميل صورة اللوجو');
                }
                setImageError(true);
              }}
            />
          ) : (
            <Ionicons name="medical" size={64} color="#ffffff" />
          )}
        </View>

        {/* رسالة الترحيب */}
        <Text style={styles.welcomeText}>مرحباً بك في</Text>
        <Text style={styles.appName}>ميعاد</Text>
        <Text style={styles.subtitle}>احجز موعدك بسهولة</Text>

        {/* مؤشر التحميل */}
        <View style={styles.loaderContainer}>
          <View style={styles.loader} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c6980',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0c6980',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Cairo_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'center',
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Cairo_700Bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 40,
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loader: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
    overflow: 'hidden',
  },
});

