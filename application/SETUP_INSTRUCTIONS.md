# 🚀 تعليمات الإعداد - تطبيق Bazarli

## ✅ تم إكمال جميع الصفحات والمكونات!

### 📱 الصفحات المكتملة:

#### Authentication
- ✅ `LoginPage.js` - تسجيل الدخول مع OTP
- ✅ `RegisterPage.js` - إنشاء حساب مع OTP
- ✅ `OTPVerificationPage.js` - التحقق من رقم الهاتف

#### Main Pages
- ✅ `StoresPage.js` - قائمة المتاجر (مع Redux + API)
- ✅ `ProductsPage.js` - قائمة المنتجات (مع Redux + API)
- ✅ `CheckoutPage.js` - صفحة إتمام الطلب الكاملة

#### Dashboard Pages
- ✅ `CustomerDashboard.js` - لوحة تحكم العميل
- ✅ `DriverDashboard.js` - لوحة تحكم السائق
- ✅ `AdminDashboard.js` - لوحة تحكم الإدمن

#### Components (محدثة لاستخدام Redux)
- ✅ `Cart.js` - سلة المشتريات
- ✅ `StoresSection.js` - قسم المتاجر في الصفحة الرئيسية
- ✅ `ProductsSection.js` - قسم المنتجات في الصفحة الرئيسية
- ✅ `ProductCard.js` - بطاقة المنتج
- ✅ `StoreCard.js` - بطاقة المتجر
- ✅ `BottomNavigation.js` - القائمة السفلية

---

## 🔧 خطوات الإعداد

### 1. تحديث BASE_URL

**ملف:** `src/store/api.js`
```javascript
const BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api/v1';
// مثال: 'http://192.168.1.100:8000/api/v1'
```

**ملف:** `src/services/api.js`
```javascript
const BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api/v1';
```

**ملاحظة:** استخدم IP address بدلاً من `localhost` للوصول من الجهاز/المحاكي

### 2. تشغيل Migration في Laravel

```bash
cd web
php artisan migrate
```

### 3. تشغيل التطبيق

```bash
cd application
npm start
```

---

## 🎯 الميزات الرئيسية

### ✅ Redux Toolkit + RTK Query
- **تحديث فوري للبيانات** - عند تغيير أي بيانات، تتحدث الواجهة تلقائياً
- **Caching تلقائي** - تقليل الطلبات غير الضرورية
- **Auto Refetch** - إعادة جلب البيانات عند الحاجة

### ✅ Authentication System
- تسجيل دخول بالهاتف وكلمة المرور
- إنشاء حساب جديد
- التحقق من رقم الهاتف بـ OTP (6 أرقام)
- إعادة إرسال رمز التحقق مع countdown

### ✅ Stores & Products
- عرض المتاجر والمنتجات من API
- فلترة متقدمة (فئة، محافظة، مدينة)
- بحث في الوقت الفعلي
- Pagination تلقائي

### ✅ Shopping Cart
- إضافة/حذف/تحديث المنتجات
- تحديث فوري للعدد والمجموع
- عرض تفاصيل كل منتج في السلة

### ✅ Checkout
- ملخص الطلب
- اختيار عنوان التوصيل
- اختيار طريقة الدفع (نقدي، بطاقة، محفظة)
- إضافة ملاحظات
- إنشاء الطلب

### ✅ Dashboard
- **Customer**: إحصائيات، طلبات حديثة
- **Driver**: إحصائيات التوصيل، طلبات متاحة
- **Admin**: إحصائيات شاملة للنظام

---

## 📋 Redux Slices

### Auth Slice
```javascript
import { login, register, verifyPhone, logout } from '../store/slices/authSlice';
```

### Stores Slice
```javascript
import { useGetStoresQuery } from '../store/slices/storesSlice';
```

### Products Slice
```javascript
import { useGetProductsQuery } from '../store/slices/productsSlice';
```

### Cart Slice
```javascript
import { 
  useGetCartQuery, 
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation 
} from '../store/slices/cartSlice';
```

### Orders Slice
```javascript
import { 
  useGetUserOrdersQuery,
  useCreateOrderMutation 
} from '../store/slices/ordersSlice';
```

### Dashboard Slice
```javascript
import { useGetCustomerStatsQuery } from '../store/slices/dashboardSlice';
```

---

## 🌐 دعم اللغات

- ✅ العربية (RTL)
- ✅ الإنجليزية (LTR)
- ✅ تبديل اللغة في الوقت الفعلي
- ✅ جميع النصوص مترجمة

---

## 🎨 الألوان المستخدمة

```javascript
primary: '#007AFF'      // اللون الأساسي
secondary: '#6C757D'    // اللون الثانوي
accent: '#FF6B35'       // لون التمييز
background: '#FFFFFF'   // الخلفية
```

---

## ⚠️ ملاحظات مهمة

1. **BASE_URL**: تأكد من تحديثه في الملفين المذكورين أعلاه
2. **Network**: تأكد من أن الجهاز/المحاكي يمكنه الوصول إلى API
3. **CORS**: تأكد من إعداد CORS في Laravel للسماح بالطلبات من التطبيق
4. **Token**: يتم حفظ Token تلقائياً في AsyncStorage
5. **Language**: يتم حفظ اللغة المفضلة تلقائياً

---

## 🚀 جاهز للاستخدام!

جميع الصفحات والمكونات جاهزة وتعمل مع Redux مع تحديث فوري للبيانات! 🎉

**الخطوة التالية:** قم بتحديث BASE_URL وشغّل التطبيق!

