import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, RefreshControl, Linking, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DoctorTabParamList } from '../navigation/DoctorTabNavigator';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDoctorMeQuery, useGetDoctorStatsQuery, useGetDoctorAppointmentsQuery, useGetDoctorPaymentsQuery } from '../services/api';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import { getDoctorImage } from '../utils/imageUtils';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';

export const DoctorDashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<DoctorTabParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  console.log('DoctorDashboardScreen - تم فتح الشاشة');

  // Fetch doctor data
  const { data: doctorData, isLoading: doctorLoading, error: doctorError, refetch: refetchDoctor } = useDoctorMeQuery();
  const doctorRaw = doctorData?.doctor || doctorData?.data;
  const doctorId = doctorRaw?.id;

  // في حال حذف الحساب من قبل الأدمن: تسجيل خروج فوري وإعادة التوجيه
  useEffect(() => {
    // إذا عاد الخطأ 401/404 أو لم تعد بيانات الطبيب موجودة بعد التحميل
    const status = (doctorError as any)?.status || (doctorError as any)?.originalStatus;
    const isDeletedOrUnauthorized = status === 401 || status === 404;
    if (!doctorLoading && (isDeletedOrUnauthorized || (!doctorRaw && doctorError))) {
      if (__DEV__) {
        console.warn('🚪 الحساب غير متاح (محذوف/غير مخول) -> تسجيل الخروج وإعادة التوجيه', { status });
      }
      dispatch(logout());
      (rootNavigation as any).reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [doctorLoading, doctorRaw, doctorError, dispatch, rootNavigation]);

  // Fetch stats
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetDoctorStatsQuery(doctorId || 0, {
    skip: !doctorId,
  });
  const stats = statsData?.data?.stats || statsData?.stats || statsData;

  // Fetch appointments
  const { data: appointmentsData, isLoading: appointmentsLoading, refetch: refetchAppointments } = useGetDoctorAppointmentsQuery(doctorId || 0, {
    skip: !doctorId,
  });

  // Fetch payments to check for pending payments
  const { data: paymentsData, isLoading: paymentsLoading, refetch: refetchPayments } = useGetDoctorPaymentsQuery(doctorId || '', { 
    skip: !doctorId,
    // إعادة جلب البيانات عند فتح الشاشة
    refetchOnMountOrArgChange: true,
  });

  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetchDoctor();
        refetchStats();
        refetchAppointments();
        refetchPayments();
      }
    }, [doctorId, refetchDoctor, refetchStats, refetchAppointments, refetchPayments])
  );

  // دالة مساعدة لاستخراج المنطقة
  const extractArea = (doctorData: any): string => {
    if (!doctorData) return 'غير محدد';

    // طباعة للتشخيص
    if (__DEV__) {
      console.log('🔍 فحص المنطقة - البيانات الكاملة:', JSON.stringify(doctorData, null, 2));
    }

    // محاولة 1: area مباشر (string)
    if (typeof doctorData.area === 'string' && doctorData.area.trim()) {
      if (__DEV__) console.log('✅ تم العثور على المنطقة في doctorData.area:', doctorData.area);
      return doctorData.area.trim();
    }

    // محاولة 2: area ككائن مع name
    if (doctorData.area && typeof doctorData.area === 'object') {
      if (doctorData.area.name && typeof doctorData.area.name === 'string') {
        if (__DEV__) console.log('✅ تم العثور على المنطقة في doctorData.area.name:', doctorData.area.name);
        return String(doctorData.area.name).trim();
      }
      // إذا كان الكائن يحتوي على string مباشر
      if (typeof doctorData.area === 'object' && Object.keys(doctorData.area).length === 0) {
        // كائن فارغ
      } else {
        // محاولة أي حقل آخر في الكائن
        const firstValue = Object.values(doctorData.area)[0];
        if (typeof firstValue === 'string' && firstValue.trim()) {
          if (__DEV__) console.log('✅ تم العثور على المنطقة في doctorData.area (first value):', firstValue);
          return firstValue.trim();
        }
      }
    }

    // محاولة 3: location مباشر
    if (typeof doctorData.location === 'string' && doctorData.location.trim()) {
      if (__DEV__) console.log('✅ تم العثور على المنطقة في doctorData.location:', doctorData.location);
      return doctorData.location.trim();
    }

    // محاولة 4: location ككائن
    if (doctorData.location && typeof doctorData.location === 'object' && doctorData.location.name) {
      if (__DEV__) console.log('✅ تم العثور على المنطقة في doctorData.location.name:', doctorData.location.name);
      return String(doctorData.location.name).trim();
    }

    // محاولة 5: أي حقل آخر قد يحتوي على المنطقة
    const areaFields = ['area_name', 'areaName', 'region', 'city', 'district'];
    for (const field of areaFields) {
      if (doctorData[field] && typeof doctorData[field] === 'string' && doctorData[field].trim()) {
        if (__DEV__) console.log(`✅ تم العثور على المنطقة في doctorData.${field}:`, doctorData[field]);
        return doctorData[field].trim();
      }
    }

    // محاولة 6: البحث في كل الحقول
    for (const key in doctorData) {
      if (key.toLowerCase().includes('area') || key.toLowerCase().includes('location') || key.toLowerCase().includes('region')) {
        const value = doctorData[key];
        if (typeof value === 'string' && value.trim()) {
          if (__DEV__) console.log(`✅ تم العثور على المنطقة في doctorData.${key}:`, value);
          return value.trim();
        }
      }
    }

    if (__DEV__) console.warn('⚠️ لم يتم العثور على المنطقة في البيانات');
    return 'غير محدد';
  };

  // استخراج صورة الطبيب
  const doctorImage = useMemo(() => {
    if (!doctorRaw) return null;
    return getDoctorImage(doctorRaw);
  }, [doctorRaw]);

  const doctor = doctorRaw
    ? {
        ...doctorRaw,
        // ضمان عرض الاسم والتخصص والمنطقة بشكل صحيح
        name: doctorRaw.name || doctorRaw.title || 'الطبيب',
        category:
          (doctorRaw.category && (doctorRaw.category.name || doctorRaw.category)) ||
          doctorRaw.specialty ||
          'غير محدد',
        area: extractArea(doctorRaw),
        email: doctorRaw.email,
        phone: doctorRaw.phone || doctorRaw.phone_number,
        confirmed_appointments: Number(doctorRaw.confirmed_appointments || 0),
        pending_appointments: Number(doctorRaw.pending_appointments || 0),
        description: doctorRaw.description,
      }
    : undefined;

  // Log errors for debugging
  useEffect(() => {
    if (doctorError) {
      console.error('خطأ في جلب بيانات الطبيب:', doctorError);
    }
    if (doctorData && doctorRaw) {
      if (__DEV__) {
        console.log('🔍 بيانات الطبيب الكاملة:', doctorData);
        console.log('📋 doctorRaw:', doctorRaw);
        console.log('📍 منطقة الطبيب (area):', doctorRaw.area, typeof doctorRaw.area);
        console.log('📍 موقع الطبيب (location):', doctorRaw.location, typeof doctorRaw.location);
        console.log('✅ اسم المنطقة المستخرج:', doctor?.area);
      }
    }
  }, [doctorError, doctorData, doctorRaw, doctor]);

  // التأكد من أن appointments هي مصفوفة
  let appointmentsArray: any[] = [];
  if (appointmentsData) {
    if (Array.isArray(appointmentsData)) {
      appointmentsArray = appointmentsData;
    } else if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
      appointmentsArray = appointmentsData.data;
    } else if (Array.isArray(appointmentsData.appointments)) {
      appointmentsArray = appointmentsData.appointments;
    }
  }

  const appointments = appointmentsArray.map((a: any) => ({
    ...a,
    // توحيد الحقول للعرض
    date: a.appointment_date || a.date || '',
    time: a.appointment_time || a.time || '',
    patient_name: a.patient_name || a.name || 'مريض',
    patient_phone: a.patient_phone || a.phone || a.phone_number || '',
    status: a.status || a.state || 'pending',
  }));

  const isLoading = doctorLoading || statsLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDoctor(), refetchStats(), refetchAppointments()]);
    setRefreshing(false);
  };

  // Stats cards data - استخدام بيانات الإحصائيات الحقيقية من API
  const totalAppointments = Number(stats?.total_appointments || 0);
  const pendingAppointments = Number(stats?.pending_appointments || 0);
  const confirmedAppointments = Number(stats?.confirmed_appointments || 0);
  const cancelledAppointments = Number(stats?.cancelled_appointments || 0);
  const todayAppointments = Number(stats?.today_appointments || 0);
  const dailyLimit = Number(stats?.daily_limit || 0);
  const availableToday = Number(stats?.available_today || 0);
  const remainingSlotsToday = Number(stats?.remaining_slots_today || 0);

  // معلومات الاشتراك
  const subscriptionInfo = useMemo(() => {
    if (!doctor) return null;
    const activeSubscription = (doctor as any).active_subscription || (doctor as any).subscription;
    if (!activeSubscription) return null;

    return {
      type: activeSubscription.subscription_type || activeSubscription.type || 'غير محدد',
      expiresAt: activeSubscription.subscription_expires_at || activeSubscription.expires_at,
      daysRemaining: activeSubscription.days_remaining || 0,
      isActive: activeSubscription.status === 'active' || activeSubscription.is_active,
    };
  }, [doctor]);

  // البحث عن دفع معلق
  const pendingPayment = useMemo(() => {
    const list = paymentsData?.payments || paymentsData?.data?.payments || [];
    return list.find((p: any) => p.status === 'pending' && p.payment_type === 'subscription') || null;
  }, [paymentsData]);

  // التحقق من حالة الدفع والاشتراك وإعادة التوجيه
  useEffect(() => {
    if (doctorLoading || paymentsLoading || !doctorRaw) return;

    // التحقق من وجود دفع مدفوع أولاً (إذا كان هناك دفع مدفوع، لا نحول)
    const allPayments = paymentsData?.payments || paymentsData?.data?.payments || [];
    const paidPayment = allPayments.find((p: any) => {
      const status = (p.status || '').toLowerCase();
      const paymentType = (p.payment_type || '').toLowerCase();
      return (
        (status === 'paid' || status === 'approved' || status === 'completed') &&
        paymentType === 'subscription'
      );
    });

    if (__DEV__) {
      console.log('🔍 فحص حالة الدفع والاشتراك:', {
        allPaymentsCount: allPayments.length,
        paidPayment: paidPayment ? { id: paidPayment.id, status: paidPayment.status } : null,
        pendingPayment: pendingPayment ? { id: pendingPayment.id, status: pendingPayment.status } : null,
        subscriptionInfo,
        doctorStatus: doctorRaw?.status,
      });
    }

    // إذا كان هناك دفع مدفوع، لا نحول (حتى لو لم يكن الاشتراك محدث بعد)
    if (paidPayment) {
      if (__DEV__) {
        console.log('✅ يوجد دفع مدفوع، البقاء في الداشبورد:', {
          paymentId: paidPayment.id,
          status: paidPayment.status,
          subscriptionExpiresAt: paidPayment.subscription_expires_at,
        });
      }
      return;
    }

    // إذا كان هناك دفع معلق، نحول إلى صفحة الانتظار
    if (pendingPayment) {
      if (__DEV__) {
        console.log('⚠️ يوجد دفع معلق، التحويل إلى صفحة الانتظار:', pendingPayment);
      }
      (rootNavigation as any).replace('Waiting');
      return;
    }

    // التحقق من انتهاء الاشتراك
    if (subscriptionInfo) {
      const expiresAt = subscriptionInfo.expiresAt;
      const daysRemaining = subscriptionInfo.daysRemaining || 0;

      // التحقق من انتهاء الاشتراك
      let isExpired = false;
      if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        isExpired = expiryDate <= now;
      } else if (daysRemaining <= 0) {
        isExpired = true;
      }

      if (isExpired) {
        if (__DEV__) {
          console.log('⚠️ الاشتراك منتهي، التحويل إلى صفحة انتهاء الاشتراك', {
            expiresAt: subscriptionInfo.expiresAt,
            daysRemaining,
          });
        }
        (rootNavigation as any).replace('SubscriptionExpired');
        return;
      }
    }

    // التحقق من حالة الطبيب - إذا كان status === 'active'، لا نحول
    if (doctorRaw?.status === 'active') {
      if (__DEV__) {
        console.log('✅ حالة الطبيب نشطة، البقاء في الداشبورد');
      }
      return;
    }

    // إذا لم يكن هناك اشتراك نشط (null أو isActive = false)، نحول إلى صفحة اختيار الخطة
    const hasActiveSubscription = subscriptionInfo?.isActive === true;
    if (!hasActiveSubscription) {
      if (__DEV__) {
        console.log('⚠️ لا يوجد اشتراك نشط، التحويل إلى صفحة اختيار الخطة', {
          subscriptionInfo,
          hasActiveSubscription,
          doctorStatus: doctorRaw?.status,
        });
      }
      (rootNavigation as any).replace('SelectPlan');
      return;
    }
  }, [doctorLoading, doctorRaw, pendingPayment, subscriptionInfo, rootNavigation, paymentsData]);

  // دالة لتحويل الوقت من 24 ساعة إلى 12 ساعة
  const formatTo12Hour = (time24?: string): string => {
    if (!time24) return '-';
    try {
      // إذا كان الوقت بصيغة 12 ساعة بالفعل (يحتوي على ص/م)
      if (time24.includes('ص') || time24.includes('م') || time24.includes('AM') || time24.includes('PM')) {
        return time24;
      }

      // تحويل من 24 ساعة إلى 12 ساعة
      const timeMatch = time24.match(/^(\d{1,2}):(\d{2})/);
      if (!timeMatch) return time24;

      const hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];

      if (isNaN(hours) || hours < 0 || hours > 23) return time24;

      if (hours === 0) {
        return `12:${minutes} ص`;
      } else if (hours < 12) {
        return `${hours}:${minutes} ص`;
      } else if (hours === 12) {
        return `12:${minutes} م`;
      } else {
        return `${hours - 12}:${minutes} م`;
      }
    } catch {
      return time24;
    }
  };

  // دالة لتنظيف وتنسيق رقم الهاتف
  const formatPhoneNumber = (phone?: string): string => {
    if (!phone) return '';
    // إزالة أي مسافات أو أحرف غير رقمية (عدا +)
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned;
  };

  const statsCards = [
    {
      id: 'today',
      title: 'حجوزات اليوم',
      value: todayAppointments,
      subtitle: `من ${dailyLimit || 'غير محدد'}`,
      icon: 'today-outline',
      color: '#0c6980',
      bgColor: '#e6f2f4',
      textColor: '#0c6980',
    },
    {
      id: 'available',
      title: 'المتاح اليوم',
      value: availableToday,
      subtitle: remainingSlotsToday > 0 ? `${remainingSlotsToday} فتحة متبقية` : 'لا توجد فتحات',
      icon: 'time-outline',
      color: '#22c55e',
      bgColor: '#d1fae5',
      textColor: '#065f46',
    },
    {
      id: 'pending',
      title: 'قيد الانتظار',
      value: pendingAppointments,
      subtitle: 'في انتظار الموافقة',
      icon: 'hourglass-outline',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      textColor: '#92400e',
    },
    {
      id: 'confirmed',
      title: 'المؤكدة',
      value: confirmedAppointments,
      subtitle: 'مواعيد مؤكدة',
      icon: 'checkmark-circle-outline',
      color: '#22c55e',
      bgColor: '#d1fae5',
      textColor: '#065f46',
    },
    {
      id: 'total',
      title: 'إجمالي الحجوزات',
      value: totalAppointments,
      subtitle: 'جميع المواعيد',
      icon: 'calendar-outline',
      color: '#6366f1',
      bgColor: '#eef2ff',
      textColor: '#4338ca',
    },
    {
      id: 'cancelled',
      title: 'الملغاة',
      value: cancelledAppointments,
      subtitle: 'مواعيد ملغاة',
      icon: 'close-circle-outline',
      color: '#ef4444',
      bgColor: '#fee2e2',
      textColor: '#991b1b',
    },
  ];


  const recentAppointments = appointments.slice(0, 5);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-warning-100 text-warning-700',
      confirmed: 'bg-primary-100 text-primary-700',
      completed: 'bg-success-100 text-success-700',
      cancelled: 'bg-error-100 text-error-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكدة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
    };
    return texts[status] || status;
  };

  return (
    <Container>
      <ScreenLayout
        title="لوحة التحكم"
        showHeader={true}
        scrollable={true}
        showHomeButton={true}
        onHomePress={() => {
          (rootNavigation as any).navigate('Home');
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0c6980"
              colors={['#0c6980']}
            />
          }
        >
          {/* Welcome Section - تصميم محسّن للموبايل */}
          <View className="mb-5">
            <View
              style={{
                backgroundColor: '#0c6980',
                borderRadius: 24,
                padding: 20,
                shadowColor: '#0c6980',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#ffffff',
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  }}
                >
                  {doctorImage ? (
                    <Image
                      source={{ uri: doctorImage }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 28,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="person-circle" size={32} color="#0c6980" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 12,
                      marginBottom: 4,
                      fontFamily: 'Cairo_400Regular',
                      opacity: 0.9,
                    }}
                  >
                    مرحباً بك دكتور
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#ffffff',
                      fontSize: 20,
                      fontFamily: 'Cairo_700Bold',
                    }}
                  >
                    {doctor?.name || 'الطبيب'}
                  </Text>
                  {doctor?.category && doctor.category !== 'غير محدد' && (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#ffffff',
                        fontSize: 14,
                        fontFamily: 'Cairo_500Medium',
                        opacity: 0.9,
                        marginTop: 2,
                      }}
                    >
                      {doctor.category}
                    </Text>
                  )}
                </View>
              </View>
              {doctor?.area && doctor.area !== 'غير محدد' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Ionicons name="location" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14,
                      fontFamily: 'Cairo_500Medium',
                    }}
                  >
                    {doctor.area}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Subscription Status Card - بطاقة حالة الاشتراك */}
          {subscriptionInfo && (
            <View
              style={{
                backgroundColor: subscriptionInfo.isActive ? '#d1fae5' : '#fee2e2',
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                borderWidth: 2,
                borderColor: subscriptionInfo.isActive ? '#22c55e' : '#ef4444',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: subscriptionInfo.isActive ? '#22c55e' : '#ef4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name={subscriptionInfo.isActive ? 'checkmark-circle' : 'close-circle'}
                    size={28}
                    color="#ffffff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Cairo_700Bold',
                      color: subscriptionInfo.isActive ? '#065f46' : '#991b1b',
                      marginBottom: 4,
                    }}
                  >
                    {subscriptionInfo.isActive ? 'اشتراك نشط' : 'اشتراك منتهي'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Cairo_400Regular',
                      color: subscriptionInfo.isActive ? '#065f46' : '#991b1b',
                      opacity: 0.8,
                    }}
                  >
                    {subscriptionInfo.type}
                  </Text>
                </View>
              </View>
              {subscriptionInfo.isActive && subscriptionInfo.daysRemaining > 0 && (
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 12,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Cairo_500Medium',
                        color: '#065f46',
                      }}
                    >
                      الأيام المتبقية
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Cairo_700Bold',
                        color: '#065f46',
                      }}
                    >
                      {subscriptionInfo.daysRemaining} يوم
                    </Text>
                  </View>
                  {subscriptionInfo.expiresAt && (
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Cairo_400Regular',
                        color: '#065f46',
                        marginTop: 4,
                        opacity: 0.7,
                      }}
                    >
                      ينتهي في: {new Date(subscriptionInfo.expiresAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  )}
                </View>
              )}
              {!subscriptionInfo.isActive && (
                <Pressable
                  onPress={() => navigation.navigate('Subscription')}
                  style={{
                    backgroundColor: '#0c6980',
                    borderRadius: 12,
                    padding: 12,
                    marginTop: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#ffffff',
                    }}
                  >
                    تجديد الاشتراك
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Stats Grid - تصميم محسّن للموبايل */}
          {isLoading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <ActivityIndicator size="large" color="#0c6980" />
            </View>
          ) : (
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Cairo_700Bold',
                    color: '#111827',
                  }}
                >
                  الإحصائيات
                </Text>
                <Pressable
                  onPress={() => navigation.navigate('Appointments')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#0c6980',
                      marginLeft: 4,
                    }}
                  >
                    التفاصيل
                  </Text>
                  {/* <Ionicons name="arrow-forward" size={16} color="#0c6980" /> */}
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {statsCards.map((stat) => (
                  <Pressable
                    key={stat.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 20,
                      padding: 18,
                      flex: 1,
                      minWidth: '47%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      elevation: 3,
                      borderWidth: 1,
                      borderColor: '#f3f4f6',
                      borderTopWidth: 3,
                      borderTopColor: stat.color,
                    }}
                    onPress={() => {
                      if (stat.id !== 'category') {
                        navigation.navigate('Appointments');
                      }
                    }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                        backgroundColor: stat.bgColor,
                      }}
                    >
                      <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 28,
                        fontFamily: 'Cairo_700Bold',
                        color: stat.textColor,
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#111827',
                        fontFamily: 'Cairo_600SemiBold',
                        marginBottom: 2,
                      }}
                    >
                      {stat.title}
                    </Text>
                    {stat.subtitle && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: '#6b7280',
                          fontFamily: 'Cairo_400Regular',
                        }}
                      >
                        {stat.subtitle}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Recent Appointments - تصميم محسّن */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontFamily: 'Cairo_700Bold', color: '#111827' }}>آخر الحجوزات</Text>
              <Pressable
                onPress={() => navigation.navigate('Appointments')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: 'Cairo_600SemiBold', color: '#0c6980', marginLeft: 4 }}>
                  عرض الكل
                </Text>
                {/* <Ionicons name="arrow-forward" size={16} color="#0c6980" /> */}
              </Pressable>
            </View>

            {appointmentsLoading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color="#0c6980" />
              </View>
            ) : recentAppointments.length > 0 ? (
              <View style={{ gap: 16 }}>
                {recentAppointments.map((appointment: any, index: number) => {
                  const statusColors = {
                    pending: { main: '#f59e0b', light: '#fef3c7', dark: '#92400e', bg: '#fffbf0' },
                    confirmed: { main: '#0c6980', light: '#e6f2f4', dark: '#065f46', bg: '#f0f9ff' },
                    completed: { main: '#22c55e', light: '#d1fae5', dark: '#065f46', bg: '#f0fdf4' },
                    cancelled: { main: '#ef4444', light: '#fee2e2', dark: '#991b1b', bg: '#fef2f2' },
                  };
                  const status = appointment.status || 'pending';
                  const colors = statusColors[status as keyof typeof statusColors] || statusColors.pending;

                  return (
                    <Pressable
                      key={appointment.id || index}
                      style={({ pressed }) => ({
                        backgroundColor: '#ffffff',
                        borderRadius: 24,
                        padding: 0,
                        marginBottom: 0,
                        shadowColor: colors.main,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: pressed ? 0.15 : 0.1,
                        shadowRadius: 12,
                        elevation: pressed ? 6 : 4,
                        borderWidth: 1,
                        borderColor: '#f1f5f9',
                        overflow: 'hidden',
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                      onPress={() => navigation.navigate('Appointments')}
                    >
                      {/* Status Indicator Bar */}
                      <View
                        style={{
                          height: 4,
                          backgroundColor: colors.main,
                          width: '100%',
                        }}
                      />

                      <View style={{ padding: 20 }}>
                        {/* Header Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                          {/* Avatar Circle */}
                          <View
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 28,
                              backgroundColor: colors.light,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: 12,
                              borderWidth: 2,
                              borderColor: colors.main + '20',
                            }}
                          >
                            <Ionicons
                              name={status === 'pending' ? 'hourglass-outline' :
                                    status === 'confirmed' ? 'checkmark-circle' :
                                    status === 'completed' ? 'checkmark-done-circle' : 'close-circle'}
                              size={28}
                              color={colors.main}
                            />
                          </View>

                          {/* Patient Info */}
                          <View style={{ flex: 1, marginLeft: 4 }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 18,
                                fontFamily: 'Cairo_700Bold',
                                color: '#111827',
                                marginBottom: 6,
                              }}
                            >
                              {appointment.patient_name || 'مريض'}
                            </Text>
                            {/* {appointment.daily_appointment_number && (
                              <View
                                style={{
                                  alignSelf: 'flex-start',
                                  backgroundColor: colors.light,
                                  paddingHorizontal: 10,
                                  paddingVertical: 4,
                                  borderRadius: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontFamily: 'Cairo_600SemiBold',
                                    color: colors.dark,
                                  }}
                                >
                                  موعد #{appointment.daily_appointment_number}
                                </Text>
                              </View>
                            )} */}
                          </View>

                          {/* Status Badge */}
                          <View
                            style={{
                              borderRadius: 16,
                              paddingHorizontal: 14,
                              paddingVertical: 8,
                              backgroundColor: colors.light,
                              borderWidth: 1.5,
                              borderColor: colors.main + '30',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: 'Cairo_700Bold',
                                color: colors.dark,
                                letterSpacing: 0.3,
                              }}
                            >
                              {getStatusText(status)}
                            </Text>
                          </View>
                        </View>

                        {/* Divider */}
                        <View
                          style={{
                            height: 1,
                            backgroundColor: '#f1f5f9',
                            marginBottom: 16,
                          }}
                        />

                        {/* Details Section */}
                        <View style={{ gap: 12 }}>
                          {/* Date */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: colors.bg,
                              borderRadius: 16,
                              padding: 16,
                              width: '100%',
                            }}
                          >
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                backgroundColor: colors.light,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 12,
                              }}
                            >
                              <Ionicons name="calendar" size={20} color={colors.main} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontFamily: 'Cairo_400Regular',
                                  color: '#6b7280',
                                  marginBottom: 4,
                                }}
                              >
                                التاريخ
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: 14,
                                  fontFamily: 'Cairo_600SemiBold',
                                  color: '#111827',
                                }}
                              >
                                {appointment.date ? new Date(appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  calendar: 'gregory'
                                }) : '-'}
                              </Text>
                            </View>
                          </View>

                          {/* Time */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: colors.bg,
                              borderRadius: 16,
                              padding: 16,
                              width: '100%',
                            }}
                          >
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                backgroundColor: colors.light,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 12,
                              }}
                            >
                              <Ionicons name="time" size={20} color={colors.main} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontFamily: 'Cairo_400Regular',
                                  color: '#6b7280',
                                  marginBottom: 4,
                                }}
                              >
                                الوقت
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: 'Cairo_600SemiBold',
                                  color: '#111827',
                                }}
                              >
                                {formatTo12Hour(appointment.time || appointment.appointment_time)}
                              </Text>
                            </View>
                          </View>

                          {/* Phone Number */}
                          {(appointment.patient_phone || appointment.phone || appointment.phone_number) && (
                            <Pressable
                              onPress={() => {
                                const phone = formatPhoneNumber(
                                  appointment.patient_phone ||
                                  appointment.phone ||
                                  appointment.phone_number
                                );
                                if (phone) {
                                  // إزالة أي رموز خاصة من الرقم (مثل +)
                                  const cleanPhone = phone.replace(/[^\d]/g, '');
                                  // إذا لم يبدأ الرقم برمز الدولة، نضيف 963 (سوريا)
                                  const phoneWithCountry = cleanPhone.startsWith('963')
                                    ? cleanPhone
                                    : `${cleanPhone}`;
                                  // فتح واتساب
                                  const whatsappUrl = `https://wa.me/${phoneWithCountry}`;
                                  Linking.openURL(whatsappUrl).catch((err) => {
                                    console.error('❌ خطأ في فتح واتساب:', err);
                                    Alert.alert('خطأ', 'تعذر فتح واتساب. يرجى التأكد من تثبيت التطبيق.');
                                  });
                                }
                              }}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.bg,
                                borderRadius: 16,
                                padding: 16,
                                width: '100%',
                              }}
                            >
                              <View
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 12,
                                  backgroundColor: '#25D366',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginLeft: 12,
                                }}
                              >
                                <Ionicons name="logo-whatsapp" size={22} color="#ffffff" />
                              </View>
                              <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontFamily: 'Cairo_400Regular',
                                    color: '#6b7280',
                                    marginBottom: 4,
                                  }}
                                >
                                  رقم الهاتف
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: 'Cairo_600SemiBold',
                                    color: '#111827',
                                  }}
                                  numberOfLines={1}
                                >
                                  {formatPhoneNumber(
                                    appointment.patient_phone ||
                                    appointment.phone ||
                                    appointment.phone_number
                                  )}
                                </Text>
                              </View>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 24,
                  padding: 48,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#f1f5f9',
                  borderStyle: 'dashed',
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#f8fafc',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="calendar-outline" size={40} color="#cbd5e1" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Cairo_600SemiBold',
                    color: '#475569',
                    marginBottom: 8,
                  }}
                >
                  لا توجد حجوزات حالياً
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Cairo_400Regular',
                    color: '#94a3b8',
                    textAlign: 'center',
                  }}
                >
                  سيتم عرض الحجوزات هنا عند توفرها
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions - تصميم محسّن */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Cairo_700Bold', color: '#111827', marginBottom: 16 }}>
              إجراءات سريعة
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[
                {
                  id: 'appointments',
                  title: 'المواعيد',
                  icon: 'calendar-outline',
                  color: '#0c6980',
                  bgColor: '#e6f2f4',
                  route: 'Appointments' as const,
                  badge: pendingAppointments > 0 ? pendingAppointments : undefined,
                },
                {
                  id: 'schedule',
                  title: 'الجدول الزمني',
                  icon: 'time-outline',
                  color: '#6366f1',
                  bgColor: '#eef2ff',
                  route: 'Schedule' as const,
                },
                {
                  id: 'subscription',
                  title: 'الاشتراك',
                  icon: 'card-outline',
                  color: '#22c55e',
                  bgColor: '#d1fae5',
                  route: 'Subscription' as const,
                },
                {
                  id: 'profile',
                  title: 'الملف الشخصي',
                  icon: 'person-outline',
                  color: '#0c6980',
                  bgColor: '#e6f2f4',
                  route: 'Profile' as const,
                },
                {
                  id: 'notifications',
                  title: 'الإشعارات',
                  icon: 'notifications-outline',
                  color: '#f59e0b',
                  bgColor: '#fef3c7',
                  route: 'Notifications' as const,
                },
              ].map((action) => (
                <Pressable
                  key={action.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    padding: 18,
                    width: '47%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#f3f4f6',
                    borderTopWidth: 3,
                    borderTopColor: action.color,
                    position: 'relative',
                  }}
                  onPress={() => {
                    try {
                      navigation.navigate(action.route);
                    } catch (e) {
                      Alert.alert('تنبيه', `تعذر فتح ${action.title}`);
                    }
                  }}
                >
                  {action.badge && action.badge > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#ef4444',
                        borderRadius: 12,
                        minWidth: 24,
                        height: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'Cairo_700Bold',
                          color: '#ffffff',
                        }}
                      >
                        {action.badge > 9 ? '9+' : action.badge}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      backgroundColor: action.bgColor,
                    }}
                  >
                    <Ionicons name={action.icon as any} size={28} color={action.color} />
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 15,
                      fontFamily: 'Cairo_600SemiBold',
                      color: '#111827',
                      lineHeight: 22,
                    }}
                  >
                    {action.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Doctor Info Card - تصميم محسّن */}
          {doctor && (
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#f3f4f6',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#e6f2f4',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="information-circle" size={22} color="#0c6980" />
                </View>
                <Text style={{ fontSize: 18, fontFamily: 'Cairo_700Bold', color: '#111827' }}>
                  معلومات الطبيب
                </Text>
              </View>
              <View style={{ gap: 12 }}>
                {doctor.email && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="mail-outline" size={18} color="#6b7280" style={{ marginRight: 10, width: 20 }} />
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 14, color: '#6b7280', fontFamily: 'Cairo_400Regular', flex: 1 }}
                    >
                      {doctor.email}
                    </Text>
                  </View>
                )}
                {doctor.phone && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="call-outline" size={18} color="#6b7280" style={{ marginRight: 10, width: 20 }} />
                    <Text
                      style={{ fontSize: 14, color: '#6b7280', fontFamily: 'Cairo_400Regular', flex: 1 }}
                    >
                      {doctor.phone}
                    </Text>
                  </View>
                )}
                {doctor.category && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="medical-outline" size={18} color="#6b7280" style={{ marginRight: 10, width: 20 }} />
                    <Text
                      style={{ fontSize: 14, color: '#6b7280', fontFamily: 'Cairo_400Regular', flex: 1 }}
                    >
                      {doctor.category}
                    </Text>
                  </View>
                )}
                {doctor.description && (
                  <View style={{ marginTop: 4, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#6b7280',
                        fontFamily: 'Cairo_400Regular',
                        lineHeight: 20,
                      }}
                    >
                      {doctor.description}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </ScreenLayout>
    </Container>
  );
};

