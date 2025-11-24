# إصلاح سريع - مشكلة الاتصال بالخادم على الجوال

## ✅ تم الإصلاح!

تم تحديث ملف `application/src/config/api.js` لاستخدام IP address جهازك: **192.168.1.100**

## الخطوات التالية:

### 1. تأكد من أن الـ Server يعمل:
```bash
cd web
php artisan serve --host=0.0.0.0 --port=8000
```

**مهم:** استخدم `--host=0.0.0.0` حتى يقبل الطلبات من الشبكة المحلية.

### 2. تأكد من:
- ✅ الهاتف والكمبيوتر على نفس شبكة Wi-Fi
- ✅ الـ Firewall لا يمنع المنفذ 8000
- ✅ الـ Server يعمل على `0.0.0.0:8000`

### 3. أعد تشغيل Expo:
- أوقف Metro bundler (Ctrl+C)
- أعد تشغيله: `npm start` أو `expo start`
- افتح التطبيق على الجوال باستخدام Expo Go

## إذا استمرت المشكلة:

1. **تحقق من IP address:**
   ```bash
   ipconfig
   ```
   ابحث عن "IPv4 Address" تحت "Wireless LAN adapter Wi-Fi"

2. **تحقق من الـ URL في التطبيق:**
   - افتح: `application/src/config/api.js`
   - تأكد من أن الـ URL صحيح: `http://192.168.1.100:8000/api/v1`

3. **اختبر الـ API مباشرة:**
   - افتح المتصفح على الجوال
   - اذهب إلى: `http://192.168.1.100:8000/api/v1/stores`
   - يجب أن ترى JSON response

4. **تحقق من الـ Firewall:**
   - Windows: افتح Windows Defender Firewall
   - أضف exception للمنفذ 8000

## ملاحظة:

إذا غيرت شبكة Wi-Fi أو IP address تغير، يجب تحديث الـ URL في `config/api.js` مرة أخرى.

