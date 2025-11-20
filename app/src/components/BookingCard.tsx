import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Modal, Pressable, Image, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import { getDoctorImage } from '../utils/imageUtils';
import { useGetCategoriesQuery } from '../services/api';

type BookingCardProps = {
  visible: boolean;
  bookingData: any;
  onClose: () => void;
};

/**
 * كرت الحجز النهائي
 * يعرض تفاصيل الموعد المحجوز مع إمكانية التحميل
 */
export const BookingCard = ({ visible, bookingData, onClose }: BookingCardProps) => {
  const cardRef = useRef<ViewShot>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) {
      Alert.alert('خطأ', 'لا يمكن تحميل الصورة في الوقت الحالي');
      return;
    }

    setIsDownloading(true);

    try {
      // طلب صلاحيات الوصول إلى معرض الصور
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'صلاحيات مطلوبة',
            'نحتاج إلى صلاحية الوصول إلى معرض الصور لحفظ الكرت.',
            [{ text: 'حسناً' }]
          );
          setIsDownloading(false);
          return;
        }
      }

      // انتظار بسيط لضمان أن كل شيء قد تم رسمه
      await new Promise(resolve => setTimeout(resolve, 500));

      // التقاط صورة للكرت
      if (!cardRef.current || !cardRef.current.capture) {
        throw new Error('لا يمكن الوصول إلى دالة التقاط الصورة');
      }

      const uri = await cardRef.current.capture();
      
      if (!uri) {
        throw new Error('فشل في التقاط الصورة');
      }

      console.log('✅ تم التقاط الصورة بنجاح:', uri);

      // حفظ الصورة في معرض الصور
      if (Platform.OS !== 'web') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('ميعاد', asset, false);
        
        Alert.alert(
          'نجح',
          'تم حفظ كرت الحجز في معرض الصور بنجاح',
          [{ text: 'حسناً' }]
        );
        
        console.log('✅ تم حفظ الصورة في معرض الصور');
      } else {
        // على الويب، استخدم المشاركة
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'حفظ أو مشاركة كرت الحجز',
            UTI: 'public.png',
          });
        } else {
          Alert.alert(
            'معلومات',
            'تم التقاط الصورة. يمكنك حفظها يدوياً.',
            [{ text: 'حسناً' }]
          );
        }
      }
    } catch (error: any) {
      console.error('❌ خطأ في تحميل الكرت:', error);
      console.error('تفاصيل الخطأ:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      });
      
      const errorMessage = error?.message || 'حدث خطأ أثناء محاولة حفظ الكرت. يرجى المحاولة مرة أخرى.';
      
      Alert.alert(
        'خطأ',
        errorMessage,
        [{ text: 'حسناً' }]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      
      return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  // دالة لتحويل الوقت من 24 ساعة إلى 12 ساعة
  const convertTo12Hour = (time24: string): string => {
    if (!time24) return '';
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

  // جلب التصنيفات لاستخراج اسم التخصص
  const { data: categoriesData } = useGetCategoriesQuery();

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

  // استخراج بيانات الطبيب
  const doctor = bookingData?.doctor || {};
  
  // استخراج اسم الطبيب
  const doctorName = doctor?.name || doctor?.title || bookingData?.doctorName || 'طبيب';
  
  // استخراج صورة الطبيب
  const doctorImage = getDoctorImage(doctor) || bookingData?.doctorImage || null;
  
  // استخراج التخصص
  const doctorSpecialty = useMemo(() => {
    // محاولة 1: من bookingData.doctorSpecialty
    if (bookingData?.doctorSpecialty && typeof bookingData.doctorSpecialty === 'string') {
      return bookingData.doctorSpecialty;
    }
    
    // محاولة 2: مباشرة من doctor.specialty
    if (doctor?.specialty && typeof doctor.specialty === 'string') {
      return doctor.specialty;
    }
    
    // محاولة 3: من doctor.category.name
    if (doctor?.category?.name && typeof doctor.category.name === 'string') {
      return doctor.category.name;
    }
    
    // محاولة 4: من doctor.category إذا كان string مباشرة
    if (doctor?.category && typeof doctor.category === 'string') {
      return doctor.category;
    }
    
    // محاولة 5: البحث في قائمة التصنيفات باستخدام category_id
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
  }, [doctor, categoryList, bookingData]);

  // استخراج بيانات الحجز (دعم الأسماء المختلفة)
  const appointmentId = bookingData?.appointmentId || bookingData?.id || bookingData?.data?.id || '---';
  const patientName = bookingData?.patient_name || bookingData?.patientName || '';
  const phone = bookingData?.phone_number || bookingData?.phone || '';
  const date = bookingData?.appointment_date || bookingData?.date || '';
  const time = bookingData?.appointment_time || bookingData?.time || '';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <ViewShot 
          ref={cardRef}
          style={styles.card}
          options={{
            format: 'png',
            quality: 1.0,
            result: 'tmpfile',
          }}
        >
          {/* شريط السحب */}
          <View style={styles.dragHandle} />
          
          {/* العنوان */}
          <View style={styles.header}>
            <View 
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
            </View>
            <Text style={styles.title}>تم الحجز بنجاح</Text>
            <Text style={styles.subtitle}>تم تأكيد موعدك بنجاح</Text>
          </View>
        
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* معلومات الطبيب */}
            <View style={styles.doctorCard}>
              <View style={styles.doctorInfo}>
                {doctorImage && !imageError ? (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: doctorImage }} 
                      style={styles.doctorImage}
                      resizeMode="cover"
                      onError={() => setImageError(true)}
                    />
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="person" size={40} color="#0c6980" />
                  </View>
                )}
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{doctorName}</Text>
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{doctorSpecialty}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* تفاصيل الموعد */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>تفاصيل الموعد</Text>
              
              <View style={styles.detailsList}>
                {/* اسم المريض */}
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="person-outline" size={20} color="#0c6980" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>اسم المريض</Text>
                    <Text style={styles.detailValue}>{patientName || '---'}</Text>
                  </View>
                </View>
                
                {/* رقم الهاتف */}
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="call-outline" size={20} color="#0c6980" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>رقم الهاتف</Text>
                    <Text style={styles.detailValue}>{phone || '---'}</Text>
                  </View>
                </View>
                
                {/* التاريخ */}
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#0c6980" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>التاريخ</Text>
                    <Text style={styles.detailValue}>{date ? formatDate(date) : '---'}</Text>
                  </View>
                </View>
                
                {/* الوقت */}
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <View style={[styles.detailIconContainer, styles.timeIconContainer]}>
                    <Ionicons name="time-outline" size={20} color="#ffffff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>الوقت</Text>
                    <Text style={[styles.detailValue, styles.timeValue]}>
                      {time ? (time.includes('ص') || time.includes('م') ? time : convertTo12Hour(time)) : '---'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* الأزرار */}
            <View style={styles.buttonsContainer} className='py-5 flex items-center flex-wrap gap-5'>
              <Pressable
                onPress={onClose}
                className='bg-red-500 w-full rounded-2xl text-white py-3 flex items-center justify-center'
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="close-circle" size={24} color="#ffffff" />
                  <Text style={styles.cancelButtonText} className='text-white'>إغلاق</Text>
                </View>
              </Pressable>
              
              <Pressable
                onPress={handleDownload}
                disabled={isDownloading}
                className='bg-primary-500 w-full rounded-2xl text-white py-3 flex items-center justify-center'
                style={({ pressed }) => [
                  styles.confirmButton,
                  isDownloading && styles.confirmButtonDisabled,
                  pressed && !isDownloading && styles.confirmButtonPressed,
                ]}
              >
                <View style={styles.buttonContent} className='flex items-center justify-center gap-2'>
                  <Ionicons 
                    name={isDownloading ? "hourglass-outline" : "download-outline"} 
                    size={24} 
                    color="#ffffff"
                  />
                  <Text style={styles.confirmButtonText} className='text-white'>
                    {isDownloading ? 'جاري التحميل...' : 'تحميل الكرت'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        </ViewShot>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Cairo_700Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  doctorCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0c6980',
    shadowColor: '#0c6980',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#0c6980',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e6f2f4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0c6980',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontFamily: 'Cairo_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#0c6980',
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: 'Cairo_600SemiBold',
    color: '#0c6980',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
    color: '#111827',
    marginBottom: 20,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastDetailItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e6f2f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timeIconContainer: {
    backgroundColor: '#0c6980',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Cairo_500Medium',
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    color: '#111827',
  },
  timeValue: {
    fontSize: 18,
    fontFamily: 'Cairo_700Bold',
    color: '#0c6980',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButtonPressed: {
    backgroundColor: '#dc2626',
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
    color: '#ffffff',
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#0c6980',
    shadowColor: '#0c6980',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  confirmButtonPressed: {
    backgroundColor: '#0a5669',
    transform: [{ scale: 0.98 }],
  },
  confirmButtonText: {
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
    color: '#ffffff',
  },
});

