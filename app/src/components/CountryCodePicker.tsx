import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { countries, Country, defaultCountry } from '../data/countries';

type CountryCodePickerProps = {
  selectedCountry?: Country;
  onSelect: (country: Country) => void;
};

/**
 * مكون اختيار رمز الدولة
 * يعرض قائمة الدول مع رموز النداء
 */
export const CountryCodePicker = ({
  selectedCountry = defaultCountry,
  onSelect,
}: CountryCodePickerProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 items-center justify-center active:bg-gray-50"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          width: '100%',
        }}
      >
        <View className="flex-row items-center justify-between" style={{ width: '100%' }}>
          <View className="flex-row items-center">
            <Text className="text-gray-900 font-bold text-base mr-2">
              {selectedCountry.flag}
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {selectedCountry.dialCode}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </View>
      </Pressable>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">اختر الدولة</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = selectedCountry.code === item.code;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item);
                      setShowModal(false);
                    }}
                    className={`px-5 py-4 border-b border-gray-100 flex-row items-center justify-between ${
                      isSelected ? 'bg-primary-50' : 'bg-white'
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="text-2xl mr-3">{item.flag}</Text>
                      <View className="flex-1">
                        <Text className={`text-base ${isSelected ? 'text-primary-600 font-bold' : 'text-gray-900 font-medium'}`}>
                          {item.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">{item.dialCode}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#0c6980" />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="px-5 py-8 items-center">
                  <Text className="text-gray-500">لا توجد دول متاحة</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

