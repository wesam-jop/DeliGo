import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, ActivityIndicator, Modal, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { CountryCodePicker } from '../components/CountryCodePicker';
import { Country, defaultCountry } from '../data/countries';
import { useGetCategoriesQuery, useGetProductAreasQuery, useDoctorRegisterMutation } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DoctorRegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // الخطوة الأولى
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // الخطوة الثانية
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  
  // refs للحقول
  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  // جلب التصنيفات والمناطق
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();
  const { data: areasData, isLoading: areasLoading, isError: areasError } = useGetProductAreasQuery();
  const [doctorRegister, { isLoading: isRegistering }] = useDoctorRegisterMutation();

  // معالجة بيانات التصنيفات
  let categoryList: any[] = [];
  if (categoriesData) {
    if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
      categoryList = categoriesData.categories.map((cat: string, index: number) => ({ id: index + 1, name: cat }));
    } else if (Array.isArray(categoriesData)) {
      categoryList = categoriesData.map((cat: any, index: number) => {
        if (typeof cat === 'string') {
          return { id: index + 1, name: cat };
        }
        return { id: cat.id || index + 1, name: cat.name || cat };
      });
    } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
      categoryList = categoriesData.data.map((cat: any, index: number) => {
        if (typeof cat === 'string') {
          return { id: index + 1, name: cat };
        }
        return { id: cat.id || index + 1, name: cat.name || cat };
      });
    }
  }

  // معالجة بيانات المناطق - نفس منطق DoctorSearchFilter
  let areaList: any[] = [];
  if (areasData) {
    // إذا كانت البيانات على شكل { areas: [...] }
    if (areasData.areas && Array.isArray(areasData.areas)) {
      areaList = areasData.areas.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
    // إذا كانت البيانات array مباشرة
    else if (Array.isArray(areasData)) {
      areaList = areasData.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
    // إذا كانت البيانات على شكل { data: [...] }
    else if (areasData.data && Array.isArray(areasData.data)) {
      areaList = areasData.data.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(1);
    }
  };

  const validateStep1 = (): boolean => {
    if (!title.trim() || title.trim().length < 1) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return false;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return false;
    }

    if (phoneNumber.trim().length < 8) {
      Alert.alert('خطأ', 'رقم الهاتف يجب أن يكون على الأقل 8 أرقام');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة المرور');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    if (!selectedCategory) {
      Alert.alert('خطأ', 'يرجى اختيار التخصص');
      return false;
    }

    if (!selectedArea) {
      Alert.alert('خطأ', 'يرجى اختيار المنطقة');
      return false;
    }

    if (!description.trim() || description.trim().length < 1) {
      Alert.alert('خطأ', 'يرجى إدخال الوصف');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) {
      return;
    }

    try {
      // التحقق النهائي من البيانات
      if (!selectedCategory || !selectedArea) {
        Alert.alert('خطأ', 'يرجى التأكد من اختيار التخصص والمنطقة');
        return;
      }

      // العثور على التصنيف المحدد للحصول على ID الصحيح
      const selectedCategoryObj = categoryList.find((cat: any) => {
        const catId = cat.id || cat;
        const catName = cat.name || cat;
        return String(catId) === selectedCategory || catName === selectedCategory;
      });

      // استخراج category_id - يجب أن يكون رقم كما في الويب
      let categoryId: number = 0;
      if (selectedCategoryObj) {
        if (selectedCategoryObj.id && !isNaN(Number(selectedCategoryObj.id))) {
          categoryId = Number(selectedCategoryObj.id);
        } else {
          // إذا لم يكن ID موجود، استخدم الفهرس + 1
          const index = categoryList.findIndex((cat: any) => cat === selectedCategoryObj);
          categoryId = index >= 0 ? index + 1 : 1;
        }
      } else if (selectedCategory && !isNaN(Number(selectedCategory))) {
        categoryId = Number(selectedCategory);
      }

      // تنظيف قيمة المنطقة
      const areaValue = String(selectedArea).trim();

      // تنظيف رقم الهاتف - نفس منطق الويب
      const phoneToValidate = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `${country.dialCode}${phoneNumber.trim()}`;
      const cleanedPhone = phoneToValidate.replace(/[\s\-()]/g, '');

      // بناء بيانات التسجيل - نفس بنية الويب بالضبط
      const registerData = {
        title: title.trim(),
        doctor_email: email.trim(),
        doctor_password: password.trim(),
        password_confirmation: confirmPassword.trim(),
        category_id: categoryId,
        doctor_area: areaValue,
        doctor_phone: cleanedPhone,
        status: 'active',
        has_dashboard_access: true,
        description: description.trim(),
      };

      if (__DEV__) {
        console.log('📝 بيانات التسجيل:', registerData);
        console.log('📋 تفاصيل التصنيف:', {
          selectedCategory,
          selectedCategoryObj,
          categoryId,
          categoryIdType: typeof categoryId,
        });
        console.log('📍 تفاصيل المنطقة:', {
          selectedArea,
          areaValue,
        });
      }
      
      const result = await doctorRegister(registerData).unwrap();
      
      if (__DEV__) {
        console.log('✅ تم التسجيل بنجاح:', result);
      }

      // حفظ التوكن والبيانات بعد التسجيل الناجح
      if (result?.token) {
        await AsyncStorage.setItem('doctorToken', result.token);
        if (result?.doctor?.id) {
          await AsyncStorage.setItem('doctorId', String(result.doctor.id));
        }
      }

      // الانتقال إلى صفحة اختيار الخطة
      (navigation as any).replace('SelectPlan');
    } catch (error: any) {
      console.error('❌ خطأ في التسجيل:', error);
      
      // معالجة أفضل لأخطاء API
      let errorMessage = 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
      
      if (error?.data) {
        // إذا كان الخطأ يحتوي على رسالة محددة
        if (error.data.message) {
          errorMessage = error.data.message;
        } else if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.error) {
          errorMessage = error.data.error;
        } else if (error.data.errors) {
          // معالجة أخطاء التحقق (validation errors)
          const errors = error.data.errors;
          const errorKeys = Object.keys(errors);
          if (errorKeys.length > 0) {
            const firstError = errors[errorKeys[0]];
            errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
          }
        }
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('خطأ في التسجيل', errorMessage);
    }
  };

  const selectedCategoryObj = categoryList.find((cat: any) => {
    const catId = cat.id || cat;
    const catName = cat.name || cat;
    return String(catId) === selectedCategory || catName === selectedCategory;
  });
  const selectedCategoryName = selectedCategoryObj?.name || selectedCategoryObj || 'اختر التخصص';

  const selectedAreaName = selectedArea || 'اختر المنطقة';

  return (
    <Container>
      <ScreenLayout 
        title="إنشاء حساب طبيب"
        showHeader={true}
        showBackButton={true}
        onBackPress={handleGoBack}
        scrollable={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 300 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
          {/* مؤشر الخطوات */}
          <View className="flex-row items-center justify-center mb-8 mt-4">
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full items-center justify-center ${
                currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-300'
              }`}>
                <Text 
                  className={`font-bold text-base ${currentStep >= 1 ? 'text-white' : 'text-gray-600'}`}
                  style={{ fontFamily: 'Cairo_700Bold' }}
                >
                  1
                </Text>
              </View>
              <View className={`h-1 w-20 mx-2 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
              <View className={`w-12 h-12 rounded-full items-center justify-center ${
                currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'
              }`}>
                <Text 
                  className={`font-bold text-base ${currentStep >= 2 ? 'text-white' : 'text-gray-600'}`}
                  style={{ fontFamily: 'Cairo_700Bold' }}
                >
                  2
                </Text>
              </View>
            </View>
          </View>

          {currentStep === 1 ? (
            <>
              {/* العنوان */}
              <View className="items-center mb-8 mt-4">
                <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="person-add" size={40} color="#0c6980" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
                  إنشاء حساب جديد
                </Text>
                <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                  أدخل بياناتك الأساسية لإنشاء حسابك
                </Text>
              </View>

              {/* حقول الخطوة الأولى */}
              <View className="mb-6">
                {/* الاسم الكامل */}
                <View className="mb-6">
                  <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    الاسم الكامل *
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
                      <Ionicons name="person-outline" size={22} color="#0c6980" />
                    </View>
                    <TextInput
                      placeholder="أدخل اسمك الكامل"
                      value={title}
                      onChangeText={setTitle}
                      autoCapitalize="words"
                      className="flex-1 text-gray-900 text-base"
                      placeholderTextColor="#9CA3AF"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        emailInputRef.current?.focus();
                      }}
                      onFocus={() => {
                        scrollViewRef.current?.scrollTo({ y: 100, animated: true });
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
                        phoneInputRef.current?.focus();
                      }}
                      onFocus={() => {
                        scrollViewRef.current?.scrollTo({ y: 200, animated: true });
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

                {/* رقم الهاتف */}
                <View className="mb-6">
                  <Text className="text-gray-800 font-semibold text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    رقم الهاتف *
                  </Text>
                  <View className="flex-col gap-3">
                    <CountryCodePicker
                      selectedCountry={country}
                      onSelect={setCountry}
                    />
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
                        <Ionicons name="call-outline" size={22} color="#0c6980" />
                      </View>
                      <TextInput
                        ref={phoneInputRef}
                        placeholder="912345678"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                        keyboardType="phone-pad"
                        className="flex-1 text-gray-900 text-base"
                        placeholderTextColor="#9CA3AF"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                        onFocus={() => {
                          scrollViewRef.current?.scrollTo({ y: 300, animated: true });
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
                </View>

                {/* كلمة المرور */}
                <View className="mb-6">
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
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        confirmPasswordInputRef.current?.focus();
                      }}
                      onFocus={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
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

                {/* تأكيد كلمة المرور */}
                <View>
                  <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    تأكيد كلمة المرور *
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
                      ref={confirmPasswordInputRef}
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      className="flex-1 text-gray-900 text-base"
                      placeholderTextColor="#9CA3AF"
                      returnKeyType="done"
                      onSubmitEditing={handleNextStep}
                      onFocus={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }}
                      style={{ 
                        fontFamily: 'Cairo_400Regular',
                        fontSize: 16,
                        paddingVertical: 4,
                      }}
                    />
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-2 -mr-2"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#0c6980" 
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* زر التالي */}
              <Pressable
                onPress={handleNextStep}
                disabled={isRegistering}
                className={`w-full py-4 rounded-2xl items-center justify-center ${
                  isRegistering ? 'bg-gray-400' : 'bg-primary-600'
                }`}
                style={!isRegistering ? {
                  backgroundColor: '#0a5669',
                  shadowColor: '#0c6980',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                } : {}}
              >
                {isRegistering ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo_700Bold' }}>
                    التالي
                  </Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              {/* العنوان */}
              <View className="items-center mb-8 mt-4">
                <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="medical" size={40} color="#0c6980" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
                  الخطوة الثانية
                </Text>
                <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                  أكمل بياناتك المهنية
                </Text>
              </View>

              {/* حقول الخطوة الثانية */}
              <View className="mb-6">
                {/* التخصص */}
                <View className="mb-6">
                  <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    التخصص *
                  </Text>
                  <Pressable
                    onPress={() => setShowCategoryModal(true)}
                    className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 active:bg-gray-50"
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
                      <Ionicons name="medical-outline" size={22} color="#0c6980" />
                    </View>
                    <Text 
                      className={`flex-1 text-base ${selectedCategory ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}
                      style={{ 
                        fontFamily: selectedCategory ? 'Cairo_600SemiBold' : 'Cairo_400Regular',
                        fontSize: 16,
                        paddingVertical: 4,
                      }}
                    >
                      {selectedCategoryName}
                    </Text>
                    <Ionicons name="chevron-down" size={22} color="#0c6980" />
                  </Pressable>
                </View>

                {/* المنطقة */}
                <View className="mb-6">
                  <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    المنطقة *
                  </Text>
                  <Pressable
                    onPress={() => setShowAreaModal(true)}
                    className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 active:bg-gray-50"
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
                      <Ionicons name="location-outline" size={22} color="#0c6980" />
                    </View>
                    <Text 
                      className={`flex-1 text-base ${selectedArea ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}
                      style={{ 
                        fontFamily: selectedArea ? 'Cairo_600SemiBold' : 'Cairo_400Regular',
                        fontSize: 16,
                        paddingVertical: 4,
                      }}
                    >
                      {selectedAreaName}
                    </Text>
                    <Ionicons name="chevron-down" size={22} color="#0c6980" />
                  </Pressable>
                </View>

                {/* الوصف */}
                <View>
                  <Text className="text-gray-800 font-semibold mb-3 text-base" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    الوصف *
                  </Text>
                  <View 
                    className="bg-white rounded-2xl px-4 py-3.5"
                    style={{
                      borderWidth: 2,
                      borderColor: '#e5e7eb',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      elevation: 3,
                      minHeight: 120,
                    }}
                  >
                    <TextInput
                      ref={descriptionInputRef}
                      placeholder="أدخل وصف مختصر عنك وتخصصك..."
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      className="flex-1 text-gray-900 text-base"
                      placeholderTextColor="#9CA3AF"
                      style={{
                        fontFamily: 'Cairo_400Regular',
                        fontSize: 16,
                      }}
                      onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    />
                  </View>
                  <Text 
                    className="text-gray-500 text-xs mt-2"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    {description.length} حرف
                  </Text>
                </View>
              </View>

              {/* الأزرار */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-100 py-4.5 rounded-2xl items-center active:bg-gray-200"
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                  }}
                >
                  <Text 
                    className="text-gray-800 font-bold text-base"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    السابق
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={handleRegister}
                  disabled={isRegistering}
                  className={`flex-1 py-4 rounded-2xl items-center justify-center ${
                    isRegistering ? 'bg-gray-400' : 'bg-primary-600'
                  }`}
                  style={!isRegistering ? {
                    backgroundColor: '#0a5669',
                    shadowColor: '#0c6980',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 8,
                  } : {}}
                >
                  {isRegistering ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text 
                      className="text-white text-lg font-bold"
                      style={{ fontFamily: 'Cairo_700Bold' }}
                    >
                      إنشاء الحساب
                    </Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal التخصص */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
          >
            <View className="bg-white rounded-t-3xl max-h-[70%]">
              <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
                <Text 
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'Cairo_700Bold' }}
                >
                  اختر التخصص
                </Text>
                <Pressable onPress={() => setShowCategoryModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </Pressable>
              </View>
              <FlatList
                data={categoryList}
                keyExtractor={(item: any) => String(item.id || item)}
                renderItem={({ item }: { item: any }) => {
                  const itemId = item.id || item;
                  const itemName = item.name || item;
                  const isSelected = String(itemId) === selectedCategory || itemName === selectedCategory;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        // حفظ ID التصنيف - نفس منطق DoctorSearchFilter
                        const selectedValue = String(itemId);
                        if (__DEV__) {
                          console.log('✅ تم اختيار التصنيف:', {
                            selectedValue,
                            itemId,
                            itemName,
                            itemObject: item,
                          });
                        }
                        setSelectedCategory(selectedValue);
                        setShowCategoryModal(false);
                      }}
                      className={`px-5 py-4 border-b border-gray-100 flex-row items-center justify-between ${
                        isSelected ? 'bg-primary-50' : 'bg-white'
                      }`}
                    >
                      <Text 
                        className={`text-base ${isSelected ? 'text-primary-600 font-bold' : 'text-gray-900 font-medium'}`}
                        style={{ fontFamily: isSelected ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                      >
                        {itemName}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#0c6980" />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View className="px-5 py-8 items-center">
                    <Text 
                      className="text-gray-500"
                      style={{ fontFamily: 'Cairo_400Regular' }}
                    >
                      لا توجد تصنيفات متاحة
                    </Text>
                  </View>
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal المنطقة */}
        <Modal
          visible={showAreaModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAreaModal(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-end"
            activeOpacity={1}
            onPress={() => setShowAreaModal(false)}
          >
            <View className="bg-white rounded-t-3xl max-h-[70%]">
              <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
                <Text 
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: 'Cairo_700Bold' }}
                >
                  اختر المنطقة
                </Text>
                <Pressable onPress={() => setShowAreaModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </Pressable>
              </View>
              <FlatList
                data={areaList}
                keyExtractor={(item: any, index: number) => String(item || index)}
                renderItem={({ item }: { item: any }) => {
                  // استخراج قيمة المنطقة - نفس منطق DoctorSearchFilter
                  const areaValue = typeof item === 'string' ? item : (item.name || item || String(item));
                  const cleanedAreaValue = String(areaValue).trim();
                  const isSelected = cleanedAreaValue === String(selectedArea);
                  
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (__DEV__) {
                          console.log('✅ تم اختيار المنطقة:', {
                            originalItem: item,
                            extractedValue: cleanedAreaValue,
                            type: typeof item,
                          });
                        }
                        setSelectedArea(cleanedAreaValue);
                        setShowAreaModal(false);
                      }}
                      className={`px-5 py-4 border-b border-gray-100 flex-row items-center justify-between ${
                        isSelected ? 'bg-primary-50' : 'bg-white'
                      }`}
                    >
                      <Text 
                        className={`text-base ${isSelected ? 'text-primary-600 font-bold' : 'text-gray-900 font-medium'}`}
                        style={{ fontFamily: isSelected ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                      >
                        {cleanedAreaValue}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#0c6980" />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View className="px-5 py-8 items-center">
                    <Text 
                      className="text-gray-500"
                      style={{ fontFamily: 'Cairo_400Regular' }}
                    >
                      لا توجد مناطق متاحة
                    </Text>
                  </View>
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </ScreenLayout>
    </Container>
  );
};

