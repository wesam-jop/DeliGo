# 🔔 نظام الإشعارات الكامل - Complete Notifications System

## 📋 نظرة عامة

تم إنشاء نظام إشعارات متكامل يتضمن:
- ✅ إشعارات داخلية (في الموقع)
- ✅ إشعارات خارجية (Browser Push Notifications)
- ✅ APIs جاهزة لتطبيق الموبايل
- ✅ Real-time updates
- ✅ إدارة كاملة للإشعارات

---

## 🗄️ Database Structure

### جدول `notifications`
```sql
- id
- user_id (foreign key)
- type (order, driver_order, store_order, system, promotion)
- title
- message
- data (JSON)
- is_read (boolean)
- read_at (timestamp)
- action_url
- icon
- priority (low, normal, high, urgent)
- created_at
- updated_at
```

### جدول `push_subscriptions`
```sql
- id
- user_id (foreign key)
- endpoint (unique)
- public_key
- auth_token
- user_agent
- device_type (web, mobile)
- is_active (boolean)
- created_at
- updated_at
```

---

## 🔧 الإعدادات (Setup)

### 1. تثبيت المكتبات

```bash
composer require minishlink/web-push
composer install
```

### 2. إنشاء VAPID Keys

```bash
# يمكن استخدام هذا الموقع لإنشاء VAPID keys:
# https://web-push-codelab.glitch.me/

# أو استخدام مكتبة:
php artisan tinker
>>> $keys = \Minishlink\WebPush\VAPID::createVapidKeys();
>>> echo "Public Key: " . $keys['publicKey'] . "\n";
>>> echo "Private Key: " . $keys['privateKey'] . "\n";
```

### 3. إضافة إلى `.env`

```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=https://your-domain.com
```

### 4. تشغيل Migrations

```bash
php artisan migrate
```

---

## 📁 الملفات المُنشأة

### Backend

1. **Models**
   - `app/Models/Notification.php`
   - `app/Models/PushSubscription.php`

2. **Services**
   - `app/Services/NotificationService.php`

3. **Controllers**
   - `app/Http/Controllers/NotificationController.php`
   - `app/Http/Controllers/Api/NotificationController.php`

4. **Migrations**
   - `database/migrations/2025_11_24_174838_create_notifications_table.php`
   - `database/migrations/2025_11_24_174838_create_push_subscriptions_table.php`

### Frontend

1. **Components**
   - `resources/js/Components/NotificationBell.jsx`

2. **Pages**
   - `resources/js/Pages/Notifications/Index.jsx`

3. **Utils**
   - `resources/js/utils/pushNotifications.js`

4. **Service Worker**
   - `public/sw.js`

---

## 🚀 الاستخدام

### إرسال إشعار

```php
use App\Services\NotificationService;

$notificationService = app(NotificationService::class);

// إشعار بسيط
$notificationService->create(
    userId: $user->id,
    type: 'order',
    title: 'Order Created',
    message: 'Your order has been created successfully',
    data: ['order_id' => $order->id],
    actionUrl: route('orders.show', $order->id),
    icon: 'shopping-cart',
    priority: 'high'
);

// إشعار لعدة مستخدمين
$notificationService->sendToUsers(
    userIds: [1, 2, 3],
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on all products',
    actionUrl: route('products.index')
);

// إشعار لنوع مستخدم معين
$notificationService->sendToUserType(
    userType: 'driver',
    type: 'driver_order',
    title: 'New Order Available',
    message: 'A new order is waiting for you'
);
```

### إشعارات جاهزة للطلبات

```php
// عند إنشاء طلب
$notificationService->notifyOrderCreated($user->id, $order);

// عند تغيير حالة الطلب
$notificationService->notifyOrderStatusChanged($user->id, $order);

// إشعار للسائق
$notificationService->notifyDriverNewOrder($driver->id, $order);

// إشعار لصاحب المتجر
$notificationService->notifyStoreNewOrder($storeOwner->id, $order);
```

---

## 🌐 APIs

### Web Routes

```
GET    /notifications                    - عرض جميع الإشعارات
POST   /notifications/{id}/read         - تعليم إشعار كمقروء
POST   /notifications/read-all          - تعليم جميع الإشعارات كمقروءة
DELETE /notifications/{id}              - حذف إشعار
GET    /notifications/unread-count      - عدد الإشعارات غير المقروءة
GET    /notifications/recent            - آخر 10 إشعارات
POST   /notifications/subscribe         - الاشتراك في Push Notifications
POST   /notifications/unsubscribe        - إلغاء الاشتراك
```

