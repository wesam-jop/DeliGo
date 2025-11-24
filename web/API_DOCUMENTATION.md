# 📱 API Documentation - Bazarli Mobile App

## Base URL
```
http://your-domain.com/api/v1
```

## Authentication
جميع الـ APIs المحمية تتطلب Bearer Token في Header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication APIs

### 1. Register
**POST** `/register`

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com", // optional
  "phone": "963912345678",
  "password": "password123",
  "password_confirmation": "password123",
  "user_type": "customer", // customer, store_owner, driver
  "address": "دمشق، المزة",
  "latitude": 33.5138,
  "longitude": 36.2765,
  "governorate_id": 1,
  "city_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "1|xxxxxxxxxxxx",
    "token_type": "Bearer",
    "verification_required": true
  },
  "message": "تم التسجيل بنجاح. يرجى التحقق من رقم الهاتف"
}
```

### 2. Login
**POST** `/login`

**Request Body:**
```json
{
  "phone": "963912345678", // or "email": "ahmed@example.com"
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "1|xxxxxxxxxxxx",
    "token_type": "Bearer",
    "is_verified": true
  },
  "message": "تم تسجيل الدخول بنجاح"
}
```

### 3. Verify Phone
**POST** `/verify-phone`

**Request Body:**
```json
{
  "phone": "963912345678",
  "code": "123456"
}
```

### 4. Resend Verification Code
**POST** `/resend-verification`

**Request Body:**
```json
{
  "phone": "963912345678"
}
```

### 5. Logout
**POST** `/logout` (Protected)

---

## 👤 Profile APIs

### 1. Get Profile
**GET** `/profile` (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "963912345678",
    "address": "دمشق، المزة",
    "latitude": 33.5138,
    "longitude": 36.2765,
    "user_type": "customer",
    "is_verified": true,
    "avatar": "avatars/1_xxx.jpg",
    "governorate": {...},
    "city": {...}
  }
}
```

### 2. Update Profile
**PUT** `/profile` (Protected)

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "963912345678",
  "address": "دمشق، المزة",
  "latitude": 33.5138,
  "longitude": 36.2765,
  "governorate_id": 1,
  "city_id": 1,
  "avatar": "data:image/jpeg;base64,..." // base64 image
}
```

### 3. Change Password
**POST** `/profile/change-password` (Protected)

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123",
  "new_password_confirmation": "newpassword123"
}
```

---

## 🛒 Cart APIs

### 1. Get Cart
**GET** `/cart` (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product": {...},
        "quantity": 2,
        "subtotal": 50.00
      }
    ],
    "total": 50.00,
    "items_count": 1
  }
}
```

### 2. Get Cart Count
**GET** `/cart/count` (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 3. Add to Cart
**POST** `/cart/add` (Protected)

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

### 4. Update Cart Item
**PUT** `/cart/update` (Protected)

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 3
}
```

### 5. Remove from Cart
**DELETE** `/cart/remove/{product_id}` (Protected)

### 6. Clear Cart
**DELETE** `/cart/clear` (Protected)

---

## 🏪 Store APIs

### 1. List Stores
**GET** `/stores`

**Query Parameters:**
- `search` - Search by name or address
- `category_id` - Filter by category (through products)
- `governorate_id` - Filter by governorate
- `city_id` - Filter by city
- `store_type` - Filter by store type
- `latitude` - User latitude (for distance calculation)
- `longitude` - User longitude
- `radius` - Search radius in km (default: 10)
- `sort_by` - created_at, name, orders_count, products_count
- `sort_order` - asc, desc
- `per_page` - Items per page (max: 100)
- `page` - Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "متجر البازار",
        "address": "دمشق، المزة",
        "phone": "963912345678",
        "logo_path": "stores/logo.jpg",
        "is_active": true,
        "delivery_fee": 5.00,
        "estimated_delivery_time": 15,
        "governorate": {...},
        "city": {...},
        "orders_count": 150,
        "products_count": 50
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 10
  }
}
```

### 2. Get Store Details
**GET** `/stores/{id}`

### 3. Get Store Products
**GET** `/stores/{id}/products`

**Query Parameters:**
- `category_id` - Filter by category
- `search` - Search products
- `per_page` - Items per page
- `page` - Page number

---

## 📦 Product APIs

### 1. List Products
**GET** `/products`

**Query Parameters:**
- `search` - Search by name or description
- `category_id` - Filter by category
- `store_id` - Filter by store
- `governorate_id` - Filter by governorate (through store)
- `city_id` - Filter by city (through store)
- `featured` - Show only featured products (true/false)
- `sort_by` - sort_order, name, price, created_at, sales_count
- `sort_order` - asc, desc
- `per_page` - Items per page (max: 100)
- `page` - Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "خبز أبيض",
        "description": "خبز طازج",
        "price": 25.00,
        "discount_price": 20.00,
        "final_price": 20.00,
        "discount_percentage": 20,
        "image": "products/bread.jpg",
        "unit": "كيلو",
        "stock_quantity": 100,
        "is_available": true,
        "is_featured": true,
        "category": {...},
        "store": {...}
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 50
  }
}
```

