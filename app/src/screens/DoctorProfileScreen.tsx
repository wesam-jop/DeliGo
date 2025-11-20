import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Modal, TextInput, RefreshControl, Image, Platform, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  useDoctorMeQuery, 
  useUpdateDoctorProfileMutation, 
  useChangeDoctorPasswordMutation,
  useUploadDoctorProfileImageMutation,
  useGetCategoriesQuery,
} from '../services/api';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CountryCodePicker } from '../components/CountryCodePicker';
import { Country, defaultCountry, countries } from '../data/countries';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DoctorProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    category: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Fetch doctor data
  const { data: doctorData, isLoading, refetch } = useDoctorMeQuery();
  // Get doctor from response - try multiple paths
  // Priority: doctorData.doctor > doctorData.data > doctorData
  const doctor = doctorData?.doctor || doctorData?.data || doctorData;
  const doctorId = doctor?.id;
  
  // Fetch categories
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesQuery();
  
  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetch();
        refetchCategories();
      }
    }, [doctorId, refetch, refetchCategories])
  );

  // Debug: Create a helper to get phone/area from multiple sources
  const getDoctorPhone = () => {
    if (doctorData?.doctor?.phone) return String(doctorData.doctor.phone);
    if (doctorData?.doctor?.doctor_phone) return String(doctorData.doctor.doctor_phone);
    if (doctor?.phone) return String(doctor.phone);
    if (doctor?.doctor_phone) return String(doctor.doctor_phone);
    return '';
  };

  const getDoctorArea = () => {
    if (doctorData?.doctor?.area) return String(doctorData.doctor.area);
    if (doctorData?.doctor?.doctor_area) return String(doctorData.doctor.doctor_area);
    if (doctor?.area) return String(doctor.area);
    if (doctor?.doctor_area) return String(doctor.doctor_area);
    return '';
  };

  // Debug: Log raw API response
  useEffect(() => {
    if (doctorData && __DEV__) {
      console.log('🔍 Raw API Response:', JSON.stringify(doctorData, null, 2));
      console.log('🔍 Doctor Object:', JSON.stringify(doctor, null, 2));
      console.log('🔍 Doctor Keys:', doctor ? Object.keys(doctor) : 'No doctor');
      console.log('🔍 doctorData.doctor:', JSON.stringify(doctorData.doctor, null, 2));
      console.log('🔍 doctorData.data:', JSON.stringify(doctorData.data, null, 2));
    }
  }, [doctorData, doctor]);

  // Debug: Log doctor data to verify email
  useEffect(() => {
    if (doctor && __DEV__) {
      console.log('🔍 Doctor Profile Data:', {
        doctor,
        email: doctor.email,
        doctor_email: doctor.doctor_email,
        finalEmail: doctor?.email || doctor?.doctor_email,
      });
    }
  }, [doctor]);

  const categories = useMemo(() => {
    // API returns: { success: true, categories: ['name1', 'name2', ...] }
    // or might be: { success: true, data: [{ id, name }, ...] }
    if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
      // If it's an array of strings (names only)
      return categoriesData.categories.map((name: string, index: number) => ({
        id: index + 1,
        name: name,
      }));
    } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      // If it's an array of objects with id and name
      return categoriesData.data;
    } else if (Array.isArray(categoriesData)) {
      // If the response itself is an array
      return categoriesData;
    }
    return [];
  }, [categoriesData]);

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateDoctorProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeDoctorPasswordMutation();
  const [uploadProfileImage] = useUploadDoctorProfileImageMutation();

  // Initialize form when doctor data loads
  useEffect(() => {
    if (doctor) {
      const doctorCategory = doctor.category_id 
        ? categories.find((cat: any) => cat.id === doctor.category_id)?.name 
        : (doctor.category || (typeof doctor.category === 'object' ? doctor.category?.name : '') || '');
      
      // Debug: Log full doctor object to see all available fields
      if (__DEV__) {
        console.log('👨‍⚕️ Full Doctor Object:', doctor);
        console.log('📱 All phone fields:', {
          phone: doctor.phone,
          doctor_phone: doctor.doctor_phone,
          'doctor.doctor_phone': (doctor as any).doctor_phone,
          'doctor.phone': (doctor as any).phone,
        });
      }
      
      // Parse phone number to extract country code and number
      // Priority: doctorData.doctor.phone > doctorData.doctor.doctor_phone > doctor.phone > doctor.doctor_phone
      let fullPhone = '';
      
      if (doctorData?.doctor?.phone) {
        fullPhone = String(doctorData.doctor.phone);
      } else if (doctorData?.doctor?.doctor_phone) {
        fullPhone = String(doctorData.doctor.doctor_phone);
      } else if (doctor?.phone) {
        fullPhone = String(doctor.phone);
      } else if (doctor?.doctor_phone) {
        fullPhone = String(doctor.doctor_phone);
      } else if ((doctor as any)?.phone) {
        fullPhone = String((doctor as any).phone);
      } else if ((doctor as any)?.doctor_phone) {
        fullPhone = String((doctor as any).doctor_phone);
      }
      
      // Remove any null or undefined strings
      if (fullPhone === 'null' || fullPhone === 'undefined' || !fullPhone) {
        fullPhone = '';
      }
      
      if (__DEV__) {
        console.log('📞 Phone extraction:', {
          'doctorData?.doctor?.phone': doctorData?.doctor?.phone,
          'doctorData?.doctor?.doctor_phone': doctorData?.doctor?.doctor_phone,
          'doctor?.phone': doctor?.phone,
          'doctor?.doctor_phone': doctor?.doctor_phone,
          fullPhone,
          doctorDataKeys: doctorData ? Object.keys(doctorData) : [],
          doctorKeys: doctor ? Object.keys(doctor) : [],
        });
      }
      let phoneNumber = fullPhone;
      let country = defaultCountry;
      
      // Debug: Log phone data
      if (__DEV__) {
        console.log('📱 Phone Data:', {
          fullPhone,
          doctorPhone: doctor.phone,
          doctorDoctorPhone: doctor.doctor_phone,
          stringFullPhone: fullPhone,
        });
      }
      
      // Try to extract country code from phone number
      if (fullPhone && fullPhone.startsWith('+')) {
        // Sort countries by dialCode length (longest first) to match longer codes first
        const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
        
        for (const c of sortedCountries) {
          if (fullPhone.startsWith(c.dialCode)) {
            country = c;
            phoneNumber = fullPhone.substring(c.dialCode.length).trim();
            if (__DEV__) {
              console.log('✅ Found country code:', {
                country: c.name,
                dialCode: c.dialCode,
                extractedNumber: phoneNumber,
              });
            }
            break;
          }
        }
      } else if (fullPhone && fullPhone.length > 0) {
        // If phone doesn't start with +, assume it's already without country code
        // but we still need to show it
        phoneNumber = fullPhone;
        if (__DEV__) {
          console.log('⚠️ Phone without + prefix:', fullPhone);
        }
      }
      
      setSelectedCountry(country);
      
      if (__DEV__) {
        console.log('📱 Final phone setup:', {
          selectedCountry: country.name,
          phoneNumber,
        });
      }
      
      // Get area from multiple possible sources
      const doctorArea = doctorData?.doctor?.area || 
                        doctorData?.doctor?.doctor_area || 
                        doctor?.area || 
                        doctor?.doctor_area || 
                        '';
      
      setEditForm({
        name: doctor.name || doctor.title || '',
        email: doctor.email || doctor.doctor_email || '',
        phone: phoneNumber || '', // This will be empty string if no phone, allowing user to enter new one
        area: doctorArea,
        category: doctorCategory,
      });
      
      // Log final form state
      if (__DEV__) {
        console.log('📝 Form initialized:', {
          phone: phoneNumber || '',
          selectedCountry: country.name,
          countryCode: country.dialCode,
        });
      }
    }
  }, [doctor, categories, doctorData]);

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    if (!doctorId) {
      Alert.alert('خطأ', 'معرف الطبيب غير موجود');
      return;
    }

    if (!editForm.name || !editForm.email || !editForm.phone || !editForm.area || !editForm.category) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${selectedCountry.dialCode}${editForm.phone.trim()}`;
      
      await updateProfile({
        doctorId,
        data: {
          name: editForm.name,
          email: editForm.email,
          phone: fullPhoneNumber,
          area: editForm.area,
          category: editForm.category || undefined,
        },
      }).unwrap();
      
      Alert.alert('نجح', 'تم تحديث الملف الشخصي بنجاح');
      setEditModalVisible(false);
      refetch();
    } catch (error: any) {
      Alert.alert('خطأ', error?.data?.message || 'فشل تحديث الملف الشخصي');
    }
  };

  const handleChangePassword = async () => {
    if (!doctorId) {
      Alert.alert('خطأ', 'معرف الطبيب غير موجود');
      return;
    }

    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      Alert.alert('خطأ', 'كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      await changePassword({
        doctorId,
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      }).unwrap();
      
      Alert.alert('نجح', 'تم تغيير كلمة المرور بنجاح');
      setPasswordModalVisible(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      Alert.alert('خطأ', error?.data?.message || 'فشل تغيير كلمة المرور');
    }
  };

  const handleUploadImage = async () => {
    if (!doctorId) {
      Alert.alert('خطأ', 'معرف الطبيب غير موجود');
      return;
    }

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('تنبيه', 'يجب السماح بالوصول إلى الصور');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        try {
          await uploadProfileImage({
            doctorId,
            image: {
              uri: result.assets[0].uri,
              type: 'image/jpeg',
              name: 'profile.jpg',
            },
          }).unwrap();
          
          Alert.alert('نجح', 'تم رفع الصورة الشخصية بنجاح');
          refetch();
        } catch (error: any) {
          Alert.alert('خطأ', error?.data?.message || 'فشل رفع الصورة');
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error: any) {
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
      setUploadingImage(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'تعديل الملف الشخصي',
      icon: 'create-outline',
      color: '#0c6980',
      onPress: handleEditProfile,
    },
    {
      id: 'password',
      title: 'تغيير كلمة المرور',
      icon: 'lock-closed-outline',
      color: '#6b7280',
      onPress: () => setPasswordModalVisible(true),
    },
    {
      id: 'image',
      title: 'تغيير الصورة الشخصية',
      icon: 'camera-outline',
      color: '#3b82f6',
      onPress: handleUploadImage,
    },
  ];

  return (
    <Container>
      <ScreenLayout
        title="الملف الشخصي"
        showHeader={true}
        scrollable={true}
        showHomeButton={true}
        onHomePress={() => {
          navigation.navigate('Home');
        }}
      >
        <View className="flex-1 bg-gray-50">
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#0c6980" />
              <Text className="text-gray-600 mt-4">جاري تحميل البيانات...</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor="#0c6980"
                  colors={['#0c6980']}
                />
              }
            >
              {/* Profile Header */}
              <View 
                style={{
                  backgroundColor: '#0c6980',
                  borderRadius: 24,
                  padding: 24,
                  marginBottom: 24,
                  shadowColor: '#0c6980',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Pressable
                    onPress={handleUploadImage}
                    disabled={uploadingImage}
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#ffffff',
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 8,
                      borderWidth: 3,
                      borderColor: '#ffffff',
                      position: 'relative',
                    }}
                  >
                    {doctor?.profile_image_url ? (
                      <Image
                        source={{ uri: doctor.profile_image_url }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 50,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="person" size={48} color="#0c6980" />
                    )}
                    {uploadingImage && (
                      <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: 50,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ActivityIndicator size="small" color="#ffffff" />
                      </View>
                    )}
                    <View style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 32,
                      height: 32,
                      backgroundColor: '#0c6980',
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 3,
                      borderColor: '#ffffff',
                    }}>
                      <Ionicons name="camera" size={16} color="#ffffff" />
                    </View>
                  </Pressable>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: 24, 
                    fontFamily: 'Cairo_700Bold',
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                    {doctor?.name || doctor?.title || 'الطبيب'}
                  </Text>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: 15,
                    fontFamily: 'Cairo_400Regular',
                    marginBottom: 12,
                    textAlign: 'center',
                  }}>
                    {(doctor?.email || doctor?.doctor_email) ? (
                      doctor.email || doctor.doctor_email
                    ) : (
                      'بريد إلكتروني غير محدد'
                    )}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}>
                      <Text style={{ 
                        color: '#ffffff', 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                      }}>
                        {typeof doctor?.category === 'object' 
                          ? doctor.category?.name 
                          : doctor?.category || 'اختصاص'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Doctor Info */}
              <View style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#f1f5f9',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Ionicons name="information-circle-outline" size={24} color="#0c6980" style={{ marginLeft: 8 }} />
                  <Text style={{ 
                    fontSize: 18, 
                    fontFamily: 'Cairo_700Bold', 
                    color: '#111827',
                  }}>
                    معلومات الطبيب
                  </Text>
                </View>
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: '#f0f9ff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="mail" size={20} color="#0c6980" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 11,
                        fontFamily: 'Cairo_400Regular',
                        color: '#6b7280',
                        marginBottom: 2,
                      }}>
                        البريد الإلكتروني
                      </Text>
                      <Text style={{ 
                        fontSize: 14,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                      }}>
                        {(doctor?.email || doctor?.doctor_email) ? (
                          doctor.email || doctor.doctor_email
                        ) : (
                          <Text style={{ color: '#9ca3af', fontFamily: 'Cairo_400Regular' }}>
                            غير محدد
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                  {/* Phone */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: '#f0f9ff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="call" size={20} color="#0c6980" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 11,
                        fontFamily: 'Cairo_400Regular',
                        color: '#6b7280',
                        marginBottom: 2,
                      }}>
                        رقم الهاتف
                      </Text>
                      <Text style={{ 
                        fontSize: 14,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                      }}>
                        {(() => {
                          const phone = getDoctorPhone();
                          if (phone && phone.trim() !== '' && phone !== 'null' && phone !== 'undefined') {
                            return phone;
                          }
                          return (
                            <Text style={{ color: '#9ca3af', fontFamily: 'Cairo_400Regular' }}>
                              غير محدد
                            </Text>
                          );
                        })()}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Area */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: '#f0f9ff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="location" size={20} color="#0c6980" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 11,
                        fontFamily: 'Cairo_400Regular',
                        color: '#6b7280',
                        marginBottom: 2,
                      }}>
                        المنطقة
                      </Text>
                      <Text style={{ 
                        fontSize: 14,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                      }}>
                        {(() => {
                          const area = getDoctorArea();
                          if (area && area.trim() !== '' && area !== 'null' && area !== 'undefined') {
                            return area;
                          }
                          return (
                            <Text style={{ color: '#9ca3af', fontFamily: 'Cairo_400Regular' }}>
                              غير محدد
                            </Text>
                          );
                        })()}
                      </Text>
                    </View>
                  </View>
                  {doctor?.category && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: '#f0f9ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Ionicons name="medical" size={20} color="#0c6980" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 11,
                          fontFamily: 'Cairo_400Regular',
                          color: '#6b7280',
                          marginBottom: 2,
                        }}>
                          التخصص
                        </Text>
                        <Text style={{ 
                          fontSize: 14,
                          fontFamily: 'Cairo_600SemiBold',
                          color: '#111827',
                        }}>
                          {typeof doctor.category === 'object' 
                            ? doctor.category?.name 
                            : doctor.category}
                        </Text>
                      </View>
                    </View>
                  )}
                  {(doctor?.area || doctor?.doctor_area) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: '#f0f9ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Ionicons name="location" size={20} color="#0c6980" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 11,
                          fontFamily: 'Cairo_400Regular',
                          color: '#6b7280',
                          marginBottom: 2,
                        }}>
                          المنطقة
                        </Text>
                        <Text style={{ 
                          fontSize: 14,
                          fontFamily: 'Cairo_600SemiBold',
                          color: '#111827',
                        }}>
                          {doctor?.area || doctor?.doctor_area}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Menu Items */}
              <View className="mb-6">
                {menuItems.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={item.onPress}
                    className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm border border-gray-100"
                    style={{
                      marginBottom: index < menuItems.length - 1 ? 16 : 0,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{
                          backgroundColor: `${item.color}20`,
                        }}
                      >
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </Pressable>
                ))}
              </View>

              {/* Logout Button */}
              <Pressable
                onPress={handleLogout}
                className="bg-error-50 rounded-2xl p-4 flex-row items-center justify-center border-2 border-error-200"
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text className="text-error-600 font-bold text-base mr-2">تسجيل الخروج</Text>
              </Pressable>

              {/* App Version */}
              <Text style={{ 
                textAlign: 'center', 
                color: '#9ca3af', 
                fontSize: 12,
                fontFamily: 'Cairo_400Regular',
                marginTop: 24,
                marginBottom: 16,
              }}>
                الإصدار 1.0.0
              </Text>
            </ScrollView>
          )}

          {/* Edit Profile Modal */}
          <Modal
            visible={editModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
              <View style={{ 
                backgroundColor: '#ffffff', 
                borderTopLeftRadius: 24, 
                borderTopRightRadius: 24, 
                padding: 24,
                maxHeight: '90%',
              }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 24,
                }}>
                  <Text style={{ 
                    fontSize: 20, 
                    fontFamily: 'Cairo_700Bold', 
                    color: '#111827',
                  }}>
                    تعديل الملف الشخصي
                  </Text>
                  <Pressable onPress={() => setEditModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ gap: 16 }}>
                    {/* Name */}
                    <View>
                      <Text style={{ 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        الاسم <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <TextInput
                        value={editForm.name}
                        onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                        placeholder="اسم الطبيب"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontSize: 15,
                          fontFamily: 'Cairo_400Regular',
                          color: '#111827',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                        }}
                      />
                    </View>

                    {/* Email */}
                    <View>
                      <Text style={{ 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        البريد الإلكتروني <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <TextInput
                        value={editForm.email}
                        onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                        placeholder="example@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontSize: 15,
                          fontFamily: 'Cairo_400Regular',
                          color: '#111827',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                        }}
                      />
                    </View>

                    {/* Phone */}
                    <View>
                      <Text style={{ 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        رقم الهاتف <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <View style={{ gap: 12 }}>
                        <View style={{ width: '100%' }}>
                          <CountryCodePicker
                            selectedCountry={selectedCountry}
                            onSelect={setSelectedCountry}
                          />
                        </View>
                        <View style={{ width: '100%' }}>
                          <TextInput
                            value={editForm.phone}
                            onChangeText={(text) => setEditForm({ ...editForm, phone: text.replace(/[^0-9]/g, '') })}
                            placeholder="09xxxxxxxx"
                            keyboardType="phone-pad"
                            style={{
                              backgroundColor: '#f9fafb',
                              borderRadius: 12,
                              paddingHorizontal: 16,
                              paddingVertical: 14,
                              fontSize: 15,
                              fontFamily: 'Cairo_400Regular',
                              color: '#111827',
                              borderWidth: 1,
                              borderColor: '#e5e7eb',
                              width: '100%',
                            }}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Area */}
                    <View>
                      <Text style={{ 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        المنطقة <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <TextInput
                        value={editForm.area}
                        onChangeText={(text) => setEditForm({ ...editForm, area: text })}
                        placeholder="المنطقة"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontSize: 15,
                          fontFamily: 'Cairo_400Regular',
                          color: '#111827',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                        }}
                      />
                    </View>

                    {/* Category */}
                    <View>
                      <Text style={{ 
                        fontSize: 13,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        التخصص <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <Pressable
                        onPress={() => setShowCategoryPicker(true)}
                        style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text style={{
                          fontSize: 15,
                          fontFamily: 'Cairo_400Regular',
                          color: editForm.category ? '#111827' : '#9ca3af',
                        }}>
                          {editForm.category || 'اختر التخصص'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6b7280" />
                      </Pressable>
                    </View>
                  </View>
                </ScrollView>

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                  <Pressable
                    onPress={() => setEditModalVisible(false)}
                    style={{
                      flex: 1,
                      backgroundColor: '#f3f4f6',
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 15,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#6b7280',
                    }}>
                      إلغاء
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    style={{
                      flex: 1,
                      backgroundColor: '#0c6980',
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: 'center',
                      opacity: isUpdatingProfile ? 0.6 : 1,
                    }}
                  >
                    {isUpdatingProfile ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={{ 
                        fontSize: 15,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#ffffff',
                      }}>
                        حفظ
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Change Password Modal */}
          <Modal
            visible={passwordModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPasswordModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
              <View style={{ 
                backgroundColor: '#ffffff', 
                borderTopLeftRadius: 24, 
                borderTopRightRadius: 24, 
                padding: 24,
              }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 24,
                }}>
                  <Text style={{ 
                    fontSize: 20, 
                    fontFamily: 'Cairo_700Bold', 
                    color: '#111827',
                  }}>
                    تغيير كلمة المرور
                  </Text>
                  <Pressable onPress={() => setPasswordModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>

                <View style={{ gap: 16 }}>
                  {/* Current Password */}
                  <View>
                    <Text style={{ 
                      fontSize: 13,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#111827',
                      marginBottom: 8,
                    }}>
                      كلمة المرور الحالية <Text style={{ color: '#ef4444' }}>*</Text>
                    </Text>
                    <TextInput
                      value={passwordForm.current_password}
                      onChangeText={(text) => setPasswordForm({ ...passwordForm, current_password: text })}
                      placeholder="كلمة المرور الحالية"
                      secureTextEntry
                      style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 15,
                        fontFamily: 'Cairo_400Regular',
                        color: '#111827',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                      }}
                    />
                  </View>

                  {/* New Password */}
                  <View>
                    <Text style={{ 
                      fontSize: 13,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#111827',
                      marginBottom: 8,
                    }}>
                      كلمة المرور الجديدة <Text style={{ color: '#ef4444' }}>*</Text>
                    </Text>
                    <TextInput
                      value={passwordForm.new_password}
                      onChangeText={(text) => setPasswordForm({ ...passwordForm, new_password: text })}
                      placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)"
                      secureTextEntry
                      style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 15,
                        fontFamily: 'Cairo_400Regular',
                        color: '#111827',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                      }}
                    />
                  </View>

                  {/* Confirm Password */}
                  <View>
                    <Text style={{ 
                      fontSize: 13,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#111827',
                      marginBottom: 8,
                    }}>
                      تأكيد كلمة المرور <Text style={{ color: '#ef4444' }}>*</Text>
                    </Text>
                    <TextInput
                      value={passwordForm.confirm_password}
                      onChangeText={(text) => setPasswordForm({ ...passwordForm, confirm_password: text })}
                      placeholder="تأكيد كلمة المرور الجديدة"
                      secureTextEntry
                      style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 15,
                        fontFamily: 'Cairo_400Regular',
                        color: '#111827',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                      }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                  <Pressable
                    onPress={() => {
                      setPasswordModalVisible(false);
                      setPasswordForm({
                        current_password: '',
                        new_password: '',
                        confirm_password: '',
                      });
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#f3f4f6',
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 15,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#6b7280',
                    }}>
                      إلغاء
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleChangePassword}
                    disabled={isChangingPassword}
                    style={{
                      flex: 1,
                      backgroundColor: '#0c6980',
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: 'center',
                      opacity: isChangingPassword ? 0.6 : 1,
                    }}
                  >
                    {isChangingPassword ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={{ 
                        fontSize: 15,
                        fontFamily: 'Cairo_600SemiBold',
                        color: '#ffffff',
                      }}>
                        حفظ
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Category Picker Modal */}
          <Modal
            visible={showCategoryPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCategoryPicker(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
              <View style={{ 
                backgroundColor: '#ffffff', 
                borderTopLeftRadius: 24, 
                borderTopRightRadius: 24,
                maxHeight: '70%',
                paddingTop: 20,
              }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb',
                }}>
                  <Text style={{ 
                    fontSize: 18, 
                    fontFamily: 'Cairo_700Bold', 
                    color: '#111827' 
                  }}>
                    اختر التخصص
                  </Text>
                  <Pressable onPress={() => setShowCategoryPicker(false)}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => String(item.id || item.name)}
                  renderItem={({ item }) => {
                    const categoryName = item.name || item;
                    const isSelected = editForm.category === categoryName;
                    return (
                      <Pressable
                        onPress={() => {
                          setEditForm({ ...editForm, category: categoryName });
                          setShowCategoryPicker(false);
                        }}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 16,
                          backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                          borderBottomWidth: 1,
                          borderBottomColor: '#f3f4f6',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ 
                            fontSize: 15, 
                            fontFamily: isSelected ? 'Cairo_600SemiBold' : 'Cairo_400Regular',
                            color: isSelected ? '#0c6980' : '#111827',
                          }}>
                            {categoryName}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color="#0c6980" />
                          )}
                        </View>
                      </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontFamily: 'Cairo_400Regular', color: '#6b7280' }}>
                        لا توجد تخصصات متاحة
                      </Text>
                    </View>
                  }
                />
              </View>
            </View>
          </Modal>

        </View>
      </ScreenLayout>
    </Container>
  );
};

