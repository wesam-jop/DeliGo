import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDoctorMeQuery, useGetDoctorNotificationsQuery, useMarkNotificationReadMutation } from '../services/api';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { Ionicons } from '@expo/vector-icons';

export const DoctorNotificationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch doctor data
  const { data: doctorData } = useDoctorMeQuery();
  const doctor = doctorData?.doctor || doctorData?.data;
  const doctorId = doctor?.id;

  // Fetch notifications
  const { data: notificationsData, isLoading, refetch } = useGetDoctorNotificationsQuery(doctorId || 0, {
    skip: !doctorId,
  });
  const notifications = (notificationsData?.notifications || notificationsData?.data || []) as any[];
  const unreadCount = notificationsData?.unread_count ?? notifications.filter((n: any) => !n.read).length;

  const [markAsRead] = useMarkNotificationReadMutation();
  
  // تحديث البيانات تلقائياً عند فتح الشاشة
  useFocusEffect(
    React.useCallback(() => {
      if (doctorId) {
        refetch();
      }
    }, [doctorId, refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string | number) => {
    try {
      await markAsRead({ doctorId, notificationId }).unwrap();
      refetch();
    } catch (error) {
      console.error('خطأ في تحديد الإشعار كمقروء:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      appointment: 'calendar-outline',
      new_appointment: 'calendar-outline',
      appointment_confirmed: 'checkmark-circle-outline',
      payment: 'cash-outline',
      system: 'settings-outline',
      alert: 'alert-circle-outline',
      info: 'information-circle-outline',
    };
    return (icons[type] as any) || ('notifications-outline' as any);
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      appointment: '#0c6980',
      new_appointment: '#0c6980',
      appointment_confirmed: '#22c55e',
      payment: '#22c55e',
      system: '#6366f1',
      alert: '#ef4444',
      info: '#3b82f6',
    };
    return colors[type] || '#6b7280';
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      let hh = d.getHours();
      const mm = String(d.getMinutes()).padStart(2, '0');
      const am = hh < 12;
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      return `${y}-${m}-${day} ${h12}:${mm} ${am ? 'ص' : 'م'}`;
    } catch {
      return value;
    }
  };

  return (
    <Container>
      <ScreenLayout
        title="الإشعارات"
        showHeader={true}
        scrollable={true}
        showHomeButton={true}
        onHomePress={() => {
          navigation.navigate('Home');
        }}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header Stats */}
          {unreadCount > 0 && (
            <View className="bg-primary-600 px-4 py-3 mx-4 mt-4 rounded-xl">
              <View className="flex-row items-center gap-2">
                <Ionicons name="mail-unread-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold">
                  لديك {unreadCount} إشعار غير مقروء
                </Text>
              </View>
            </View>
          )}

          {/* Notifications List */}
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
                <Text className="text-gray-600 mt-4">جاري تحميل الإشعارات...</Text>
              </View>
            ) : notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <Pressable
                  key={notification.id}
                  onPress={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  className={`bg-white rounded-2xl p-5 mb-3 border-l-4 ${
                    !notification.read ? 'border-primary-600' : 'border-transparent'
                  } shadow-sm`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-start gap-3">
                    {/* Icon */}
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: `${getNotificationColor(notification.type)}20`,
                      }}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={24}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="text-base font-bold text-gray-900 flex-1">
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View className="w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                      </View>
                      <Text className="text-sm text-gray-600 mb-2 leading-5">
                        {notification.message}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={14} color="#9ca3af" />
                        <Text className="text-xs text-gray-500">
                          {formatDateTime(notification.created_at || notification.date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View className="items-center justify-center py-12">
                <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
                <Text className="text-gray-600 text-center mt-4 text-lg font-semibold">
                  لا توجد إشعارات حالياً
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  سيظهر هنا جميع الإشعارات عند توفرها
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScreenLayout>
    </Container>
  );
};

