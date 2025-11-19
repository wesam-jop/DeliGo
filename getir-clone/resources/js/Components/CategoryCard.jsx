import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../hooks/useTranslation';
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
    Wine,
    DollarSign
} from 'lucide-react';

export default function CategoryCard({ category }) {
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
        <Link
            href={`/categories/${category.id}`}
            className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-lg shadow-black/30 transition-all duration-200 overflow-hidden group hover:-translate-y-1 hover:border-purple-400/40"
        >
            <div className="p-6 text-center space-y-3 text-white">
                <div className="text-purple-200 mb-2 group-hover:scale-110 transition-transform duration-200 flex justify-center">
                    {getCategoryIcon(category.name)}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                    {category.name}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-2">
                    {category.description}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs">
                    <DollarSign className="w-3 h-3 text-emerald-300" />
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 text-white px-3 py-1">
                        {category.products_count} {t('products_count_text')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
