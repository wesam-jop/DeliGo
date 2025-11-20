import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, RefreshControl, TextInput, Switch, Modal } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDoctorMeQuery, useGetDoctorScheduleQuery, useUpdateDoctorScheduleMutation } from '../services/api';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';

export const DoctorScheduleScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch doctor data
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data;
  const doctorId = doctor?.id;

  // Fetch schedule
  const { data: scheduleData, isLoading, refetch } = useGetDoctorScheduleQuery(doctorId || 0, {
    skip: !doctorId,
  });
  
  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetch();
      }
    }, [doctorId, refetch])
  );
  // توحيد شكل بيانات الجدول (تدعم {schedules:[...]} أو {data:[...]})
  const schedulesArray = Array.isArray(scheduleData?.schedules)
    ? scheduleData?.schedules
    : Array.isArray(scheduleData?.data)
      ? scheduleData?.data
      : [];
  const scheduleByDay = useMemo(() => {
    return (schedulesArray as any[]).reduce((acc: any, item: any) => {
      const key = String(item.day_of_week || '').toLowerCase();
      acc[key] = {
        id: item.id,
        start_time: item.start_time || '',
        end_time: item.end_time || '',
        appointment_duration: item.appointment_duration ?? '',
        break_duration: item.break_duration ?? '',
        available_slots: item.available_slots,
        working_hours: item.working_hours,
        is_active: Boolean(item.is_active ?? true),
        day_name_arabic: item.day_name_arabic,
      };
      return acc;
    }, {} as Record<string, any>);
  }, [scheduleData]);

  const [updateSchedule, { isLoading: isUpdating }] = useUpdateDoctorScheduleMutation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const days = [
    { id: 'sunday', label: 'الأحد', name: 'Sunday' },
    { id: 'monday', label: 'الإثنين', name: 'Monday' },
    { id: 'tuesday', label: 'الثلاثاء', name: 'Tuesday' },
    { id: 'wednesday', label: 'الأربعاء', name: 'Wednesday' },
    { id: 'thursday', label: 'الخميس', name: 'Thursday' },
    { id: 'friday', label: 'الجمعة', name: 'Friday' },
    { id: 'saturday', label: 'السبت', name: 'Saturday' },
  ];

  // حالة قابلة للتعديل لكل يوم
  const [editableByDay, setEditableByDay] = useState<Record<string, {
    id?: number | string;
    start_time: string;
    end_time: string;
    appointment_duration: string;
    break_duration: string;
    is_active: boolean;
  }>>({});

  // مؤشر حفظ لليوم
  const [savingDayKey, setSavingDayKey] = useState<string | null>(null);

  // تهيئة الحالة من البيانات الواردة
  useEffect(() => {
    const initial: any = {};
    days.forEach((d) => {
      const key = d.id;
      const src = scheduleByDay[key] || {};
      initial[key] = {
        id: src.id,
        start_time: src.start_time || '',
        end_time: src.end_time || '',
        appointment_duration: String(src.appointment_duration ?? ''),
        break_duration: String(src.break_duration ?? ''),
        // يوم بدون بيانات = غير نشط افتراضياً
        is_active: src.hasOwnProperty('is_active') ? Boolean(src.is_active) : false,
      };
    });
    setEditableByDay(initial);
  }, [scheduleData]);

  const isValidTime = (value: string) => /^\d{2}:\d{2}$/.test(value);
  const isValidNumber = (value: string) => /^\d+$/.test(value);

  // عرض الوقت بصيغة 12 ساعة (ص/م)
  const formatTo12h = (time24?: string) => {
    if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) return time24 || '';
    const [hStr, m] = time24.split(':');
    let h = parseInt(hStr, 10);
    if (Number.isNaN(h)) return time24;
    const isAM = h < 12;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m} ${isAM ? 'ص' : 'م'}`;
  };

  const to24h = (hour12: number, minutes: string, isAM: boolean) => {
    let h = hour12 % 12;
    if (!isAM) h += 12;
    return `${String(h).padStart(2, '0')}:${minutes}`;
  };

  // Time picker modal state
  const [timePicker, setTimePicker] = useState<{
    visible: boolean;
    dayKey: string | null;
    target: 'start' | 'end' | null;
    hour: number;
    minute: string;
    am: boolean;
  }>({ visible: false, dayKey: null, target: null, hour: 9, minute: '00', am: true });

  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesList = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  const openTimePicker = (dayKey: string, target: 'start' | 'end') => {
    const current = target === 'start' ? editableByDay[dayKey]?.start_time : editableByDay[dayKey]?.end_time;
    let hour = 9;
    let minute = '00';
    let am = true;
    if (/^\d{2}:\d{2}$/.test(current)) {
      const [hh, mm] = current.split(':');
      const h = parseInt(hh, 10);
      am = h < 12;
      hour = h % 12 === 0 ? 12 : h % 12;
      minute = mm;
    }
    setTimePicker({ visible: true, dayKey, target, hour, minute, am });
  };

  const confirmTimePicker = () => {
    if (!timePicker.target || !timePicker.dayKey) return;
    const value24 = to24h(timePicker.hour, timePicker.minute, timePicker.am);
    if (__DEV__) {
      console.log('⏱️ اختيار وقت', { dayKey: timePicker.dayKey, target: timePicker.target, hour: timePicker.hour, minute: timePicker.minute, am: timePicker.am, value24 });
    }
    setEditableByDay((prev) => {
      const next = { ...prev } as any;
      if (!next[timePicker.dayKey!]) return prev;
      if (timePicker.target === 'start') {
        next[timePicker.dayKey!].start_time = value24;
      } else {
        next[timePicker.dayKey!].end_time = value24;
      }
      return next;
    });
    setTimePicker((p) => ({ ...p, visible: false, dayKey: null, target: null }));
  };

  const saveSingleDay = async (k: string) => {
    try {
      const v = editableByDay[k];
      if (!v) return;
      // إذا اليوم مفعل نتحقق من صحة الأوقات
      if (v.is_active) {
        if (!v.start_time || !v.end_time || !isValidTime(v.start_time) || !isValidTime(v.end_time)) {
          Alert.alert('تنبيه', 'يرجى اختيار وقتي البدء والانتهاء بصيغة صحيحة قبل التفعيل');
          return;
        }
      } else {
        // إذا اليوم غير مفعل ولا يوجد id لا حاجة لإرسال أي شيء
        if (!v.id) {
          return;
        }
      }
      const payload: any = {
        id: v.id,
        day_of_week: k,
        start_time: v.start_time,
        end_time: v.end_time,
        appointment_duration: Number(v.appointment_duration || 0),
        break_duration: Number(v.break_duration || 0),
        is_active: v.is_active ? 1 : 0,
      };
      if (__DEV__) console.log('📝 حفظ يوم منفرد:', payload);
      setSavingDayKey(k);
      await updateSchedule({ doctorId: doctorId as number, schedule: { schedules: [payload] } }).unwrap();
      setSavingDayKey(null);
      refetch();
    } catch (e) {
      setSavingDayKey(null);
      Alert.alert('خطأ', 'تعذر حفظ يوم الجدول');
      if (__DEV__) console.error('❌ خطأ حفظ يوم:', e);
    }
  };

  const handleSaveAll = async () => {
    try {
      const schedules = days.map((d) => {
        const k = d.id;
        const v = editableByDay[k] || {} as any;
        if (!v.start_time || !v.end_time) return null;
        if (!isValidTime(v.start_time) || !isValidTime(v.end_time)) return null;
        const payload: any = {
          id: v.id,
          day_of_week: k,
          start_time: v.start_time,
          end_time: v.end_time,
          appointment_duration: Number(v.appointment_duration || 0),
          break_duration: Number(v.break_duration || 0),
          is_active: v.is_active ? 1 : 0,
        };
        return payload;
      }).filter(Boolean);

      if (!schedules.length) {
        Alert.alert('تنبيه', 'يرجى إدخال أوقات صحيحة على الأقل لأحد الأيام');
        return;
      }

      if (__DEV__) {
        console.log('📝 إرسال تحديث الجدول (جميع الأيام):', { schedules });
      }
      await updateSchedule({ doctorId: doctorId as number, schedule: { schedules } }).unwrap();
      Alert.alert('تم الحفظ', 'تم تحديث الجدول الزمني بنجاح');
      refetch();
    } catch (error: any) {
      if (__DEV__) console.error('❌ خطأ تحديث الجدول:', error);
      Alert.alert('خطأ', error?.data?.message || 'تعذر حفظ التعديلات');
    }
  };

  return (
    <Container>
      <ScreenLayout
        title="الجدول الزمني"
        showHeader={true}
        scrollable={true}
        showHomeButton={true}
        onHomePress={() => {
          navigation.navigate('Home');
        }}
      >
        <View className="flex-1 bg-gray-50">
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
            {isLoading ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#0c6980" />
                <Text className="text-gray-600 mt-4">جاري تحميل الجدول الزمني...</Text>
              </View>
            ) : (
              <>
                {days.map((day) => {
                  const k = day.id;
                  const v = editableByDay[k] || { start_time: '', end_time: '', appointment_duration: '', break_duration: '', is_active: false };
                  const isSaving = savingDayKey === k;
                  const statusChipBg = v.is_active ? '#dcfce7' : '#f3f4f6';
                  const statusChipText = v.is_active ? '#166534' : '#374151';
                  // السماح بالتحرير دائماً، حتى لو اليوم غير نشط
                  const editorsDisabled = false;
                  return (
                    <View key={k} className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
                      <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="calendar-outline" size={22} color="#0c6980" />
                          <Text className="text-lg font-bold text-gray-900">{day.label}</Text>
                          <View style={{ backgroundColor: statusChipBg }} className="px-2.5 py-1 rounded-full ml-1">
                            <Text style={{ color: statusChipText }} className="text-[11px] font-semibold">{v.is_active ? 'نشط' : 'غير نشط'}</Text>
                          </View>
                          {isSaving ? <ActivityIndicator size="small" color="#0c6980" /> : null}
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Pressable
                            onPress={() => {
                              const next = !v.is_active;
                              setEditableByDay((prev) => ({ ...prev, [k]: { ...prev[k], is_active: next } }));
                              // حفظ فوري: عند الإيقاف دائماً إن كان له id، وعند التفعيل فقط إذا الأوقات صالحة
                              if (!next) {
                                // إيقاف
                                saveSingleDay(k);
                              } else {
                                // تفعيل: إن كانت الأوقات غير صالحة نعرض تنبيه ولا نرسل
                                if (!v.start_time || !v.end_time || !isValidTime(v.start_time) || !isValidTime(v.end_time)) {
                                  Alert.alert('تنبيه', 'اختر وقتي البدء والانتهاء أولاً ثم فعّل اليوم');
                                } else {
                                  saveSingleDay(k);
                                }
                              }
                            }}
                            className={`px-3 py-2 rounded-full flex-row items-center gap-1 ${v.is_active ? 'bg-success-100' : 'bg-gray-200'}`}
                            style={{
                              backgroundColor: v.is_active ? '#dcfce7' : '#e5e7eb',
                            }}
                          >
                            <Ionicons name={'power'} size={16} color={v.is_active ? '#166534' : '#374151'} />
                            <Text style={{ color: v.is_active ? '#166534' : '#374151' }} className="text-xs font-semibold">
                              {v.is_active ? 'إيقاف اليوم' : 'تفعيل اليوم'}
                            </Text>
                          </Pressable>
                        </View>
                      </View>

                      {/* Working hours */}
                      <View className="p-3 rounded-xl mb-3" style={{ backgroundColor: v.is_active ? '#e6f2f4' : '#f9fafb' }}>
                        <View className="flex-row items-center gap-3">
                          <View className="flex-1">
                            <Text className="text-xs text-gray-600 mb-1">من</Text>
                            <Pressable disabled={editorsDisabled} onPress={() => openTimePicker(k, 'start')} className={`border rounded-xl px-3 py-3 ${editorsDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                              <Text className={editorsDisabled ? 'text-gray-400' : 'text-gray-800'}>{v.start_time ? formatTo12h(v.start_time) : 'اختر الوقت'}</Text>
                            </Pressable>
                          </View>
                          <View className="flex-1">
                            <Text className="text-xs text-gray-600 mb-1">إلى</Text>
                            <Pressable disabled={editorsDisabled} onPress={() => openTimePicker(k, 'end')} className={`border rounded-xl px-3 py-3 ${editorsDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'}`}>
                              <Text className={editorsDisabled ? 'text-gray-400' : 'text-gray-800'}>{v.end_time ? formatTo12h(v.end_time) : 'اختر الوقت'}</Text>
                            </Pressable>
                          </View>
                        </View>
                        <Text className="text-[11px] text-gray-500 mt-2">اختر وقت بصيغة 12 ساعة (ص/م)، يمكن الحفظ حتى لو اليوم غير نشط</Text>
                      </View>

                      {/* Durations */}
                      <View className="flex-row gap-3">
                        <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: v.is_active ? '#dcfce7' : '#f9fafb' }}>
                          <Text className="text-sm font-semibold text-gray-700 mb-2">مدة المعاينة</Text>
                          <TextInput
                            value={v.appointment_duration}
                            onChangeText={(t) => setEditableByDay((prev) => ({ ...prev, [k]: { ...prev[k], appointment_duration: t } }))}
                            placeholder="30"
                            className="bg-white border border-gray-200 rounded-xl px-3 py-2"
                            keyboardType="number-pad"
                          />
                        </View>
                        <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: v.is_active ? '#fef3c7' : '#fef3f2' }}>
                          <Text className="text-sm font-semibold text-gray-700 mb-2">مدة الاستراحة</Text>
                          <TextInput
                            value={v.break_duration}
                            onChangeText={(t) => setEditableByDay((prev) => ({ ...prev, [k]: { ...prev[k], break_duration: t } }))}
                            placeholder="15"
                            className="bg-white border border-gray-200 rounded-xl px-3 py-2"
                            keyboardType="number-pad"
                          />
                        </View>
                      </View>

                      {/* Save single day button */}
                      {/* <Pressable onPress={() => saveSingleDay(k)} disabled={isSaving || editorsDisabled} className={`mt-3 rounded-xl py-3 items-center ${editorsDisabled ? 'bg-gray-100' : 'bg-gray-800/5'}`}>
                        <Text className={editorsDisabled ? 'text-gray-400' : 'text-gray-800'}>حفظ هذا اليوم</Text>
                      </Pressable> */}
                    </View>
                  );
                })}

                {/* Save All */}
                <Pressable
                  onPress={handleSaveAll}
                  disabled={isUpdating}
                  className="bg-primary-600 rounded-xl py-4 items-center shadow-lg mt-2"
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="save-outline" size={20} color="#fff" />
                      <Text className="text-white font-bold text-base">حفظ</Text>
                    </View>
                  )}
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </ScreenLayout>
      {/* Time Picker Modal */}
      <Modal visible={timePicker.visible} transparent animationType="slide" onRequestClose={() => setTimePicker((p) => ({ ...p, visible: false, dayKey: null, target: null }))}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5" style={{ maxHeight: '60%' }}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">اختيار الوقت</Text>
              <Pressable onPress={() => setTimePicker((p) => ({ ...p, visible: false, dayKey: null, target: null }))}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>
            <Text className="text-center text-gray-700 mb-3">الوقت المختار: {`${timePicker.hour}:${timePicker.minute} ${timePicker.am ? 'ص' : 'م'}`}</Text>
            <View className="flex-row items-stretch justify-between">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-2">الساعة</Text>
                <ScrollView style={{ maxHeight: 220 }}>
                  {hours12.map((h) => (
                    <Pressable key={h} onPress={() => setTimePicker((p) => ({ ...p, hour: h }))} className={`px-4 py-2 rounded-lg mb-2 ${timePicker.hour === h ? 'bg-primary-50' : 'bg-white'}`}>
                      <Text className={timePicker.hour === h ? 'text-primary-700 font-semibold' : 'text-gray-800'}>{h}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View className="flex-1 mx-2">
                <Text className="text-xs text-gray-500 mb-2">الدقائق</Text>
                <ScrollView style={{ maxHeight: 220 }}>
                  {minutesList.map((m) => (
                    <Pressable key={m} onPress={() => setTimePicker((p) => ({ ...p, minute: m }))} className={`px-4 py-2 rounded-lg mb-2 ${timePicker.minute === m ? 'bg-primary-50' : 'bg-white'}`}>
                      <Text className={timePicker.minute === m ? 'text-primary-700 font-semibold' : 'text-gray-800'}>{m}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View style={{ width: 96 }}>
                <Text className="text-xs text-gray-500 mb-2">الفترة</Text>
                <View className="gap-2">
                  <Pressable onPress={() => setTimePicker((p) => ({ ...p, am: true }))} className={`px-4 py-3 rounded-lg ${timePicker.am ? 'bg-primary-600' : 'bg-gray-100'}`}>
                    <Text className={timePicker.am ? 'text-white font-semibold text-center' : 'text-gray-800 text-center'}>ص</Text>
                  </Pressable>
                  <Pressable onPress={() => setTimePicker((p) => ({ ...p, am: false }))} className={`px-4 py-3 rounded-lg ${!timePicker.am ? 'bg-primary-600' : 'bg-gray-100'}`}>
                    <Text className={!timePicker.am ? 'text-white font-semibold text-center' : 'text-gray-800 text-center'}>م</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable onPress={confirmTimePicker} className="mt-4 bg-primary-600 rounded-xl py-3 items-center">
              <Text className="text-white font-semibold">تأكيد</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

