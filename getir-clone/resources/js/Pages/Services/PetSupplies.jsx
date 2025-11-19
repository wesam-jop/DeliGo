import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServiceTemplate from './ServiceTemplate';
import { Package, Clock, Shield, Star } from 'lucide-react';

export default function PetSupplies({ products, categories }) {
    const { t } = useTranslation();

    const stats = [
        { number: '800+', label: 'Pet Products' },
        { number: '24/7', label: 'Service Available' },
        { number: '30min', label: 'Average Delivery' },
        { number: '99%', label: 'Pet Approved' }
    ];

    const features = [
        {
            icon: Clock,
            title: t('fast_delivery'),
            description: 'Essential pet supplies delivered quickly',
        },
        {
            icon: Shield,
            title: t('quality_guaranteed'),
            description: 'Premium pet food and accessories',
        },
        {
            icon: Star,
            title: t('wide_selection'),
            description: 'Products for all types of pets',
        },
    ];

    return (
        <ServiceTemplate
            serviceName={t('pet_supplies')}
            serviceIcon={Package}
            products={products}
            categories={categories}
            stats={stats}
            features={features}
            color="pink"
        />
    );
}