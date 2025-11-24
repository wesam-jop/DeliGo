# 🚀 دليل إعداد نظام الإشعارات - Notifications Setup Guide

## ✅ ما تم إنجازه

تم إنشاء نظام إشعارات كامل ومتكامل يتضمن:

### 1. **إشعارات داخلية (In-App Notifications)**
- ✅ عرض الإشعارات في الموقع
- ✅ عداد الإشعارات غير المقروءة
- ✅ Real-time polling (كل 30 ثانية)
- ✅ صفحة كاملة لإدارة الإشعارات

### 2. **إشعارات خارجية (Browser Push Notifications)**
- ✅ Web Push Notifications
- ✅ Service Worker
- ✅ الاشتراك/إلغاء الاشتراك
- ✅ إشعارات حتى عند إغلاق الموقع

### 3. **APIs لتطبيق الموبايل**
- ✅ جميع APIs جاهزة
- ✅ دعم Push Notifications للموبايل
- ✅ Pagination و Filtering

### 4. **ربط مع الأحداث**
- ✅ إشعارات عند إنشاء الطلبات
- ✅ إشعارات عند تغيير حالة الطلب
- ✅ إشعارات للسائقين
- ✅ إشعارات لأصحاب المتاجر

---

## 📋 الخطوات التالية

### 1. تشغيل Migrations

```bash
php artisan migrate
```

### 2. إنشاء VAPID Keys

**الطريقة 1: استخدام موقع**
1. اذهب إلى: https://web-push-codelab.glitch.me/
2. انسخ Public Key و Private Key

**الطريقة 2: استخدام Laravel Tinker**
```bash
php artisan tinker
```
```php
$keys = \Minishlink\WebPush\VAPID::createVapidKeys();
echo "Public Key: " . $keys['publicKey'] . "\n";
echo "Private Key: " . $keys['privateKey'] . "\n";
```

### 3. إضافة إلى `.env`

```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=https://your-domain.com
```

**ملاحظة:** في التطوير يمكن استخدام `http://localhost:8000`

### 4. تحديث Layouts

استبدل `NotificationBell` في Layouts:

**في `DriverLayout.jsx`, `StoreLayout.jsx`, `CustomerLayout.jsx`:**

```jsx
import NotificationBell from '../../Components/NotificationBell';

// استبدل الكود القديم بـ:
<NotificationBell 
    unreadCount={props.notifications?.unreadCount || 0}
    notifications={props.notifications?.recent || []}
/>
```

### 5. تهيئة Push Notifications

**في `app.jsx`:**

```jsx
import { initializePushNotifications } from './utils/pushNotifications';

// في setup function
setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
    
    // تهيئة Push Notifications
    if (props.vapidPublicKey) {
        initializePushNotifications(props.vapidPublicKey);
    }
}
```

---

## 🧪 الاختبار

### 1. اختبار الإشعارات الداخلية

```bash
php artisan tinker
```

```php
$service = app(\App\Services\NotificationService::class);
$service->create(
    userId: 1,
    type: 'test',
    title: 'Test Notification',
    message: 'This is a test notification'
);
```

### 2. اختبار Push Notifications

1. افتح الموقع في المتصفح
2. امنح الإذن للإشعارات عند الطلب
3. أرسل إشعار من Backend
4. يجب أن تظهر الإشعارة في المتصفح

### 3. اختبار APIs

```bash
# الحصول على الإشعارات
curl -X GET http://localhost:8000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# الاشتراك في Push Notifications
curl -X POST http://localhost:8000/api/v1/notifications/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    },
    "device_type": "mobile"
  }'
```

---

## 📱 لتطبيق الموبايل

### React Native Example

```javascript
import * as Notifications from 'expo-notifications';

// الاشتراك
const subscription = await Notifications.getExpoPushTokenAsync();

// إرسال للـ API
await fetch('https://your-api.com/api/v1/notifications/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    endpoint: subscription.data,
    keys: {
      p256dh: '...',
      auth: '...',
    },
    device_type: 'mobile',
  }),
});
```

---

## 🔧 الإعدادات المتقدمة

### تخصيص Service Worker

يمكن تخصيص `public/sw.js` لإضافة:
- Actions في الإشعارات
- Sound customization
- Vibration patterns

### تخصيص NotificationService

يمكن إضافة:
- Scheduled notifications
- Notification templates
- Multi-language support

---

## ⚠️ ملاحظات مهمة

1. **HTTPS مطلوب**: Push Notifications تعمل فقط على HTTPS (أو localhost)
2. **Permissions**: المستخدم يجب أن يمنح الإذن
3. **Browser Support**: مدعومة في Chrome, Firefox, Edge, Safari (iOS 16.4+)
4. **VAPID Keys**: يجب إنشاء keys فريدة لكل بيئة

---

## 📚 الملفات المرجعية

- `NOTIFICATIONS_SYSTEM.md` - توثيق شامل للنظام
- `app/Services/NotificationService.php` - Service للإشعارات
- `resources/js/Components/NotificationBell.jsx` - Component للإشعارات
- `resources/js/utils/pushNotifications.js` - Utilities للـ Push

---

## ✅ النظام جاهز!

جميع المكونات تم إنشاؤها وربطها. فقط قم بـ:
1. ✅ تشغيل Migrations
2. ✅ إضافة VAPID Keys
3. ✅ تحديث Layouts
4. ✅ تهيئة Push Notifications

**النظام جاهز للاستخدام!** 🎉

