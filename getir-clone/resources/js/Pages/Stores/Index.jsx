import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { Store, MapPin, ShoppingBag, Package, Search, Filter } from 'lucide-react';
import StoreCard from '../../Components/StoreCard';

export default function StoresIndex() {
    const { props } = usePage();
    const { stores, storeTypes, filters } = props;
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (type) params.set('type', type);
        window.location.href = `/stores?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearch('');
        setType('');
        window.location.href = '/stores';
    };

    return (
        <Layout>
            <Head title={t('stores_page_title')} />
            <div className="relative min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[220px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[220px]" />

                <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                    <div className="text-center text-white space-y-3">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl">
                            <Store className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-bold">{t('stores_page_title')}</h1>
                        <p className="text-purple-100 text-base">{t('stores_page_subtitle')}</p>
                        <p className="text-sm text-purple-200">
                            {t('stores_results_count', { count: stores.total })}
                        </p>
                    </div>

                    <form
                        onSubmit={handleFilter}
                        className="rounded-3xl border border-white/20 bg-white/95 shadow-2xl p-6 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('search')}
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t('stores_search_placeholder')}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('filter')}
                                </label>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">{t('stores_filter_all')}</option>
                                        {storeTypes.map((storeType) => (
                                            <option key={storeType} value={storeType}>
                                                {storeType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
                            >
                                {t('apply')}
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300"
                            >
                                {t('clear')}
                            </button>
                        </div>
                    </form>

                    {stores.data.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {stores.data.map((store) => (
                                // <div
                                //     key={store.id}
                                // className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-xl p-6 flex justify-between items-center flex-column"
                                // >
                                // <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 pointer-events-none" />

                                // <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                //     <div className="flex items-center gap-4">
                                //         <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-inner">
                                //             <Store className="w-6 h-6" />
                                //         </div>
                                //         <div>
                                //             <h2 className="text-xl font-bold text-slate-900">{store.name}</h2>
                                //             <p className="text-sm text-slate-500 capitalize">{store.store_type}</p>
                                //         </div>
                                //     </div>
                                //     <span
                                //         className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                //             store.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                //         }`}
                                //     >
                                //         {store.is_active ? t('store_products_available') : t('store_products_unavailable')}
                                //     </span>
                                // </div>
                                //     {store.address && (
                                //         <p className="text-sm text-slate-600 flex items-center gap-2 leading-relaxed">
                                //             <MapPin className="w-4 h-4 text-purple-500" />
                                //             {store.address}
                                //         </p>
                                //     )}
                                // <div className="grid grid-cols-2 gap-3 text-sm">
                                //     <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                //         <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{t('orders')}</p>
                                //         <div className="flex items-center gap-2">
                                //             <ShoppingBag className="w-4 h-4 text-purple-500" />
                                //             <span className="text-xl font-semibold text-slate-900">{store.orders_count}</span>
                                //         </div>
                                //         <p className="text-xs text-slate-500 mt-1">
                                //             {t('stores_orders_count', { count: store.orders_count })}
                                //         </p>
                                //     </div>
                                //     <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                //         <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                                //             {t('store_products_section_title')}
                                //         </p>
                                //         <div className="flex items-center gap-2">
                                //             <Package className="w-4 h-4 text-purple-500" />
                                //             <span className="text-xl font-semibold text-slate-900">{store.products_count}</span>
                                //         </div>
                                //         <p className="text-xs text-slate-500 mt-1">
                                //             {t('stores_products_count', { count: store.products_count })}
                                //         </p>
                                //     </div>
                                // </div>
                                // <div className="flex flex-wrap gap-3">
                                //         <Link
                                //             href={`/products?store=${store.id}`}
                                //         className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-purple-500/40 transition"
                                //         >
                                //             {t('stores_view_store')}
                                //         </Link>
                                //     </div>
                                // </div>
                                <StoreCard store={store} t={t} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl p-10 text-center">
                            <p className="text-lg font-semibold text-slate-900 mb-2">{t('stores_no_results')}</p>
                            <p className="text-sm text-slate-500">{t('stores_try_search')}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}


