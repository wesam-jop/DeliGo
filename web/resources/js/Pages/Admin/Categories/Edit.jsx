import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import CategoryForm from './CategoryForm';
import { useTranslation } from '../../../hooks/useTranslation';

export default function CategoryEdit({ category }) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(category?.image_url || null);

    const form = useForm({
        name_ar: category?.name_ar || category?.name || '',
        name_en: category?.name_en || category?.name || '',
        slug: category?.slug || '',
        description_ar: category?.description_ar || category?.description || '',
        description_en: category?.description_en || category?.description || '',
        icon: category?.icon || '',
        sort_order: category?.sort_order ?? 0,
        is_active: category?.is_active ?? true,
        image: null,
        remove_image: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.put(`/admin/categories/${category.id}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        form.setData('image', file);
        form.setData('remove_image', false);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveImage = () => {
        form.setData('image', null);
        form.setData('remove_image', true);
        setPreview(null);
    };

    return (
        <AdminLayout title={t('edit_category') || 'Edit category'}>
            <Head title={t('edit_category') || 'Edit category'} />

            <CategoryForm
                t={t}
                form={form}
                onSubmit={handleSubmit}
                processing={form.processing}
                submitLabel={form.processing ? (t('saving') || 'Saving...') : (t('update_category') || 'Update category')}
                title={t('edit_category') || 'Edit category'}
                description={t('category_edit_description') || 'Update the information and media for this category.'}
                imagePreview={preview}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
            />
        </AdminLayout>
    );
}

