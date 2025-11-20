import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { 
  useGetPaymentQrCodeQuery, 
  useCreatePaymentMutation, 
  useUploadPaymentReceiptMutation, 
  useDoctorMeQuery, 
  useGetDoctorPaymentsQuery, 
  useUpdatePaymentSubscriptionTypeMutation,
  useGetSubscriptionPlansQuery,
} from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubscriptionExpiredScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  
  const { data: qrCodeData, isLoading: qrLoading } = useGetPaymentQrCodeQuery();
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data || doctorData;
  const doctorId = doctor?.id;
  const { data: paymentsData } = useGetDoctorPaymentsQuery(doctorId || '', { skip: !doctorId });
  const { data: plansData, isLoading: plansLoading } = useGetSubscriptionPlansQuery();
  const [createPayment, { isLoading: creatingPayment }] = useCreatePaymentMutation();
  const [uploadReceipt, { isLoading: uploadingReceipt }] = useUploadPaymentReceiptMutation();
  const [updateSubscriptionType] = useUpdatePaymentSubscriptionTypeMutation();

  // معالجة بيانات الخطط
  const plans = useMemo(() => {
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

  // البحث عن دفع معلق
  const pendingPayment = useMemo(() => {
    const list = paymentsData?.payments || paymentsData?.data?.payments || [];
    return list.find((p: any) => p.status === 'pending' && p.payment_type === 'subscription') || null;
  }, [paymentsData]);

  // استخدام الدفع المعلق الموجود
  React.useEffect(() => {
    if (pendingPayment?.id && !paymentId) {
      setPaymentId(pendingPayment.id);
    }
  }, [pendingPayment, paymentId]);

  const qrCodeUrl = qrCodeData?.qr_code_url || qrCodeData?.data?.qr_code_url || qrCodeData?.qr_code?.qr_code_image_url;
  const paymentCode = qrCodeData?.payment_code || qrCodeData?.data?.payment_code || qrCodeData?.qr_code?.code;

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlansModal(false);
  };

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

  const handleRenewSubscription = async () => {
    if (!selectedPlan) {
      Alert.alert('خطأ', 'يرجى اختيار خطة اشتراك');
      return;
    }

    if (!selectedImage) {
      Alert.alert('خطأ', 'يرجى رفع وصل الدفع');
      return;
    }

    let currentPaymentId = paymentId;

    try {
      // أنشئ دفع إذا لم يوجد دفع معلق
      if (!currentPaymentId && doctorId && selectedPlan) {
        const createRes = await createPayment({
          doctor_id: doctorId,
          amount: selectedPlan.price || selectedPlan.amount || 0,
          payment_type: 'subscription',
          payment_method: 'bank_transfer',
          subscription_plan_id: selectedPlan.id,
          subscription_type: selectedPlan.type || 'monthly',
          notes: `تجديد اشتراك ${selectedPlan.type === 'monthly' ? 'شهري' : 'سنوي'} - $${selectedPlan.price || selectedPlan.amount || 0}`,
          is_renewal: true,
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
              subscription_type: selectedPlan?.type || 'monthly',
              subscription_plan_id: selectedPlan?.id,
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

      // رفع الوصل
      setUploading(true);
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
      console.error('❌ خطأ في تجديد الاشتراك:', error);
      const errorMessage = 
        error?.data?.message || 
        error?.error || 
        'حدث خطأ في تجديد الاشتراك. يرجى المحاولة مرة أخرى.';
      Alert.alert('خطأ', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <ScreenLayout 
        title="انتهى الاشتراك"
        showHeader={true}
        showBackButton={false}
        scrollable={false}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        >
          {/* العنوان */}
          <View className="items-center mb-8 mt-4">
            <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
              انتهى الاشتراك
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
              انتهت صلاحية اشتراكك
            </Text>
            <Text className="text-gray-600 text-center mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
              يرجى تجديد الاشتراك للمتابعة
            </Text>
          </View>

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

          {/* اختيار الخطة */}
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <Text className="text-gray-800 font-semibold mb-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
              اختر خطة التجديد
            </Text>
            
            <Pressable
              onPress={() => setShowPlansModal(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl py-4 items-center justify-center bg-gray-50"
            >
              {selectedPlan ? (
                <View className="items-center">
                  <Text className="text-gray-900 font-semibold text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    {selectedPlan.name || selectedPlan.type || 'خطة'}
                  </Text>
                  <Text className="text-gray-600 mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
                    {selectedPlan.price || selectedPlan.amount || 0} $
                  </Text>
                </View>
              ) : (
                <>
                  <Ionicons name="card-outline" size={32} color="#0c6980" />
                  <Text className="text-gray-700 font-semibold mt-2" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                    اختر خطة
                  </Text>
                </>
              )}
            </Pressable>
          </View>

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
          </View>

          {/* زر التجديد */}
          <Pressable
            onPress={handleRenewSubscription}
            disabled={!selectedPlan || !selectedImage || uploading || uploadingReceipt}
            className={`w-full py-4 rounded-2xl items-center justify-center ${
              selectedPlan && selectedImage && !uploading && !uploadingReceipt
                ? 'bg-primary-600' 
                : 'bg-gray-400'
            }`}
            style={selectedPlan && selectedImage && !uploading && !uploadingReceipt ? {
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
                تجديد الاشتراك
              </Text>
            )}
          </Pressable>
        </ScrollView>

        {/* Modal اختيار الخطة */}
        <Modal
          visible={showPlansModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPlansModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
            <View style={{ 
              backgroundColor: '#ffffff', 
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24,
              maxHeight: '80%',
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
                  اختر خطة التجديد
                </Text>
                <Pressable onPress={() => setShowPlansModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </Pressable>
              </View>
              
              {plansLoading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0c6980" />
                </View>
              ) : (
                <FlatList
                  data={plans}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => {
                    const isSelected = selectedPlan?.id === item.id;
                    const price = item.price || item.amount || 0;
                    const formattedPrice = typeof price === 'number' ? price.toLocaleString('ar-SY') : price;
                    
                    return (
                      <Pressable
                        onPress={() => handleSelectPlan(item)}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 16,
                          backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                          borderBottomWidth: 1,
                          borderBottomColor: '#f3f4f6',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ 
                              fontSize: 16, 
                              fontFamily: isSelected ? 'Cairo_600SemiBold' : 'Cairo_400Regular',
                              color: isSelected ? '#0c6980' : '#111827',
                            }}>
                              {item.name || item.type || 'خطة'}
                            </Text>
                            <Text style={{ 
                              fontSize: 14, 
                              fontFamily: 'Cairo_400Regular',
                              color: '#6b7280',
                              marginTop: 4,
                            }}>
                              {formattedPrice} $ / {item.type === 'monthly' ? 'شهري' : 'سنوي'}
                            </Text>
                          </View>
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
                        لا توجد خطط متاحة
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
        </Modal>
      </ScreenLayout>
    </Container>
  );
};

