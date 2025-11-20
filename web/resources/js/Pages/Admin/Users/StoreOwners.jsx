import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Store, 
    Search, 
    Filter,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    ShoppingCart,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Plus,
    Download,
    Package,
    TrendingUp
} from 'lucide-react';

export default function StoreOwners({ storeOwners, stats }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredStoreOwners = storeOwners?.filter(owner => {
        const matchesSearch = 
            owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            owner.phone?.includes(searchTerm);
        
        const matchesFilter = 
            filterStatus === 'all' ||
            (filterStatus === 'verified' && owner.is_verified) ||
            (filterStatus === 'unverified' && !owner.is_verified) ||
            (filterStatus === 'with_stores' && owner.stores_count > 0);
        
        return matchesSearch && matchesFilter;
    }) || [];

    const handleDelete = (owner) => {
        const message = t('confirm_delete_store_owner') || 'Are you sure you want to delete this store owner?';
        if (confirm(message)) {
            router.delete(`/admin/users/${owner.id}`);
        }
    };

    return (
        <AdminLayout title={t('store_owners')}>
            <Head title={t('store_owners')} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('store_owners')}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_store_owners') || 'Manage all store owner accounts'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('export') || 'Export'}</span>
                        </button>
                        <Link
                            href="/admin/users/create"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-semibold">{t('add_store_owner') || 'Add Store Owner'}</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('total_store_owners') || 'Total Store Owners'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.total || 0}</p>
                                <p className="text-xs text-green-600 mt-1">{t('all_registered') || 'All registered'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Store className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('verified_store_owners') || 'Verified'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.verified || 0}</p>
                                <p className="text-xs text-blue-600 mt-1">{t('active_accounts') || 'Active accounts'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-700">{t('unverified_store_owners') || 'Unverified'}</p>
                                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats?.unverified || 0}</p>
                                <p className="text-xs text-yellow-600 mt-1">{t('pending_verification') || 'Pending verification'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('active_stores') || 'Active Stores'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.active_stores || 0}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('running_stores') || 'Running stores'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-white" />
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
                                placeholder={t('search_store_owners') || 'Search store owners by name or phone...'}
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
                                <option value="verified">{t('verified') || 'Verified'}</option>
                                <option value="unverified">{t('unverified') || 'Unverified'}</option>
                                <option value="with_stores">{t('with_stores') || 'With Stores'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Store Owners Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('store_owner') || 'Store Owner'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('contact_info') || 'Contact Info'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('stores') || 'Stores'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('status') || 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('joined_date') || 'Joined'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredStoreOwners.length > 0 ? (
                                    filteredStoreOwners.map((owner) => (
                                        <tr key={owner.id} className="hover:bg-slate-50/50 transition-all duration-150 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
                                                            {owner.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </div>
                                                        {owner.is_verified && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-900 truncate">
                                                            {owner.name || '-'}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                            ID: {owner.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {owner.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                                <Phone className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <span className="text-slate-700 font-medium">{owner.phone}</span>
                                                        </div>
                                                    )}
                                                    {owner.address && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                                <MapPin className="w-4 h-4 text-green-600" />
                                                            </div>
                                                            <span className="text-slate-600 truncate max-w-xs">{owner.address}</span>
                                                        </div>
                                                    )}
                                                    {!owner.phone && !owner.address && (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                                                        <Store className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">
                                                            {owner.stores_count || 0}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {t('stores') || 'stores'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {owner.stores && owner.stores.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {owner.stores.slice(0, 2).map((store) => (
                                                            <span key={store.id} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                                                                {store.name}
                                                            </span>
                                                        ))}
                                                        {owner.stores.length > 2 && (
                                                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                                                                +{owner.stores.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                                                    owner.is_verified
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                    {owner.is_verified ? (
                                                        <>
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>{t('verified') || 'Verified'}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>{t('unverified') || 'Unverified'}</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {new Date(owner.created_at).toLocaleDateString('ar-SA', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {new Date(owner.created_at).toLocaleDateString('ar-SA', {
                                                                weekday: 'short'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/users/${owner.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('view') || 'View'}
                                                    >
                                                        <Eye className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/users/${owner.id}/edit`}
                                                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('edit') || 'Edit'}
                                                    >
                                                        <Edit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(owner)}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('delete') || 'Delete'}
                                                    >
                                                        <Trash2 className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Store className="w-10 h-10 text-slate-400" />
                                                </div>
                                                <p className="text-slate-600 font-medium mb-1">{t('no_store_owners_found') || 'No store owners found'}</p>
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
                {filteredStoreOwners.length > 0 && (
                    <div className="text-center text-sm text-slate-600">
                        {t('showing_results') || 'Showing'} {filteredStoreOwners.length} {t('of') || 'of'} {storeOwners?.length || 0} {t('store_owners') || 'store owners'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

