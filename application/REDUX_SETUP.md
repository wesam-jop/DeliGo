# Redux Setup - React Native App

## ✅ تم إعداد Redux Toolkit مع RTK Query بنجاح!

### الميزات الرئيسية:
- ✅ **تحديث فوري للبيانات** - عند تغيير أي بيانات في API، يتم تحديث الواجهة تلقائياً
- ✅ **Caching تلقائي** - البيانات المخزنة مؤقتاً لتقليل الطلبات
- ✅ **Refetching تلقائي** - إعادة جلب البيانات عند الحاجة
- ✅ **Optimistic Updates** - تحديثات فورية قبل استجابة الخادم

---

## 📁 البنية

### Store Structure
```
src/store/
├── api.js                    # RTK Query base API
├── index.js                  # Redux store configuration
├── hooks.js                  # Redux hooks
└── slices/
    ├── authSlice.js          # Authentication state
    ├── storesSlice.js        # Stores state & API
    ├── productsSlice.js      # Products state & API
    ├── cartSlice.js          # Cart state & API
    ├── ordersSlice.js        # Orders state & API
    ├── dashboardSlice.js     # Dashboard state & API
    └── locationSlice.js      # Location state & API
```

---

## 🔧 الإعداد

### 1. تحديث BASE_URL

**ملف:** `src/store/api.js`
```javascript
const BASE_URL = 'http://YOUR_API_URL/api/v1';
```

**ملف:** `src/services/api.js`
```javascript
const BASE_URL = 'http://YOUR_API_URL/api/v1';
```

### 2. استخدام Redux في المكونات

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetStoresQuery } from '../store/slices/storesSlice';
import { useAddToCartMutation } from '../store/slices/cartSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  // Query (GET)
  const { data, isLoading, refetch } = useGetStoresQuery();
  
  // Mutation (POST/PUT/DELETE)
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const handleAdd = async () => {
    try {
      await addToCart({ product_id: 1, quantity: 1 }).unwrap();
      // Success - data will update automatically!
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <View>...</View>;
};
```

---

## 📱 الصفحات المكتملة

### Authentication
- ✅ `LoginPage.js` - تسجيل الدخول
- ✅ `RegisterPage.js` - إنشاء حساب
- ✅ `OTPVerificationPage.js` - التحقق من OTP

### Main Pages
- ✅ `StoresPage.js` - قائمة المتاجر (مع Redux)
- ✅ `ProductsPage.js` - قائمة المنتجات (مع Redux)
- ✅ `CheckoutPage.js` - صفحة إتمام الطلب

### Dashboard
- ✅ `CustomerDashboard.js` - لوحة تحكم العميل
- ✅ `DriverDashboard.js` - لوحة تحكم السائق
- ✅ `AdminDashboard.js` - لوحة تحكم الإدمن

### Components
- ✅ `Cart.js` - سلة المشتريات (مع Redux)
- ✅ `StoresSection.js` - قسم المتاجر (مع Redux)
- ✅ `ProductsSection.js` - قسم المنتجات (مع Redux)
- ✅ `ProductCard.js` - بطاقة المنتج (مع Redux)
- ✅ `BottomNavigation.js` - القائمة السفلية (مع Redux)

---

## 🔄 كيفية عمل التحديث الفوري

### مثال: إضافة منتج للسلة

```javascript
// في ProductCard.js
const [addToCart] = useAddToCartMutation();

const handleAdd = async () => {
  await addToCart({ product_id: 1, quantity: 1 }).unwrap();
  // ✅ السلة تتحدث تلقائياً في جميع المكونات!
  // ✅ عدد المنتجات في BottomNavigation يتحدث!
  // ✅ Cart modal يتحدث!
};
```

### مثال: تحديث كمية منتج

```javascript
// في Cart.js
const [updateCart] = useUpdateCartMutation();

const handleUpdate = async (productId, quantity) => {
  await updateCart({ product_id: productId, quantity }).unwrap();
  // ✅ السلة تتحدث فوراً!
  // ✅ المجموع يتحدث!
};
```

---

## 🎯 Redux Slices

### Auth Slice
- `login` - تسجيل الدخول
- `register` - إنشاء حساب
- `verifyPhone` - التحقق من الهاتف
- `logout` - تسجيل الخروج
- `loadUser` - تحميل بيانات المستخدم

### Stores Slice
- `useGetStoresQuery` - جلب المتاجر
- `useGetStoreQuery` - جلب متجر واحد
- `useGetStoreProductsQuery` - جلب منتجات متجر

### Products Slice
- `useGetProductsQuery` - جلب المنتجات
- `useGetProductQuery` - جلب منتج واحد
- `useGetCategoriesQuery` - جلب الفئات

### Cart Slice
- `useGetCartQuery` - جلب السلة
- `useGetCartCountQuery` - عدد المنتجات
- `useAddToCartMutation` - إضافة للسلة
- `useUpdateCartMutation` - تحديث السلة
- `useRemoveFromCartMutation` - حذف من السلة
- `useClearCartMutation` - مسح السلة

### Orders Slice
- `useGetUserOrdersQuery` - جلب طلبات المستخدم
- `useGetOrderQuery` - جلب طلب واحد
- `useCreateOrderMutation` - إنشاء طلب
- `useCancelOrderMutation` - إلغاء طلب
- `useTrackOrderQuery` - تتبع طلب

### Dashboard Slice
- `useGetCustomerStatsQuery` - إحصائيات العميل
- `useGetStoreStatsQuery` - إحصائيات المتجر
- `useGetAdminStatsQuery` - إحصائيات الإدمن

### Location Slice
- `useGetGovernoratesQuery` - جلب المحافظات
- `useGetCitiesQuery` - جلب المدن
- `useGetDeliveryLocationsQuery` - جلب عناوين التوصيل

---

## ⚠️ ملاحظات مهمة

1. **BASE_URL**: تأكد من تحديث BASE_URL في `src/store/api.js` و `src/services/api.js`
2. **Authentication**: جميع الـ APIs المحمية تحتاج Bearer Token (يتم إضافتها تلقائياً)
3. **Language**: اللغة يتم إرسالها تلقائياً في Header
4. **Error Handling**: الأخطاء يتم معالجتها تلقائياً في baseQueryWithReauth
5. **Auto Refetch**: البيانات يتم إعادة جلبها تلقائياً عند تغيير الفلاتر أو الحالة

---

## 🚀 جاهز للاستخدام!

جميع الصفحات والمكونات جاهزة وتستخدم Redux مع تحديث فوري للبيانات! 🎉

