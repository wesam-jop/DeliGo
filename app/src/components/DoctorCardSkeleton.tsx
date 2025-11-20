import React from 'react';
import { View } from 'react-native';

export const DoctorCardSkeleton = () => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
      <View className="flex-row">
        <View className="w-16 h-16 rounded-xl mr-3 bg-gray-200 animate-pulse" />
        <View className="flex-1">
          <View className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
          <View className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
          <View className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <View className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        <View className="flex-row gap-2">
          <View className="h-9 w-16 bg-gray-200 rounded-xl animate-pulse" />
          <View className="h-9 w-20 bg-gray-200 rounded-xl animate-pulse" />
        </View>
      </View>
    </View>
  );
};












