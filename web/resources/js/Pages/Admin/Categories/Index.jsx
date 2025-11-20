import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { useGeneralSettings } from '../../../hooks/useGeneralSettings';
import {
    Tag,
    Search,
    Filter,
    Edit,
    CheckCircle,
    XCircle,
    Calendar,
    Package,
    Download,
    Plus,
    ShoppingCart,
    Grid3x3,
    FileText,
    Trash2,
} from 'lucide-react';

export default function Categories({ categories, stats }) {
    const { t } = useTranslation();
    const { formatDate, formatTime } = useGeneralSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const normalizedSearch = searchTerm.toLowerCase();
    const filteredCategories = categories?.filter(category => {
        const searchable = [
            category.display_name,
            category.name_en,
            category.name_ar,
            category.display_description,
            category.description_en,
            category.description_ar,
            category.slug,
        ]
            .filter(Boolean)
            .map((value) => value.toLowerCase());

        const matchesSearch =
            !normalizedSearch || searchable.some((value) => value.includes(normalizedSearch));

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'active' && category.is_active) ||
            (filterStatus === 'inactive' && !category.is_active) ||
            (filterStatus === 'with_products' && category.products_count > 0) ||
            (filterStatus === 'without_products' && category.products_count === 0);

        return matchesSearch && matchesFilter;
    }) || [];

    const handleToggleActive = (category) => {
        router.post(`/admin/categories/${category.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (category) => {
        if (!confirm(t('confirm_delete_category') || 'Delete this category?')) {
            return;
        }

        router.delete(`/admin/categories/${category.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('categories')}>
            <Head title={t('categories')} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('categories')}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_categories') || 'Manage all product categories'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('export') || 'Export'}</span>
                        </button>
                        <Link
                            href="/admin/categories/create"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-semibold">{t('add_category') || 'Add Category'}</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('total_categories') || 'Total Categories'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total || 0}</p>
                                <p className="text-xs text-blue-600 mt-1">{t('all_categories') || 'All categories'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Tag className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('active_categories') || 'Active'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.active || 0}</p>
                                <p className="text-xs text-green-600 mt-1">{t('enabled') || 'Enabled'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700">{t('inactive_categories') || 'Inactive'}</p>
                                <p className="text-3xl font-bold text-red-900 mt-2">{stats?.inactive || 0}</p>
                                <p className="text-xs text-red-600 mt-1">{t('disabled') || 'Disabled'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_products') || 'Total Products'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.total_products || 0}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('all_products') || 'All products'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700">{t('with_products') || 'With Products'}</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{stats?.categories_with_products || 0}</p>
                                <p className="text-xs text-orange-600 mt-1">{t('has_products') || 'Has products'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-700">{t('without_products') || 'Empty'}</p>
                                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats?.categories_without_products || 0}</p>
                                <p className="text-xs text-yellow-600 mt-1">{t('no_products') || 'No products'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Grid3x3 className="w-7 h-7 text-white" />
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
                                placeholder={t('search_categories') || 'Search by name, description, or slug...'}
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
                                <option value="with_products">{t('with_products') || 'With Products'}</option>
                                <option value="without_products">{t('without_products') || 'Without Products'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('category') || 'Category'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('description') || 'Description'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('products') || 'Products'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('sort_order') || 'Sort Order'}
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
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-slate-50/50 transition-all duration-150 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {category.image_url ? (
                                                        <img 
                                                            src={category.image_url} 
                                                            alt={category.display_name}
                                                            className="w-12 h-12 rounded-xl object-cover shadow-md"
                                                        />
                                                    ) : category.icon ? (
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                                            {category.icon}
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                            {(category.display_name || '?').charAt(0)?.toUpperCase() || 'C'}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-900 truncate">
                                                            {category.display_name || '-'}
                                                        </div>
                                                        <div className="text-xs text-slate-500 flex flex-wrap gap-1 mt-0.5">
                                                            {category.name_ar && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                                    AR: {category.name_ar}
                                                                </span>
                                                            )}
                                                            {category.name_en && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                                    EN: {category.name_en}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {category.slug && (
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                /{category.slug}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {category.display_description ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-4 h-4 text-slate-600" />
                                                        </div>
                                                        <span className="text-sm text-slate-600 truncate max-w-xs">
                                                            {category.display_description}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">
                                                            {category.products_count || 0}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {t('products') || 'products'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <Grid3x3 className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {category.sort_order || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleActive(category)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                                        category.is_active
                                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {category.is_active ? (
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
                                                            {formatDate(category.created_at)}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {formatTime(category.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/categories/${category.id}/edit`}
                                                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('edit') || 'Edit'}
                                                    >
                                                        <Edit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(category)}
                                                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 group/action"
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
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Tag className="w-10 h-10 text-slate-400" />
                                                </div>
                                                <p className="text-slate-600 font-medium mb-1">{t('no_categories_found') || 'No categories found'}</p>
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
                {filteredCategories.length > 0 && (
                    <div className="text-center text-sm text-slate-600">
                        {t('showing_results') || 'Showing'} {filteredCategories.length} {t('of') || 'of'} {categories?.length || 0} {t('categories') || 'categories'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

