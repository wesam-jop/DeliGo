import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Container } from '../components/Container';
import { ScreenLayout } from '../components/ScreenLayout';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { DoctorsSection } from '../components/sections/DoctorsSection';
import { DoctorSearchFilter } from '../components/sections/DoctorSearchFilter';
import { useGetProductsQuery } from '../services/api';
import { saveDoctorsLocally, getDoctorsLocally } from '../utils/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * شاشة الصفحة الرئيسية
 * تتكون من:
 * - Header أنيق مع لوجو
 * - Slider للصور المتحركة
 * - البحث والفلترة
 * - قسم عرض الأطباء
 */
export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [localDoctors, setLocalDoctors] = useState<any[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // تحميل البيانات المحلية عند فتح الشاشة
  useEffect(() => {
    const loadLocalData = async () => {
      setIsLoadingLocal(true);
      const local = await getDoctorsLocally();
      if (local && local.length > 0) {
        setLocalDoctors(local);
        if (__DEV__) {
          console.log('📦 تم تحميل الأطباء من التخزين المحلي:', local.length);
        }
      }
      setIsLoadingLocal(false);
    };
    loadLocalData();
  }, []);

  // بناء query parameters للبحث والفلترة
  // ملاحظة: نحن نعتمد على الفلترة المحلية بدلاً من API لأنها أكثر موثوقية ودقة
  // نجلب جميع الأطباء أولاً ثم نفلترهم محلياً
  const queryParams = undefined; // نجلب جميع البيانات بدون فلترة من API

  const { 
    data: productsResponse, 
    isLoading: isProductsLoading, 
    error: productsError, 
    isError,
    refetch,
    isFetching,
    isSuccess
  } = useGetProductsQuery(queryParams, {
    // إعادة جلب البيانات عند التركيز على الشاشة
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  
  // طباعة معلومات التشخيص
  React.useEffect(() => {
    if (__DEV__) {
      if (isError && productsError) {
        console.error('❌ خطأ في جلب البيانات:', productsError);
        if ('data' in productsError) {
          console.error('📦 بيانات الخطأ:', productsError.data);
        }
        if ('status' in productsError) {
          console.error('📊 حالة الخطأ:', productsError.status);
        }
      }
      if (isSuccess && productsResponse) {
        console.log('✅ تم جلب البيانات بنجاح:', {
          hasData: !!productsResponse,
          dataType: Array.isArray(productsResponse) ? 'array' : typeof productsResponse,
          responseKeys: productsResponse ? Object.keys(productsResponse) : [],
        });
      }
    }
  }, [isError, productsError, isSuccess, productsResponse]);
  
  // حفظ البيانات المحلية عند نجاح جلب البيانات من API
  useEffect(() => {
    if (productsResponse) {
      let apiDoctors: any[] = [];
      if (productsResponse.data && Array.isArray(productsResponse.data)) {
        apiDoctors = productsResponse.data;
      } else if (Array.isArray(productsResponse)) {
        apiDoctors = productsResponse;
      }
      
      if (apiDoctors.length > 0) {
        saveDoctorsLocally(apiDoctors);
        setLocalDoctors(apiDoctors);
        if (__DEV__) {
          console.log('✅ تم حفظ الأطباء محلياً بعد جلبها من API:', apiDoctors.length);
        }
      }
    }
  }, [productsResponse]);

  // استخراج بيانات الأطباء من API أو استخدام البيانات المحلية
  const doctors: any[] = useMemo(() => {
    if (productsResponse) {
      if (productsResponse.data && Array.isArray(productsResponse.data)) {
        return productsResponse.data;
      } else if (Array.isArray(productsResponse)) {
        return productsResponse;
      }
    }
    // إذا لم تكن هناك بيانات من API، استخدم البيانات المحلية
    if (localDoctors.length > 0) {
      if (__DEV__) {
        console.log('📦 استخدام البيانات المحلية للأطباء:', localDoctors.length);
      }
      return localDoctors;
    }
    return [];
  }, [productsResponse, localDoctors]);

  // تطبيق البحث والفلترة محلياً - هذا يضمن دقة النتائج
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors]; // نسخة من المصفوفة لتجنب تعديل الأصلية
    
    // طباعة معلومات التشخيص
    if (__DEV__) {
      console.log('🔍 معلومات الفلترة:', {
        totalDoctors: doctors.length,
        selectedCategory,
        selectedArea,
        searchText,
        sampleDoctor: doctors[0] ? {
          name: doctors[0].name,
          category: doctors[0].category,
          category_id: doctors[0].category_id,
          specialty: doctors[0].specialty,
          area: doctors[0].area,
          location: doctors[0].location,
        } : null,
      });
    }
    
    // فلترة بالبحث
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter((doctor: any) => {
        const name = (doctor.name || doctor.title || '').toLowerCase();
        const specialty = (doctor.specialty || doctor.category?.name || '').toLowerCase();
        return name.includes(searchLower) || specialty.includes(searchLower);
      });
    }
    
    // فلترة بالتصنيف - مع معالجة شاملة للمقارنة
    if (selectedCategory) {
      const originalCount = filtered.length;
      const selectedCategoryLower = String(selectedCategory).toLowerCase().trim();
      const selectedCategoryTrimmed = String(selectedCategory).trim();
      
      filtered = filtered.filter((doctor: any) => {
        // محاولة 1: مطابقة ID (رقم)
        const categoryId = doctor.category?.id || doctor.category_id;
        if (categoryId) {
          const categoryIdStr = String(categoryId).trim();
          if (categoryIdStr === selectedCategoryTrimmed || categoryIdStr === selectedCategoryLower) {
            if (__DEV__) {
              console.log('✅ مطابقة ID:', { categoryId, categoryIdStr, selectedCategory, doctor: doctor.name });
            }
            return true;
          }
        }
        
        // محاولة 2: مطابقة الاسم من category.name
        const categoryName = doctor.category?.name;
        if (categoryName) {
          const categoryNameLower = String(categoryName).toLowerCase().trim();
          if (categoryNameLower === selectedCategoryLower) {
            if (__DEV__) {
              console.log('✅ مطابقة category.name:', { categoryName, selectedCategoryLower, doctor: doctor.name });
            }
            return true;
          }
          // مطابقة جزئية
          if (categoryNameLower.includes(selectedCategoryLower) || selectedCategoryLower.includes(categoryNameLower)) {
            if (__DEV__) {
              console.log('✅ مطابقة جزئية category.name:', { categoryName, selectedCategoryLower, doctor: doctor.name });
            }
            return true;
          }
        }
        
        // محاولة 3: مطابقة specialty
        const specialty = doctor.specialty;
        if (specialty) {
          const specialtyLower = String(specialty).toLowerCase().trim();
          if (specialtyLower === selectedCategoryLower) {
            if (__DEV__) {
              console.log('✅ مطابقة specialty:', { specialty, selectedCategoryLower, doctor: doctor.name });
            }
            return true;
          }
          // مطابقة جزئية
          if (specialtyLower.includes(selectedCategoryLower) || selectedCategoryLower.includes(specialtyLower)) {
            if (__DEV__) {
              console.log('✅ مطابقة جزئية specialty:', { specialty, selectedCategoryLower, doctor: doctor.name });
            }
            return true;
          }
        }
        
        // محاولة 4: مطابقة category كـ string مباشر
        if (doctor.category && typeof doctor.category === 'string') {
          const categoryStr = String(doctor.category).toLowerCase().trim();
          if (categoryStr === selectedCategoryLower || categoryStr.includes(selectedCategoryLower)) {
            return true;
          }
        }
        
        return false;
      });
      
      if (__DEV__) {
        console.log('📊 فلترة التخصص:', {
          selectedCategory,
          beforeFilter: originalCount,
          afterFilter: filtered.length,
          removed: originalCount - filtered.length,
        });
        
        // طباعة عينة من الأطباء المفلترة
        if (filtered.length > 0) {
          console.log('📋 عينة من الأطباء المفلترة:', filtered.slice(0, 2).map((d: any) => ({
            name: d.name,
            category: d.category,
            category_id: d.category_id,
            specialty: d.specialty,
          })));
        } else {
          console.log('⚠️ لا توجد نتائج - فحص بيانات طبيب واحد:', doctors[0] ? {
            name: doctors[0].name,
            category: doctors[0].category,
            category_id: doctors[0].category_id,
            specialty: doctors[0].specialty,
          } : 'no doctors');
        }
      }
    }
    
    // فلترة بالمنطقة - مع معالجة شاملة للمقارنة
    if (selectedArea) {
      const originalCount = filtered.length;
      const selectedAreaStr = String(selectedArea).trim();
      const selectedAreaLower = selectedAreaStr.toLowerCase();
      
      filtered = filtered.filter((doctor: any) => {
        // محاولة 1: استخراج المنطقة من doctor.area (string)
        let area = '';
        if (doctor.area) {
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
        if (!area && doctor.location) {
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
            if (doctor[field]) {
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
        
        // إذا لم نجد منطقة، نتخطى هذا الطبيب
        if (!area) {
          return false;
        }
        
        const areaLower = area.toLowerCase();
        
        // مطابقة مباشرة
        if (area === selectedAreaStr) {
          if (__DEV__) {
            console.log('✅ مطابقة مباشرة للمنطقة:', { area, selectedArea, doctor: doctor.name });
          }
          return true;
        }
        
        // مطابقة case-insensitive
        if (areaLower === selectedAreaLower) {
          if (__DEV__) {
            console.log('✅ مطابقة case-insensitive للمنطقة:', { area, selectedArea, doctor: doctor.name });
          }
          return true;
        }
        
        // مطابقة جزئية
        if (areaLower && areaLower.includes(selectedAreaLower)) {
          if (__DEV__) {
            console.log('✅ مطابقة جزئية للمنطقة:', { area, selectedArea, doctor: doctor.name });
          }
          return true;
        }
        
        // مطابقة عكسية
        if (selectedAreaLower && selectedAreaLower.includes(areaLower)) {
          if (__DEV__) {
            console.log('✅ مطابقة عكسية للمنطقة:', { area, selectedArea, doctor: doctor.name });
          }
          return true;
        }
        
        return false;
      });
      
      if (__DEV__) {
        console.log('📍 فلترة المنطقة:', {
          selectedArea,
          beforeFilter: originalCount,
          afterFilter: filtered.length,
          removed: originalCount - filtered.length,
        });
        
        // طباعة عينة من الأطباء المفلترة
        if (filtered.length > 0) {
          console.log('📋 عينة من الأطباء المفلترة بالمنطقة:', filtered.slice(0, 2).map((d: any) => ({
            name: d.name,
            area: d.area,
            location: d.location,
          })));
        } else {
          console.log('⚠️ لا توجد نتائج للمنطقة - فحص بيانات طبيب واحد:', doctors[0] ? {
            name: doctors[0].name,
            area: doctors[0].area,
            location: doctors[0].location,
            areaType: typeof doctors[0].area,
            locationType: typeof doctors[0].location,
          } : 'no doctors');
        }
      }
    }
    
    if (__DEV__) {
      console.log('✅ النتيجة النهائية:', {
        totalFiltered: filtered.length,
        sampleDoctor: filtered[0] ? {
          name: filtered[0].name,
          category: filtered[0].category,
          category_id: filtered[0].category_id,
          specialty: filtered[0].specialty,
          area: filtered[0].area,
        } : null,
      });
    }
    
    return filtered;
  }, [doctors, searchText, selectedCategory, selectedArea]);


  const handleDoctorPress = (doctor: any) => {
    console.log('تم الضغط على طبيب:', doctor.name || doctor.title);
    // يمكن إضافة منطق التنقل لصفحة تفاصيل الطبيب
  };

  // دالة التحديث عند السحب للأسفل
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('بدء التحديث...');
      await refetch();
      console.log('تم التحديث بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error);
    } finally {
      // تأخير بسيط لإظهار animation
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  };

  const handleLoginPress = () => {
    if (isAuthenticated) {
      navigation.navigate('DoctorDashboard');
    } else {
      navigation.navigate('DoctorLogin');
    }
  };

  return (
    <Container>
      <ScreenLayout 
        title="ميعاد" 
        logoUri={undefined}
        scrollable={false}
        showLoginButton={true}
        onLoginPress={handleLoginPress}
        isAuthenticated={isAuthenticated}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isFetching}
              onRefresh={handleRefresh}
                  colors={['#0c6980']} // Android
                  tintColor="#0c6980" // iOS
              progressViewOffset={0}
            />
          }
          bounces={true}
        >
          {/* القسم الأول: البانر الترحيبي */}
          <WelcomeBanner
            title="مرحباً بك في ميعاد"
            subtitle="احجز موعدك بسهولة مع أفضل الأطباء المتخصصين"
          />

          {/* القسم الثاني: البحث والفلترة */}
          <DoctorSearchFilter
            searchText={searchText}
            selectedCategory={selectedCategory}
            selectedArea={selectedArea}
            onSearchChange={setSearchText}
            onCategorySelect={setSelectedCategory}
            onAreaSelect={setSelectedArea}
          />

          {/* القسم الثالث: عرض الأطباء */}
          <DoctorsSection
            doctors={filteredDoctors}
            isLoading={(isProductsLoading || isLoadingLocal) && !isError && doctors.length === 0}
            error={isError && !doctors.length && !localDoctors.length ? productsError : null}
            onDoctorPress={handleDoctorPress}
            title="الأطباء المتاحون"
            showTitle={true}
          />
        </ScrollView>
      </ScreenLayout>
    </Container>
  );
};

