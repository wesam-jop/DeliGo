import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import CategoryCard from '../../Components/CategoryCard';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { 
    Package,
    Apple,
    Utensils,
    Milk,
    Coffee,
    Cookie,
    Sparkles,
    Heart,
    Baby,
    Shirt,
    Home,
    Wine
} from 'lucide-react';

export default function CategoriesIndex({ categories }) {
    const { t } = useTranslation();
    
    // دالة لتحويل أسماء الفئات إلى أيقونات
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'grocery': <Package className="w-12 h-12" />,
            'fruits_vegetables': <Apple className="w-12 h-12" />,
            'meat_fish': <Utensils className="w-12 h-12" />,
            'dairy': <Milk className="w-12 h-12" />,
            'beverages': <Coffee className="w-12 h-12" />,
            'sweets': <Cookie className="w-12 h-12" />,
            'cleaning': <Sparkles className="w-12 h-12" />,
            'personal_care': <Heart className="w-12 h-12" />,
            'baby_supplies': <Baby className="w-12 h-12" />,
            'clothing': <Shirt className="w-12 h-12" />,
            'home_garden': <Home className="w-12 h-12" />,
            'alcohol': <Wine className="w-12 h-12" />,
        };
        return iconMap[categoryName] || <Package className="w-12 h-12" />;
    };

    return (
        <Layout>
            <Head title={t('categories')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-slate-900">فئات المنتجات</h1>
                        <p className="text-slate-600 mt-2">اكتشف جميع فئات منتجاتنا المتنوعة</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد فئات متاحة</h3>
                            <p className="text-slate-600">سيتم إضافة فئات جديدة قريباً</p>
                        </div>
                    )}
                </div>
            </div>

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