### 2. Get Product Details
**GET** `/products/{id}`

---

## 📋 Category APIs

### 1. List Categories
**GET** `/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "خضروات",
      "slug": "vegetables",
      "image": "categories/vegetables.jpg",
      "products_count": 50
    }
  ]
}
```

### 2. Get Category Details
**GET** `/categories/{id}`

---

## 📍 Location APIs

### 1. List Governorates
**GET** `/governorates`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "دمشق"
    }
  ]
}
```

### 2. List Cities
**GET** `/cities?governorate_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "المزة",
      "governorate_id": 1
    }
  ]
}
```

---

## 🛍️ Order APIs

### 1. Create Order
**POST** `/orders` (Protected)

**Request Body:**
```json
{
  "store_id": 1,
  "delivery_address": "دمشق، المزة، شارع الرئيسي",
  "delivery_latitude": 33.5138,
  "delivery_longitude": 36.2765,
  "customer_phone": "963912345678",
  "payment_method": "cash", // cash, card, wallet
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "notes": "من فضلك اطلب عند الوصول"
}
```

### 2. Get User Orders
**GET** `/user/orders` (Protected)

**Query Parameters:**
- `status` - Filter by status
- `per_page` - Items per page
- `page` - Page number

### 3. Get Order Details
**GET** `/orders/{id}` (Protected)

### 4. Cancel Order
**POST** `/orders/{id}/cancel` (Protected)

### 5. Track Order
**GET** `/orders/{id}/track` (Protected)

---

## ⭐ Favorite Products APIs

### 1. List Favorites
**GET** `/favorites` (Protected)

### 2. Add to Favorites
**POST** `/favorites` (Protected)

**Request Body:**
```json
{
  "product_id": 1
}
```

### 3. Remove from Favorites
**DELETE** `/favorites/{product_id}` (Protected)

---

## 📍 Delivery Locations APIs

### 1. List Delivery Locations
**GET** `/delivery-locations` (Protected)

### 2. Create Delivery Location
**POST** `/delivery-locations` (Protected)

**Request Body:**
```json
{
  "name": "المنزل",
  "address": "دمشق، المزة",
  "latitude": 33.5138,
  "longitude": 36.2765,
  "is_default": true
}
```

### 3. Update Delivery Location
**PUT** `/delivery-locations/{id}` (Protected)

### 4. Delete Delivery Location
**DELETE** `/delivery-locations/{id}` (Protected)

### 5. Set Default Location
**POST** `/delivery-locations/{id}/default` (Protected)

---

## 📊 Dashboard APIs

### 1. Customer Dashboard
**GET** `/dashboard/customer` (Protected - Customer only)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_orders": 10,
      "pending_orders": 2,
      "delivered_orders": 8,
      "total_spent": 500.00,
      "favorite_products_count": 5
    },
    "recent_orders": [...],
    "favorite_products": [...]
  }
}
```

### 2. Store Dashboard
**GET** `/dashboard/store` (Protected - Store Owner only)

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {...},
    "stats": {
      "total_orders": 100,
      "pending_orders": 5,
      "delivered_orders": 90,
      "total_revenue": 5000.00,
      "total_products": 50
    },
    "recent_orders": [...],
    "top_products": [...],
    "daily_sales": [...]
  }
}
```

### 3. Admin Dashboard
**GET** `/dashboard/admin` (Protected - Admin only)

---

## 🔒 Error Responses

جميع الأخطاء تعيد نفس التنسيق:

```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 📝 Notes

1. جميع التواريخ في تنسيق ISO 8601
2. جميع الأرقام العشرية يتم إرجاعها كـ float
3. الصور يمكن أن تكون URLs أو base64
4. اللغة يتم تحديدها من Header: `Accept-Language: ar` أو `en`
5. Pagination: جميع قوائم البيانات تدعم pagination

---

## 🚀 Quick Start

1. Register/Login للحصول على Token
2. استخدم Token في Header: `Authorization: Bearer {token}`
3. استدعي الـ APIs المطلوبة

---

**تم إنشاء جميع الـ APIs بنجاح! 🎉**

