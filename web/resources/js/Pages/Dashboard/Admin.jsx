import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layout';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { useGeneralSettings } from '../../hooks/useGeneralSettings';

export default function AdminDashboard({ stats, recentOrders, topStores, monthlySales, newUsers }) {
    const { formatCurrency, formatDate } = useGeneralSettings();
    return (
        <Layout>
            <Head title="داشبورد الإدارة" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-900">داشبورد الإدارة</h1>
                        <p className="text-gray-600 mt-2">لوحة تحكم شاملة لإدارة النظام</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي المتاجر</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_stores}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600">العملاء</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.total_customers}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600">أصحاب المتاجر</p>
                                <p className="text-3xl font-bold text-green-600">{stats.total_store_owners}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600">المنتجات</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.total_products}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">الطلبات الأخيرة</h3>
                            </div>
                            <div className="p-6">
                                {recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">طلب #{order.order_number}</p>
                                                    <p className="text-sm text-gray-600">{order.user?.name}</p>
                                                    <p className="text-xs text-gray-500">{order.store?.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-purple-600">{formatCurrency(order.total_amount)}</p>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status === 'pending' ? 'في الانتظار' :
                                                         order.status === 'delivered' ? 'مسلم' : order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">لا توجد طلبات بعد</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Stores */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">المتاجر الأكثر نشاطاً</h3>
                            </div>
                            <div className="p-6">
                                {topStores.length > 0 ? (
                                    <div className="space-y-4">
                                        {topStores.map((store, index) => (
                                            <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{store.name}</p>
                                                        <p className="text-sm text-gray-600">{store.address}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">{store.orders_count} طلب</p>
                                                    <p className="text-xs text-gray-500">{formatCurrency(store.total_revenue)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">لا توجد بيانات بعد</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Sales Chart */}
                    {monthlySales.length > 0 && (
                        <div className="mt-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">المبيعات الشهرية (آخر 12 شهر)</h3>
                                <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
                                    {monthlySales.slice(-12).map((sale, index) => (
                                        <div key={index} className="text-center">
                                            <div className="bg-purple-100 rounded-lg p-3 mb-2">
                                                <p className="text-sm font-medium text-purple-600">{formatCurrency(sale.total_amount)}</p>
                                                <p className="text-xs text-gray-600">{sale.orders_count} طلب</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(new Date(sale.year, sale.month - 1, 1))}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* New Users Chart */}
                    {newUsers.length > 0 && (
                        <div className="mt-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">المستخدمين الجدد (آخر 30 يوم)</h3>
                                <div className="grid grid-cols-10 gap-2">
                                    {newUsers.slice(-30).map((user, index) => (
                                        <div key={index} className="text-center">
                                            <div className="bg-blue-100 rounded p-2 mb-1">
                                                <p className="text-xs font-medium text-blue-600">{user.users_count}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(user.date).toLocaleDateString('ar-SA', { day: 'numeric' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/admin/users"
                                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    <span className="font-medium text-gray-900">إدارة المستخدمين</span>
                                </Link>
                                
                                <Link
                                    href="/admin/stores"
                                    className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="font-medium text-gray-900">إدارة المتاجر</span>
                                </Link>
                                
                                <Link
                                    href="/admin/products"
                                    className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span className="font-medium text-gray-900">إدارة المنتجات</span>
                                </Link>
                                
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium text-gray-900">إدارة الطلبات</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
