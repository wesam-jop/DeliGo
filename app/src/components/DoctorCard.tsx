import React, { useState, useMemo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useGetCategoriesQuery } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type DoctorCardProps = {
  doctor: any;
  onPress?: () => void;
};

export const DoctorCard = ({ doctor, onPress }: DoctorCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [imageError, setImageError] = useState(false);
  
  // جلب قائمة التصنيفات
  const { data: categoriesData } = useGetCategoriesQuery();

  // معالجة بيانات التصنيفات
  const categoryList = useMemo(() => {
    let list: any[] = [];
    if (categoriesData) {
      if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
        list = categoriesData.categories.map((cat: string, index: number) => ({ id: index + 1, name: cat }));
      } else if (Array.isArray(categoriesData)) {
        list = categoriesData.map((cat: any, index: number) => {
          if (typeof cat === 'string') {
            return { id: index + 1, name: cat };
          }
          return { id: cat.id || index + 1, name: cat.name || cat };
        });
      } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
        list = categoriesData.data.map((cat: any, index: number) => {
          if (typeof cat === 'string') {
            return { id: index + 1, name: cat };
          }
          return { id: cat.id || index + 1, name: cat.name || cat };
        });
      }
    }
    return list;
  }, [categoriesData]);

  // معالجة بيانات الطبيب - البحث عن الاسم في عدة حقول محتملة
  const name = useMemo(() => {
    if (doctor?.name && typeof doctor.name === 'string' && doctor.name.trim()) {
      return doctor.name.trim();
    }
    if (doctor?.title && typeof doctor.title === 'string' && doctor.title.trim()) {
      return doctor.title.trim();
    }
    if (doctor?.full_name && typeof doctor.full_name === 'string' && doctor.full_name.trim()) {
      return doctor.full_name.trim();
    }
    if (doctor?.doctor_name && typeof doctor.doctor_name === 'string' && doctor.doctor_name.trim()) {
      return doctor.doctor_name.trim();
    }
    // البحث في جميع الحقول التي تحتوي على "name" في المفتاح
    if (doctor && typeof doctor === 'object') {
      const nameKeys = Object.keys(doctor).filter(key => 
        key.toLowerCase().includes('name') && 
        typeof doctor[key] === 'string' && 
        doctor[key]?.trim()
      );
      if (nameKeys.length > 0) {
        return doctor[nameKeys[0]].trim();
      }
    }
    return 'طبيب';
  }, [doctor]);
  
  // جلب اسم التخصص بطرق متعددة
  const specialty = useMemo(() => {
    // محاولة 1: مباشرة من specialty
    if (doctor?.specialty && typeof doctor.specialty === 'string') {
      return doctor.specialty;
    }
    
    // محاولة 2: من category.name
    if (doctor?.category?.name && typeof doctor.category.name === 'string') {
      return doctor.category.name;
    }
    
    // محاولة 3: من category إذا كان string مباشرة
    if (doctor?.category && typeof doctor.category === 'string') {
      return doctor.category;
    }
    
    // محاولة 4: البحث في قائمة التصنيفات باستخدام category_id
    if (doctor?.category_id || doctor?.category?.id) {
      const categoryId = doctor.category_id || doctor.category?.id;
      const foundCategory = categoryList.find(
        (cat: any) => String(cat.id) === String(categoryId)
      );
      if (foundCategory?.name) {
        return foundCategory.name;
      }
    }
    
    // محاولة 5: البحث في قائمة التصنيفات باستخدام category name إذا كان موجود
    if (doctor?.category) {
      const foundCategory = categoryList.find(
        (cat: any) => cat.name === doctor.category || (cat.id && String(cat.id) === String(doctor.category))
      );
      if (foundCategory?.name) {
        return foundCategory.name;
      }
    }
    
    return 'تخصص';
  }, [doctor, categoryList]);
  
  // جلب رابط الصورة بطرق متعددة
  const avatar = useMemo(() => {
    // دالة لمعالجة المسار (إذا كان نسبي، نضيف base URL)
    const processImageUrl = (url: string): string => {
      if (!url || typeof url !== 'string') {
        return '';
      }
      
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        return '';
      }
      
      // إذا كان الرابط كامل (يبدأ بـ http:// أو https://)
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
      }
      
      // الحصول على base URL (بدون /api لأن الصور في /storage/ وليس في /api/)
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
      // إزالة /api من النهاية إذا كانت موجودة
      let baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
      
      // التأكد من أن baseUrl لا ينتهي بـ /
      baseUrl = baseUrl.replace(/\/$/, '');
      
      // التحقق من أن المسار يحتوي على /storage/ وإضافته إذا كان مفقوداً
      let finalPath = trimmedUrl;
      
      // إذا كان المسار يبدأ بـ /storage/ بالفعل، استخدمه مباشرة
      if (finalPath.startsWith('/storage/')) {
        return `${baseUrl}${finalPath}`;
      }
      
      // إذا كان المسار يبدأ بـ / لكن ليس /storage/
      if (finalPath.startsWith('/')) {
        // إزالة / من البداية
        const pathWithoutSlash = finalPath.substring(1);
        // إضافة /storage/ قبل المسار
        finalPath = `/storage/${pathWithoutSlash}`;
      } else {
        // إذا كان المسار لا يبدأ بـ /، أضف /storage/ قبل المسار
        finalPath = `/storage/${finalPath}`;
      }
      
      return `${baseUrl}${finalPath}`;
    };
    
    // محاولة 1: من profile_image_url (رابط كامل جاهز من API - الأولوية الأولى)
    if (doctor?.profile_image_url && typeof doctor.profile_image_url === 'string') {
      const processed = processImageUrl(doctor.profile_image_url);
      if (processed) return processed;
    }
    
    // محاولة 2: من avatar_url (رابط كامل)
    if (doctor?.avatar_url && typeof doctor.avatar_url === 'string') {
      const processed = processImageUrl(doctor.avatar_url);
      if (processed) return processed;
    }
    
    // محاولة 3: من image_url (رابط كامل)
    if (doctor?.image_url && typeof doctor.image_url === 'string') {
      const processed = processImageUrl(doctor.image_url);
      if (processed) return processed;
    }
    
    // محاولة 4: من profile_image (مسار نسبي - يحتاج إضافة /storage/)
    if (doctor?.profile_image && typeof doctor.profile_image === 'string') {
      const processed = processImageUrl(doctor.profile_image);
      if (processed) return processed;
    }
    
    // محاولة 5: من avatar مباشرة
    if (doctor?.avatar && typeof doctor.avatar === 'string') {
      const processed = processImageUrl(doctor.avatar);
      if (processed) return processed;
    }
    
    // محاولة 6: من image
    if (doctor?.image && typeof doctor.image === 'string') {
      const processed = processImageUrl(doctor.image);
      if (processed) return processed;
    }
    
    // محاولة 7: من photo
    if (doctor?.photo && typeof doctor.photo === 'string') {
      const processed = processImageUrl(doctor.photo);
      if (processed) return processed;
    }
    
    // محاولة 8: البحث في جميع الحقول تلقائياً
    if (doctor && typeof doctor === 'object') {
      const imageKeys = Object.keys(doctor).filter(key => 
        (key.toLowerCase().includes('image') || 
         key.toLowerCase().includes('avatar') || 
         key.toLowerCase().includes('photo') ||
         key.toLowerCase().includes('picture') ||
         key.toLowerCase().includes('img')) &&
        typeof doctor[key] === 'string' &&
        doctor[key]?.trim()
      );
      
      for (const key of imageKeys) {
        const processed = processImageUrl(doctor[key]);
        if (processed) return processed;
      }
    }
    
    return null;
  }, [doctor]);
  
  // استخراج المنطقة بطرق متعددة - نفس منطق HomeScreen
  const location = useMemo(() => {
    let area = '';
    
    // محاولة 1: استخراج المنطقة من doctor.area (string)
    if (doctor?.area) {
      if (typeof doctor.area === 'string' && doctor.area.trim()) {
        area = doctor.area.trim();
      } else if (typeof doctor.area === 'object' && doctor.area.name) {
        area = String(doctor.area.name).trim();
      } else if (typeof doctor.area === 'object') {
        // محاولة استخراج أول قيمة string من الكائن
        const firstValue = Object.values(doctor.area).find((v: any) => typeof v === 'string' && v.trim());
        if (firstValue) {
          area = String(firstValue).trim();
        }
      }
    }
    
    // محاولة 2: استخراج المنطقة من doctor.location (string)
    if (!area && doctor?.location) {
      if (typeof doctor.location === 'string' && doctor.location.trim()) {
        area = doctor.location.trim();
      } else if (typeof doctor.location === 'object' && doctor.location.name) {
        area = String(doctor.location.name).trim();
      }
    }
    
    // محاولة 3: البحث في حقول أخرى محتملة
    if (!area) {
      const areaFields = ['doctor_area', 'area_name', 'region', 'city', 'district'];
      for (const field of areaFields) {
        if (doctor?.[field]) {
          if (typeof doctor[field] === 'string' && doctor[field].trim()) {
            area = doctor[field].trim();
            break;
          } else if (typeof doctor[field] === 'object' && doctor[field].name) {
            area = String(doctor[field].name).trim();
            break;
          }
        }
      }
    }
    
    return area;
  }, [doctor]);
  
  // استخراج الوصف بطرق متعددة
  const description = useMemo(() => {
    // محاولة 1: من description مباشرة
    if (doctor?.description && typeof doctor.description === 'string' && doctor.description.trim()) {
      return doctor.description.trim();
    }
    
    // محاولة 2: من doctor_description
    if (doctor?.doctor_description && typeof doctor.doctor_description === 'string' && doctor.doctor_description.trim()) {
      return doctor.doctor_description.trim();
    }
    
    // محاولة 3: من bio
    if (doctor?.bio && typeof doctor.bio === 'string' && doctor.bio.trim()) {
      return doctor.bio.trim();
    }
    
    // محاولة 4: من about
    if (doctor?.about && typeof doctor.about === 'string' && doctor.about.trim()) {
      return doctor.about.trim();
    }
    
    return null;
  }, [doctor]);
  
  const isAvailable = doctor?.available ?? true;

  const handleBookPress = (e: any) => {
    e?.stopPropagation?.();
    navigation.navigate('Booking', { doctor });
  };

  // لون الأساسي للتصميم
  const primaryColor = '#0c6980';

  return (
    <Pressable 
      onPress={onPress}
      className="bg-white rounded-3xl p-5 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* القسم العلوي: علامة الموقع */}
      <View className="flex-row items-center justify-between mb-6">
        {/* يمكن إضافة الشعار هنا لاحقاً */}
        <View className="flex-1" />
        
        {/* علامة الموقع */}
        {location && (
          <View 
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          >
            <Ionicons name="location" size={14} color="#fff" style={{ marginRight: 4 }} />
            <Text 
              className="text-white text-xs font-bold font-sans"
              style={{ fontFamily: 'Cairo_700Bold', textAlign: 'right' }}
            >
              {location}
            </Text>
          </View>
        )}
      </View>

      {/* القسم الأوسط: معلومات الطبيب */}
      <View className="items-center mb-6">
        {/* صورة الطبيب */}
        <View className="mb-4">
          {avatar && !imageError ? (
            <Image 
              source={{ uri: avatar }} 
              className="w-24 h-24 rounded-full"
              style={{ 
                borderWidth: 3, 
                borderColor: primaryColor,
                backgroundColor: '#e6f2f4',
              }}
              resizeMode="cover"
              onError={() => {
                setImageError(true);
              }}
              onLoadStart={() => {
                setImageError(false);
              }}
              onLoad={() => {
                // تم تحميل الصورة بنجاح
              }}
            />
          ) : (
            <View 
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: '#e6f2f4',
                borderWidth: 3, 
                borderColor: primaryColor,
              }}
            >
              <Ionicons name="person" size={48} color={primaryColor} />
            </View>
          )}
        </View>
        
        {/* اسم الطبيب */}
        <Text 
          className="text-gray-900 font-bold text-2xl font-sans mb-2"
          style={{ fontFamily: 'Cairo_700Bold', textAlign: 'center' }}
          numberOfLines={2}
        >
          د. {name}
        </Text>
        
        {/* التخصص */}
        <Text 
          className="text-gray-500 text-base font-sans mb-3"
          style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
        >
          {specialty}
        </Text>
        
        {/* الموقع */}
        {location && (
          <View className="flex-row items-center justify-center mb-3">
            <Ionicons name="location" size={16} color={primaryColor} style={{ marginRight: 4 }} />
            <Text 
              className="text-gray-600 text-sm font-sans"
              style={{ fontFamily: 'Cairo_400Regular', textAlign: 'center' }}
            >
              {location}
            </Text>
          </View>
        )}
        
        {/* الوصف */}
        {description && (
          <View className="w-full mt-2 px-2">
            <Text 
              className="text-gray-600 text-sm font-sans"
              style={{ 
                fontFamily: 'Cairo_400Regular', 
                textAlign: 'center',
                lineHeight: 20,
              }}
              numberOfLines={3}
            >
              {description}
            </Text>
          </View>
        )}
      </View>

      {/* القسم السفلي: زر الحجز */}
      <Pressable 
        onPress={handleBookPress}
        disabled={!isAvailable}
        className="w-full py-4 rounded-2xl items-center justify-center"
        style={{ 
          backgroundColor: isAvailable ? primaryColor : '#9ca3af',
          shadowColor: isAvailable ? primaryColor : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isAvailable ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: isAvailable ? 5 : 2,
        }}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Text 
            className="text-white text-base font-bold font-sans"
            style={{ fontFamily: 'Cairo_700Bold', textAlign: 'center', marginRight: 8 }}
          >
            {isAvailable ? 'احجز موعد' : 'غير متاح'}
          </Text>
          {isAvailable && (
            <Ionicons name="add-circle" size={20} color="#fff" />
          )}
        </View>
      </Pressable>
    </Pressable>
  );
};
