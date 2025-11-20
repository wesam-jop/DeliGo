import React, { useState } from 'react';
import { View, Text, Modal, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BookingConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: {
    doctorName: string;
    doctorImage?: string | null;
    doctorSpecialty: string;
    patientName: string;
    phone: string;
    date: string;
    time: string;
  };
};

/**
 * Modal تأكيد الحجز
 * يعرض تفاصيل الموعد قبل التأكيد النهائي
 */
export const BookingConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  bookingData,
}: BookingConfirmationModalProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          {/* شريط السحب */}
          <View style={styles.dragHandle} />
          
          {/* العنوان */}
          <View style={styles.header}>
            <View 
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#e6f2f4',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="calendar" size={28} color="#0c6980" />
            </View>
            <Text style={styles.title}>تأكيد الحجز</Text>
            <Text style={styles.subtitle}>يرجى مراجعة التفاصيل قبل التأكيد</Text>
          </View>
          
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* معلومات الطبيب */}
            <View style={styles.doctorCard}>
              <View style={styles.doctorInfo}>
                {bookingData.doctorImage && !imageError ? (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: bookingData.doctorImage }} 
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
                  <Text style={styles.doctorName}>{bookingData.doctorName}</Text>
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{bookingData.doctorSpecialty}</Text>
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
                    <Text style={styles.detailValue}>{bookingData.patientName}</Text>
                  </View>
                </View>
                
                {/* رقم الهاتف */}
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="call-outline" size={20} color="#0c6980" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>رقم الهاتف</Text>
                    <Text style={styles.detailValue}>{bookingData.phone}</Text>
                  </View>
                </View>
                
                {/* التاريخ */}
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#0c6980" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>التاريخ</Text>
                    <Text style={styles.detailValue}>{bookingData.date}</Text>
                  </View>
                </View>
                
                {/* الوقت */}
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <View style={[styles.detailIconContainer, styles.timeIconContainer]}>
                    <Ionicons name="time-outline" size={20} color="#ffffff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>الوقت</Text>
                    <Text style={[styles.detailValue, styles.timeValue]}>{bookingData.time}</Text>
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
                  <Text style={styles.cancelButtonText} className='text-white'>إلغاء</Text>
                </View>
              </Pressable>
              
              <Pressable
                onPress={onConfirm}
                className='bg-primary-500 w-full rounded-2xl text-white py-3 flex items-center justify-center'
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && styles.confirmButtonPressed,
                ]}
              >
                <View style={styles.buttonContent} className='flex items-center justify-center gap-2'>
                  <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                  <Text style={styles.confirmButtonText} className='text-white'>تأكيد الحجز</Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        </View>
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
  modalContainer: {
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
    marginBottom: 24,
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
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButtonPressed: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
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

