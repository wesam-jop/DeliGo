import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServiceTemplate from './ServiceTemplate';
import { Heart, Clock, Shield, Star } from 'lucide-react';

export default function Pharmacy({ products, categories }) {
    const { t } = useTranslation();

    const stats = [
        { number: '1000+', label: 'Medicines' },
        { number: '24/7', label: 'Emergency Service' },
        { number: '20min', label: 'Average Delivery' },
        { number: '100%', label: 'Licensed Products' }
    ];

    const features = [
        {
            icon: Clock,
            title: t('fast_delivery'),
            description: 'Emergency medicines delivered quickly',
        },
        {
            icon: Shield,
            title: t('quality_guaranteed'),
            description: 'Licensed and verified pharmaceutical products',
        },
        {
            icon: Star,
            title: t('wide_selection'),
            description: 'Prescription and over-the-counter medicines',
        },
    ];

    return (
        <ServiceTemplate
            serviceName={t('pharmacy')}
            serviceIcon={Heart}
            products={products}
            categories={categories}
            stats={stats}
            features={features}
            color="red"
        />
    );
}