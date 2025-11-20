import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServiceTemplate from './ServiceTemplate';
import { Truck, Clock, Shield, Star } from 'lucide-react';

export default function FoodDelivery({ products, categories }) {
    const { t } = useTranslation();

    const stats = [
        { number: '200+', label: 'Restaurants' },
        { number: '24/7', label: 'Service Available' },
        { number: '25min', label: 'Average Delivery' },
        { number: '4.8★', label: 'Average Rating' }
    ];

    const features = [
        {
            icon: Clock,
            title: t('fast_delivery'),
            description: 'Hot and fresh food delivered quickly',
        },
        {
            icon: Shield,
            title: t('quality_guaranteed'),
            description: 'From top-rated restaurants and chefs',
        },
        {
            icon: Star,
            title: t('wide_selection'),
            description: 'Diverse cuisines and dietary options',
        },
    ];

    return (
        <ServiceTemplate
            serviceName={t('food_delivery')}
            serviceIcon={Truck}
            products={products}
            categories={categories}
            stats={stats}
            features={features}
            color="orange"
        />
    );
}