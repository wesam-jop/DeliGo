import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGetSubscriptionPlansQuery, useCreatePaymentMutation, useGetDoctorPaymentsQuery, useUpdatePaymentSubscriptionTypeMutation, useDoctorMeQuery } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SelectPlanScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  const { data: plansData, isLoading, error } = useGetSubscriptionPlansQuery();
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data || doctorData;
  const doctorId = doctor?.id;
  const { data: paymentsData } = useGetDoctorPaymentsQuery(doctorId || '', { skip: !doctorId });
  const [createPayment, { isLoading: creatingPayment }] = useCreatePaymentMutation();
  const [updateSubscriptionType] = useUpdatePaymentSubscriptionTypeMutation();

  // معالجة بيانات الخطط
  const plans = React.useMemo(() => {
    if (!plansData) return [];
    
    if (Array.isArray(plansData)) {
      return plansData;
    }
    
    if (plansData.data && Array.isArray(plansData.data)) {
      return plansData.data;
    }
    
    if (plansData.plans && Array.isArray(plansData.plans)) {
      return plansData.plans;
    }
    
    return [];
  }, [plansData]);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleContinue = async () => {
    if (!selectedPlan || !doctor) {
      Alert.alert('خطأ', 'يرجى اختيار خطة اشتراك');
      return;
    }

    try {
      // محاولة إنشاء دفع جديد
      const res = await createPayment({
        doctor_id: doctor.id,
        amount: selectedPlan.price || selectedPlan.amount || 0,
        payment_type: 'subscription',
        payment_method: 'bank_transfer',
        subscription_plan_id: selectedPlan.id,
        subscription_type: selectedPlan.type || 'monthly',
        notes: `دفعة اشتراك ${selectedPlan.type === 'monthly' ? 'شهري' : 'سنوي'} - $${selectedPlan.price || selectedPlan.amount || 0}`,
      }).unwrap();

      if (res?.payment?.id) {
        // نجح إنشاء الدفع، انتقل إلى صفحة الدفع
        (navigation as any).navigate('Payment', { plan: selectedPlan });
        return;
      }
    } catch (error: any) {
      // إذا فشل إنشاء الدفع (قد يكون يوجد دفع معلق مسبقاً)
      console.log('⚠️ فشل إنشاء الدفع، البحث عن دفع معلق موجود:', error);
    }

    // Fallback: إذا فشل إنشاء الدفع، ابحث عن دفع معلق موجود وحدثه
    const list = paymentsData?.payments || paymentsData?.data?.payments || [];
    const pending = list.find((p: any) => p.status === 'pending');
    
    if (pending && pending.id) {
      try {
        const upd = await updateSubscriptionType({
          paymentId: pending.id,
          body: {
            subscription_type: selectedPlan.type || 'monthly',
            subscription_plan_id: selectedPlan.id,
          },
        }).unwrap();

        if (upd?.payment) {
          // نجح تحديث الدفع المعلق، انتقل إلى صفحة الدفع
          (navigation as any).navigate('Payment', { plan: selectedPlan });
          return;
        }
      } catch (updateError) {
        console.error('❌ خطأ في تحديث نوع الاشتراك:', updateError);
      }
    }

    // إذا لم ينجح أي شيء، انتقل إلى صفحة الدفع على أي حال
    (navigation as any).navigate('Payment', { plan: selectedPlan });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <ScreenLayout 
        title="اختر خطة الاشتراك"
        showHeader={true}
        showBackButton={true}
        onBackPress={handleGoBack}
        scrollable={false}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        >
          {/* العنوان */}
          <View className="items-center mb-8 mt-4">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="card" size={40} color="#0c6980" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
              اختر خطة الاشتراك
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
              اختر الخطة المناسبة لك للبدء
            </Text>
          </View>

          {isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0c6980" />
              <Text className="text-gray-600 mt-4" style={{ fontFamily: 'Cairo_400Regular' }}>
                جاري تحميل الخطط...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
              <Text className="text-red-600 mt-4 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                حدث خطأ في تحميل الخطط
              </Text>
            </View>
          ) : plans.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="information-circle" size={48} color="#6b7280" />
              <Text className="text-gray-600 mt-4 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                لا توجد خطط متاحة حالياً
              </Text>
            </View>
          ) : (
            <View className="mb-6">
              {plans.map((plan: any, index: number) => {
                const isSelected = selectedPlan?.id === plan.id;
                const price = plan.price || plan.amount || 0;
                const formattedPrice = typeof price === 'number' ? price.toLocaleString('ar-SY') : price;
                
                return (
                  <Pressable
                    key={plan.id}
                    onPress={() => handleSelectPlan(plan)}
                    className={`rounded-2xl p-6 border-2 ${
                      isSelected 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      marginBottom: index < plans.length - 1 ? 16 : 0,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.15 : 0.08,
                      shadowRadius: 8,
                      elevation: isSelected ? 5 : 3,
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-1">
                        <Text 
                          className={`text-xl font-bold mb-2 ${
                            isSelected ? 'text-primary-600' : 'text-gray-900'
                          }`}
                          style={{ fontFamily: 'Cairo_700Bold' }}
                        >
                          {plan.name || plan.type || 'خطة'}
                        </Text>
                        {plan.description && (
                          <Text 
                            className="text-gray-600 text-sm"
                            style={{ fontFamily: 'Cairo_400Regular' }}
                          >
                            {plan.description}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <View className="w-8 h-8 bg-primary-600 rounded-full items-center justify-center">
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-row items-baseline mb-4">
                      <Text 
                        className="text-3xl font-bold text-gray-900"
                        style={{ fontFamily: 'Cairo_700Bold' }}
                      >
                        {formattedPrice}
                      </Text>
                      <Text 
                        className="text-gray-600 mr-2"
                        style={{ fontFamily: 'Cairo_400Regular' }}
                      >
                        $
                      </Text>
                      {plan.type && (
                        <Text 
                          className="text-gray-500 text-sm mr-2"
                          style={{ fontFamily: 'Cairo_400Regular' }}
                        >
                          / {plan.type === 'monthly' ? 'شهري' : 'سنوي'}
                        </Text>
                      )}
                    </View>

                    {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
                      <View className="mt-4">
                        {plan.features.map((feature: string, index: number) => (
                          <View key={index} className="flex-row items-center mb-2">
                            <Ionicons name="checkmark-circle" size={20} color="#0c6980" />
                            <Text 
                              className="text-gray-700 mr-2"
                              style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* زر المتابعة */}
          {plans.length > 0 && (
            <Pressable
              onPress={handleContinue}
              disabled={!selectedPlan}
              className={`w-full py-4 rounded-2xl items-center justify-center ${
                selectedPlan ? 'bg-primary-600' : 'bg-gray-400'
              }`}
              style={selectedPlan ? {
                backgroundColor: '#0a5669',
                shadowColor: '#0c6980',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              } : {}}
            >
              <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo_700Bold' }}>
                المتابعة للدفع
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </ScreenLayout>
    </Container>
  );
};

