import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Layout from '../Layout';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { useTranslation } from '../../hooks/useTranslation';
import {
    Store as StoreIcon,
    ShoppingBag,
    Clock,
    Receipt,
    DollarSign,
    Package,
    Layers,
    Settings,
    Plus,
    Upload,
} from 'lucide-react';

export default function StoreDashboard({
    store,
    stats,
    recentOrders,
    topProducts,
    dailySales,
    productCategories,
    storeProducts,
}) {
    const { flash } = usePage().props;
    const { t, locale } = useTranslation();

    const productForm = useForm({
        name: '',
        category_id: productCategories[0]?.id || '',
        price: '',
        stock_quantity: 0,
        unit: 'piece',
        description: '',
        image: null,
    });

    const handleProductSubmit = (e) => {
        e.preventDefault();
        productForm.post('/dashboard/store/products', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                productForm.reset('name', 'price', 'stock_quantity', 'unit', 'description', 'image');
            },
        });
    };

    const handleProductImageChange = (event) => {
        productForm.setData('image', event.target.files[0]);
    };

    const statCards = [
        {
            label: t('store_stats_orders'),
            value: stats.total_orders,
            icon: ShoppingBag,
            accent: 'from-purple-500/20 to-purple-500/5 text-purple-700',
        },
        {
            label: t('store_stats_pending'),
            value: stats.pending_orders,
            icon: Clock,
            accent: 'from-amber-500/20 to-amber-500/5 text-amber-700',
        },
        {
            label: t('store_stats_preparing'),
            value: stats.preparing_orders,
            icon: Receipt,
            accent: 'from-blue-500/20 to-blue-500/5 text-blue-700',
        },
        {
            label: t('store_stats_revenue'),
            value: `${stats.total_revenue} ${t('total_spent_currency')}`,
            icon: DollarSign,
            accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-700',
        },
    ];

    const quickActions = [
        {
            label: t('store_recent_orders_title'),
            href: '/orders',
            icon: ShoppingBag,
            accent: 'from-blue-500/20 to-blue-500/5 text-blue-700',
        },
        {
            label: t('store_products_section_title'),
            href: '/products',
            icon: Package,
            accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-700',
        },
        {
            label: t('categories'),
            href: '/categories',
            icon: Layers,
            accent: 'from-purple-500/20 to-purple-500/5 text-purple-700',
        },
        {
            label: t('store_setup_title'),
            href: '/dashboard/store/setup',
            icon: Settings,
            accent: 'from-amber-500/20 to-amber-500/5 text-amber-700',
        },
    ];

    const orderStatusClasses = {
        pending: 'bg-amber-100 text-amber-800',
        preparing: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-emerald-100 text-emerald-800',
    };

    const orderStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return t('pending');
            case 'preparing':
                return t('preparing');
            case 'delivered':
                return t('delivered');
            default:
                return status;
        }
    };

    return (
        <Layout>
            <Head title={t('store_dashboard')} />

            <div className="relative min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[200px]" />

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur px-6 py-8 text-white shadow-2xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-purple-100">{t('store_dashboard_overview')}</p>
                            <h1 className="text-3xl font-bold">{store.name}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                                    store.is_active ? 'bg-emerald-500/20 text-emerald-100' : 'bg-rose-500/20 text-rose-100'
                                }`}
                            >
                                {store.is_active ? t('store_status_active') : t('store_status_inactive')}
                            </span>
                        </div>
                    </div>

                    {(flash?.success || flash?.error) && (
                        <div
                            className={`rounded-2xl border p-4 text-sm ${
                                flash.success
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-rose-200 bg-rose-50 text-rose-700'
                            }`}
                        >
                            {flash.success || flash.error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCards.map(({ label, value, icon: Icon, accent }) => (
                            <div key={label} className="rounded-2xl border border-white/40 bg-white/90 p-5 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{label}</p>
                                        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl p-6 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">{t('store_products_section_title')}</h3>
                                <p className="text-sm text-slate-500">{t('store_products_section_subtitle')}</p>
                            </div>
                            <form className="space-y-4" onSubmit={handleProductSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('store_product_name_label')}
                                        </label>
                                        <input
                                            type="text"
                                            value={productForm.data.name}
                                            onChange={(e) => productForm.setData('name', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        {productForm.errors.name && (
                                            <p className="mt-1 text-xs text-rose-600">{productForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('store_product_category_label')}
                                        </label>
                                        <select
                                            value={productForm.data.category_id}
                                            onChange={(e) => productForm.setData('category_id', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            {productCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {productForm.errors.category_id && (
                                            <p className="mt-1 text-xs text-rose-600">{productForm.errors.category_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('store_product_price_label')}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={productForm.data.price}
                                            onChange={(e) => productForm.setData('price', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        {productForm.errors.price && (
                                            <p className="mt-1 text-xs text-rose-600">{productForm.errors.price}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('store_product_stock_label')}
                                        </label>
                                        <input
                                            type="number"
                                            value={productForm.data.stock_quantity}
                                            onChange={(e) => productForm.setData('stock_quantity', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        {productForm.errors.stock_quantity && (
                                            <p className="mt-1 text-xs text-rose-600">{productForm.errors.stock_quantity}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {t('store_product_unit_label')}
                                        </label>
                                        <input
                                            type="text"
                                            value={productForm.data.unit}
                                            onChange={(e) => productForm.setData('unit', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {t('store_product_description_label')}
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={productForm.data.description}
                                        onChange={(e) => productForm.setData('description', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {t('store_product_image_label')}
                                    </label>
                                    <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center cursor-pointer hover:border-purple-400 transition">
                                        <Upload className="h-8 w-8 text-purple-500" />
                                        <span className="mt-3 text-sm font-semibold text-slate-700">
                                            {productForm.data.image ? productForm.data.image.name : t('store_logo_placeholder')}
                                        </span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProductImageChange} />
                                    </label>
                                    {productForm.errors.image && (
                                        <p className="mt-1 text-xs text-rose-600">{productForm.errors.image}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={productForm.processing}
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                                >
                                    {productForm.processing ? t('store_submit_processing') : t('store_product_submit')}
                                </button>
                            </form>
                        </div>

                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">{t('store_products_list_title')}</h3>
                                <Link
                                    href="/products"
                                    className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                                >
                                    {t('store_view_products_cta')}
                                </Link>
                            </div>
                            {storeProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {storeProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-500">{product.category?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {product.price} {t('total_spent_currency')}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {product.stock_quantity} {t('store_products_table_stock')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">{t('store_products_list_empty')}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <h3 className="text-lg font-semibold text-slate-900">{t('store_recent_orders_title')}</h3>
                            </div>
                            <div className="p-6">
                                {recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-900">#{order.order_number}</p>
                                                    <p className="text-sm text-slate-500">{order.user?.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-purple-600">
                                                        {order.total_amount} {t('total_spent_currency')}
                                                    </p>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                            orderStatusClasses[order.status] || 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {orderStatusLabel(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-6">{t('store_recent_orders_empty')}</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <h3 className="text-lg font-semibold text-slate-900">{t('store_top_products_title')}</h3>
                            </div>
                            <div className="p-6">
                                {topProducts.length > 0 ? (
                                    <div className="space-y-4">
                                        {topProducts.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                                        <p className="text-xs text-slate-500">{product.category?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {product.order_count} {t('orders')}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {product.price} {t('total_spent_currency')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-6">{t('store_top_products_empty')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {dailySales.length > 0 && (
                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">{t('store_daily_sales_title')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {dailySales.map((sale, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                                        <p className="text-lg font-semibold text-purple-600">
                                            {sale.total_amount} {t('total_spent_currency')}
                                        </p>
                                        <p className="text-xs text-slate-500 mb-2">
                                            {sale.orders_count} {t('orders')}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(sale.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('store_quick_actions_title')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map(({ label, href, icon: Icon, accent }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br ${accent} p-4 text-slate-900`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-semibold text-sm">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AppDownloadSection />
        </Layout>
    );
}
