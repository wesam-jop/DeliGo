import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { useGeneralSettings } from '../../../hooks/useGeneralSettings';
import { 
    Store, 
    Search, 
    Filter,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    Calendar,
    Phone,
    MapPin,
    User,
    ShoppingCart,
    Package,
    DollarSign,
    Download,
    Plus,
    Clock,
    Mail,
    Navigation
} from 'lucide-react';

export default function Stores({ stores, stats }) {
    const { t } = useTranslation();
    const { formatCurrency } = useGeneralSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredStores = stores?.filter(store => {
        const matchesSearch = 
            store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.phone?.includes(searchTerm) ||
            store.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
            filterStatus === 'all' ||
            (filterStatus === 'active' && store.is_active) ||
            (filterStatus === 'inactive' && !store.is_active);
        
        return matchesSearch && matchesFilter;
    }) || [];

    const handleToggleActive = (store) => {
        router.post(`/admin/stores/${store.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('stores')}>
            <Head title={t('stores')} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('stores')}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_stores') || 'Manage all stores in the platform'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('export') || 'Export'}</span>
                        </button>
                        <Link
                            href="/admin/stores/create"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-semibold">{t('add_store') || 'Add Store'}</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('total_stores') || 'Total Stores'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total || 0}</p>
                                <p className="text-xs text-blue-600 mt-1">{t('all_stores') || 'All stores'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Store className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('active_stores') || 'Active'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.active || 0}</p>
                                <p className="text-xs text-green-600 mt-1">{t('operational') || 'Operational'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700">{t('inactive_stores') || 'Inactive'}</p>
                                <p className="text-3xl font-bold text-red-900 mt-2">{stats?.inactive || 0}</p>
                                <p className="text-xs text-red-600 mt-1">{t('suspended') || 'Suspended'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_orders') || 'Total Orders'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.total_orders || 0}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('all_orders') || 'All orders'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700">{t('total_products') || 'Products'}</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{stats?.total_products || 0}</p>
                                <p className="text-xs text-orange-600 mt-1">{t('all_products') || 'All products'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">{t('total_revenue') || 'Revenue'}</p>
                                <p className="text-2xl font-bold text-emerald-900 mt-2">
                                    {formatCurrency(stats?.total_revenue || 0)}
                                </p>
                                <p className="text-xs text-emerald-600 mt-1">{t('total_earnings') || 'Total earnings'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl shadow-sm border border-lime-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-lime-700">{t('platform_share_total_label') || 'Platform share'}</p>
                                <p className="text-2xl font-bold text-lime-900 mt-2">
                                    {formatCurrency(stats?.platform_cut_total || 0)}
                                </p>
                                <p className="text-xs text-lime-600 mt-1">
                                    {t('platform_commission_current', { percent: stats?.commission_percentage ?? 0 }) || ''}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_stores') || 'Search by store name, code, address, phone, or owner...'}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">{t('filter') || 'Filter'}</span>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium text-slate-700 min-w-[150px]"
                            >
                                <option value="all">{t('all') || 'All'}</option>
                                <option value="active">{t('active') || 'Active'}</option>
                                <option value="inactive">{t('inactive') || 'Inactive'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stores Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('store') || 'Store'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('owner') || 'Owner'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('contact_info') || 'Contact Info'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('stats') || 'Stats'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('status') || 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('created_at') || 'Created'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredStores.length > 0 ? (
                                    filteredStores.map((store) => (
                                        <tr key={store.id} className="hover:bg-slate-50/50 transition-all duration-150 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {store.logo_path ? (
                                                        <img 
                                                            src={store.logo_path} 
                                                            alt={store.name}
                                                            className="w-12 h-12 rounded-xl object-cover shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                            {store.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-900 truncate">
                                                            {store.name || '-'}
                                                        </div>
                                                        {store.code && (
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                {t('code') || 'Code'}: {store.code}
                                                            </div>
                                                        )}
                                                        {store.store_type && (
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                {store.store_type_label || store.store_type}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {store.owner ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900">{store.owner.name}</div>
                                                            <div className="text-xs text-slate-500">ID: {store.owner.id}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {store.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                                <Phone className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <span className="text-slate-700 font-medium">{store.phone}</span>
                                                        </div>
                                                    )}
                                                    {store.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                                                <Mail className="w-4 h-4 text-purple-600" />
                                                            </div>
                                                            <span className="text-slate-600 truncate max-w-xs">{store.email}</span>
                                                        </div>
                                                    )}
                                                    {store.address && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                                <MapPin className="w-4 h-4 text-green-600" />
                                                            </div>
                                                            <span className="text-slate-600 truncate max-w-xs">{store.address}</span>
                                                        </div>
                                                    )}
                                                    {store.latitude && store.longitude && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Navigation className="w-3 h-3" />
                                                            <span>{t('location_available') || 'Location available'}</span>
                                                        </div>
                                                    )}
                                                    {!store.phone && !store.email && !store.address && (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                                            <ShoppingCart className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {store.orders_count || 0}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {t('orders') || 'orders'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {store.products_count || 0}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {t('products') || 'products'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {formatCurrency(store.platform_revenue?.delivered_total || 0)}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {t('store_revenue_total') || 'Delivered revenue'}
                                                            </div>
                                                            <div className="text-[11px] text-emerald-600 mt-1">
                                                                {t('store_platform_cut_label', {
                                                                    percent: store.platform_revenue?.commission_percentage ?? 0,
                                                                })}{' '}
                                                                : {formatCurrency(store.platform_revenue?.platform_cut || 0)}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500">
                                                                {t('store_net_revenue') || 'Store net'}:{' '}
                                                                {formatCurrency(store.platform_revenue?.store_net || 0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleActive(store)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                                        store.is_active
                                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {store.is_active ? (
                                                        <>
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>{t('active') || 'Active'}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>{t('inactive') || 'Inactive'}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {new Date(store.created_at).toLocaleDateString('ar-SA', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {new Date(store.created_at).toLocaleDateString('ar-SA', {
                                                                weekday: 'short'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/stores/${store.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('view') || 'View'}
                                                    >
                                                        <Eye className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/stores/${store.id}/edit`}
                                                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('edit') || 'Edit'}
                                                    >
                                                        <Edit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Store className="w-10 h-10 text-slate-400" />
                                                </div>
                                                <p className="text-slate-600 font-medium mb-1">{t('no_stores_found') || 'No stores found'}</p>
                                                <p className="text-sm text-slate-400">{t('try_different_search') || 'Try adjusting your search or filter criteria'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Count */}
                {filteredStores.length > 0 && (
                    <div className="text-center text-sm text-slate-600">
                        {t('showing_results') || 'Showing'} {filteredStores.length} {t('of') || 'of'} {stores?.length || 0} {t('stores') || 'stores'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

