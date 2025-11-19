import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    HeroSection, 
    StatsSection, 
    FeaturesSection, 
    CTASection,
    SearchFilterSection 
} from '../../Components';
import ProductCard from '../../Components/ProductCard';
import { 
    Store, 
    Truck, 
    Clock, 
    Shield, 
    Star,
    Package,
    Heart,
    Zap
} from 'lucide-react';

export default function ServiceTemplate({ 
    serviceName, 
    serviceIcon, 
    products, 
    categories,
    stats = [],
    features = [],
    color = "purple"
}) {
    const { t } = useTranslation();

    // Default stats if none provided
    const defaultStats = stats.length > 0 ? stats : [
        { number: '1000+', label: 'Products Available' },
        { number: '24/7', label: 'Service Available' },
        { number: '30min', label: 'Average Delivery' },
        { number: '99%', label: 'Customer Satisfaction' }
    ];

    // Default features if none provided
    const defaultFeatures = features.length > 0 ? features : [
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

    const handleSearch = (filters) => {
        // Handle search logic here
        console.log('Search filters:', filters);
    };

    const handleFilter = (filters) => {
        // Handle filter logic here
        console.log('Filter options:', filters);
    };

    return (
        <Layout>
            <Head title={serviceName} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <HeroSection
                    title={serviceName}
                    subtitle={`Get ${serviceName.toLowerCase()} delivered to your doorstep in minutes`}
                    icon={serviceIcon}
                    gradientFrom={`from-${color}-600`}
                    gradientTo={`to-${color}-800`}
                    badges={[
                        { icon: Clock, text: 'Fast Delivery' },
                        { icon: Shield, text: 'Quality Guaranteed' },
                        { icon: Star, text: 'Top Rated' }
                    ]}
                />

                {/* Stats Section */}
                <StatsSection
                    stats={defaultStats}
                    color={color}
                />

                {/* Search and Filter Section */}
                <SearchFilterSection
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    categories={categories}
                    placeholder={`Search ${serviceName.toLowerCase()}...`}
                />

                {/* Features Section */}
                <FeaturesSection
                    features={defaultFeatures}
                    title={`Why Choose Our ${serviceName}?`}
                    subtitle="We provide the best service with quality products and fast delivery"
                    color={color}
                    columns={3}
                />

                {/* Products Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Featured Products
                            </h2>
                            <p className="text-lg text-gray-600">
                                Discover our top-rated products
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products?.data?.slice(0, 8).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() => {}}
                                    onUpdateQuantity={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <CTASection
                    title="Ready to Get Started?"
                    subtitle="Download our app and start ordering now"
                    primaryButton={{
                        text: "Download App",
                        href: "/download",
                        icon: Package
                    }}
                    secondaryButton={{
                        text: "Learn More",
                        href: "/about",
                        icon: Heart
                    }}
                    gradientFrom={`from-${color}-600`}
                    gradientTo={`to-${color}-800`}
                />
            </div>
        </Layout>
    );
}
