import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import ProductCard from '../../Components/ProductCard';
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
    Wine,
    Plus,
    Minus,
    ShoppingCart
} from 'lucide-react';

export default function CategoryShow({ category, products, filters }) {
    const { t } = useTranslation();
    
    // حماية من البيانات غير المحددة
    const safeFilters = filters || {};
    const safeProducts = products || { data: [], total: 0, links: [] };
    const safeCategory = category || { id: 0, name: '', icon: '', description: '' };

    // دالة لتحويل أسماء الفئات إلى أيقونات
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'grocery': <Package className="w-16 h-16" />,
            'fruits_vegetables': <Apple className="w-16 h-16" />,
            'meat_fish': <Utensils className="w-16 h-16" />,
            'dairy': <Milk className="w-16 h-16" />,
            'beverages': <Coffee className="w-16 h-16" />,
            'sweets': <Cookie className="w-16 h-16" />,
            'cleaning': <Sparkles className="w-16 h-16" />,
            'personal_care': <Heart className="w-16 h-16" />,
            'baby_supplies': <Baby className="w-16 h-16" />,
            'clothing': <Shirt className="w-16 h-16" />,
            'home_garden': <Home className="w-16 h-16" />,
            'alcohol': <Wine className="w-16 h-16" />,
        };
        return iconMap[categoryName] || <Package className="w-16 h-16" />;
    };

    const [search, setSearch] = useState(() => safeFilters?.search || '');
    const [sortBy, setSortBy] = useState(() => safeFilters?.sort || 'sort_order');
    const [sortDirection, setSortDirection] = useState(() => safeFilters?.direction || 'asc');

    // دوال إدارة السلة
    const addToCart = (productId) => {
        router.post('/cart/add', {
            product_id: productId,
            quantity: 1
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            router.delete(`/cart/remove/${productId}`, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            router.post('/cart/update', {
                product_id: productId,
                quantity: quantity
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/categories/${safeCategory.id}`, {
            search,
            sort: sortBy,
            direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSortChange = (newSortBy) => {
        const newDirection = sortBy === newSortBy && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(newSortBy);
        setSortDirection(newDirection);
        router.get(`/categories/${safeCategory.id}`, {
            search,
            sort: newSortBy,
            direction: newDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <Layout>
            <Head title={safeCategory.name} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-slate-500 hover:text-purple-600">الرئيسية</Link>
                            <span className="text-slate-400">/</span>
                            <Link href="/categories" className="text-slate-500 hover:text-purple-600">الفئات</Link>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 font-medium">{safeCategory.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Category Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="text-purple-600 mb-4 flex justify-center">
                                {getCategoryIcon(safeCategory.name)}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{safeCategory.name}</h1>
                            <p className="text-slate-600 max-w-2xl mx-auto">{safeCategory.description}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar - Filters */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">البحث والترتيب</h3>
                                
                                {/* Search */}
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="ابحث في هذه الفئة..."
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </form>

                                {/* Sort */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">ترتيب حسب</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'sort_order', label: t('default_sort') },
                                            { value: 'name', label: t('sort_by_name') },
                                            { value: 'price', label: t('sort_by_price') },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortChange(option.value)}
                                                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    sortBy === option.value 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                {option.label}
                                                {sortBy === option.value && (
                                                    <span className="mr-2">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:w-3/4">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-slate-600">
                                    عرض {safeProducts.data.length} من {safeProducts.total} منتج في فئة {safeCategory.name}
                                </p>
                            </div>

                            {safeProducts.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {safeProducts.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">{safeCategory.icon}</div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد منتجات في هذه الفئة</h3>
                                    <p className="text-slate-600">جرب البحث في فئات أخرى</p>
                                    <Link 
                                        href="/categories" 
                                        className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        تصفح جميع الفئات
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {safeProducts.links && safeProducts.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {safeProducts.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-lg ${
                                                    link.active
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
