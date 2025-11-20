import React from 'react';
import { Link } from '@inertiajs/react';
import { Upload, Image as ImageIcon, Trash2, ChevronLeft } from 'lucide-react';

export default function CategoryForm({
    t,
    form,
    onSubmit,
    processing,
    submitLabel,
    title,
    description,
    backHref = '/admin/categories',
    imagePreview,
    onImageChange,
    onRemoveImage,
}) {
    const slugify = (value) => {
        if (!value) return '';
        return value
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{t('categories')}</p>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    {description && <p className="text-slate-500 mt-1">{description}</p>}
                </div>
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {t('back_to_categories') || 'Back to categories'}
                </Link>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{t('category_basic_info') || 'Basic information'}</p>
                        <p className="text-xs text-slate-500">{t('category_basic_info_hint') || 'Control how the category appears to shoppers.'}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_name_ar_label') || 'Arabic name'}
                            </label>
                            <input
                                type="text"
                                value={form.data.name_ar}
                                onChange={(e) => form.setData('name_ar', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={t('category_name_ar_placeholder') || 'مثال: البقالة'}
                            />
                            {form.errors.name_ar && <p className="text-xs text-rose-600 mt-1">{form.errors.name_ar}</p>}
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-semibold text-slate-700">
                                    {t('category_slug_label') || 'Slug'}
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData('slug', slugify(form.data.name_en || form.data.name_ar))
                                    }
                                    className="text-xs text-purple-600 hover:text-purple-700"
                                >
                                    {t('auto_generate') || 'Auto-generate'}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={form.data.slug || ''}
                                onChange={(e) => form.setData('slug', slugify(e.target.value))}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="bakery"
                            />
                            {form.errors.slug && <p className="text-xs text-rose-600 mt-1">{form.errors.slug}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_name_en_label') || 'English name'}
                            </label>
                            <input
                                type="text"
                                value={form.data.name_en}
                                onChange={(e) => form.setData('name_en', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Bakery"
                            />
                            {form.errors.name_en && <p className="text-xs text-rose-600 mt-1">{form.errors.name_en}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_icon_label') || 'Emoji/Icon'}
                            </label>
                            <input
                                type="text"
                                value={form.data.icon || ''}
                                onChange={(e) => form.setData('icon', e.target.value)}
                                maxLength={4}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="🛒"
                            />
                            {form.errors.icon && <p className="text-xs text-rose-600 mt-1">{form.errors.icon}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_sort_order_label') || 'Sort order'}
                            </label>
                            <input
                                type="number"
                                value={form.data.sort_order ?? ''}
                                onChange={(e) => form.setData('sort_order', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {form.errors.sort_order && <p className="text-xs text-rose-600 mt-1">{form.errors.sort_order}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_description_ar_label') || 'Arabic description'}
                            </label>
                            <textarea
                                value={form.data.description_ar || ''}
                                onChange={(e) => form.setData('description_ar', e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={t('category_description_placeholder') || 'وصف مختصر يظهر للمستخدمين'}
                            />
                            {form.errors.description_ar && (
                                <p className="text-xs text-rose-600 mt-1">{form.errors.description_ar}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                {t('category_description_en_label') || 'English description'}
                            </label>
                            <textarea
                                value={form.data.description_en || ''}
                                onChange={(e) => form.setData('description_en', e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Short description shown to users"
                            />
                            {form.errors.description_en && (
                                <p className="text-xs text-rose-600 mt-1">{form.errors.description_en}</p>
                            )}
                        </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                            type="checkbox"
                            checked={!!form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        {t('category_status_label') || 'Category is active'}
                    </label>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{t('category_media') || 'Media'}</p>
                        <p className="text-xs text-slate-500">
                            {t('category_image_help') || 'Upload a 600x600 image or use an emoji icon.'}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="flex flex-col items-center justify-center flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center cursor-pointer hover:border-purple-400 transition">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-2xl shadow mb-3"
                                />
                            ) : (
                                <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
                            )}
                            <span className="text-sm font-semibold text-slate-700">
                                {imagePreview ? t('change_image') || 'Change image' : t('upload_image') || 'Upload image'}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">{t('category_image_label') || 'PNG or JPG up to 2 MB'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                        </label>

                        {imagePreview && (
                            <button
                                type="button"
                                onClick={onRemoveImage}
                                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                {t('remove_image') || 'Remove image'}
                            </button>
                        )}
                    </div>
                    {form.errors.image && <p className="text-xs text-rose-600">{form.errors.image}</p>}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}

