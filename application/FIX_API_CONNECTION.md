# إصلاح مشكلة الاتصال بالـ API

## المشكلة
إذا كنت تحصل على رسالة: **"لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت وإعدادات الـ API"**

## الحل السريع

### 1. إذا كنت تستخدم Android Emulator:
الكود سيتعامل مع هذا تلقائياً. تأكد فقط من أن الـ server يعمل:
```bash
cd web
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. إذا كنت تستخدم iOS Simulator:
استخدم `localhost` - يجب أن يعمل مباشرة.

### 3. إذا كنت تستخدم جهاز حقيقي (Android/iOS):
**يجب تغيير الـ URL!**

1. افتح الملف: `application/src/config/api.js`
2. غير السطر:
   ```javascript
   const BASE_URL = __DEV__ 
     ? 'http://localhost:8000/api/v1' // ⚠️ CHANGE THIS!
     : 'https://yourdomain.com/api/v1';
   ```
   
   إلى:
   ```javascript
   const BASE_URL = __DEV__ 
     ? 'http://YOUR_IP:8000/api/v1' // استبدل YOUR_IP بـ IP جهازك
     : 'https://yourdomain.com/api/v1';
   ```

### 4. كيفية معرفة IP address جهازك:

**Windows:**
```cmd
ipconfig
```
ابحث عن "IPv4 Address" تحت "Wireless LAN adapter Wi-Fi" أو "Ethernet adapter"

**Mac/Linux:**
```bash
ifconfig
# أو
ip addr
```

ابحث عن IP مثل: `192.168.1.100` أو `192.168.0.50`

### 5. تشغيل الـ Server بشكل صحيح:
```bash
cd web
php artisan serve --host=0.0.0.0 --port=8000
```

**مهم:** استخدم `--host=0.0.0.0` حتى يقبل الطلبات من الشبكة المحلية.

### 6. تأكد من:
- ✅ الهاتف والكمبيوتر على نفس شبكة Wi-Fi
- ✅ الـ Firewall لا يمنع المنفذ 8000
- ✅ الـ Server يعمل (`php artisan serve`)
- ✅ الـ URL صحيح في `config/api.js`

## مثال:

إذا كان IP جهازك هو `192.168.1.100`:

```javascript
const BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:8000/api/v1'
  : 'https://yourdomain.com/api/v1';
```

## بعد التغيير:
1. أعد تشغيل التطبيق (أوقف Metro وابدأ من جديد)
2. جرب تسجيل الدخول مرة أخرى

