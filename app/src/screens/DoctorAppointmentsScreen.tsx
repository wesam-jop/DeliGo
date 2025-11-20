import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl, Alert, Modal, TextInput, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDoctorMeQuery, useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../services/api';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { saveAppointmentsLocally, getAppointmentsLocally } from '../utils/storage';

export const DoctorAppointmentsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [detailsModal, setDetailsModal] = useState<{ visible: boolean; appointment: any | null }>({ visible: false, appointment: null });
  
  // Search and Date Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    // اختيار اليوم تلقائياً
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch doctor data
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data;
  const doctorId = doctor?.id;

  // State للبيانات المحلية
  const [localAppointments, setLocalAppointments] = useState<any[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Fetch appointments
  const { data: appointmentsData, isLoading, refetch, error: appointmentsError, isError } = useGetDoctorAppointmentsQuery(doctorId || 0, {
    skip: !doctorId,
  });

  // تحميل البيانات المحلية عند فتح الشاشة
  useEffect(() => {
    const loadLocalData = async () => {
      if (doctorId) {
        setIsLoadingLocal(true);
        const local = await getAppointmentsLocally(doctorId);
        if (local && local.length > 0) {
          setLocalAppointments(local);
          if (__DEV__) {
            console.log('📦 تم تحميل المواعيد من التخزين المحلي:', local.length);
          }
        }
        setIsLoadingLocal(false);
      }
    };
    loadLocalData();
  }, [doctorId]);

  // حفظ البيانات المحلية عند نجاح جلب البيانات من API
  useEffect(() => {
    if (appointmentsData && doctorId) {
      const raw = (
        (appointmentsData?.data as any[])
        || (appointmentsData?.appointments as any[])
        || (Array.isArray(appointmentsData) ? (appointmentsData as any[]) : [])
      ) as any[];
      
      if (Array.isArray(raw) && raw.length > 0) {
        saveAppointmentsLocally(doctorId, raw);
        setLocalAppointments(raw);
        if (__DEV__) {
          console.log('✅ تم حفظ المواعيد محلياً بعد جلبها من API:', raw.length);
        }
      }
    }
  }, [appointmentsData, doctorId]);
  
  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetch();
      }
    }, [doctorId, refetch])
  );

  // استخدام البيانات من API إذا كانت متوفرة، وإلا استخدام البيانات المحلية
  const rawAppointments = useMemo(() => {
    if (appointmentsData) {
      const apiData = (
        (appointmentsData?.data as any[])
        || (appointmentsData?.appointments as any[])
        || (Array.isArray(appointmentsData) ? (appointmentsData as any[]) : [])
      ) as any[];
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData;
      }
    }
    // إذا لم تكن هناك بيانات من API، استخدم البيانات المحلية
    if (localAppointments.length > 0) {
      if (__DEV__) {
        console.log('📦 استخدام البيانات المحلية للمواعيد:', localAppointments.length);
      }
      return localAppointments;
    }
    return [];
  }, [appointmentsData, localAppointments]) as any[];
  // تحديث حالة التحميل لتشمل البيانات المحلية
  const isLoadingData = isLoading && isLoadingLocal && rawAppointments.length === 0;

  const allAppointments = Array.isArray(rawAppointments)
    ? rawAppointments.map((a: any) => ({
        ...a,
        id: a.id,
        booking_number: a.booking_number || a.id,
        patient_name: a.patient_name || a.name || 'مريض',
        patient_phone: a.patient_phone || a.phone || a.phone_number || a.phone_number || '',
        date: a.appointment_date || a.date || '',
        time: a.appointment_time || a.time || '',
        appointment_time_formatted: a.appointment_time_formatted,
        status: a.status || a.state || 'pending',
      }))
    : [];

  const [updateAppointmentStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  // Logs للتشخيص
  useEffect(() => {
    if (__DEV__) {
      console.log('🔎 doctorId:', doctorId);
      console.log('📦 appointmentsData:', appointmentsData);
      if (isError) {
        console.error('❌ appointmentsError:', appointmentsError);
      }
      if (appointmentsData && !Array.isArray(appointmentsData) && !Array.isArray(appointmentsData?.data)) {
        console.log('⚠️ شكل البيانات غير مصفوفة. المفاتيح:', Object.keys(appointmentsData || {}));
      }
    }
  }, [doctorId, appointmentsData, isError, appointmentsError]);

  // تنسيقات التاريخ والوقت
  const formatDateOnly = (isoOrDate: string | Date | undefined) => {
    if (!isoOrDate) return '';
    try {
      const d = new Date(isoOrDate);
      if (Number.isNaN(d.getTime())) return String(isoOrDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return String(isoOrDate);
    }
  };
  const formatTime = (appointment: any) => {
    if (appointment.appointment_time_formatted) return appointment.appointment_time_formatted;
    return appointment.time || '';
  };

  // استخراج التواريخ التي تحتوي على حجوزات
  const datesWithAppointments = useMemo(() => {
    const datesMap: Record<string, boolean> = {};
    allAppointments.forEach((appointment: any) => {
      const dateStr = formatDateOnly(appointment.date || appointment.appointment_date);
      if (dateStr) {
        datesMap[dateStr] = true;
      }
    });
    return datesMap;
  }, [allAppointments]);

  // إنشاء markedDates للتقويم
  const markedDates = useMemo(() => {
    const marked: any = {};
    
    // إضافة علامات على التواريخ التي تحتوي على حجوزات
    Object.keys(datesWithAppointments).forEach((dateStr) => {
      marked[dateStr] = {
        marked: true,
        dotColor: '#0c6980',
      };
    });
    
    // إضافة التاريخ المحدد
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      marked[selectedDateStr] = {
        ...marked[selectedDateStr],
        selected: true,
        selectedColor: '#0c6980',
        selectedTextColor: '#ffffff',
        marked: datesWithAppointments[selectedDateStr] ? true : false,
        dotColor: datesWithAppointments[selectedDateStr] ? '#ffffff' : undefined,
      };
    }
    
    return marked;
  }, [datesWithAppointments, selectedDate]);

  // Filter appointments by status, date, and search
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((appointment: any) => {
      // Filter by status
      if (selectedTab !== 'all' && appointment.status !== selectedTab) {
        return false;
      }
      
      // Filter by date
      if (selectedDate) {
        const appointmentDate = appointment.date ? new Date(appointment.date) : null;
        if (appointmentDate) {
          appointmentDate.setHours(0, 0, 0, 0);
          const filterDate = new Date(selectedDate);
          filterDate.setHours(0, 0, 0, 0);
          if (appointmentDate.getTime() !== filterDate.getTime()) {
            return false;
          }
        } else {
          return false;
        }
      }
      
      // Filter by search query (patient name)
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase().trim();
        const patientName = (appointment.patient_name || '').toLowerCase();
        if (!patientName.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }, [allAppointments, selectedTab, selectedDate, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-warning-100 text-warning-700 border-warning-300',
      confirmed: 'bg-primary-100 text-primary-700 border-primary-300',
      completed: 'bg-success-100 text-success-700 border-success-300',
      cancelled: 'bg-error-100 text-error-700 border-error-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: 'time-outline',
      confirmed: 'checkmark-circle-outline',
      completed: 'checkmark-done-circle-outline',
      cancelled: 'close-circle-outline',
    };
    return icons[status] || 'ellipse-outline';
  };

  const handleStatusChange = async (appointmentId: string | number, newStatus: string) => {
    try {
      await updateAppointmentStatus({ appointmentId, status: newStatus }).unwrap();
      Alert.alert('نجح', 'تم تحديث حالة الموعد بنجاح');
      refetch();
    } catch (error: any) {
      Alert.alert('خطأ', error?.data?.message || 'فشل تحديث حالة الموعد');
    }
  };

  const tabs = [
    { id: 'all' as const, label: 'الكل', count: allAppointments.length },
    { id: 'pending' as const, label: 'قيد الانتظار', count: allAppointments.filter((a: any) => a.status === 'pending').length },
    { id: 'confirmed' as const, label: 'مؤكدة', count: allAppointments.filter((a: any) => a.status === 'confirmed').length },
    { id: 'completed' as const, label: 'مكتملة', count: allAppointments.filter((a: any) => a.status === 'completed').length },
  ];

  return (
    <Container>
      <ScreenLayout
        title="المواعيد"
        showHeader={true}
        scrollable={true}
        showHomeButton={true}
        onHomePress={() => {
          navigation.navigate('Home');
        }}
      >
        <View className="flex-1 bg-gray-50">
          {/* Search and Date Filter */}
          <View style={{ backgroundColor: '#ffffff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            {/* Search Input */}
            <View style={{ marginBottom: 12 }}>
              <View 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <Ionicons name="search-outline" size={20} color="#6b7280" style={{ marginLeft: 8 }} />
                <TextInput
                  placeholder="البحث عن اسم المريض..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontFamily: 'Cairo_400Regular',
                    color: '#111827',
                  }}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} style={{ marginRight: 4 }}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </Pressable>
                )}
              </View>
            </View>
            
            {/* Date Filter - Compact Design */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable
                onPress={() => {
                  setShowDatePicker(true);
                }}
                style={({ pressed }) => ({
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: pressed ? '#e0f2fe' : '#f0f9ff',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: '#0c6980',
                })}
              >
                <Ionicons name="calendar" size={18} color="#0c6980" style={{ marginLeft: 6 }} />
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: 'Cairo_600SemiBold', 
                  color: '#0c6980',
                  marginLeft: 8,
                  flex: 1,
                }}>
                  {selectedDate 
                    ? selectedDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        calendar: 'gregory'
                      })
                    : 'اختر التاريخ'}
                </Text>
                <Ionicons name="chevron-down-outline" size={16} color="#0c6980" />
              </Pressable>
              
              {/* Quick Actions */}
              <Pressable
                onPress={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  setSelectedDate(today);
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: selectedDate && selectedDate.toDateString() === new Date().toDateString() 
                    ? '#0c6980' 
                    : '#fef3c7',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: selectedDate && selectedDate.toDateString() === new Date().toDateString()
                    ? '#0c6980'
                    : '#f59e0b',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ 
                  fontSize: 12, 
                  fontFamily: 'Cairo_600SemiBold', 
                  color: selectedDate && selectedDate.toDateString() === new Date().toDateString()
                    ? '#ffffff'
                    : '#92400e',
                }}>
                  اليوم
                </Text>
              </Pressable>
              
              {selectedDate && selectedDate.toDateString() !== new Date().toDateString() && (
                <Pressable
                  onPress={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    setSelectedDate(today);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: '#fee2e2',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#ef4444',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={16} color="#991b1b" />
                </Pressable>
              )}
            </View>
          </View>
          
          {/* Date Picker Modal */}
          {showDatePicker && (
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <Pressable 
                style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}
                onPress={() => setShowDatePicker(false)}
              >
                <View 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderTopLeftRadius: 24, 
                    borderTopRightRadius: 24, 
                    paddingTop: 20,
                    paddingBottom: 30,
                    paddingHorizontal: 16,
                    maxHeight: '85%',
                  }}
                  onStartShouldSetResponder={() => true}
                >
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f1f5f9',
                  }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Cairo_700Bold', color: '#111827' }}>
                      اختر التاريخ
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <Pressable 
                        onPress={() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          setSelectedDate(today);
                          setShowDatePicker(false);
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          backgroundColor: '#fef3c7',
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontFamily: 'Cairo_600SemiBold', color: '#92400e' }}>
                          اليوم
                        </Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => setShowDatePicker(false)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          backgroundColor: '#0c6980',
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontFamily: 'Cairo_600SemiBold', color: '#ffffff' }}>
                          تم
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <Calendar
                    current={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onDayPress={(day) => {
                      const newDate = new Date(day.dateString);
                      newDate.setHours(0, 0, 0, 0);
                      setSelectedDate(newDate);
                      setShowDatePicker(false);
                    }}
                    markedDates={markedDates}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#6b7280',
                      selectedDayBackgroundColor: '#0c6980',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#0c6980',
                      todayBackgroundColor: '#e6f2f4',
                      dayTextColor: '#111827',
                      textDisabledColor: '#d1d5db',
                      dotColor: '#0c6980',
                      selectedDotColor: '#ffffff',
                      arrowColor: '#0c6980',
                      monthTextColor: '#111827',
                      indicatorColor: '#0c6980',
                      textDayFontFamily: 'Cairo_600SemiBold',
                      textMonthFontFamily: 'Cairo_700Bold',
                      textDayHeaderFontFamily: 'Cairo_600SemiBold',
                      textDayFontSize: 15,
                      textMonthFontSize: 20,
                      textDayHeaderFontSize: 13,
                    }}
                    enableSwipeMonths={true}
                    firstDay={6}
                    minDate={new Date(2020, 0, 1).toISOString().split('T')[0]}
                    maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                    style={{
                      borderRadius: 16,
                      padding: 8,
                      marginBottom: 10,
                    }}
                    hideExtraDays={true}
                    showWeekNumbers={false}
                  />
                </View>
              </Pressable>
            </Modal>
          )}
          
          {/* Tabs */}
          <View style={{ 
            backgroundColor: '#ffffff', 
            paddingVertical: 16,
            paddingHorizontal: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              {tabs.map((tab) => {
                const isSelected = selectedTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setSelectedTab(tab.id)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 16,
                      backgroundColor: isSelected ? '#0c6980' : '#f3f4f6',
                      minWidth: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: isSelected ? '#0c6980' : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.2 : 0.05,
                      shadowRadius: 4,
                      elevation: isSelected ? 3 : 1,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text
                        style={{
                          fontFamily: isSelected ? 'Cairo_600SemiBold' : 'Cairo_500Medium',
                          fontSize: 14,
                          color: isSelected ? '#ffffff' : '#6b7280',
                        }}
                      >
                        {tab.label}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#e5e7eb',
                          minWidth: 28,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Cairo_700Bold',
                            fontSize: 12,
                            color: isSelected ? '#ffffff' : '#4b5563',
                          }}
                        >
                          {tab.count}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Appointments List */}
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
            {!doctorId ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="person-circle-outline" size={64} color="#d1d5db" />
                <Text className="text-gray-600 text-center mt-4 text-lg font-semibold">يرجى تسجيل الدخول كطبيب لعرض المواعيد</Text>
              </View>
            ) : null}
            {isLoadingData ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#0c6980" />
                <Text className="text-gray-600 mt-4">جاري تحميل المواعيد...</Text>
              </View>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment: any) => (
                <View
                  key={appointment.id}
                  className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900 mb-1">
                        {appointment.patient_name || appointment.name || 'مريض'}
                      </Text>
                      <View className="flex-row items-center gap-2 mb-2">
                        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                        <Text className="text-sm text-gray-600">{formatDateOnly(appointment.date)}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={16} color="#6b7280" />
                        <Text className="text-sm text-gray-600">{formatTime(appointment)}</Text>
                      </View>
                    </View>
                    <View className={`rounded-xl px-3 py-1 border ${getStatusColor(appointment.status)}`}>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name={getStatusIcon(appointment.status) as any} size={16} />
                        <Text className="text-xs font-semibold">{getStatusText(appointment.status)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Phone + Booking Number */}
                  <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="call-outline" size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-600">{appointment.patient_phone || '-'}</Text>
                    </View>
                    {/* <View className="flex-row items-center gap-2">
                      <Ionicons name="pricetag-outline" size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-600">رقم الحجز: {appointment.booking_number}</Text>
                    </View> */}
                  </View>

                  {/* Notes */}
                  {appointment.notes && (
                    <View className="mb-3 pb-3 border-b border-gray-100">
                      <Text className="text-xs text-gray-500 font-medium mb-1">ملاحظات:</Text>
                      <Text className="text-sm text-gray-700">{appointment.notes}</Text>
                    </View>
                  )}

                  {/* Actions */}
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setDetailsModal({ visible: true, appointment })}
                      className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
                    >
                      <Text className="text-gray-800 font-semibold text-sm">التفاصيل</Text>
                    </Pressable>
                    {appointment.status === 'pending' && (
                      <>
                        <Pressable
                          onPress={() => handleStatusChange(appointment.id, 'confirmed')}
                          disabled={isUpdating}
                          className="flex-1 bg-primary-600 rounded-xl py-3 items-center"
                        >
                          <Text className="text-white font-semibold text-sm">تأكيد</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleStatusChange(appointment.id, 'cancelled')}
                          disabled={isUpdating}
                          className="flex-1 bg-error-500 rounded-xl py-3 items-center"
                        >
                          <Text className="text-white font-semibold text-sm">إلغاء</Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-12 px-4">
                <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
                <Text className="text-gray-600 text-center mt-4 text-lg font-semibold" style={{ fontFamily: 'Cairo_700Bold' }}>
                  {searchQuery || selectedDate
                    ? 'لا توجد نتائج للبحث'
                    : 'لا توجد مواعيد حالياً'}
                </Text>
                <Text className="text-gray-400 text-center mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
                  {searchQuery || selectedDate
                    ? 'جرب البحث بكلمات مختلفة أو اختر تاريخ آخر'
                    : 'سيظهر هنا جميع المواعيد عند توفرها. إذا كنت تتوقع وجود مواعيد، تحقق من الاتصال أو صلاحية الحساب.'}
                </Text>
                {(searchQuery || selectedDate) && (
                  <Pressable
                    onPress={() => {
                      setSearchQuery('');
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      setSelectedDate(today);
                    }}
                    style={{
                      marginTop: 16,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      backgroundColor: '#0c6980',
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontFamily: 'Cairo_600SemiBold', fontSize: 14 }}>
                      إعادة تعيين الفلاتر
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>
          {/* Details Modal */}
          <Modal
            visible={detailsModal.visible}
            transparent
            animationType="slide"
            onRequestClose={() => setDetailsModal({ visible: false, appointment: null })}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-white rounded-t-3xl p-5">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-bold text-gray-900">تفاصيل الحجز</Text>
                  <Pressable onPress={() => setDetailsModal({ visible: false, appointment: null })}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>
                {detailsModal.appointment && (
                  <View className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="person-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-700">{detailsModal.appointment.patient_name}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="call-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-700">{detailsModal.appointment.patient_phone || '-'}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-700">{formatDateOnly(detailsModal.appointment.date)} - {formatTime(detailsModal.appointment)}</Text>
                    </View>
                    {/* <View className="flex-row items-center gap-2">
                      <Ionicons name="pricetag-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-700">رقم الحجز: {detailsModal.appointment.booking_number}</Text>
                    </View> */}
                    {detailsModal.appointment.notes ? (
                      <View className="mt-2">
                        <Text className="text-xs text-gray-500 mb-1">ملاحظات:</Text>
                        <Text className="text-gray-700">{detailsModal.appointment.notes}</Text>
                      </View>
                    ) : null}
                    {detailsModal.appointment.status === 'pending' && (
                      <View className="flex-row gap-2 mt-4">
                        <Pressable
                          onPress={async () => {
                            await handleStatusChange(detailsModal.appointment.id, 'confirmed');
                            setDetailsModal({ visible: false, appointment: null });
                          }}
                          className="flex-1 bg-primary-600 rounded-xl py-3 items-center"
                        >
                          <Text className="text-white font-semibold text-sm">تأكيد</Text>
                        </Pressable>
                        <Pressable
                          onPress={async () => {
                            await handleStatusChange(detailsModal.appointment.id, 'cancelled');
                            setDetailsModal({ visible: false, appointment: null });
                          }}
                          className="flex-1 bg-error-500 rounded-xl py-3 items-center"
                        >
                          <Text className="text-white font-semibold text-sm">إلغاء</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScreenLayout>
    </Container>
  );
};

