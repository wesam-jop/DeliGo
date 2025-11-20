import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function FavoriteToggleButton({
    productId,
    variant = 'icon',
    className = '',
    size = 'md',
}) {
    const { t } = useTranslation();
    const { props } = usePage();
    const auth = props.auth || {};
    const favoriteProductIds = auth.favorite_product_ids || [];

    const [isFavorite, setIsFavorite] = useState(favoriteProductIds.includes(productId));
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setIsFavorite(favoriteProductIds.includes(productId));
    }, [favoriteProductIds, productId]);

    const handleToggle = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setSubmitting(true);

        const options = {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        };

        if (isFavorite) {
            router.delete(`/favorites/${productId}`, options);
        } else {
            router.post('/favorites', { product_id: productId }, options);
        }
    };

    const label = isFavorite
        ? (t('remove_from_favorites') || 'Remove from favorites')
        : (t('add_to_favorites') || 'Add to favorites');

    if (variant === 'pill') {
        return (
            <button
                type="button"
                onClick={handleToggle}
                disabled={submitting}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isFavorite
                        ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } ${submitting ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            >
                <Heart
                    className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`}
                />
                <span>{label}</span>
            </button>
        );
    }

    const sizeClasses = {
        sm: 'h-9 w-9',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label={label}
            disabled={submitting}
            className={`flex items-center justify-center rounded-full border bg-white/90 backdrop-blur shadow-sm transition-all ${
                isFavorite
                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            } ${sizeClasses[size] || sizeClasses.md} ${submitting ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
        >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
    );
}

