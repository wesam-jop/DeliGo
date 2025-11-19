import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from './Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    User, 
    Save,
    Upload,
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    ShoppingCart,
    Store,
    Package,
    CheckCircle,
    AlertCircle,
    Loader,
    X,
    Edit,
    Settings,
    HelpCircle,
    Zap
} from 'lucide-react';

export default function Profile({ user: initialUser, stats }) {
    const { t } = useTranslation();
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: initialUser?.name || '',
        phone: initialUser?.phone || '',
        address: initialUser?.address || '',
        latitude: initialUser?.latitude || '',
        longitude: initialUser?.longitude || '',
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setAvatarPreview(null);
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (initialUser?.avatar) {
            return initialUser.avatar.startsWith('http') 
                ? initialUser.avatar 
                : `/storage/${initialUser.avatar}`;
        }
        return null;
    };

    const getUserTypeLabel = (type) => {
        const labels = {
            admin: t('admin') || 'Admin',
            customer: t('customer') || 'Customer',
            store_owner: t('store_owner') || 'Store Owner',
            driver: t('driver') || 'Driver',
        };
        return labels[type] || type;
    };

    return (
        <AdminLayout title={t('profile') || 'Profile'}>
            <Head title={t('profile') || 'Profile'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('profile') || 'Profile'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_your_profile') || 'Manage your profile information and settings'}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_orders') || 'Total Orders'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.total_orders || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('completed_orders') || 'Completed Orders'}</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats?.completed_orders || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    {stats?.total_stores > 0 && (
                        <>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">{t('total_stores') || 'Total Stores'}</p>
                                        <p className="text-2xl font-bold text-purple-600 mt-1">{stats?.total_stores || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">{t('active_stores') || 'Active Stores'}</p>
                                        <p className="text-2xl font-bold text-indigo-600 mt-1">{stats?.active_stores || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-purple-600" />
                                    {t('personal_information') || 'Personal Information'}
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                            {getAvatarUrl() ? (
                                                <img 
                                                    src={getAvatarUrl()} 
                                                    alt={data.name || 'Avatar'} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full flex items-center justify-center ${getAvatarUrl() ? 'hidden' : ''}`}>
                                                <User className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                                            <Camera className="w-4 h-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{data.name || t('admin_user') || 'Admin User'}</h4>
                                        <p className="text-sm text-slate-600 mb-2">{getUserTypeLabel(initialUser?.user_type)}</p>
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors text-sm font-medium text-slate-700">
                                            <Upload className="w-4 h-4" />
                                            <span>{t('upload_photo') || 'Upload Photo'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('name') || 'Name'} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder={t('enter_your_name') || 'Enter your name'}
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('phone') || 'Phone'} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder={t('enter_your_phone') || 'Enter your phone number'}
                                            required
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('address') || 'Address'}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder={t('enter_your_address') || 'Enter your address'}
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* Location Coordinates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            {t('latitude') || 'Latitude'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="-90 to 90"
                                        />
                                        {errors.latitude && (
                                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.latitude}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            {t('longitude') || 'Longitude'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="-180 to 180"
                                        />
                                        {errors.longitude && (
                                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.longitude}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span>{t('saving') || 'Saving...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>{t('save_changes') || 'Save Changes'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-6">
                        {/* Account Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-slate-600" />
                                    {t('account_details') || 'Account Details'}
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-slate-600">{t('user_type') || 'User Type'}</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {getUserTypeLabel(initialUser?.user_type)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-600">{t('verification_status') || 'Verification Status'}</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                        initialUser?.is_verified
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                    }`}>
                                        {initialUser?.is_verified ? (
                                            <>
                                                <CheckCircle className="w-3 h-3" />
                                                {t('verified') || 'Verified'}
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-3 h-3" />
                                                {t('unverified') || 'Unverified'}
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-600">{t('member_since') || 'Member Since'}</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {initialUser?.created_at ? new Date(initialUser.created_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    {t('quick_actions') || 'Quick Actions'}
                                </h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => router.visit('/admin/settings/general')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <Settings className="w-5 h-5 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">{t('settings') || 'Settings'}</span>
                                </button>
                                <button
                                    onClick={() => router.visit('/admin/help')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <HelpCircle className="w-5 h-5 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">{t('help') || 'Help'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

