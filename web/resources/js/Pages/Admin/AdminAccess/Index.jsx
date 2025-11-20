import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Shield, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Phone,
    User,
    Calendar,
    FileText
} from 'lucide-react';

export default function AdminAccessIndex({ adminAccesses }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAccesses = adminAccesses?.filter(access => {
        const matchesSearch = 
            access.phone?.includes(searchTerm) ||
            access.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            access.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    }) || [];

    const toggleActive = (adminAccess) => {
        router.post(`/admin/admin-access/${adminAccess.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (access) => {
        const message = t('confirm_delete_access') || 'Are you sure you want to delete this access permission?';
        if (confirm(message)) {
            router.delete(`/admin/admin-access/${access.id}`);
        }
    };

    return (
        <AdminLayout title={t('access_permissions')}>
            <Head title={t('access_permissions')} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('access_permissions')}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_access_permissions') || 'Manage accounts allowed to access the admin dashboard'}</p>
                    </div>
                    <Link
                        href="/admin/admin-access/create"
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-semibold">{t('add_new_permission') || 'Add New Permission'}</span>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_permissions') || 'Total Permissions'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{adminAccesses?.length || 0}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('all_permissions') || 'All permissions'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('active_permissions') || 'Active Permissions'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">
                                    {adminAccesses?.filter(a => a.is_active).length || 0}
                                </p>
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
                                <p className="text-sm font-medium text-red-700">{t('disabled_permissions') || 'Disabled Permissions'}</p>
                                <p className="text-3xl font-bold text-red-900 mt-2">
                                    {adminAccesses?.filter(a => !a.is_active).length || 0}
                                </p>
                                <p className="text-xs text-red-600 mt-1">{t('disabled') || 'Disabled'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
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
                                placeholder={t('search_permissions') || 'Search by phone, user name, or notes...'}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('phone_number') || 'Phone Number'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('user') || 'User'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('status') || 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('notes') || 'Notes'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('created_at') || 'Created At'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredAccesses.length > 0 ? (
                                    filteredAccesses.map((access) => (
                                        <tr key={access.id} className="hover:bg-slate-50/50 transition-all duration-150 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <Phone className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">{access.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {access.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                                                            <User className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900">{access.user.name}</div>
                                                            <div className="text-xs text-slate-500">ID: {access.user.id}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">{t('not_linked') || 'Not linked'}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleActive(access)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                                        access.is_active
                                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {access.is_active ? (
                                                        <>
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>{t('active') || 'Active'}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>{t('disabled') || 'Disabled'}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                {access.notes ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-4 h-4 text-slate-600" />
                                                        </div>
                                                        <span className="text-sm text-slate-600 max-w-xs truncate">{access.notes}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {new Date(access.created_at).toLocaleDateString('ar-SA', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {new Date(access.created_at).toLocaleDateString('ar-SA', {
                                                                weekday: 'short'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/admin-access/${access.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('view') || 'View'}
                                                    >
                                                        <Eye className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/admin-access/${access.id}/edit`}
                                                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group/action"
                                                        title={t('edit') || 'Edit'}
                                                    >
                                                        <Edit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(access)}
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
                                                    <Shield className="w-10 h-10 text-slate-400" />
                                                </div>
                                                <p className="text-slate-600 font-medium mb-1">{t('no_permissions_found') || 'No permissions found'}</p>
                                                <p className="text-sm text-slate-400 mb-4">{t('try_different_search') || 'Try adjusting your search criteria'}</p>
                                                <Link
                                                    href="/admin/admin-access/create"
                                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>{t('add_new_permission') || 'Add New Permission'}</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Count */}
                {filteredAccesses.length > 0 && (
                    <div className="text-center text-sm text-slate-600">
                        {t('showing_results') || 'Showing'} {filteredAccesses.length} {t('of') || 'of'} {adminAccesses?.length || 0} {t('permissions') || 'permissions'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

