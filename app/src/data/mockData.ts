/**
 * بيانات وهمية للاستخدام عند عدم توفر بيانات من API
 * مطابقة لبنية API الفعلية
 */

// بيانات وهمية للتصنيفات (التخصصات)
export const mockCategories = [
  "أسنان",
  "أطفال",
  "باطنية",
  "جراحة عامة",
  "نساء وتوليد",
  "أنف وأذن وحنجرة",
  "جلدية وتجميل",
  "قلب وأوعية دموية",
  "عيون",
  "أعصاب",
];

// بيانات وهمية للمناطق
export const mockAreas = [
  "إدلب",
  "سراقب",
  "سرمين",
  "حلب",
  "دمشق",
  "حمص",
  "طرطوس",
  "اللاذقية",
];

// بيانات وهمية للأطباء
export const mockDoctors = [
  {
    id: 1,
    name: "د. أحمد محمد علي",
    title: "د. أحمد محمد علي",
    specialty: "أسنان",
    category: { name: "أسنان", id: 1 },
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80",
    rating: 4.8,
    location: "إدلب",
    area: "إدلب",
    price: "50000",
    visit_price: "50000",
    available: true,
  },
  {
    id: 2,
    name: "د. فاطمة حسن",
    title: "د. فاطمة حسن",
    specialty: "أطفال",
    category: { name: "أطفال", id: 2 },
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80",
    rating: 4.9,
    location: "سراقب",
    area: "سراقب",
    price: "45000",
    visit_price: "45000",
    available: true,
  },
  {
    id: 3,
    name: "د. خالد يوسف",
    title: "د. خالد يوسف",
    specialty: "باطنية",
    category: { name: "باطنية", id: 3 },
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80",
    rating: 4.7,
    location: "سرمين",
    area: "سرمين",
    price: "55000",
    visit_price: "55000",
    available: true,
  },
  {
    id: 4,
    name: "د. سارة أحمد",
    title: "د. سارة أحمد",
    specialty: "نساء وتوليد",
    category: { name: "نساء وتوليد", id: 4 },
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80",
    rating: 4.9,
    location: "إدلب",
    area: "إدلب",
    price: "60000",
    visit_price: "60000",
    available: false,
  },
  {
    id: 5,
    name: "د. محمد خليل",
    title: "د. محمد خليل",
    specialty: "قلب وأوعية دموية",
    category: { name: "قلب وأوعية دموية", id: 5 },
    avatar: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&q=80",
    rating: 5.0,
    location: "حلب",
    area: "حلب",
    price: "70000",
    visit_price: "70000",
    available: true,
  },
  {
    id: 6,
    name: "د. نورا حسن",
    title: "د. نورا حسن",
    specialty: "جلدية وتجميل",
    category: { name: "جلدية وتجميل", id: 6 },
    avatar: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200&q=80",
    rating: 4.6,
    location: "سراقب",
    area: "سراقب",
    price: "65000",
    visit_price: "65000",
    available: true,
  },
];

// دالة للحصول على بيانات التصنيفات الوهمية
export const getMockCategoriesResponse = () => {
  return {
    success: true,
    message: "Products retrieved successfully",
    categories: mockCategories,
  };
};

// دالة للحصول على بيانات المناطق الوهمية
export const getMockAreasResponse = () => {
  return {
    success: true,
    message: "Areas retrieved successfully",
    areas: mockAreas,
  };
};

// دالة للحصول على بيانات الأطباء الوهمية
export const getMockProductsResponse = () => {
  return {
    success: true,
    message: "Products retrieved successfully",
    data: mockDoctors,
  };
};

