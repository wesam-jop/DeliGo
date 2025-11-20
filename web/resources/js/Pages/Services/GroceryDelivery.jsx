import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServiceTemplate from './ServiceTemplate';
import { Store, Clock, Shield, Star } from 'lucide-react';

export default function GroceryDelivery({ products, categories }) {
    const { t } = useTranslation();

    const stats = [
        { number: '5000+', label: 'Grocery Items' },
        { number: '24/7', label: 'Service Available' },
        { number: '15min', label: 'Average Delivery' },
        { number: '98%', label: 'Fresh Products' }
    ];

    const features = [
        {
            icon: Clock,
            title: t('fast_delivery'),
            description: t('fast_delivery_desc'),
        },
        {
            icon: Shield,
            title: t('quality_guaranteed'),
            description: t('quality_guaranteed_desc'),
        },
        {
            icon: Star,
            title: t('wide_selection'),
            description: t('wide_selection_desc'),
        },
    ];

    return (
        <ServiceTemplate
            serviceName={t('grocery_delivery')}
            serviceIcon={Store}
            products={products}
            categories={categories}
            stats={stats}
            features={features}
            color="green"
        />
    );
}