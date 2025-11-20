import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGetDoctorAvailableSlotsQuery, useCreateAppointmentMutation, useGetCategoriesQuery } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { BookingConfirmationModal } from '../components/BookingConfirmationModal';
import { BookingCard } from '../components/BookingCard';
import { CountryCodePicker } from '../components/CountryCodePicker';
import { Country, defaultCountry } from '../data/countries';
import { getDoctorImage } from '../utils/imageUtils';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingScreen = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { doctor } = route.params;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [imageError, setImageError] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // refs للحقول لتسهيل التمرير عند الفوكس
  const scrollViewRef = useRef<ScrollView>(null);
  const patientNameInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);

  const doctorId = doctor?.id;
  
  // جلب التصنيفات لاستخراج اسم التخصص
  const { data: categoriesData } = useGetCategoriesQuery();
  
  // جلب المواعيد المتاحة للتاريخ المحدد
  const { 
    data: slotsData, 
    isLoading: isLoadingAvailability,
    isError: availabilityError,
    refetch: refetchSlots
  } = useGetDoctorAvailableSlotsQuery(
    { 
      doctorId: doctorId as number, 
      date: selectedDate 
    },
    {
      skip: !doctorId || !selectedDate, // لا نجلب المواعيد إلا إذا كان التاريخ محدد
    }
  );

  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();

  // معالجة بيانات التصنيفات
  const categoryList = useMemo(() => {
    let list: any[] = [];
    if (categoriesData) {
      if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
        list = categoriesData.categories.map((cat: string, index: number) => ({ id: index + 1, name: cat }));
      } else if (Array.isArray(categoriesData)) {
        list = categoriesData.map((cat: any, index: number) => {
          if (typeof cat === 'string') {
            return { id: index + 1, name: cat };
          }
          return { id: cat.id || index + 1, name: cat.name || cat };
        });
      } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
        list = categoriesData.data.map((cat: any, index: number) => {
          if (typeof cat === 'string') {
            return { id: index + 1, name: cat };
          }
          return { id: cat.id || index + 1, name: cat.name || cat };
        });
      }
    }
    return list;
  }, [categoriesData]);

  // استخراج اسم التخصص
  const doctorSpecialty = useMemo(() => {
    // محاولة 1: مباشرة من specialty
    if (doctor?.specialty && typeof doctor.specialty === 'string') {
      return doctor.specialty;
    }
    
    // محاولة 2: من category.name
    if (doctor?.category?.name && typeof doctor.category.name === 'string') {
      return doctor.category.name;
    }
    
    // محاولة 3: من category إذا كان string مباشرة
    if (doctor?.category && typeof doctor.category === 'string') {
      return doctor.category;
    }
    
    // محاولة 4: البحث في قائمة التصنيفات باستخدام category_id
    if (doctor?.category_id || doctor?.category?.id) {
      const categoryId = doctor.category_id || doctor.category?.id;
      const foundCategory = categoryList.find(
        (cat: any) => String(cat.id) === String(categoryId)
      );
      if (foundCategory?.name) {
        return foundCategory.name;
      }
    }
    
    return 'تخصص';
  }, [doctor, categoryList]);

  // دالة لتحويل الوقت من 24 ساعة إلى 12 ساعة
  const convertTo12Hour = (time24: string): string => {
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const min = minutes || '00';
      
      if (hour === 0) {
        return `12:${min} ص`;
      } else if (hour < 12) {
        return `${hour}:${min} ص`;
      } else if (hour === 12) {
        return `12:${min} م`;
      } else {
        return `${hour - 12}:${min} م`;
      }
    } catch {
      return time24;
    }
  };

  // معالجة بيانات المواعيد المتاحة - من slots (تخزين الوقت الأصلي والوقت المحول)
  const availableTimes = useMemo(() => {
    if (!slotsData || !selectedDate) return [];
    
    // إذا كانت البيانات تحتوي على slots
    if (slotsData.slots && Array.isArray(slotsData.slots)) {
      return slotsData.slots.map((time: string) => ({
        original: time, // الوقت الأصلي (24 ساعة) للإرسال للAPI
        display: convertTo12Hour(time), // الوقت المعروض (12 ساعة)
      }));
    }
    
    return [];
  }, [slotsData, selectedDate]);

  // معالجة التواريخ المتاحة - توليد 7 أيام قادمة
  const availableDates = useMemo(() => {
    // توليد 7 أيام قادمة
    const datesList = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesList.push(date.toISOString().split('T')[0]);
    }
    
    return datesList;
  }, []);

  // تحديد أول تاريخ متاح افتراضياً
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // عند تغيير التاريخ، إعادة تعيين الوقت المحدد
  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate]);

  const handleBook = () => {
    // التحقق من صحة البيانات
    if (!patientName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المريض');
      return;
    }
    
    if (!phoneNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }
    
    if (!selectedDate) {
      Alert.alert('خطأ', 'يرجى اختيار التاريخ');
      return;
    }
    
    if (!selectedTime) {
      Alert.alert('خطأ', 'يرجى اختيار الوقت');
      return;
    }

    // عرض modal التأكيد
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirmModal(false);

    // التحقق من صحة البيانات قبل الإرسال
    if (!phoneNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber.trim()}`;
    
    // التحقق من أن رقم الهاتف ليس فارغاً بعد البناء
    if (!fullPhoneNumber || fullPhoneNumber === selectedCountry.dialCode) {
      Alert.alert('خطأ', 'يرجى إدخال رقم هاتف صحيح');
      return;
    }

    try {
      // بناء بيانات الحجز - باستخدام الأسماء التي يتوقعها API
      const appointmentData = {
        doctor_id: doctorId,
        patient_name: patientName.trim(),
        phone_number: fullPhoneNumber, // API يتوقع phone_number
        appointment_date: selectedDate, // API يتوقع appointment_date
        appointment_time: selectedTime, // API يتوقع appointment_time
        notes: null, // API يتوقع notes
      };

      console.log('إرسال بيانات الحجز:', appointmentData);
      console.log('رقم الهاتف الكامل:', fullPhoneNumber);
      console.log('طول رقم الهاتف:', fullPhoneNumber.length);

      const result = await createAppointment(appointmentData).unwrap();

      // حفظ بيانات الحجز مع جميع المعلومات المطلوبة
      const bookingInfo = {
        ...appointmentData,
        appointmentId: result?.data?.id || result?.id || result?.appointment_id,
        doctor: doctor,
        doctorName: doctorName,
        doctorImage: doctorImage,
        doctorSpecialty: doctorSpecialty,
        patient_name: appointmentData.patient_name,
        phone_number: appointmentData.phone_number,
        phone: appointmentData.phone_number, // للتوافق مع الكود القديم
        appointment_date: appointmentData.appointment_date,
        date: appointmentData.appointment_date, // للتوافق مع الكود القديم
        appointment_time: appointmentData.appointment_time,
        time: appointmentData.appointment_time, // للتوافق مع الكود القديم
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      setBookingData(bookingInfo);
      setShowBookingCard(true);
    } catch (error: any) {
      console.error('خطأ في الحجز:', error);
      console.error('تفاصيل الخطأ:', {
        data: error?.data,
        status: error?.status,
        message: error?.message,
      });
      
      const errorMessage = 
        error?.data?.message || 
        error?.error || 
        error?.message || 
        'حدث خطأ أثناء إنشاء الموعد. يرجى المحاولة مرة أخرى.';
      
      Alert.alert('خطأ في الحجز', errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // دالة للحصول على الوقت المعروض (12 ساعة) من الوقت الأصلي (24 ساعة)
  const getDisplayTime = (time24: string): string => {
    return convertTo12Hour(time24);
  };

  const doctorName = doctor?.name || doctor?.title || 'طبيب';
  const doctorImage = getDoctorImage(doctor);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLoginPress = () => {
    if (isAuthenticated) {
      navigation.navigate('DoctorDashboard');
    } else {
      navigation.navigate('DoctorLogin');
    }
  };

  // دالة للتمرير عند الفوكس على حقل
  const handleInputFocus = (inputType: 'name' | 'phone') => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        if (inputType === 'name') {
          scrollViewRef.current.scrollTo({ y: 150, animated: true });
        } else if (inputType === 'phone') {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    }, 100);
  };

  return (
    <Container>
      <ScreenLayout 
        title="حجز موعد"
        showHeader={true}
        showBackButton={true}
        onBackPress={handleGoBack}
        showLoginButton={true}
        onLoginPress={handleLoginPress}
        isAuthenticated={isAuthenticated}
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
            contentContainerStyle={{
              paddingBottom: 300,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
          {/* معلومات الطبيب - تصميم محسّن */}
          <View 
            style={{
              backgroundColor: '#ffffff',
              marginHorizontal: 16,
              marginTop: 16,
              marginBottom: 8,
              padding: 20,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              shadowColor: '#0c6980',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              {doctorImage && !imageError ? (
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: '#0c6980',
                    shadowColor: '#0c6980',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Image 
                    source={{ uri: doctorImage }} 
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                  />
                </View>
              ) : (
                <View 
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    backgroundColor: '#e6f2f4',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: '#0c6980',
                    shadowColor: '#0c6980',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Ionicons name="person" size={48} color="#0c6980" />
                </View>
              )}
              
              <View style={{ flex: 1 }}>
                <Text 
                  style={{
                    fontSize: 22,
                    fontFamily: 'Cairo_700Bold',
                    color: '#111827',
                    marginBottom: 8,
                  }}
                >
                  {doctorName}
                </Text>
                {doctorSpecialty && (
                  <View 
                    style={{
                      backgroundColor: '#f0f9ff',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      alignSelf: 'flex-start',
                      borderWidth: 1,
                      borderColor: '#0c6980',
                    }}
                  >
                    <Text 
                      style={{
                        fontSize: 14,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#0c6980',
                      }}
                    >
                      {doctorSpecialty}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* حقول الإدخال */}
          <View style={{ marginHorizontal: 16, marginTop: 24, gap: 20 }}>
            {/* الاسم */}
            <View>
              <Text 
                style={{
                  fontSize: 16,
                  fontFamily: 'Cairo_600SemiBold',
                  color: '#111827',
                  marginBottom: 12,
                }}
              >
                اسم المريض <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              <View 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <View 
                  style={{
                    backgroundColor: '#e6f2f4',
                    borderRadius: 14,
                    padding: 10,
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="person-outline" size={22} color="#0c6980" />
                </View>
                <TextInput
                  ref={patientNameInputRef}
                  placeholder="أدخل اسم المريض"
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholderTextColor="#9CA3AF"
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    fontSize: 16,
                    fontFamily: 'Cairo_400Regular',
                    color: '#111827',
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    phoneNumberInputRef.current?.focus();
                  }}
                  onFocus={() => handleInputFocus('name')}
                />
              </View>
            </View>

            {/* رقم الهاتف */}
            <View>
              <Text 
                style={{
                  fontSize: 16,
                  fontFamily: 'Cairo_600SemiBold',
                  color: '#111827',
                  marginBottom: 12,
                }}
              >
                رقم الهاتف <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              <View style={{ gap: 12 }}>
                <CountryCodePicker 
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
                <View 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    borderWidth: 2,
                    borderColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <View 
                    style={{
                      backgroundColor: '#e6f2f4',
                      borderRadius: 14,
                      padding: 10,
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="call-outline" size={22} color="#0c6980" />
                  </View>
                  <TextInput
                    ref={phoneNumberInputRef}
                    placeholder="912345678"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      fontSize: 16,
                      fontFamily: 'Cairo_400Regular',
                      color: '#111827',
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      // يمكن إضافة منطق هنا إذا لزم الأمر
                    }}
                    onFocus={() => handleInputFocus('phone')}
                  />
                </View>
              </View>
            </View>

            {/* التاريخ */}
            <View>
              <Text 
                style={{
                  fontSize: 16,
                  fontFamily: 'Cairo_600SemiBold',
                  color: '#111827',
                  marginBottom: 12,
                }}
              >
                التاريخ <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              
              {/* قائمة التواريخ المتاحة */}
              {availableDates.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
                  style={{ marginBottom: 16 }}
                >
                  {availableDates.map((date: string, index: number) => {
                    try {
                      const dateObj = new Date(date);
                      const dayName = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][dateObj.getDay()];
                      const day = dateObj.getDate();
                      const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                      const month = monthNames[dateObj.getMonth()];
                      const isSelected = selectedDate === date;
                      
                      return (
                        <Pressable
                          key={date || index}
                          onPress={() => setSelectedDate(date)}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderRadius: 16,
                            borderWidth: 2,
                            backgroundColor: isSelected ? '#0c6980' : '#ffffff',
                            borderColor: isSelected ? '#0c6980' : '#e5e7eb',
                            shadowColor: isSelected ? '#0c6980' : '#000',
                            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                            shadowOpacity: isSelected ? 0.3 : 0.08,
                            shadowRadius: isSelected ? 8 : 4,
                            elevation: isSelected ? 6 : 2,
                            minWidth: 100,
                            alignItems: 'center',
                          }}
                        >
                          <Text 
                            style={{
                              fontSize: 12,
                              fontFamily: 'Cairo_500Medium',
                              color: isSelected ? '#ffffff' : '#6b7280',
                              marginBottom: 4,
                            }}
                          >
                            {dayName}
                          </Text>
                          <Text 
                            style={{
                              fontSize: 18,
                              fontFamily: 'Cairo_700Bold',
                              color: isSelected ? '#ffffff' : '#111827',
                            }}
                          >
                            {day}
                          </Text>
                          <Text 
                            style={{
                              fontSize: 11,
                              fontFamily: 'Cairo_400Regular',
                              color: isSelected ? 'rgba(255, 255, 255, 0.9)' : '#9ca3af',
                            }}
                          >
                            {month}
                          </Text>
                        </Pressable>
                      );
                    } catch {
                      return null;
                    }
                  })}
                </ScrollView>
              )}
              
              {/* عرض التاريخ المحدد */}
              {selectedDate && (
                <View 
                  style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#0c6980',
                  }}
                >
                  <View 
                    style={{
                      backgroundColor: '#0c6980',
                      borderRadius: 12,
                      padding: 10,
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="calendar" size={24} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text 
                      style={{
                        fontSize: 14,
                        fontFamily: 'Cairo_500Medium',
                        color: '#6b7280',
                        marginBottom: 4,
                      }}
                    >
                      التاريخ المحدد
                    </Text>
                    <Text 
                      style={{
                        fontSize: 16,
                        fontFamily: 'Cairo_700Bold',
                        color: '#0c6980',
                      }}
                    >
                      {formatDate(selectedDate)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* الوقت */}
            <View>
              <Text 
                style={{
                  fontSize: 16,
                  fontFamily: 'Cairo_600SemiBold',
                  color: '#111827',
                  marginBottom: 12,
                }}
              >
                الوقت <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              {!selectedDate ? (
                <View 
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#e5e7eb',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="time-outline" size={32} color="#9ca3af" />
                  <Text 
                    style={{
                      fontSize: 15,
                      fontFamily: 'Cairo_400Regular',
                      color: '#6b7280',
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                  >
                    يرجى اختيار التاريخ أولاً
                  </Text>
                </View>
              ) : isLoadingAvailability ? (
                <View 
                  style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#0c6980',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="hourglass-outline" size={32} color="#0c6980" />
                  <Text 
                    style={{
                      fontSize: 15,
                      fontFamily: 'Cairo_500Medium',
                      color: '#0c6980',
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                  >
                    جاري جلب المواعيد المتاحة...
                  </Text>
                </View>
              ) : availableTimes.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {availableTimes.map((timeObj: { original: string; display: string }, index: number) => {
                    const isSelected = selectedTime === timeObj.original;
                    return (
                      <Pressable
                        key={index}
                        onPress={() => setSelectedTime(timeObj.original)}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 16,
                          borderRadius: 18,
                          borderWidth: 2,
                          backgroundColor: isSelected ? '#0c6980' : '#ffffff',
                          borderColor: isSelected ? '#0c6980' : '#e5e7eb',
                          shadowColor: isSelected ? '#0c6980' : '#000',
                          shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                          shadowOpacity: isSelected ? 0.3 : 0.08,
                          shadowRadius: isSelected ? 10 : 6,
                          elevation: isSelected ? 8 : 3,
                          minWidth: 90,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text 
                          style={{
                            fontSize: 16,
                            fontFamily: isSelected ? 'Cairo_700Bold' : 'Cairo_600SemiBold',
                            color: isSelected ? '#ffffff' : '#111827',
                          }}
                        >
                          {timeObj.display}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View 
                  style={{
                    backgroundColor: '#fef2f2',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#fecaca',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close-circle-outline" size={32} color="#ef4444" />
                  <Text 
                    style={{
                      fontSize: 15,
                      fontFamily: 'Cairo_500Medium',
                      color: '#dc2626',
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                  >
                    لا توجد مواعيد متاحة حالياً
                  </Text>
                </View>
              )}
            </View>

            {/* زر الحجز */}
            <Pressable
              onPress={handleBook}
              disabled={isCreating}
              style={{
                marginTop: 32,
                marginBottom: 24,
                paddingVertical: 18,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCreating ? '#9ca3af' : '#0c6980',
                shadowColor: isCreating ? '#000' : '#0c6980',
                shadowOffset: { width: 0, height: isCreating ? 2 : 6 },
                shadowOpacity: isCreating ? 0.1 : 0.4,
                shadowRadius: isCreating ? 4 : 16,
                elevation: isCreating ? 2 : 10,
                flexDirection: 'row',
                gap: 8,
              }}
            >
              {isCreating ? (
                <>
                  <Ionicons name="hourglass-outline" size={22} color="#ffffff" />
                  <Text 
                    style={{
                      fontSize: 18,
                      fontFamily: 'Cairo_700Bold',
                      color: '#ffffff',
                    }}
                  >
                    جاري الحجز...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#ffffff" />
                  <Text 
                    style={{
                      fontSize: 18,
                      fontFamily: 'Cairo_700Bold',
                      color: '#ffffff',
                    }}
                  >
                    احجز الموعد
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal التأكيد */}
        <BookingConfirmationModal
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
          bookingData={{
            doctorName,
            doctorImage,
            doctorSpecialty,
            patientName,
            phone: phoneNumber.trim() ? `${selectedCountry.dialCode}${phoneNumber.trim()}` : '',
            date: selectedDate ? formatDate(selectedDate) : '',
            time: selectedTime ? getDisplayTime(selectedTime) : '',
          }}
        />

        {/* كرت الحجز */}
        {showBookingCard && bookingData && (
          <BookingCard
            visible={showBookingCard}
            bookingData={bookingData}
            onClose={() => {
              setShowBookingCard(false);
              navigation.goBack();
            }}
          />
        )}
      </ScreenLayout>
    </Container>
  );
};

