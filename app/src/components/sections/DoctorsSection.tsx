import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DoctorCard } from '../DoctorCard';
import { DoctorCardSkeleton } from '../DoctorCardSkeleton';

type Doctor = {
  id?: string | number;
  name?: string;
  title?: string;
  specialty?: string;
  category?: { name?: string };
  avatar?: string;
  image?: string;
  rating?: number;
  location?: string;
  area?: string;
  price?: number | string;
  visit_price?: number | string;
  available?: boolean;
  [key: string]: any;
};

type DoctorsSectionProps = {
  doctors: Doctor[];
  isLoading?: boolean;
  error?: any;
  onDoctorPress?: (doctor: Doctor) => void;
  title?: string;
  showTitle?: boolean;
};

/**
 * مكون قسم عرض الأطباء
 * يعرض قائمة من بطاقات الأطباء بتصميم أنيق
 */
export const DoctorsSection = ({
  doctors = [],
  isLoading = false,
  error = null,
  onDoctorPress,
  title = 'الأطباء المتاحون',
  showTitle = true,
}: DoctorsSectionProps) => {
  if (isLoading) {
    return (
      <View className="px-4">
        {showTitle && (
          <View className="my-10">
            <Text className="text-2xl font-bold text-gray-900 font-sans" style={{ fontFamily: 'Cairo_700Bold', textAlign: 'right' }}>{title}</Text>
            <View className="h-1 w-16 bg-primary-600 rounded-full mt-2" />
          </View>
        )}
        <View className="gap-4">
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-4 py-8 items-center">
        <Ionicons name="alert-circle" size={48} color="#dc2626" style={{ marginBottom: 8 }} />
        <Text 
          className="text-gray-700 text-center font-sans"
          style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
        >
          تعذّر جلب قائمة الأطباء
        </Text>
        <Text 
          className="text-gray-500 text-sm mt-1 font-sans"
          style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
        >
          يرجى المحاولة مرة أخرى
        </Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View className="px-4 py-8 items-center">
        <Ionicons name="medical" size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Text 
          className="text-gray-700 text-lg font-sans"
          style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
        >
          لا يوجد أطباء متاحون حالياً
        </Text>
        <Text 
          className="text-gray-500 text-sm mt-1 font-sans"
          style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
        >
          يرجى المحاولة لاحقاً
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4 my-10">
      {showTitle && (
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text 
              className="text-2xl font-bold text-gray-900 font-sans"
              style={{ fontFamily: 'Cairo_700Bold', textAlign: 'right' }}
            >
              {title}
            </Text>
            <View className="bg-primary-100 px-3 py-1.5 rounded-full">
              <Text 
                className="text-primary-700 text-sm font-semibold font-sans"
                style={{ fontFamily: 'Cairo_600SemiBold', textAlign: 'center' }}
              >
                {doctors.length} طبيب
              </Text>
            </View>
          </View>
          <View className="h-1.5 w-20 rounded-full" style={{ backgroundColor: '#0c6980' }} />
        </View>
      )}
      
      <FlatList
        data={doctors}
        keyExtractor={(item: Doctor, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() => onDoctorPress?.(item)}
          />
        )}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View className="h-0" />}
      />
    </View>
  );
};

