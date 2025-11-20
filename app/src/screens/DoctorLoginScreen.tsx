import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { login } from '../store/authSlice';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { useDoctorLoginMutation } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DoctorLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [doctorLogin, { isLoading }] = useDoctorLoginMutation();
  
  // Refs للتنقل بين الحقول
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // دالة للتمرير عند التركيز على حقل
  const handleInputFocus = (inputNumber: number) => {
    // تمرير تدريجي لضمان ظهور الحقل بشكل كامل
    setTimeout(() => {
      if (inputNumber === 1) {
        // للبريد الإلكتروني - تمرير متوسط
        scrollViewRef.current?.scrollTo({ y: 200, animated: true });
      } else if (inputNumber === 2) {
        // لكلمة المرور - تمرير أكثر لضمان ظهور الزر أيضاً
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, 200);
  };

  // دالة للتحقق من صحة البريد الإلكتروني
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    // التحقق من البيانات
    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!password.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة المرور');
      return;
    }

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // التحقق من أن البريد الإلكتروني غير فارغ
      if (!trimmedEmail) {
        Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
        return;
      }

      const loginData = {
        identifier: trimmedEmail,
        email: trimmedEmail,
        password: trimmedPassword,
      };

      console.log('إرسال بيانات تسجيل الدخول:', loginData);
      console.log('معرفة نوع البيانات:', {
        identifier: typeof loginData.identifier,
        email: typeof loginData.email,
        password: typeof loginData.password,
        identifierLength: loginData.identifier.length,
        emailLength: loginData.email.length,
      });

      const result = await doctorLogin(loginData).unwrap();

      console.log('تم تسجيل الدخول بنجاح:', result);
      console.log('الانتقال إلى Dashboard...');
      
      // حفظ حالة تسجيل الدخول
      const token = result?.data?.token || result?.token || 'dummy_token';
      const doctorId = result?.data?.doctor_id || result?.data?.id || result?.data?.doctor?.id || '1';
      
      dispatch(login({ token, doctorId }));
      
      // الانتقال مباشرة إلى Dashboard الطبيب
      navigation.navigate('DoctorDashboard');
      
      console.log('تم الانتقال إلى Dashboard');
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      const errorMessage = 
        error?.data?.message || 
        error?.error || 
        'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      
      Alert.alert('خطأ في تسجيل الدخول', errorMessage);
    }
  };

  return (
    <Container>
      <ScreenLayout 
        title="تسجيل دخول الطبيب"
        showHeader={true}
        showBackButton={true}
        onBackPress={handleGoBack}
        scrollable={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          enabled={Platform.OS === 'ios'}
        >
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ 
              padding: 20,
              paddingBottom: 250, // مساحة إضافية كبيرة للسماح بالتمرير عند ظهور لوحة المفاتيح
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
          {/* العنوان */}
          <View className="items-center mb-8 mt-4">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="#0c6980" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك</Text>
            <Text className="text-gray-600 text-center">سجل دخولك للوصول إلى حسابك</Text>
          </View>

          {/* حقول الإدخال */}
          <View className="mb-6">
            {/* البريد الإلكتروني */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                البريد الإلكتروني *
              </Text>
              <View 
                className="flex-row items-center bg-white rounded-2xl px-4 py-3.5"
                style={{
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="bg-primary-50 rounded-xl p-2.5 mr-3">
                  <Ionicons name="mail-outline" size={22} color="#0c6980" />
                </View>
                <TextInput
                  ref={emailInputRef}
                  placeholder="أدخل البريد الإلكتروني"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-gray-900 text-base"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                  onFocus={() => {
                    handleInputFocus(1);
                  }}
                  blurOnSubmit={false}
                  style={{ 
                    fontFamily: 'Cairo_400Regular',
                    fontSize: 16,
                    paddingVertical: 4,
                  }}
                />
              </View>
            </View>

            {/* كلمة المرور */}
            <View>
              <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                كلمة المرور *
              </Text>
              <View 
                className="flex-row items-center bg-white rounded-2xl px-4 py-3.5"
                style={{
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="bg-primary-50 rounded-xl p-2.5 mr-3">
                  <Ionicons name="lock-closed-outline" size={22} color="#0c6980" />
                </View>
                <TextInput
                  ref={passwordInputRef}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-gray-900 text-base"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => {
                    handleInputFocus(2);
                  }}
                  style={{ 
                    fontFamily: 'Cairo_400Regular',
                    fontSize: 16,
                    paddingVertical: 4,
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-2 -mr-2"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#0c6980"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* زر تسجيل الدخول */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl items-center justify-center ${
              isLoading ? 'bg-gray-400' : 'bg-primary-600'
            }`}
            style={!isLoading ? {
              backgroundColor: '#0a5669',
              shadowColor: '#0c6980',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            } : {}}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-lg font-bold">تسجيل الدخول</Text>
            )}
          </Pressable>

          {/* روابط إضافية */}
          <View className="mt-8 items-center">
            {/* رابط نسيت كلمة المرور */}
            <Pressable
              onPress={() => {
                Alert.alert('استعادة كلمة المرور', 'سيتم إضافة هذه الميزة قريباً');
              }}
              className="w-full mb-5"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View className="flex-row items-center justify-center bg-gray-50 rounded-2xl px-5 py-4 active:bg-gray-100">
                <Ionicons name="key-outline" size={18} color="#0c6980" style={{ marginLeft: 8 }} />
                <Text className="text-gray-700 text-base" style={{ fontFamily: 'Cairo_400Regular' }}>
                  نسيت كلمة المرور؟{' '}
                </Text>
                <Text 
                  className="text-primary-600 font-semibold text-base" 
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  استعادة
                </Text>
              </View>
            </Pressable>

            {/* رابط إنشاء حساب جديد */}
            <Pressable
              onPress={() => {
                if (__DEV__) {
                  console.log('🔄 الضغط على زر إنشاء حساب جديد');
                }
                navigation.navigate('DoctorRegister');
              }}
              className="w-full"
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={{ marginTop: 8 }}
            >
              {({ pressed }) => (
                <View 
                  className="flex-row items-center justify-center rounded-2xl px-5 py-4 border border-primary-200"
                  style={{
                    backgroundColor: pressed ? '#d1e7e9' : '#e6f2f4',
                  }}
                >
                  <Ionicons name="person-add-outline" size={18} color="#0c6980" style={{ marginLeft: 8 }} />
                  <Text className="text-gray-700 text-base" style={{ fontFamily: 'Cairo_400Regular' }}>
                    ليس لديك حساب؟{' '}
                  </Text>
                  <Text 
                    className="text-primary-600 font-semibold text-base" 
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    إنشاء حساب جديد
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </Container>
  );
};

