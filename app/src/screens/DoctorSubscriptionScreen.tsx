import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl, Alert, Modal, TextInput, Image, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDoctorMeQuery, useGetDoctorPaymentsQuery, useCreatePaymentMutation, useGetSubscriptionPlansQuery, useGetPaymentQrCodeQuery, useUploadPaymentReceiptMutation, useUpdatePaymentSubscriptionTypeMutation } from '../services/api';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';

export const DoctorSubscriptionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Modals & renewal form
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<{ uri: string; name?: string; mimeType?: string; isImage?: boolean } | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Fetch doctor data
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data;
  const doctorId = doctor?.id;

  // Fetch payments
  const { data: paymentsData, isLoading, refetch } = useGetDoctorPaymentsQuery(doctorId || 0, {
    skip: !doctorId,
  });
  // Fetch plans
  const { data: plansData, isLoading: loadingPlans, refetch: refetchPlans } = useGetSubscriptionPlansQuery();
  // Fetch payment QR and code
  const { data: paymentQrData, isLoading: loadingQr } = useGetPaymentQrCodeQuery();
  
  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetch();
        refetchPlans();
      }
    }, [doctorId, refetch, refetchPlans])
  );

  const [createPayment, { isLoading: isSubmitting }] = useCreatePaymentMutation();
  const [uploadReceipt, { isLoading: isUploadingReceipt }] = useUploadPaymentReceiptMutation();
  const [updateSubscriptionType] = useUpdatePaymentSubscriptionTypeMutation();

  const payments = useMemo(() => {
    if (Array.isArray(paymentsData)) return paymentsData as any[];
    if (Array.isArray((paymentsData as any)?.data)) return (paymentsData as any).data as any[];
    if (Array.isArray((paymentsData as any)?.payments)) return (paymentsData as any).payments as any[];
    return [] as any[];
  }, [paymentsData]);

  const plans = useMemo(() => {
    const raw = (plansData?.plans || plansData?.data || plansData) as any;
    if (Array.isArray(raw)) {
      return raw.map((p: any) => ({
        id: p.id || p.code || p.slug || p.name,
        name: p.name || p.title || 'خطة',
        price: p.price ?? p.amount ?? 0,
        currency: p.currency || 'USD',
        type: p.type || (p.duration_days >= 365 ? 'yearly' : 'monthly'), // إضافة type
        days: p.days || p.duration_days || (p.type === 'yearly' ? 365 : 30),
        duration_days: p.duration_days || p.days || (p.type === 'yearly' ? 365 : 30),
        qr_url: p.qr_url || p.payment_qr_url,
        payment_code: p.payment_code || p.code,
      }));
    }
    return [] as any[];
  }, [plansData]);

  // Payment QR/code resolution
  const paymentInfo = useMemo(() => {
    const planQr = selectedPlan?.qr_url;
    const planCode = selectedPlan?.payment_code;
    const endpointQr = paymentQrData?.qr_code?.qr_code_image_url || paymentQrData?.qr_code_image_url;
    const endpointCode = paymentQrData?.qr_code?.code || paymentQrData?.code;
    return {
      qrUrl: planQr || endpointQr || null,
      code: planCode || endpointCode || null,
    };
  }, [selectedPlan, paymentQrData]);

  const currentSubscription = useMemo(() => {
    const direct = (paymentsData?.subscription || paymentsData?.current_subscription || {}) as any;
    if (direct && (direct.end_date || direct.expires_at)) return direct;
    const latestPaid = payments
      .filter((p: any) => (p.status || '').toLowerCase() === 'paid')
      .sort((a: any, b: any) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())[0];
    if (latestPaid) {
      const startRaw = latestPaid.start_date || latestPaid.date || latestPaid.created_at;
      let endComputed: string | undefined = latestPaid.end_date || latestPaid.expires_at;
      if (!endComputed && startRaw) {
        try {
          const start = new Date(startRaw);
          const end = new Date(start);
          // استخدام duration_days من الدفع إذا كان متوفراً
          const durationDays = latestPaid.duration_days || latestPaid.subscription_plan?.duration_days || 
                               (latestPaid.subscription_type === 'yearly' ? 365 : 30);
          end.setDate(end.getDate() + durationDays);
          endComputed = end.toISOString();
        } catch {}
      }
      return {
        plan: latestPaid.plan || latestPaid.subscription_type || latestPaid.type || 'شهري',
        subscription_type: latestPaid.subscription_type || latestPaid.type,
        status: (latestPaid.status || 'active').toLowerCase(),
        start_date: startRaw,
        end_date: endComputed || latestPaid.subscription_expires_at,
        expires_at: latestPaid.subscription_expires_at || endComputed,
        amount: latestPaid.amount,
        currency: latestPaid.currency || 'USD',
        duration_days: latestPaid.duration_days || latestPaid.subscription_plan?.duration_days,
      } as any;
    }
    return null;
  }, [paymentsData, payments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatMoney = (amount?: number | string, currency: string = 'USD') => {
    if (amount == null) return '-';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (Number.isNaN(num)) return String(amount);
    return `${num.toFixed(2)} ${currency === 'USD' ? 'دولار' : currency}`;
  };

  const formatDateLong = (value?: string) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      return d.toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return value;
    }
  };

  const calcRemaining = (end?: string) => {
    if (!end) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    const endMs = new Date(end).getTime();
    const diff = Math.max(0, endMs - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, totalMs: diff };
  };

  const remaining = calcRemaining(currentSubscription?.end_date || currentSubscription?.expires_at);
  const statusActive = remaining.totalMs > 0;
  const planName = currentSubscription?.plan || currentSubscription?.type || 'شهري';

  const handleOpenRenew = () => {
    setSelectedPlan(null);
    setReceiptFile(null);
    setShowPlansModal(true);
  };

  const pickReceipt = async () => {
    // Show options: Image or Document
    Alert.alert(
      'اختر نوع الملف',
      'هل تريد رفع صورة أم ملف PDF؟',
      [
        {
          text: 'صورة',
          onPress: async () => {
            try {
              if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('تنبيه', 'نحتاج إذن الوصول إلى الصور لرفع الإيصال');
                  return;
                }
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: false,
              });
              if (!result.canceled && result.assets && result.assets[0]) {
                const asset = result.assets[0];
                setReceiptFile({ 
                  uri: asset.uri, 
                  name: asset.fileName || 'receipt.jpg', 
                  mimeType: asset.mimeType || 'image/jpeg',
                  isImage: true,
                });
              }
            } catch (error) {
              Alert.alert('خطأ', 'تعذر اختيار الصورة');
            }
          },
        },
        {
          text: 'ملف PDF',
          onPress: async () => {
            try {
              const res = await DocumentPicker.getDocumentAsync({ 
                type: ['application/pdf'],
                copyToCacheDirectory: true,
              });
              // @ts-ignore - support multiple versions
              const canceled = (res as any).canceled === true || (res as any).type === 'cancel';
              if (canceled) return;
              // @ts-ignore
              const asset = (res as any).assets?.[0] || res;
              if (asset?.uri) {
                setReceiptFile({ 
                  uri: asset.uri, 
                  name: asset.name || 'receipt.pdf', 
                  mimeType: asset.mimeType || 'application/pdf',
                  isImage: false,
                });
              }
            } catch (error) {
              Alert.alert('خطأ', 'تعذر اختيار الملف');
            }
          },
        },
        {
          text: 'إلغاء',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleContinueToPay = () => {
    if (!selectedPlan) {
      Alert.alert('تنبيه', 'يرجى اختيار خطة');
    } else {
      setShowPlansModal(false);
      setShowPayModal(true);
    }
  };

  const handleSubmitRenewal = async () => {
    if (!selectedPlan) {
      Alert.alert('تنبيه', 'يرجى اختيار خطة');
      return;
    }
    if (!receiptFile) {
      Alert.alert('تنبيه', 'يرجى رفع إيصال الدفع (صورة أو ملف PDF)');
      return;
    }

    let currentPaymentId: number | null = null;

    try {
      // التحقق من وجود دفع معلق أولاً
      const allPayments = payments || [];
      const pendingPayment = allPayments.find((p: any) => 
        p.status === 'pending' && p.payment_type === 'subscription'
      );

      // حساب تاريخ البدء للتجديد (يجب أن يكون تاريخ انتهاء الاشتراك الحالي)
      let renewalStartDate: string | undefined = undefined;
      if (currentSubscription?.end_date || currentSubscription?.expires_at) {
        // إذا كان هناك اشتراك نشط، نبدأ من تاريخ انتهائه
        renewalStartDate = currentSubscription.end_date || currentSubscription.expires_at;
        if (__DEV__) {
          console.log('📅 تاريخ بدء التجديد (من تاريخ انتهاء الاشتراك الحالي):', renewalStartDate);
        }
      }

      if (pendingPayment?.id) {
        // استخدام الدفع المعلق الموجود وتحديث نوع الاشتراك
        currentPaymentId = pendingPayment.id;
        try {
          const subscriptionType = selectedPlan.type || (selectedPlan.duration_days >= 365 ? 'yearly' : 'monthly');
          await updateSubscriptionType({
            paymentId: currentPaymentId,
            body: {
              subscription_type: subscriptionType,
              subscription_plan_id: selectedPlan.id,
            },
          }).unwrap();
          if (__DEV__) {
            console.log('✅ تم تحديث نوع الاشتراك:', {
              paymentId: currentPaymentId,
              subscription_type: subscriptionType,
              plan_id: selectedPlan.id,
            });
          }
        } catch (updateError) {
          console.error('⚠️ خطأ في تحديث نوع الاشتراك:', updateError);
        }
      } else {
        // إنشاء دفع جديد للتجديد
        const subscriptionType = selectedPlan.type || (selectedPlan.duration_days >= 365 ? 'yearly' : 'monthly');
        const paymentData: any = {
          doctor_id: doctorId,
          amount: selectedPlan.price || selectedPlan.amount || 0,
          payment_type: 'subscription',
          payment_method: 'bank_transfer',
          subscription_plan_id: selectedPlan.id,
          subscription_type: subscriptionType,
          notes: `تجديد اشتراك ${subscriptionType === 'monthly' ? 'شهري' : 'سنوي'} - $${selectedPlan.price || selectedPlan.amount || 0}`,
          is_renewal: true,
        };
        
        // إضافة start_date إذا كان هناك اشتراك نشط (لإضافة الأيام على الأيام المتبقية)
        if (renewalStartDate) {
          paymentData.start_date = renewalStartDate;
          if (__DEV__) {
            console.log('✅ إضافة start_date للتجديد:', renewalStartDate);
          }
        }
        
        const createRes = await createPayment(paymentData).unwrap();
        
        if (__DEV__) {
          console.log('✅ تم إنشاء دفع جديد للتجديد:', {
            paymentId: createRes?.payment?.id,
            subscription_type: subscriptionType,
            plan_id: selectedPlan.id,
            amount: selectedPlan.price || selectedPlan.amount || 0,
            start_date: renewalStartDate,
            duration_days: selectedPlan.duration_days || selectedPlan.days,
          });
        }

        if (createRes?.payment?.id) {
          currentPaymentId = createRes.payment.id;
        }
      }

      if (!currentPaymentId) {
        Alert.alert('خطأ', 'لم يتم إنشاء طلب الدفع. يرجى المحاولة مرة أخرى.');
        return;
      }

      // رفع الوصل
      await uploadReceipt({
        paymentId: currentPaymentId,
        receipt: {
          uri: receiptFile.uri,
          type: receiptFile.mimeType || (receiptFile.isImage ? 'image/jpeg' : 'application/pdf'),
          name: receiptFile.name || (receiptFile.isImage ? 'receipt.jpg' : 'receipt.pdf'),
        },
      }).unwrap();

      setShowPayModal(false);
      Alert.alert(
        'نجح الرفع',
        'تم رفع ملف الوصل بنجاح. سيتم مراجعة طلبك من قبل الإدارة.',
        [
          {
            text: 'موافق',
            onPress: () => {
              refetch();
            },
          },
        ]
      );
    } catch (e: any) {
      console.error('❌ خطأ في تجديد الاشتراك:', e);
      const errorMessage = e?.data?.message || e?.error || 'تعذر إرسال طلب التجديد';
      Alert.alert('خطأ', errorMessage);
    }
  };

  const copyCode = async (code?: string | null) => {
    if (!code) return;
    let success = false;
    try {
      // @ts-ignore web clipboard
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        // @ts-ignore
        await navigator.clipboard.writeText(code);
        success = true;
      }
    } catch {}
    if (!success) {
      try { Alert.alert('الكود', code); } catch {}
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1500);
  };

  const getStatusBadge = () => {
    return (
      <View className={`px-3 py-1 rounded-full ${statusActive ? 'bg-success-100' : 'bg-error-100'}`}
        style={{ backgroundColor: statusActive ? '#dcfce7' : '#fee2e2' }}
      >
        <Text className={`${statusActive ? 'text-success-700' : 'text-error-700'} font-semibold text-sm`}
          style={{ color: statusActive ? '#166534' : '#991b1b' }}
        >
          {statusActive ? 'نشط' : 'غير نشط'}
        </Text>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-success-100 text-success-700',
      pending: 'bg-warning-100 text-warning-700',
      failed: 'bg-error-100 text-error-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      paid: 'مدفوع',
      pending: 'قيد الانتظار',
      failed: 'فشل',
      cancelled: 'ملغي',
    };
    return texts[status] || status;
  };

  const totalPaid = payments
    .filter((p: any) => (p.status || '').toLowerCase() === 'paid')
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const pendingAmount = payments
    .filter((p: any) => (p.status || '').toLowerCase() === 'pending')
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <ScreenLayout
      title="الاشتراك"
      showHeader={true}
      showHomeButton={true}
      onHomePress={() => {
        navigation.navigate('Home');
      }}
    >
      <Container>
        {/* إدارة الاشتراك */}
        <View className="p-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="shield-checkmark-outline" size={24} color="#0c6980" />
                <Text className="text-xl font-bold text-gray-900">إدارة الاشتراك</Text>
              </View>
              {getStatusBadge()}
            </View>

            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[48%] bg-gray-50 rounded-xl p-3">
                <Text className="text-xs text-gray-500 mb-1">نوع الاشتراك</Text>
                <Text className="text-gray-800 font-semibold">{planName}</Text>
              </View>
              <View className="flex-1 min-w-[48%] bg-gray-50 rounded-xl p-3">
                <Text className="text-xs text-gray-500 mb-1">تاريخ الدفع</Text>
                <Text className="text-gray-800 font-semibold">{formatDateLong(currentSubscription?.start_date || currentSubscription?.paid_at)}</Text>
              </View>
              <View className="flex-1 min-w-[48%] bg-gray-50 rounded-xl p-3">
                <Text className="text-xs text-gray-500 mb-1">تاريخ الانتهاء</Text>
                <Text className="text-gray-800 font-semibold">{formatDateLong(currentSubscription?.end_date || currentSubscription?.expires_at)}</Text>
              </View>
              <View className="flex-1 min-w-[48%] bg-gray-50 rounded-xl p-3">
                <Text className="text-xs text-gray-500 mb-1">المبلغ المدفوع</Text>
                <Text className="text-gray-800 font-semibold">{formatMoney(currentSubscription?.amount, currentSubscription?.currency)}</Text>
              </View>
            </View>

            {/* الأيام المتبقية */}
            <View className="mt-4 bg-primary-50 rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="hourglass-outline" size={20} color="#0c6980" />
                <Text className="text-gray-800 font-semibold">الأيام المتبقية</Text>
              </View>
              <Text className="text-2xl font-bold text-primary-700">{remaining.days} يوم</Text>
            </View>

            {/* عدّاد متبقي من الاشتراك */}
            <View className="mt-3 bg-white rounded-xl p-4 border border-gray-100">
              <Text className="text-gray-800 font-semibold mb-3">المتبقي من الاشتراك</Text>
              <View className="flex-row items-center justify-between">
                <View className="items-center flex-1">
                  <Text className="text-2xl font-bold text-gray-900">{remaining.days}</Text>
                  <Text className="text-xs text-gray-500">يوم</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-2xl font-bold text-gray-900">{remaining.hours}</Text>
                  <Text className="text-xs text-gray-500">ساعة</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-2xl font-bold text-gray-900">{remaining.minutes}</Text>
                  <Text className="text-xs text-gray-500">دقيقة</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-2xl font-bold text-gray-900">{remaining.seconds}</Text>
                  <Text className="text-xs text-gray-500">ثانية</Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3 mt-4">
              <Pressable onPress={handleOpenRenew} className="flex-1 bg-primary-600 rounded-xl py-3 items-center">
                <Text className="text-white font-bold">تجديد الاشتراك</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('تفاصيل الخطة', 'سيتم عرض خيارات الخطة قريباً')} className="flex-1 bg-gray-100 rounded-xl py-3 items-center">
                <Text className="text-gray-800 font-bold">تفاصيل الخطة</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* سجل المدفوعات */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">سجل المدفوعات</Text>
        </View>

        {/* Payments List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#0c6980"
              colors={['#0c6980']}
            />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#0c6980" />
              <Text className="text-gray-600 mt-4">جاري تحميل المدفوعات...</Text>
            </View>
          ) : payments.length > 0 ? (
            payments.map((payment: any) => (
              <View
                key={payment.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center">
                      <Ionicons name="cash" size={20} color="#0c6980" />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-gray-900">
                        {formatMoney(payment.amount, payment.currency || 'USD')}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {formatDateLong(payment.date || payment.created_at)}
                      </Text>
                    </View>
                  </View>
                  <View className={`rounded-xl px-3 py-1 ${getStatusColor((payment.status || '').toLowerCase())}`}>
                    <Text className="text-xs font-semibold">{getStatusText((payment.status || '').toLowerCase())}</Text>
                  </View>
                </View>
                {payment.description && (
                  <Text className="text-sm text-gray-600">{payment.description}</Text>
                )}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-600 text-center mt-4 text-lg font-semibold">
                لا توجد مدفوعات حالياً
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                سيظهر هنا سجل المدفوعات عند توفرها
              </Text>
            </View>
          )}
        </ScrollView>
      </Container>

      {/* Plans Modal */}
      <Modal visible={showPlansModal} transparent animationType="slide" onRequestClose={() => setShowPlansModal(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">اختر خطة الاشتراك</Text>
              <Pressable onPress={() => setShowPlansModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>
            {plans.map((p) => {
              const active = selectedPlan?.id === p.id;
              return (
                <Pressable key={p.id} onPress={() => setSelectedPlan(p)} className={`px-4 py-4 rounded-2xl mb-2 border ${active ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'}`}>
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-900 font-semibold">{p.name}</Text>
                      <Text className="text-gray-500 text-xs">
                        {p.type === 'yearly' ? 'سنوي' : 'شهري'} - {p.days || p.duration_days || 30} يوم
                      </Text>
                    </View>
                    <Text className="text-primary-700 font-bold">{formatMoney(p.price, p.currency)}</Text>
                  </View>
                </Pressable>
              );
            })}
            <Pressable onPress={handleContinueToPay} className="mt-3 bg-primary-600 rounded-xl py-3 items-center">
              <Text className="text-white font-semibold">متابعة للدفع</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Pay Modal */}
      <Modal visible={showPayModal} transparent animationType="slide" onRequestClose={() => setShowPayModal(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            {/* Toast */}
            {copiedToast ? (
              <View className="absolute left-5 right-5 -top-10 bg-emerald-500 rounded-2xl px-4 py-2 self-center shadow" style={{ alignSelf: 'center' }}>
                <View className="flex-row items-center justify-center">
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">تم نسخ الكود</Text>
                </View>
              </View>
            ) : null}

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">إتمام الدفع</Text>
              <Pressable onPress={() => setShowPayModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>
            {selectedPlan && (
              <View className="mb-3">
                <Text className="text-gray-800 font-semibold mb-1">الخطة المختارة: {selectedPlan.name}</Text>
                <Text className="text-gray-600 text-sm">المبلغ: {formatMoney(selectedPlan.price, selectedPlan.currency)}</Text>
              </View>
            )}
            <View className="bg-gray-50 rounded-xl p-3 mb-3">
              <Text className="text-gray-700 text-sm mb-2">امسح رمز الدفع (QR) أو انسخ الكود للدفع ثم أدخل رقم العملية وارفع صورة الإيصال إن وجد</Text>
              {loadingQr ? (
                <View className="h-28 items-center justify-center">
                  <ActivityIndicator size="small" color="#10b981" />
                </View>
              ) : paymentInfo.qrUrl ? (
                <View className="items-center justify-center">
                  <Image source={{ uri: paymentInfo.qrUrl }} style={{ width: 200, height: 200, borderRadius: 12 }} resizeMode="contain" />
                </View>
              ) : (
                <View className="h-28 rounded-xl bg-gray-200 items-center justify-center">
                  <Ionicons name="qr-code-outline" size={48} color="#6b7280" />
                </View>
              )}
              {paymentInfo.code ? (
                <View className="mt-3">
                  <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <View className="flex-row items-center" style={{ maxWidth: '75%' }}>
                      <Ionicons name="key-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-800 ml-2" numberOfLines={1}>{paymentInfo.code}</Text>
                    </View>
                    <Pressable onPress={() => copyCode(paymentInfo.code)} className="px-3 py-1.5 rounded-lg bg-primary-600">
                      <Text className="text-white text-xs font-semibold">نسخ</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
            
            {/* رفع ملف الإيصال */}
            <View className="mb-2">
              <Text className="text-xs text-gray-600 mb-1">رفع إيصال الدفع (صورة أو ملف PDF)</Text>
              {receiptFile ? (
                <View className="mt-2">
                  {receiptFile.isImage ? (
                    <View className="relative">
                      <Image source={{ uri: receiptFile.uri }} style={{ width: '100%', height: 200, borderRadius: 12 }} resizeMode="cover" />
                      <Pressable
                        onPress={() => setReceiptFile(null)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5"
                      >
                        <Ionicons name="close" size={18} color="#fff" />
                      </Pressable>
                    </View>
                  ) : (
                    <View className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <Ionicons name="document-text-outline" size={32} color="#6b7280" />
                          <View className="mr-3 flex-1">
                            <Text className="text-gray-800 font-semibold" numberOfLines={1}>{receiptFile.name || 'ملف PDF'}</Text>
                            <Text className="text-gray-500 text-xs mt-1">ملف PDF</Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() => setReceiptFile(null)}
                          className="bg-red-500 rounded-full p-1.5"
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  onPress={pickReceipt}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 items-center justify-center active:bg-gray-50"
                >
                  <Ionicons name="cloud-upload-outline" size={32} color="#6b7280" />
                  <Text className="text-gray-600 mt-2 font-semibold">اضغط لرفع إيصال الدفع</Text>
                  <Text className="text-gray-400 text-xs mt-1">صورة (PNG, JPG) أو ملف PDF</Text>
                </Pressable>
              )}
            </View>
            
            <Pressable 
              disabled={isSubmitting || isUploadingReceipt} 
              onPress={handleSubmitRenewal} 
              className="mt-3 bg-primary-600 rounded-xl py-3 items-center"
              style={{ opacity: (isSubmitting || isUploadingReceipt) ? 0.6 : 1 }}
            >
              {isSubmitting || isUploadingReceipt ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-semibold">جارٍ الإرسال...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold">إرسال طلب التجديد</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

