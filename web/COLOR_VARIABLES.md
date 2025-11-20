# متغيرات الألوان الأساسية - Color Variables Guide

## نظرة عامة
تم إعداد 4 ألوان أساسية للموقع يمكن تغييرها من مكان واحد في ملف `resources/css/app.css` داخل قسم `@theme`.

## الألوان الأساسية

### 1. اللون الأساسي - Primary Color (Purple)
اللون الرئيسي المستخدم في الأزرار، الروابط، والعناصر المميزة.

**الموقع في CSS:** `--color-primary-*`

**الاستخدام في Tailwind:**
```jsx
className="bg-purple-600 text-purple-100"
className="border-purple-500"
className="text-purple-700"
```

### 2. اللون الثانوي - Secondary Color (Slate/Dark)
يستخدم للخلفيات الداكنة، النصوص الثانوية، والحدود.

**الموقع في CSS:** `--color-secondary-*`

**الاستخدام في Tailwind:**
```jsx
className="bg-slate-900 text-slate-100"
className="bg-slate-950"
className="text-slate-300"
```

### 3. اللون المميز - Accent Color (Blue)
لون إضافي للتمييز والتأكيد على عناصر معينة.

**الموقع في CSS:** `--color-accent-*`

**الاستخدام في Tailwind:**
```jsx
className="bg-blue-600 text-blue-100"
className="border-blue-500"
```

### 4. لون الخلفية الداكن - Dark Background
للخلفيات الداكنة والثيم الليلي.

**الموقع في CSS:** `--color-dark-*`

**الاستخدام:** نفس استخدام `slate` في Tailwind.

## كيفية تغيير الألوان

### خطوات التغيير:

1. افتح ملف `resources/css/app.css`
2. ابحث عن قسم `@theme`
3. غيّر قيم المتغيرات الأساسية:
   - `--color-primary-*` للون الأساسي
   - `--color-secondary-*` للون الثانوي
   - `--color-accent-*` للون المميز
   - `--color-dark-*` للخلفية الداكنة

### مثال:

```css
/* تغيير اللون الأساسي من البنفسجي إلى الأخضر */
--color-primary-500: #10b981; /* Green-500 */
--color-primary-600: #059669; /* Green-600 */
--color-primary-700: #047857; /* Green-700 */
```

**ملاحظة:** عند تغيير الألوان، تأكد من تحديث جميع الدرجات (50-950) للحصول على تناسق أفضل.

## درجات الألوان

كل لون يحتوي على 11 درجة:
- `50` - الأفتح
- `100`, `200`, `300`, `400`
- `500` - المتوسط (الأساسي)
- `600`, `700`, `800`, `900`
- `950` - الأغمق

## أمثلة الاستخدام

### Hero Section
```jsx
<section className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
```

### Dark Background
```jsx
<section className="bg-slate-950 text-white">
```

### Buttons
```jsx
<button className="bg-purple-600 hover:bg-purple-700 text-white">
```

### Cards
```jsx
<div className="bg-slate-900 border border-white/10">
```

## نصائح

1. استخدم `purple-500` أو `purple-600` للأزرار الرئيسية
2. استخدم `slate-900` أو `slate-950` للخلفيات الداكنة
3. استخدم `purple-100` أو `purple-200` للخلفيات الفاتحة
4. استخدم `white` أو `slate-100` للنصوص على الخلفيات الداكنة

## الملفات المتأثرة

عند تغيير الألوان، سيتم تحديث جميع الصفحات تلقائياً:
- `Home.jsx`
- `Layout.jsx`
- جميع الصفحات الأخرى التي تستخدم هذه الألوان

---

**آخر تحديث:** تم إعداد المتغيرات في `resources/css/app.css`

