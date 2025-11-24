import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import ProductCard from '../../Components/ProductCard';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { 
    Plus, 
    Minus, 
    ShoppingCart, 
    Search,
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
    DollarSign,
    MapPin,
    Filter,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function ProductsIndex({ products, categories, governorates, cities: initialCities, filters, userGovernorateId, userCityId }) {
    const { t, locale } = useTranslation();
    
    // حماية من البيانات غير المحددة
    const safeFilters = filters || {};
    const safeProducts = products || { data: [], total: 0, links: [] };
    const safeCategories = categories || [];
    const safeGovernorates = governorates || [];

    const [search, setSearch] = useState(() => safeFilters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(() => safeFilters?.category || '');
    const [selectedGovernorate, setSelectedGovernorate] = useState(() => {
        return safeFilters?.governorate_id || userGovernorateId || '';
    });
    const [selectedCity, setSelectedCity] = useState(() => safeFilters?.city_id || userCityId || '');
    const [sortBy, setSortBy] = useState(() => safeFilters?.sort || 'sort_order');
    const [sortDirection, setSortDirection] = useState(() => safeFilters?.direction || 'asc');
    const [availableCities, setAvailableCities] = useState(() => initialCities || []);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeFilterSection, setActiveFilterSection] = useState(null);
    
    // جلب المدن عند تغيير المحافظة أو عند تحميل الصفحة لأول مرة
    useEffect(() => {
        if (selectedGovernorate) {
            fetch(`/api/v1/cities?governorate_id=${selectedGovernorate}`)
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setAvailableCities(result.data || []);
                        // إذا كان المستخدم لديه city_id ولم يتم تحديد واحد، استخدم إعدادات المستخدم
                        if (!selectedCity && userCityId && result.data.find(c => c.id == userCityId)) {
                            setSelectedCity(userCityId);
                            // تطبيق الفلترة تلقائياً
                            router.get('/products', {
                                search,
                                category: selectedCategory,
                                governorate_id: selectedGovernorate,
                                city_id: userCityId,
                                sort: sortBy,
                                direction: sortDirection,
                            }, {
                                preserveState: true,
                                replace: true,
                            });
                        }
                        // إذا كانت المدينة المحددة ليست في القائمة الجديدة، إعادة تعيينها
                        else if (selectedCity && !result.data.find(c => c.id == selectedCity)) {
                            setSelectedCity('');
                        }
                    }
                })
                .catch(err => console.error('Error fetching cities:', err));
        } else {
            setAvailableCities([]);
            setSelectedCity('');
        }
    }, [selectedGovernorate]);

    // دالة لتحويل أسماء الفئات إلى أيقونات
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'grocery': <Package className="w-4 h-4" />,
            'fruits_vegetables': <Apple className="w-4 h-4" />,
            'meat_fish': <Utensils className="w-4 h-4" />,
            'dairy': <Milk className="w-4 h-4" />,
            'beverages': <Coffee className="w-4 h-4" />,
            'sweets': <Cookie className="w-4 h-4" />,
            'cleaning': <Sparkles className="w-4 h-4" />,
            'personal_care': <Heart className="w-4 h-4" />,
            'baby_supplies': <Baby className="w-4 h-4" />,
            'clothing': <Shirt className="w-4 h-4" />,
            'home_garden': <Home className="w-4 h-4" />,
            'alcohol': <Wine className="w-4 h-4" />,
        };
        return iconMap[categoryName] || <Package className="w-4 h-4" />;
    };

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
        router.get('/products', {
            search,
            category: selectedCategory,
            governorate_id: selectedGovernorate,
            city_id: selectedCity,
            sort: sortBy,
            direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        router.get('/products', {
            search,
            category: categoryId,
            governorate_id: selectedGovernorate,
            city_id: selectedCity,
            sort: sortBy,
            direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleGovernorateChange = async (governorateId) => {
        setSelectedGovernorate(governorateId);
        setSelectedCity(''); // إعادة تعيين المدينة عند تغيير المحافظة
        
        router.get('/products', {
            search,
            category: selectedCategory,
            governorate_id: governorateId,
            city_id: '',
            sort: sortBy,
            direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCityChange = (cityId) => {
        setSelectedCity(cityId);
        router.get('/products', {
            search,
            category: selectedCategory,
            governorate_id: selectedGovernorate,
            city_id: cityId,
            sort: sortBy,
            direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSortChange = (newSortBy, newDirection = null) => {
        const direction = newDirection || (sortBy === newSortBy && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortBy(newSortBy);
        setSortDirection(direction);
        router.get('/products', {
            search,
            category: selectedCategory,
            governorate_id: selectedGovernorate,
            city_id: selectedCity,
            sort: newSortBy,
            direction: direction,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <Layout>
            <Head title={t('products')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-slate-900">{t('products')}</h1>
                        <p className="text-slate-600 mt-1">{t('browse_all_products')}</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className="w-full flex items-center justify-between gap-2 bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                {t('search_filter') || 'الفلاتر'}
                            </span>
                            {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Mobile Overlay */}
                    {filtersOpen && (
                        <div 
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setFiltersOpen(false)}
                        />
                    )}

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar - Filters */}
                        <div 
                            className={`lg:w-1/4 transition-all duration-300 ${filtersOpen ? 'block fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white shadow-xl lg:static lg:w-auto lg:shadow-sm lg:z-auto' : 'hidden lg:block'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <div className="lg:hidden mb-4 pb-4 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-900">{t('search_filter')}</h3>
                                        <button
                                            onClick={() => setFiltersOpen(false)}
                                            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                                            aria-label="Close filters"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden lg:block mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">{t('search_filter')}</h3>
                                </div>
                                
                                {/* Search */}
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t('search_products')}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </form>

                                {/* Location Filters */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => setActiveFilterSection(activeFilterSection === 'location' ? null : 'location')}
                                        className="w-full flex items-center justify-between font-medium text-slate-900 mb-3 lg:mb-3"
                                    >
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-purple-600" />
                                            {t('location') || 'الموقع'}
                                        </span>
                                        {activeFilterSection === 'location' ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400 lg:hidden" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400 lg:hidden" />
                                        )}
                                    </button>
                                    <div className={`space-y-3 ${activeFilterSection === 'location' || activeFilterSection === null ? 'block' : 'hidden lg:block'}`}>
                                        {/* Governorate */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                                {t('governorate')}
                                            </label>
                                            <select
                                                value={selectedGovernorate}
                                                onChange={(e) => handleGovernorateChange(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">{t('all_governorates')}</option>
                                                {safeGovernorates.map((gov) => (
                                                    <option key={gov.id} value={gov.id}>
                                                        {gov.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* City */}
                                        {selectedGovernorate && (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                                    {t('city')}
                                                </label>
                                                <select
                                                    value={selectedCity}
                                                    onChange={(e) => handleCityChange(e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value="">{t('all_cities') || 'جميع المناطق'}</option>
                                                    {availableCities.map((city) => (
                                                        <option key={city.id} value={city.id}>
                                                            {city.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => setActiveFilterSection(activeFilterSection === 'categories' ? null : 'categories')}
                                        className="w-full flex items-center justify-between font-medium text-slate-900 mb-3 lg:mb-3"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-purple-600" />
                                            {t('categories')}
                                        </span>
                                        {activeFilterSection === 'categories' ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400 lg:hidden" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400 lg:hidden" />
                                        )}
                                    </button>
                                    <div className={`space-y-2 ${activeFilterSection === 'categories' || activeFilterSection === null ? 'block' : 'hidden lg:block'}`}>
                                        <button
                                            onClick={() => handleCategoryChange('')}
                                            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                selectedCategory === '' 
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                {t('all_categories')}
                                            </span>
                                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                                                {safeProducts.total}
                                            </span>
                                        </button>
                                        {safeCategories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryChange(category.id)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    selectedCategory == category.id 
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-purple-600">
                                                        {getCategoryIcon(category.name)}
                                                    </span>
                                                    {category.name}
                                                </span>
                                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                                                    {category.products_count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <button
                                        onClick={() => setActiveFilterSection(activeFilterSection === 'sort' ? null : 'sort')}
                                        className="w-full flex items-center justify-between font-medium text-slate-900 mb-3 lg:mb-3"
                                    >
                                        <span className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-purple-600" />
                                            {t('sort_by')}
                                        </span>
                                        {activeFilterSection === 'sort' ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400 lg:hidden" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400 lg:hidden" />
                                        )}
                                    </button>
                                    <div className={`space-y-2 ${activeFilterSection === 'sort' || activeFilterSection === null ? 'block' : 'hidden lg:block'}`}>
                                        {[
                                            { value: 'sort_order', label: t('default_sort') },
                                            { value: 'name', label: t('sort_by_name') },
                                            { value: 'price', label: t('sort_by_price') },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortChange(option.value)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    sortBy === option.value 
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                            >
                                                <span>{option.label}</span>
                                                {sortBy === option.value && (
                                                    <span className="text-purple-600">
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
                            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <p className="text-sm sm:text-base text-slate-600">
                                    عرض {safeProducts.data.length} من {safeProducts.total} منتج
                                </p>
                                {/* Mobile Sort Button */}
                                <div className="lg:hidden w-full sm:w-auto">
                                    <select
                                        value={`${sortBy}_${sortDirection}`}
                                        onChange={(e) => {
                                            const [newSortBy, newDirection] = e.target.value.split('_');
                                            handleSortChange(newSortBy, newDirection);
                                        }}
                                        className="w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    >
                                        <option value="sort_order_asc">{t('default_sort')}</option>
                                        <option value="name_asc">{t('sort_by_name')} ↑</option>
                                        <option value="name_desc">{t('sort_by_name')} ↓</option>
                                        <option value="price_asc">{t('sort_by_price')} ↑</option>
                                        <option value="price_desc">{t('sort_by_price')} ↓</option>
                                    </select>
                                </div>
                            </div>

                            {safeProducts.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {safeProducts.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">لم يتم العثور على منتجات</h3>
                                    <p className="text-slate-600">جرب تغيير معايير البحث أو التصفية</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {safeProducts.links && safeProducts.links.length > 3 && (
                                <div className="mt-6 sm:mt-8 flex justify-center overflow-x-auto">
                                    <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                        {safeProducts.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg whitespace-nowrap ${
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
