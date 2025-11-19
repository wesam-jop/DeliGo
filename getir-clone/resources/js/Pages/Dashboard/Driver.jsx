import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layout';
import { 
    Truck, 
    Package, 
    Clock, 
    DollarSign,
    MapPin,
    Phone,
    CheckCircle,
    AlertCircle,
    Star
} from 'lucide-react';

export default function DriverDashboard({ stats, assignedOrders, availableOrders }) {
    return (
        <Layout>
            <Head title="داشبورد السائق" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-900">داشبورد السائق</h1>
                        <p className="text-gray-600 mt-2">مرحباً بك في لوحة تحكم السائق</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Truck className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            إجمالي التوصيلات
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.total_deliveries}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            طلبات قيد التوصيل
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.pending_deliveries}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            طلبات مكتملة
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.completed_deliveries}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            إجمالي الأرباح
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.total_earnings} ر.س
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Available Orders */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                                    طلبات متاحة للتوصيل
                                </h3>
                            </div>
                            <div className="p-6">
                                {availableOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {availableOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            طلب #{order.order_number}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {order.store?.name}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        جاهز للتوصيل
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {order.delivery_address}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        {order.customer_phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        {order.total_amount} ر.س
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 flex space-x-2">
                                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                                        قبول الطلب
                                                    </button>
                                                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                                                        عرض التفاصيل
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">لا توجد طلبات متاحة للتوصيل حالياً</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned Orders */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                                    طلباتي المخصصة
                                </h3>
                            </div>
                            <div className="p-6">
                                {assignedOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {assignedOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            طلب #{order.order_number}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {order.store?.name}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        order.status === 'out_for_delivery' 
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {order.status === 'out_for_delivery' ? 'في الطريق' : 'تم التوصيل'}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {order.delivery_address}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        {order.customer_phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        {order.total_amount} ر.س
                                                    </div>
                                                </div>
                                                
                                                {order.status === 'out_for_delivery' && (
                                                    <div className="mt-4">
                                                        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                                                            تأكيد التسليم
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">لا توجد طلبات مخصصة لك حالياً</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">إجراءات سريعة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <MapPin className="h-5 w-5 mr-2" />
                                تحديث الموقع
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <Clock className="h-5 w-5 mr-2" />
                                تغيير الحالة
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <Star className="h-5 w-5 mr-2" />
                                عرض التقييمات
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
