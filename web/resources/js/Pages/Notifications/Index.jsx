import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, X, ExternalLink, Trash2, CheckCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import Layout from '../Layout';

export default function NotificationsIndex({ notifications, unreadCount }) {
    const { t } = useTranslation();
    const [localNotifications, setLocalNotifications] = useState(notifications?.data || []);
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount || 0);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        setLocalNotifications(notifications?.data || []);
        setLocalUnreadCount(unreadCount || 0);
    }, [notifications, unreadCount]);

    const filteredNotifications = localNotifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        if (filter === 'read') return n.is_read;
        return true;
    });

    const handleMarkAsRead = (notificationId) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev => 
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                );
                setLocalUnreadCount(prev => Math.max(0, prev - 1));
            }
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setLocalUnreadCount(0);
            }
        });
    };

    const handleDelete = (notificationId) => {
        router.delete(`/notifications/${notificationId}`, {
            preserveScroll: true,
            onSuccess: () => {
                const deleted = localNotifications.find(n => n.id === notificationId);
                setLocalNotifications(prev => prev.filter(n => n.id !== notificationId));
                if (deleted && !deleted.is_read) {
                    setLocalUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        });
    };

    const getNotificationIcon = (type) => {
        const icons = {
            order: '📦',
            driver_order: '🚗',
            store_order: '🏪',
            system: '⚙️',
            promotion: '🎉',
        };
        return icons[type] || '🔔';
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return t('just_now') || 'Just now';
        if (minutes < 60) return `${minutes} ${t('minutes_ago') || 'minutes ago'}`;
        if (hours < 24) return `${hours} ${t('hours_ago') || 'hours ago'}`;
        if (days < 7) return `${days} ${t('days_ago') || 'days ago'}`;
        return date.toLocaleDateString();
    };

    return (
        <Layout>
            <Head title={t('notifications') || 'Notifications'} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-6 h-6 text-slate-600" />
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {t('notifications') || 'Notifications'}
                                </h1>
                                {localUnreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                                        {localUnreadCount} {t('unread') || 'unread'}
                                    </span>
                                )}
                            </div>
                            {localUnreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    {t('mark_all_read') || 'Mark all as read'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {t('all') || 'All'}
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    filter === 'unread'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {t('unread') || 'Unread'} {localUnreadCount > 0 && `(${localUnreadCount})`}
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    filter === 'read'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {t('read') || 'Read'}
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">
                                    {filter === 'unread' 
                                        ? (t('no_unread_notifications') || 'No unread notifications')
                                        : filter === 'read'
                                        ? (t('no_read_notifications') || 'No read notifications')
                                        : (t('no_notifications') || 'No notifications yet')
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 hover:bg-slate-50 transition-colors ${
                                        !notification.is_read ? 'bg-blue-50/30' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl flex-shrink-0">
                                            {notification.icon || getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`text-base font-semibold ${
                                                            !notification.is_read 
                                                                ? 'text-slate-900' 
                                                                : 'text-slate-600'
                                                        }`}>
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.is_read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-2">
                                                        {formatTime(notification.created_at)}
                                                    </p>
                                                    {notification.action_url && (
                                                        <Link
                                                            href={notification.action_url}
                                                            className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700"
                                                        >
                                                            {t('view_details') || 'View details'}
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title={t('mark_as_read') || 'Mark as read'}
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notification.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={t('delete') || 'Delete'}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications?.links && (
                        <div className="px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600">
                                    {t('showing') || 'Showing'} {notifications.from} - {notifications.to} {t('of') || 'of'} {notifications.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    {notifications.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-lg ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

