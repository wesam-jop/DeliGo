import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * أدوات التخزين المحلي
 * لتخزين البيانات لعرضها عند انقطاع الإنترنت
 */

const STORAGE_KEYS = {
  DOCTORS: '@miaad:doctors',
  APPOINTMENTS: '@miaad:appointments',
  LAST_SYNC_DOCTORS: '@miaad:last_sync_doctors',
  LAST_SYNC_APPOINTMENTS: '@miaad:last_sync_appointments',
};

/**
 * حفظ قائمة الأطباء محلياً
 */
export const saveDoctorsLocally = async (doctors: any[]): Promise<void> => {
  try {
    const data = {
      doctors,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(data));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_DOCTORS, new Date().toISOString());
    if (__DEV__) {
      console.log('✅ تم حفظ الأطباء محلياً:', doctors.length);
    }
  } catch (error) {
    console.error('❌ خطأ في حفظ الأطباء محلياً:', error);
  }
};

/**
 * استرجاع قائمة الأطباء المحلية
 */
export const getDoctorsLocally = async (): Promise<any[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DOCTORS);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.doctors && Array.isArray(parsed.doctors)) {
        if (__DEV__) {
          console.log('✅ تم استرجاع الأطباء من التخزين المحلي:', parsed.doctors.length);
        }
        return parsed.doctors;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ خطأ في استرجاع الأطباء المحلية:', error);
    return null;
  }
};

/**
 * حفظ المواعيد محلياً
 */
export const saveAppointmentsLocally = async (doctorId: number | string, appointments: any[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.APPOINTMENTS}:${doctorId}`;
    const data = {
      appointments,
      doctorId: String(doctorId),
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    await AsyncStorage.setItem(`${STORAGE_KEYS.LAST_SYNC_APPOINTMENTS}:${doctorId}`, new Date().toISOString());
    if (__DEV__) {
      console.log('✅ تم حفظ المواعيد محلياً:', appointments.length);
    }
  } catch (error) {
    console.error('❌ خطأ في حفظ المواعيد محلياً:', error);
  }
};

/**
 * استرجاع المواعيد المحلية
 */
export const getAppointmentsLocally = async (doctorId: number | string): Promise<any[] | null> => {
  try {
    const key = `${STORAGE_KEYS.APPOINTMENTS}:${doctorId}`;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.appointments && Array.isArray(parsed.appointments)) {
        if (__DEV__) {
          console.log('✅ تم استرجاع المواعيد من التخزين المحلي:', parsed.appointments.length);
        }
        return parsed.appointments;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ خطأ في استرجاع المواعيد المحلية:', error);
    return null;
  }
};

/**
 * التحقق من آخر وقت تحديث
 */
export const getLastSyncTime = async (type: 'doctors' | 'appointments', doctorId?: number | string): Promise<string | null> => {
  try {
    const key = type === 'doctors' 
      ? STORAGE_KEYS.LAST_SYNC_DOCTORS
      : `${STORAGE_KEYS.LAST_SYNC_APPOINTMENTS}:${doctorId}`;
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('❌ خطأ في استرجاع وقت آخر تحديث:', error);
    return null;
  }
};

/**
 * مسح البيانات المحلية
 */
export const clearLocalData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.DOCTORS,
      STORAGE_KEYS.LAST_SYNC_DOCTORS,
    ]);
    // مسح جميع مفاتيح المواعيد
    const keys = await AsyncStorage.getAllKeys();
    const appointmentKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.APPOINTMENTS));
    const syncKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.LAST_SYNC_APPOINTMENTS));
    await AsyncStorage.multiRemove([...appointmentKeys, ...syncKeys]);
    if (__DEV__) {
      console.log('✅ تم مسح البيانات المحلية');
    }
  } catch (error) {
    console.error('❌ خطأ في مسح البيانات المحلية:', error);
  }
};

