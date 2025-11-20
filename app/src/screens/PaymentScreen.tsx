import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGetPaymentQrCodeQuery, useCreatePaymentMutation, useUploadPaymentReceiptMutation, useDoctorMeQuery, useGetDoctorPaymentsQuery, useUpdatePaymentSubscriptionTypeMutation } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params: {
    plan: any;
  };
};

export const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { plan } = route.params || {};
  
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { data: qrCodeData, isLoading: qrLoading } = useGetPaymentQrCodeQuery();
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data || doctorData;
  const doctorId = doctor?.id;
  const { data: paymentsData } = useGetDoctorPaymentsQuery(doctorId || '', { skip: !doctorId });
  const [createPayment, { isLoading: creatingPayment }] = useCreatePaymentMutation();
  const [uploadReceipt, { isLoading: uploadingReceipt }] = useUploadPaymentReceiptMutation();
  const [updateSubscriptionType] = useUpdatePaymentSubscriptionTypeMutation();

  // البحث عن دفع معلق من قائمة الدفعات (مثل الموقع)
  const pendingPayment = useMemo(() => {
    const list = paymentsData?.payments || paymentsData?.data?.payments || [];
    return list.find((p: any) => p.status === 'pending') || null;
  }, [paymentsData]);

  // استخدام الدفع المعلق الموجود
  useEffect(() => {
    if (pendingPayment?.id && !paymentId) {
      setPaymentId(pendingPayment.id);
      if (__DEV__) {
        console.log('✅ تم العثور على دفع معلق موجود:', pendingPayment.id);
      }
    }
  }, [pendingPayment, paymentId]);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('إذن مطلوب', 'نحتاج إلى إذن للوصول إلى الصور');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('خطأ في اختيار الصورة:', error);
      Alert.alert('خطأ', 'حدث خطأ في اختيار الصورة');
    }
  };

  const handleUploadReceipt = async () => {
    if (!selectedImage) {
      Alert.alert('خطأ', 'يرجى اختيار ملف الوصل أولاً');
      return;
    }

    let currentPaymentId = paymentId;

    try {
      // أنشئ دفع إذا لم يوجد دفع معلق
      if (!currentPaymentId && doctorId && plan) {
        const createRes = await createPayment({
          doctor_id: doctorId,
          amount: plan.price || plan.amount || 0,
          payment_type: 'subscription',
          payment_method: 'bank_transfer',
          subscription_plan_id: plan.id,
          subscription_type: plan.type || 'monthly',
          notes: `دفعة اشتراك ${plan.type === 'monthly' ? 'شهري' : 'سنوي'} - $${plan.price || plan.amount || 0}`,
        }).unwrap();

        if (createRes?.payment?.id) {
          currentPaymentId = createRes.payment.id;
          setPaymentId(currentPaymentId);
        }
      }

      // تحديث نوع الاشتراك إذا توفر دفع بدون خطة
      if (!currentPaymentId && paymentsData?.payments?.length) {
        const list = paymentsData.payments || paymentsData.data?.payments || [];
        const pending = list.find((p: any) => p.status === 'pending');
        if (pending && pending.id) {
          const upd = await updateSubscriptionType({
            paymentId: pending.id,
            body: {
              subscription_type: plan?.type || 'monthly',
              subscription_plan_id: plan?.id,
            },
          }).unwrap();

          if (upd?.payment) {
            currentPaymentId = pending.id;
            setPaymentId(currentPaymentId);
          }
        }
      }

      if (!currentPaymentId) {
        Alert.alert('خطأ', 'لم يتم إنشاء طلب الدفع. يرجى المحاولة مرة أخرى.');
        return;
      }
    } catch (error: any) {
      console.error('❌ خطأ في إعداد الدفع:', error);
      // لا نعرض Alert إذا كان الخطأ بسبب وجود دفع معلق
      if (!error?.data?.message?.includes('دفع معلق')) {
        Alert.alert('خطأ', error?.data?.message || 'حدث خطأ في إعداد الدفع. يرجى المحاولة مرة أخرى.');
      }
      return;
    }

    setUploading(true);
    try {
      await uploadReceipt({
        paymentId: currentPaymentId,
        receipt: {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || `receipt_${Date.now()}.jpg`,
        },
      }).unwrap();

      Alert.alert(
        'نجح الرفع',
        'تم رفع ملف الوصل بنجاح. سيتم مراجعة طلبك من قبل الإدارة.',
        [
          {
            text: 'موافق',
            onPress: () => {
              (navigation as any).replace('Waiting');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ خطأ في رفع الوصل:', error);
      const errorMessage = 
        error?.data?.message || 
        error?.error || 
        'حدث خطأ في رفع الملف. يرجى المحاولة مرة أخرى.';
      Alert.alert('خطأ في الرفع', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const qrCodeUrl = qrCodeData?.qr_code_url || qrCodeData?.data?.qr_code_url || qrCodeData?.image_url;
  const paymentCode = qrCodeData?.payment_code || qrCodeData?.data?.payment_code || qrCodeData?.code;

  return (
    <Container>
      <ScreenLayout 
        title="الدفع"
        showHeader={true}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
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
              إتمام الدفع
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
              ادفع المبلغ المطلوب وارفع وصل الدفع
            </Text>
          </View>

          {/* معلومات الخطة */}
          {plan && (
            <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
              <Text className="text-gray-800 font-semibold mb-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                تفاصيل الخطة
              </Text>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600" style={{ fontFamily: 'Cairo_400Regular' }}>
                  الخطة:
                </Text>
                <Text className="text-gray-900 font-semibold" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                  {plan.name || plan.type || 'خطة'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'Cairo_400Regular' }}>
                  المبلغ:
                </Text>
                <Text className="text-gray-900 font-bold text-lg" style={{ fontFamily: 'Cairo_700Bold' }}>
                  {plan.price || plan.amount || 0} $
                </Text>
              </View>
            </View>
          )}

          {/* الباركود */}
          {qrCodeUrl && (
            <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200 items-center">
              <Text className="text-gray-800 font-semibold mb-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                باركود الدفع
              </Text>
              {qrLoading ? (
                <ActivityIndicator size="large" color="#0c6980" />
              ) : (
                <Image
                  source={{ uri: qrCodeUrl }}
                  style={{ width: 250, height: 250, resizeMode: 'contain' }}
                />
              )}
            </View>
          )}

          {/* كود الدفع */}
          {paymentCode && (
            <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
              <Text className="text-gray-800 font-semibold mb-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                كود الدفع
              </Text>
              <View className="bg-primary-50 rounded-xl p-4 items-center">
                <Text 
                  className="text-2xl font-bold text-primary-600"
                  style={{ fontFamily: 'Cairo_700Bold' }}
                >
                  {paymentCode}
                </Text>
              </View>
            </View>
          )}

          {/* رفع ملف الوصل */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <Text className="text-gray-800 font-semibold mb-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
              رفع وصل الدفع
            </Text>
            
            {selectedImage ? (
              <View className="mb-4">
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }}
                  resizeMode="cover"
                />
                <Pressable
                  onPress={handlePickImage}
                  className="bg-gray-100 rounded-xl py-3 items-center"
                >
                  <Text className="text-gray-700 font-semibold" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    تغيير الصورة
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handlePickImage}
                className="border-2 border-dashed border-gray-300 rounded-xl py-8 items-center justify-center bg-gray-50"
              >
                <Ionicons name="cloud-upload-outline" size={48} color="#0c6980" />
                <Text className="text-gray-700 font-semibold mt-4" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                  اختر ملف الوصل
                </Text>
                <Text className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
                  الصيغ المدعومة: JPG, PNG
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleUploadReceipt}
              disabled={!selectedImage || uploading || uploadingReceipt || !paymentId}
              className={`w-full py-4 rounded-2xl items-center justify-center mt-4 ${
                selectedImage && paymentId && !uploading && !uploadingReceipt
                  ? 'bg-primary-600' 
                  : 'bg-gray-400'
              }`}
              style={selectedImage && paymentId && !uploading && !uploadingReceipt ? {
                backgroundColor: '#0a5669',
                shadowColor: '#0c6980',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              } : {}}
            >
              {uploading || uploadingReceipt ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo_700Bold' }}>
                  رفع الوصل والمتابعة
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </ScreenLayout>
    </Container>
  );
};

