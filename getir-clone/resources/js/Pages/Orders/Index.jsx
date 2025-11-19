import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import AppDownloadSection from '../../Components/AppDownloadSection';

export default function OrdersIndex({ orders }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-orange-100 text-orange-800';
            case 'on_delivery':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return t('pending');
            case 'confirmed':
                return t('confirmed');
            case 'preparing':
                return t('preparing');
            case 'on_delivery':
                return t('out_for_delivery');
            case 'delivered':
                return t('delivered');
            case 'cancelled':
                return t('cancelled');
            default:
                return status;
        }
    };

    const handleCancelOrder = (orderId) => {
        if (confirm(t('confirm_cancel_order'))) {
            router.post(`/orders/${orderId}/cancel`, {}, {
                preserveState: true
            });
        }
    };

    return (
        <Layout>
            <Head title="طلباتي" />
            
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-slate-900">طلباتي</h1>
                        <p className="text-slate-600 mt-1">تتبع جميع طلباتك</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {orders?.data && orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    طلب #{order.order_number}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        إلغاء الطلب
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">عنوان التوصيل</h4>
                                                <p className="text-sm text-slate-600">{order.delivery_address}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">المتجر</h4>
                                                <p className="text-sm text-slate-600">{order.store?.name}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900 mb-2">المجموع</h4>
                                                <p className="text-lg font-bold text-purple-600">{order.total_amount} ل.س</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-slate-900 mb-2">المنتجات</h4>
                                            <div className="space-y-2">
                                                {order.order_items?.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-600">
                                                            {item.product_name} × {item.quantity}
                                                        </span>
                                                        <span className="font-medium">{item.total_price} ل.س</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-sm text-slate-600">
                                                <span>الوقت المتوقع للتوصيل: </span>
                                                <span className="font-medium">{order.estimated_delivery_time} دقيقة</span>
                                            </div>
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-purple-600 hover:text-purple-700 font-medium"
                                            >
                                                عرض التفاصيل
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد طلبات</h3>
                            <p className="text-slate-600 mb-6">لم تقم بأي طلبات بعد</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                ابدأ التسوق
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {orders && orders.links && Array.isArray(orders.links) && orders.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex space-x-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-lg ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-300'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
