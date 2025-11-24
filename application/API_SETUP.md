# API Setup Instructions

## المشكلة الشائعة: "حدث خطأ أثناء إرسال رمز التحقق"

إذا كنت تحصل على هذا الخطأ ولا يظهر أي طلب في سجل الـ API، فالمشكلة على الأرجح في إعدادات الـ URL.

## الحل

### 1. تغيير الـ API URL

افتح الملف: `application/src/config/api.js`

**للتطوير على جهاز حقيقي (Android/iOS):**
- لا تستخدم `localhost` - لن يعمل!
- استخدم IP address لجهاز الكمبيوتر

**كيفية معرفة IP address:**
- **Windows:** افتح CMD واكتب `ipconfig` وابحث عن "IPv4 Address"
- **Mac/Linux:** افتح Terminal واكتب `ifconfig` أو `ip addr`

**مثال:**
```javascript
const BASE_URL = 'http://192.168.1.100:8000/api/v1'; // استبدل 192.168.1.100 بـ IP جهازك
```

**للمحاكيات:**
- **Android Emulator:** استخدم `http://10.0.2.2:8000/api/v1`
- **iOS Simulator:** يمكنك استخدام `http://localhost:8000/api/v1`

### 2. التأكد من أن الـ Server يعمل

```bash
cd web
php artisan serve --host=0.0.0.0 --port=8000
```

**مهم:** استخدم `--host=0.0.0.0` حتى يقبل الطلبات من الشبكة المحلية.

### 3. التأكد من الـ Firewall

تأكد من أن الـ Firewall لا يمنع الطلبات على المنفذ 8000.

### 4. فحص الـ Logs

**في التطبيق:**
- افتح React Native Debugger أو Metro logs
- ابحث عن رسائل "API Request" و "API Response Error"

**في الـ Backend:**
- افتح `web/storage/logs/laravel.log`
- ابحث عن "API Request" و "API Login Request Received"

### 5. اختبار الـ API مباشرة

استخدم Postman أو curl لاختبار الـ endpoint:

```bash
curl -X POST http://YOUR_IP:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: ar" \
  -d '{"phone":"963123456789"}'
```

## إعدادات CORS

تم إعداد CORS في `web/bootstrap/app.php` للسماح بجميع الـ origins. إذا كنت تواجه مشاكل:

1. تأكد من أن الـ middleware موجود
2. تأكد من أن الـ routes في `web/routes/api.php` موجودة
3. تحقق من السجلات لمعرفة ما إذا كانت الطلبات تصل

## نصائح إضافية

1. **استخدم نفس الشبكة:** تأكد من أن الهاتف والكمبيوتر على نفس شبكة Wi-Fi
2. **اختبر على Emulator أولاً:** أسهل للتطوير والتصحيح
3. **استخدم HTTPS في الإنتاج:** غير الـ URL إلى HTTPS عند النشر

