import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGetPendingPaymentsQuery, useDoctorMeQuery, useGetDoctorPaymentsQuery } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { login } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WaitingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: doctorData, refetch: refetchDoctor } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data || doctorData;
  const doctorId = doctor?.id;
  
  const { data: pendingPayments, isLoading, refetch } = useGetPendingPaymentsQuery(undefined, {
    pollingInterval: 10000, // فحص كل 10 ثواني
  });

  // جلب جميع الدفعات للتحقق من الدفعات المدفوعة
  const { data: paymentsData, refetch: refetchPayments } = useGetDoctorPaymentsQuery(doctorId || '', { 
    skip: !doctorId,
    pollingInterval: 10000, // فحص كل 10 ثواني
  });

  // التحقق من حالة الدفع والاشتراك
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!doctorId) return;

      // البحث عن دفع تم قبوله من جميع الدفعات
      const allPayments = paymentsData?.payments || paymentsData?.data?.payments || [];
      const approvedPayment = allPayments.find((payment: any) => 
        (payment.status === 'paid' || payment.status === 'approved' || payment.status === 'completed') &&
        payment.payment_type === 'subscription'
      );

      if (approvedPayment) {
        // إعادة جلب بيانات الطبيب للتأكد من تحديث الاشتراك
        await refetchDoctor();
        await refetchPayments();
        
        // انتظار قليل للتأكد من تحديث البيانات
        setTimeout(async () => {
          // حفظ حالة تسجيل الدخول
          const token = await AsyncStorage.getItem('doctorToken');
          if (token && doctorId) {
            dispatch(login({ token, doctorId: String(doctorId) }));
          }
          
          // الانتقال إلى الداشبورد
          (navigation as any).replace('DoctorDashboard');
        }, 1000);
      }
    };

    checkPaymentStatus();
  }, [paymentsData, doctorId, dispatch, navigation, refetchDoctor, refetchPayments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <Container>
      <ScreenLayout 
        title="في انتظار الموافقة"
        showHeader={true}
        showBackButton={false}
        scrollable={false}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0c6980']}
              tintColor="#0c6980"
            />
          }
        >
          {/* العنوان */}
          <View className="items-center mb-8 mt-4">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="time-outline" size={48} color="#0c6980" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
              في انتظار الموافقة
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
              تم رفع وصل الدفع بنجاح
            </Text>
            <Text className="text-gray-600 text-center mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
              سيتم مراجعة طلبك من قبل الإدارة قريباً
            </Text>
          </View>

          {/* حالة التحميل */}
          {isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0c6980" />
              <Text className="text-gray-600 mt-4" style={{ fontFamily: 'Cairo_400Regular' }}>
                جاري التحقق من حالة الطلب...
              </Text>
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="checkmark-circle" size={28} color="#0c6980" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    تم استلام طلبك
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                    وصل الدفع قيد المراجعة
                  </Text>
                </View>
              </View>

              <View className="bg-primary-50 rounded-xl p-4 mt-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="information-circle" size={20} color="#0c6980" />
                  <Text className="text-primary-700 font-semibold mr-2" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    ملاحظة مهمة
                  </Text>
                </View>
                <Text className="text-primary-700 text-sm leading-6" style={{ fontFamily: 'Cairo_400Regular' }}>
                  سيتم إشعارك تلقائياً عند موافقة الإدارة على طلبك. يمكنك سحب الشاشة للأسفل للتحديث.
                </Text>
              </View>

              <View className="mt-6 items-center">
                <ActivityIndicator size="large" color="#0c6980" />
                <Text className="text-gray-600 mt-4 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                  جاري التحقق من حالة الطلب...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </ScreenLayout>
    </Container>
  );
};

