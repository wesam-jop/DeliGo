import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    Plus,
    Save,
    Trash2,
    AlertCircle,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';

export default function StoreTypesSettings({ storeTypes = [] }) {
    const { t } = useTranslation();
    const createForm = useForm({
        key: '',
        name_ar: '',
        name_en: '',
        icon: '',
        description: '',
        display_order: storeTypes.length,
        is_active: true,
    });

    const handleCreate = (event) => {
        event.preventDefault();
        createForm.post('/admin/settings/store-types', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                createForm.setData('display_order', storeTypes.length + 1);
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm(t('confirm_delete_store_type') || 'Are you sure you want to delete this store type?')) {
            return;
        }
        router.delete(`/admin/settings/store-types/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('store_types_settings')}>
            <Head title={t('store_types_settings')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {t('store_types_admin_title') || t('store_types_settings')}
                        </h2>
                        <p className="text-slate-600 mt-2">
                            {t('store_types_admin_subtitle') || 'Create and manage the store categories that merchants can pick from.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {t('store_types_create_title') || 'Add new store type'}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {t('store_types_create_hint') || 'Define localized names and optional icon.'}
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    {t('store_type_key_label') || 'Key (slug)'}
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.key}
                                    onChange={(e) => createForm.setData('key', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="grocery"
                                />
                                {createForm.errors.key && (
                                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {createForm.errors.key}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        {t('store_type_name_ar') || 'Arabic name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name_ar}
                                        onChange={(e) => createForm.setData('name_ar', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="بقالة"
                                    />
                                    {createForm.errors.name_ar && (
                                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {createForm.errors.name_ar}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        {t('store_type_name_en') || 'English name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name_en}
                                        onChange={(e) => createForm.setData('name_en', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Grocery"
                                    />
                                    {createForm.errors.name_en && (
                                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {createForm.errors.name_en}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        {t('store_type_icon_label') || 'Emoji / Icon'}
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.icon}
                                        onChange={(e) => createForm.setData('icon', e.target.value)}
                                        maxLength={4}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="🛒"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        {t('display_order') || 'Display order'}
                                    </label>
                                    <input
                                        type="number"
                                        value={createForm.data.display_order}
                                        onChange={(e) => createForm.setData('display_order', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    {t('description') || 'Description'}
                                </label>
                                <textarea
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder={t('store_type_description_placeholder') || 'Short internal note'}
                                />
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                {t('active') || 'Active'}
                            </label>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {createForm.processing ? (
                                    <>
                                        <Save className="w-4 h-4 animate-spin" />
                                        {t('saving') || 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {t('save') || 'Save'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {storeTypes.length ? (
                            storeTypes.map((type) => (
                                <StoreTypeCard key={type.id} type={type} t={t} onDelete={handleDelete} />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                {t('store_types_empty_admin') || 'No store types yet. Create the first one using the form on the left.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StoreTypeCard({ type, t, onDelete }) {
    const form = useForm({
        key: type.key,
        name_ar: type.name_ar,
        name_en: type.name_en,
        icon: type.icon || '',
        description: type.description || '',
        display_order: type.display_order || 0,
        is_active: type.is_active,
    });

    const handleUpdate = (event) => {
        event.preventDefault();
        form.put(`/admin/settings/store-types/${type.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-xl flex items-center justify-center">
                        {form.data.icon || '🏬'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{form.data.name_en}</p>
                        <p className="text-xs text-slate-500">{form.data.key}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete && onDelete(type.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    disabled={type.key === 'grocery'}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('delete')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-slate-500">{t('store_type_name_en') || 'English name'}</label>
                    <input
                        type="text"
                        value={form.data.name_en}
                        onChange={(e) => form.setData('name_en', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {form.errors.name_en && <p className="text-xs text-rose-600 mt-1">{form.errors.name_en}</p>}
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500">{t('store_type_name_ar') || 'Arabic name'}</label>
                    <input
                        type="text"
                        value={form.data.name_ar}
                        onChange={(e) => form.setData('name_ar', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {form.errors.name_ar && <p className="text-xs text-rose-600 mt-1">{form.errors.name_ar}</p>}
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500">{t('store_type_key_label') || 'Key'}</label>
                    <input
                        type="text"
                        value={form.data.key}
                        onChange={(e) => form.setData('key', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {form.errors.key && <p className="text-xs text-rose-600 mt-1">{form.errors.key}</p>}
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500">{t('store_type_icon_label') || 'Icon'}</label>
                    <input
                        type="text"
                        value={form.data.icon}
                        onChange={(e) => form.setData('icon', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500">{t('display_order') || 'Order'}</label>
                    <input
                        type="number"
                        value={form.data.display_order}
                        onChange={(e) => form.setData('display_order', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => form.setData('is_active', !form.data.is_active)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                        {form.data.is_active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                        {form.data.is_active ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
                    </button>
                </div>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-500">{t('description') || 'Description'}</label>
                <textarea
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('store_type_description_placeholder') || ''}
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {form.processing ? (t('saving') || 'Saving...') : (t('save_changes') || 'Save changes')}
                </button>
            </div>
        </form>
    );
}

