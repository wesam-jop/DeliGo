import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import CategoryForm from './CategoryForm';
import { useTranslation } from '../../../hooks/useTranslation';

export default function CategoryCreate({ nextSortOrder }) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);

    const form = useForm({
        name_ar: '',
        name_en: '',
        slug: '',
        description_ar: '',
        description_en: '',
        icon: '',
        sort_order: nextSortOrder || 0,
        is_active: true,
        image: null,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.post('/admin/categories', {
            forceFormData: true,
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        form.setData('image', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveImage = () => {
        form.setData('image', null);
        setPreview(null);
    };

    return (
        <AdminLayout title={t('add_category') || 'Add category'}>
            <Head title={t('add_category') || 'Add category'} />

            <CategoryForm
                t={t}
                form={form}
                onSubmit={handleSubmit}
                processing={form.processing}
                submitLabel={form.processing ? (t('saving') || 'Saving...') : (t('save_category') || 'Save category')}
                title={t('new_category') || 'New category'}
                description={t('category_form_description') || 'Define the category details and media that appear to customers.'}
                imagePreview={preview}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
            />
        </AdminLayout>
    );
}