### API Routes (للتطبيق الموبايل)

```
GET    /api/v1/notifications             - عرض جميع الإشعارات
GET    /api/v1/notifications/{id}       - عرض إشعار محدد
POST   /api/v1/notifications/{id}/read  - تعليم إشعار كمقروء
POST   /api/v1/notifications/read-all   - تعليم جميع الإشعارات كمقروءة
DELETE /api/v1/notifications/{id}       - حذف إشعار
GET    /api/v1/notifications/unread-count - عدد الإشعارات غير المقروءة
POST   /api/v1/notifications/subscribe  - الاشتراك في Push Notifications
POST   /api/v1/notifications/unsubscribe - إلغاء الاشتراك
```

---

## 💻 Frontend Usage

### استخدام NotificationBell Component

```jsx
import NotificationBell from '../Components/NotificationBell';

<NotificationBell 
    unreadCount={props.notifications.unreadCount}
    notifications={props.notifications.recent}
/>
```

### تهيئة Push Notifications

```jsx
import { initializePushNotifications } from '../utils/pushNotifications';

// في app.jsx أو Layout component
useEffect(() => {
    const vapidPublicKey = props.vapidPublicKey;
    if (vapidPublicKey) {
        initializePushNotifications(vapidPublicKey);
    }
}, []);
```

---

## 🔗 ربط الإشعارات مع الأحداث

### في OrderController

```php
use App\Services\NotificationService;

// بعد إنشاء الطلب
$notificationService = app(NotificationService::class);
$notificationService->notifyOrderCreated($user->id, $order);

// إشعار للسائقين
$drivers = User::where('user_type', 'driver')
    ->where('area_id', $user->area_id)
    ->pluck('id')
    ->toArray();
    
foreach ($drivers as $driverId) {
    $notificationService->notifyDriverNewOrder($driverId, $order);
}
```

### في DriverOrderController

```php
// عند قبول الطلب
$notificationService->notifyOrderStatusChanged($order->user_id, $order);
```

### في StoreOrderController

```php
// عند بدء التحضير
$notificationService->notifyOrderStatusChanged($order->user_id, $order);
```

---

## 📱 لتطبيق الموبايل

### الاشتراك في Push Notifications

```javascript
// في React Native أو Flutter
POST /api/v1/notifications/subscribe
{
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
        "p256dh": "...",
        "auth": "..."
    },
    "device_type": "mobile"
}
```

### الحصول على الإشعارات

```javascript
GET /api/v1/notifications?unread_only=true&per_page=20
```

---

## ⚙️ الإعدادات المتقدمة

### تخصيص Service Worker

يمكن تخصيص `public/sw.js` لإضافة:
- Actions في الإشعارات
- Badge customization
- Sound customization
- Vibration patterns

### تخصيص NotificationService

يمكن إضافة:
- Scheduled notifications
- Notification templates
- Multi-language support
- Notification channels

---

## 🧪 الاختبار

### اختبار إرسال إشعار

```php
php artisan tinker

$service = app(\App\Services\NotificationService::class);
$service->create(
    userId: 1,
    type: 'test',
    title: 'Test Notification',
    message: 'This is a test notification'
);
```

### اختبار Push Notifications

1. افتح الموقع في المتصفح
2. امنح الإذن للإشعارات
3. أرسل إشعار من Backend
4. يجب أن تظهر الإشعارة في المتصفح

---

## 📝 ملاحظات مهمة

1. **VAPID Keys**: يجب إنشاء VAPID keys فريدة لكل بيئة (development, production)
2. **HTTPS**: Push Notifications تعمل فقط على HTTPS (أو localhost للتطوير)
3. **Service Worker**: يجب أن يكون `sw.js` في المجلد `public/`
4. **Permissions**: المستخدم يجب أن يمنح الإذن للإشعارات
5. **Browser Support**: Push Notifications مدعومة في Chrome, Firefox, Edge, Safari (iOS 16.4+)

---

## 🎯 الخطوات التالية

1. ✅ ربط الإشعارات مع أحداث الطلبات
2. ✅ إضافة إشعارات للمتاجر
3. ✅ إضافة إشعارات للسائقين
4. ✅ إضافة إشعارات النظام
5. ✅ إضافة إشعارات الترويجات

---

**النظام جاهز للاستخدام!** 🚀

