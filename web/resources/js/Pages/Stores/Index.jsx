import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import StoreCard from '../../Components/StoreCard';
import { 
    Store, 
    Search,
    MapPin,
    Package,
    ShoppingBag,
    Filter,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function StoresIndex({ stores, storeTypes, governorates, cities: initialCities, filters, userGovernorateId, userCityId }) {
    const { t, locale } = useTranslation();
    
    // حماية من البيانات غير المحددة
    const safeFilters = filters || {};
    const safeStores = stores || { data: [], total: 0, links: [] };
    const safeStoreTypes = storeTypes || [];
    const safeGovernorates = governorates || [];

    // استخدام إعدادات المستخدم كقيم افتراضية إذا لم يتم تحديد فلتر
    const [search, setSearch] = useState(() => safeFilters?.search || '');
    const [selectedType, setSelectedType] = useState(() => safeFilters?.type || '');
    const [selectedGovernorate, setSelectedGovernorate] = useState(() => {
        return safeFilters?.governorate_id || userGovernorateId || '';
    });
    const [selectedCity, setSelectedCity] = useState(() => safeFilters?.city_id || userCityId || '');
    const [availableCities, setAvailableCities] = useState(() => initialCities || []);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeFilterSection, setActiveFilterSection] = useState(null);
    
    // جلب المدن عند تغيير المحافظة أو عند تحميل الصفحة لأول مرة
    React.useEffect(() => {
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
                            router.get('/stores', {
                                search,
                                type: selectedType,
                                governorate_id: selectedGovernorate,
                                city_id: userCityId,
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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/stores', {
            search,
            type: selectedType,
            governorate_id: selectedGovernorate,
            city_id: selectedCity,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        router.get('/stores', {
            search,
            type: type,
            governorate_id: selectedGovernorate,
            city_id: selectedCity,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleGovernorateChange = async (governorateId) => {
        setSelectedGovernorate(governorateId);
        setSelectedCity(''); // إعادة تعيين المدينة عند تغيير المحافظة
        
        router.get('/stores', {
            search,
            type: selectedType,
            governorate_id: governorateId,
            city_id: '',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCityChange = (cityId) => {
        setSelectedCity(cityId);
        router.get('/stores', {
            search,
            type: selectedType,
            governorate_id: selectedGovernorate,
            city_id: cityId,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <Layout>
            <Head title={t('stores_page_title')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('stores_page_title')}</h1>
                        <p className="text-sm sm:text-base text-slate-600 mt-1">{t('stores_page_subtitle') || 'تصفح جميع المتاجر المتاحة'}</p>
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
                                        <h3 className="text-lg font-semibold text-slate-900">{t('search_filter') || 'البحث والفلترة'}</h3>
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
                                    <h3 className="text-lg font-semibold text-slate-900">{t('search_filter') || 'البحث والفلترة'}</h3>
                                </div>
                                
                                {/* Search */}
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t('stores_search_placeholder') || 'ابحث عن متجر...'}
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

                                {/* Store Types */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => setActiveFilterSection(activeFilterSection === 'types' ? null : 'types')}
                                        className="w-full flex items-center justify-between font-medium text-slate-900 mb-3 lg:mb-3"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-purple-600" />
                                            {t('store_type') || 'نوع المتجر'}
                                        </span>
                                        {activeFilterSection === 'types' ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400 lg:hidden" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400 lg:hidden" />
                                        )}
                                    </button>
                                    <div className={`space-y-2 ${activeFilterSection === 'types' || activeFilterSection === null ? 'block' : 'hidden lg:block'}`}>
                                        <button
                                            onClick={() => handleTypeChange('')}
                                            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                selectedType === '' 
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Store className="w-4 h-4" />
                                                {t('stores_filter_all') || 'جميع الأنواع'}
                                            </span>
                                        </button>
                                        {safeStoreTypes.map((storeType) => (
                                            <button
                                                key={storeType.value}
                                                onClick={() => handleTypeChange(storeType.value)}
                                                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    selectedType === storeType.value 
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                                }`}
                                            >
                                                <span>{storeType.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stores Grid */}
                        <div className="lg:w-3/4">
                            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <p className="text-sm sm:text-base text-slate-600">
                                    عرض {safeStores.data.length} من {safeStores.total} متجر
                                </p>
                            </div>

                            {safeStores.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {safeStores.data.map((store) => (
                                        <StoreCard key={store.id} store={store} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">{t('stores_no_results') || 'لم يتم العثور على متاجر'}</h3>
                                    <p className="text-slate-600">{t('stores_try_search') || 'جرب تغيير معايير البحث أو التصفية'}</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {safeStores.links && safeStores.links.length > 3 && (
                                <div className="mt-6 sm:mt-8 flex justify-center overflow-x-auto">
                                    <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                        {safeStores.links.map((link, index) => (
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
        </Layout>
    );
}
