import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../hooks/useTranslation';
import { Package, DollarSign } from 'lucide-react';

export default function CategoryCard({ category }) {
    const { t } = useTranslation();

    const renderIcon = () => {
        if (category?.image_url) {
            return (
                <img
                    src={category.image_url}
                    alt={category.display_name || category.name}
                    className="w-16 h-16 object-cover rounded-2xl shadow-lg"
                />
            );
        }

        if (category?.icon) {
            return (
                <span className="text-4xl" role="img" aria-hidden="true">
                    {category.icon}
                </span>
            );
        }

        return <Package className="w-12 h-12" />;
    };

    return (
        <Link
            href={`/categories/${category.id}`}
            className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-lg shadow-black/30 transition-all duration-200 overflow-hidden group hover:-translate-y-1 hover:border-purple-400/40"
        >
            <div className="p-6 text-center space-y-3 text-white">
                <div className="text-purple-200 mb-2 group-hover:scale-110 transition-transform duration-200 flex justify-center">
                    {renderIcon()}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                    {category.display_name || category.name}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-2">
                    {category.display_description || category.description}
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
