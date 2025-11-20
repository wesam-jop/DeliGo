import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DoctorDashboardScreen } from '../screens/DoctorDashboardScreen';
import { DoctorAppointmentsScreen } from '../screens/DoctorAppointmentsScreen';
import { DoctorScheduleScreen } from '../screens/DoctorScheduleScreen';
import { DoctorNotificationsScreen } from '../screens/DoctorNotificationsScreen';
import { DoctorSubscriptionScreen } from '../screens/DoctorSubscriptionScreen';
import { DoctorProfileScreen } from '../screens/DoctorProfileScreen';

export type DoctorTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Schedule: undefined;
  Notifications: undefined;
  Subscription: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DoctorTabParamList>();

export const DoctorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0c6980',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          direction: 'rtl',
        },
        tabBarLabelStyle: {
          fontFamily: 'Cairo_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DoctorDashboardScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={DoctorAppointmentsScreen}
        options={{
          tabBarLabel: 'المواعيد',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={DoctorScheduleScreen}
        options={{
          tabBarLabel: 'الجدول',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={DoctorNotificationsScreen}
        options={{
          tabBarLabel: 'الإشعارات',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarBadge: undefined, // سيتم إضافة badge لاحقاً
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={DoctorSubscriptionScreen}
        options={{
          tabBarLabel: 'الاشتراك',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DoctorProfileScreen}
        options={{
          tabBarLabel: 'الملف',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

