import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from './Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    Users, 
    ShoppingCart, 
    Package, 
    Store, 
    TrendingUp, 
    Clock, 
    CheckCircle,
    DollarSign,
    BarChart3,
    Activity,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    Truck,
    Star,
    MessageSquare,
    Calendar,
    Zap,
    RefreshCw,
    Download,
    Filter,
    Search
} from 'lucide-react';

export default function AdminDashboard({ stats, recent_orders, top_products }) {
    const { t } = useTranslation();
    
    const statCards = [
        {
            title: t('total_users'),
            value: stats?.total_users || 0,
            icon: Users,
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            change: '+12%',
            changeType: 'increase',
            description: t('registered_users'),
            href: '/admin/users'
        },
        {
            title: t('total_orders'),
            value: stats?.total_orders || 0,
            icon: ShoppingCart,
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            change: '+8%',
            changeType: 'increase',
            description: t('completed_and_pending_orders'),
            href: '/admin/orders'
        },
        {
            title: t('total_products'),
            value: stats?.total_products || 0,
            icon: Package,
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            change: '+5%',
            changeType: 'increase',
            description: t('available_products'),
            href: '/admin/products'
        },
        {
            title: t('total_revenue'),
            value: `$${stats?.total_revenue?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            change: '+15%',
            changeType: 'increase',
            description: t('monthly_revenue'),
            href: '/admin/analytics/sales'
        },
        {
            title: t('pending_orders'),
            value: stats?.pending_orders || 0,
            icon: Clock,
            color: 'yellow',
            gradient: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            iconBg: 'bg-yellow-100',
            change: '-3%',
            changeType: 'decrease',
            description: t('awaiting_processing')
        },
        {
            title: t('completed_orders'),
            value: stats?.completed_orders || 0,
            icon: CheckCircle,
            color: 'emerald',
            gradient: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconBg: 'bg-emerald-100',
            change: '+10%',
            changeType: 'increase',
            description: t('delivered_successfully')
        }
    ];

    return (
        <AdminLayout title={t('admin_dashboard')}>
            <Head title={t('admin_dashboard')} />
            
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{t('welcome_to_dashboard')}</h1>
                                <p className="text-purple-100 text-lg">{t('dashboard_overview')}</p>
                                <div className="mt-4 flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date().toLocaleDateString('ar-SA')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Activity className="w-4 h-4" />
                                        <span>{t('active_now')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <Zap className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/orders"
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group hover:border-green-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-green-700">{t('manage_orders')}</p>
                                <p className="text-sm text-slate-500">{t('view_and_manage_all_orders')}</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group hover:border-blue-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-blue-700">{t('manage_users')}</p>
                                <p className="text-sm text-slate-500">{t('customers_stores_drivers')}</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/products"
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group hover:border-purple-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-purple-700">{t('manage_products')}</p>
                                <p className="text-sm text-slate-500">{t('products_categories_inventory')}</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/analytics"
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group hover:border-orange-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 group-hover:text-orange-700">{t('reports_and_statistics')}</p>
                                <p className="text-sm text-slate-500">{t('performance_and_sales_analysis')}</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    stat.changeType === 'increase' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {stat.changeType === 'increase' ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500">{stat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">{t('recent_orders')}</h3>
                                <Link 
                                    href="/admin/orders"
                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                                >
                                    <span>{t('view_all')}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recent_orders?.slice(0, 5).map((order, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">طلب #{order.id}</p>
                                                <p className="text-sm text-slate-500">{order.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-900">${order.total}</p>
                                            <p className={`text-xs px-2 py-1 rounded-full ${
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status === 'completed' ? 'مكتمل' :
                                                 order.status === 'pending' ? 'معلق' : 'ملغي'}
                                            </p>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-center py-8 text-slate-500">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                        <p>{t('no_recent_orders')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">{t('top_products')}</h3>
                                <Link 
                                    href="/admin/products"
                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                                >
                                    <span>{t('view_all')}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {top_products?.slice(0, 5).map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{product.name}</p>
                                                <p className="text-sm text-slate-500">{product.category?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-900">${product.price}</p>
                                            <p className="text-xs text-slate-500">{product.sales_count} مبيع</p>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-center py-8 text-slate-500">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                        <p>{t('no_products')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">{t('total_stores')}</p>
                                <p className="text-2xl font-bold">{stats?.total_stores || 0}</p>
                            </div>
                            <Store className="w-8 h-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">{t('active_drivers')}</p>
                                <p className="text-2xl font-bold">{stats?.active_drivers || 0}</p>
                            </div>
                            <Truck className="w-8 h-8 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">{t('average_rating')}</p>
                                <p className="text-2xl font-bold">4.8</p>
                            </div>
                            <Star className="w-8 h-8 text-purple-200" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

