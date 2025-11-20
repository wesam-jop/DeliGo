/**
 * أدوات مساعدة لمعالجة روابط الصور
 * توحد معالجة المسارات النسبية والكاملة من API
 */

/**
 * معالجة رابط الصورة (نسبي أو كامل)
 * @param url - رابط الصورة من API
 * @returns رابط الصورة الكامل
 */
export const processImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }
  
  // إذا كان الرابط كامل (يبدأ بـ http:// أو https://)
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // الحصول على base URL (بدون /api لأن الصور في /storage/ وليس في /api/)
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
  // إزالة /api من النهاية إذا كانت موجودة
  let baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  
  // التأكد من أن baseUrl لا ينتهي بـ /
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // التحقق من أن المسار يحتوي على /storage/ وإضافته إذا كان مفقوداً
  let finalPath = trimmedUrl;
  
  // إذا كان المسار يبدأ بـ /storage/ بالفعل، استخدمه مباشرة
  if (finalPath.startsWith('/storage/')) {
    return `${baseUrl}${finalPath}`;
  }
  
  // إذا كان المسار يبدأ بـ / لكن ليس /storage/
  if (finalPath.startsWith('/')) {
    // إزالة / من البداية
    const pathWithoutSlash = finalPath.substring(1);
    // إضافة /storage/ قبل المسار
    finalPath = `/storage/${pathWithoutSlash}`;
  } else {
    // إذا كان المسار لا يبدأ بـ /، أضف /storage/ قبل المسار
    finalPath = `/storage/${finalPath}`;
  }
  
  return `${baseUrl}${finalPath}`;
};

/**
 * استخراج رابط الصورة من بيانات الطبيب
 * يبحث في جميع الحقول المحتملة للصور
 */
export const getDoctorImage = (doctor: any): string | null => {
  if (!doctor || typeof doctor !== 'object') {
    return null;
  }
  
  // قائمة الحقول المحتملة للصور بالترتيب (الأولوية للروابط الكاملة)
  const imageFields = [
    'profile_image_url', // رابط كامل جاهز من API - الأولوية الأولى
    'avatar_url',        // رابط كامل
    'image_url',         // رابط كامل
    'profile_image',     // مسار نسبي - يحتاج إضافة /storage/
    'avatar',            // مسار نسبي
    'image',             // مسار نسبي
    'photo',             // مسار نسبي
    'profile_picture',   // مسار نسبي
    'picture',           // مسار نسبي
    'img',               // مسار نسبي
  ];
  
  // محاولة الحقول المحددة أولاً
  for (const field of imageFields) {
    if (doctor[field] && typeof doctor[field] === 'string') {
      const processed = processImageUrl(doctor[field]);
      if (processed) {
        return processed;
      }
    }
  }
  
  // البحث في جميع الحقول تلقائياً
  const imageKeys = Object.keys(doctor).filter(key => 
    (key.toLowerCase().includes('image') || 
     key.toLowerCase().includes('avatar') || 
     key.toLowerCase().includes('photo') ||
     key.toLowerCase().includes('picture') ||
     key.toLowerCase().includes('img')) &&
    typeof doctor[key] === 'string' &&
    doctor[key]?.trim()
  );
  
  for (const key of imageKeys) {
    const processed = processImageUrl(doctor[key]);
    if (processed) {
      return processed;
    }
  }
  
  return null;
};

