import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useGetCategoriesQuery, useGetProductAreasQuery } from '../../services/api';

type DoctorSearchFilterProps = {
  searchText: string;
  selectedCategory: string | null;
  selectedArea: string | null;
  onSearchChange: (text: string) => void;
  onCategorySelect: (categoryId: string | null) => void;
  onAreaSelect: (area: string | null) => void;
};

/**
 * مكون البحث والفلترة عن الأطباء
 * يحتوي على:
 * - بحث بالاسم
 * - فلترة حسب التخصص (Select)
 * - فلترة حسب المنطقة (Select)
 */
export const DoctorSearchFilter = ({
  searchText,
  selectedCategory,
  selectedArea,
  onSearchChange,
  onCategorySelect,
  onAreaSelect,
}: DoctorSearchFilterProps) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // جلب التصنيفات والمناطق من API
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();
  const { data: areasData, isLoading: areasLoading, isError: areasError } = useGetProductAreasQuery();

  // معالجة بيانات التصنيفات
  let categoryList: any[] = [];
  if (categoriesData) {
    // إذا كانت البيانات على شكل { categories: [...] }
    if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
      categoryList = categoriesData.categories.map((cat: any, index: number) => {
        if (typeof cat === 'string') {
          return { id: String(index + 1), name: cat, original: cat };
        }
        return { 
          id: String(cat.id || index + 1), 
          name: cat.name || cat,
          original: cat 
        };
      });
    }
    // إذا كانت البيانات array مباشرة
    else if (Array.isArray(categoriesData)) {
      categoryList = categoriesData.map((cat: any, index: number) => {
        if (typeof cat === 'string') {
          return { id: String(index + 1), name: cat, original: cat };
        }
        return { 
          id: String(cat.id || index + 1), 
          name: cat.name || cat,
          original: cat 
        };
      });
    }
    // إذا كانت البيانات على شكل { data: [...] }
    else if (categoriesData.data && Array.isArray(categoriesData.data)) {
      categoryList = categoriesData.data.map((cat: any, index: number) => {
        if (typeof cat === 'string') {
          return { id: String(index + 1), name: cat, original: cat };
        }
        return { 
          id: String(cat.id || index + 1), 
          name: cat.name || cat,
          original: cat 
        };
      });
    }
  }
  
  // طباعة للتشخيص
  if (__DEV__ && categoryList.length > 0) {
    console.log('📋 قائمة التصنيفات:', categoryList.slice(0, 3));
  }

  // معالجة بيانات المناطق
  let areaList: any[] = [];
  if (areasData) {
    // إذا كانت البيانات على شكل { areas: [...] }
    if (areasData.areas && Array.isArray(areasData.areas)) {
      areaList = areasData.areas.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
    // إذا كانت البيانات array مباشرة
    else if (Array.isArray(areasData)) {
      areaList = areasData.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
    // إذا كانت البيانات على شكل { data: [...] }
    else if (areasData.data && Array.isArray(areasData.data)) {
      areaList = areasData.data.map((area: any) => {
        if (typeof area === 'string') {
          return area;
        }
        return area.name || area || String(area);
      });
    }
  }
  
  // طباعة للتشخيص
  if (__DEV__ && areaList.length > 0) {
    console.log('📍 قائمة المناطق:', areaList.slice(0, 3));
  }

  // العثور على التصنيف المحدد
  const selectedCategoryObj = categoryList.find((cat: any) => {
    const catId = cat.id || cat;
    const catName = cat.name || cat;
    return String(catId) === selectedCategory || catName === selectedCategory;
  });
  const selectedCategoryName = selectedCategoryObj?.name || selectedCategoryObj || 'اختر التخصص';

  // العثور على المنطقة المحددة
  const selectedAreaObj = areaList.find((area: any) => 
    String(area) === selectedArea || area === selectedArea
  );
  const selectedAreaName = selectedAreaObj || selectedArea || 'اختر المنطقة';

  const handleCategorySelect = (category: any) => {
    if (!category) {
      onCategorySelect(null);
    } else {
      // نحفظ الاسم دائماً لأنه الأكثر موثوقية للفلترة
      let selectedValue: string;
      if (typeof category === 'string') {
        selectedValue = category.trim();
      } else {
        // نعطي الأولوية للاسم لأنه يعمل مع جميع أنواع البيانات
        selectedValue = (category.name || category).toString().trim();
      }
      
      if (__DEV__) {
        console.log('✅ تم اختيار التصنيف:', {
          selectedValue,
          categoryObject: category,
          categoryName: category?.name,
          categoryId: category?.id,
        });
      }
      
      onCategorySelect(selectedValue);
    }
    setShowCategoryModal(false);
  };

  const handleAreaSelect = (area: string | null) => {
    // استخراج قيمة المنطقة - معالجة جميع الحالات
    let areaValue: string | null = null;
    
    if (area === null || area === undefined) {
      areaValue = null;
    } else if (typeof area === 'string') {
      areaValue = area.trim();
    } else if (typeof area === 'object' && area !== null) {
      // إذا كانت المنطقة كائن
      areaValue = (area.name || area.value || String(area)).trim();
    } else {
      areaValue = String(area).trim();
    }
    
    // التأكد من أن القيمة ليست فارغة
    if (areaValue === '' || areaValue === 'null' || areaValue === 'undefined') {
      areaValue = null;
    }
    
    if (__DEV__) {
      console.log('✅ تم اختيار المنطقة:', {
        originalArea: area,
        extractedValue: areaValue,
        type: typeof area,
      });
    }
    
    onAreaSelect(areaValue);
    setShowAreaModal(false);
  };

  return (
    <View className="bg-white px-4 py-4 border-b border-gray-200">
      {/* شريط البحث */}
      <View className="mb-4">
        <View 
          className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 border border-gray-200"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Ionicons name="search" size={20} color="#0c6980" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="ابحث عن طبيب..."
            value={searchText}
            onChangeText={onSearchChange}
            className="flex-1 text-gray-900 text-base"
            placeholderTextColor="#9CA3AF"
            style={{
              fontFamily: 'Cairo_400Regular',
            }}
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => onSearchChange('')}
              className="ml-2 w-7 h-7 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Ionicons name="close-circle" size={18} color="#6b7280" />
            </Pressable>
          )}
        </View>
      </View>

      {/* الفلاتر */}
      <View className="flex-row gap-3 flex-col">
        {/* فلترة حسب التخصص */}
        <View className="flex-1">
          <Pressable
            onPress={() => setShowCategoryModal(true)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex-row items-center justify-between active:bg-gray-50"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-1">
              <Text 
                className="text-xs text-gray-500 mb-1 font-medium"
                style={{ fontFamily: 'Cairo_500Medium' }}
              >
                التخصص
              </Text>
              <Text 
                className="text-gray-900 font-semibold text-sm" 
                numberOfLines={1}
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {selectedCategoryName}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#0c6980" style={{ marginRight: 8 }} />
          </Pressable>

          <Modal
            visible={showCategoryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <TouchableOpacity
              className="flex-1 bg-black/50 justify-end"
              activeOpacity={1}
              onPress={() => setShowCategoryModal(false)}
            >
              <View className="bg-white rounded-t-3xl max-h-[70%]">
                <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
                  <Text 
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    اختر التخصص
                  </Text>
                  <Pressable onPress={() => setShowCategoryModal(false)}>
                    <Text 
                      className="text-blue-600 text-base"
                      style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                      إلغاء
                    </Text>
                  </Pressable>
                </View>
                <FlatList
                  data={categoryList}
                  keyExtractor={(item: any) => String(item.id || item)}
                  renderItem={({ item }: { item: any }) => {
                    const itemId = item.id || item;
                    const itemName = item.name || item;
                    const isSelected = String(itemId) === selectedCategory || itemName === selectedCategory;
                    return (
                      <TouchableOpacity
                        onPress={() => handleCategorySelect(item)}
                        className={`px-4 py-4 border-b border-gray-100 ${
                          isSelected ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <Text 
                          className={`text-base ${
                            isSelected ? 'text-blue-600 font-semibold' : 'text-gray-800'
                          }`}
                          style={{ fontFamily: isSelected ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                        >
                          {itemName}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  ListHeaderComponent={
                    <TouchableOpacity
                      onPress={() => handleCategorySelect(null)}
                      className={`px-4 py-4 border-b border-gray-200 ${
                        !selectedCategory ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <Text 
                        className={`text-base ${
                          !selectedCategory ? 'text-blue-600 font-semibold' : 'text-gray-800'
                        }`}
                        style={{ fontFamily: !selectedCategory ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                      >
                        الكل
                      </Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <View className="px-4 py-8 items-center">
                      <Text 
                        className="text-gray-500"
                        style={{ fontFamily: 'Cairo_400Regular' }}
                      >
                        لا توجد تصنيفات متاحة
                      </Text>
                    </View>
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* فلترة حسب المنطقة */}
        <View className="flex-1">
          <Pressable
            onPress={() => setShowAreaModal(true)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex-row items-center justify-between active:bg-gray-50"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-1">
              <Text 
                className="text-xs text-gray-500 mb-1 font-medium"
                style={{ fontFamily: 'Cairo_500Medium' }}
              >
                المنطقة
              </Text>
              <Text 
                className="text-gray-900 font-semibold text-sm" 
                numberOfLines={1}
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {selectedAreaName}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#0c6980" style={{ marginRight: 8 }} />
          </Pressable>

          <Modal
            visible={showAreaModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowAreaModal(false)}
          >
            <TouchableOpacity
              className="flex-1 bg-black/50 justify-end"
              activeOpacity={1}
              onPress={() => setShowAreaModal(false)}
            >
              <View className="bg-white rounded-t-3xl max-h-[70%]">
                <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
                  <Text 
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    اختر المنطقة
                  </Text>
                  <Pressable onPress={() => setShowAreaModal(false)}>
                    <Text 
                      className="text-blue-600 text-base"
                      style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                      إلغاء
                    </Text>
                  </Pressable>
                </View>
                <FlatList
                  data={areaList}
                  keyExtractor={(item: any, index: number) => String(item || index)}
                  renderItem={({ item }: { item: any }) => {
                    const areaValue = typeof item === 'string' ? item : (item.name || item);
                    return (
                      <TouchableOpacity
                        onPress={() => handleAreaSelect(areaValue)}
                        className={`px-4 py-4 border-b border-gray-100 ${
                          String(areaValue) === String(selectedArea) ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <Text 
                          className={`text-base ${
                            String(areaValue) === String(selectedArea) ? 'text-blue-600 font-semibold' : 'text-gray-800'
                          }`}
                          style={{ fontFamily: String(areaValue) === String(selectedArea) ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                        >
                          {areaValue}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  ListHeaderComponent={
                    <TouchableOpacity
                      onPress={() => handleAreaSelect(null)}
                      className={`px-4 py-4 border-b border-gray-200 ${
                        !selectedArea ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <Text 
                        className={`text-base ${
                          !selectedArea ? 'text-blue-600 font-semibold' : 'text-gray-800'
                        }`}
                        style={{ fontFamily: !selectedArea ? 'Cairo_700Bold' : 'Cairo_400Regular' }}
                      >
                        الكل
                      </Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <View className="px-4 py-8 items-center">
                      <Text 
                        className="text-gray-500"
                        style={{ fontFamily: 'Cairo_400Regular' }}
                      >
                        لا توجد مناطق متاحة
                      </Text>
                    </View>
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>

      {/* إظهار الفلاتر النشطة */}
      {(selectedCategory || selectedArea) && (
        <View className="flex-row gap-2 mt-3">
          {selectedCategory && (
            <Pressable
              onPress={() => onCategorySelect(null)}
              className="bg-blue-100 px-3 py-1.5 rounded-lg flex-row items-center"
            >
              <Text 
                className="text-blue-700 text-xs mr-1"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {selectedCategoryName}
              </Text>
              <Text 
                className="text-blue-700 text-xs"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                ✕
              </Text>
            </Pressable>
          )}
          {selectedArea && (
            <Pressable
              onPress={() => onAreaSelect(null)}
              className="bg-blue-100 px-3 py-1.5 rounded-lg flex-row items-center"
            >
              <Text 
                className="text-blue-700 text-xs mr-1"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {selectedAreaName}
              </Text>
              <Text 
                className="text-blue-700 text-xs"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                ✕
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

