import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, ExternalLink } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from '../hooks/useTranslation';

export default function NotificationBell({ unreadCount = 0, notifications = [] }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setLocalNotifications(notifications);
        setLocalUnreadCount(unreadCount);
    }, [notifications, unreadCount]);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/notifications/recent')
                .then(res => res.json())
                .then(data => {
                    if (data.notifications) {
                        setLocalNotifications(data.notifications);
                        setLocalUnreadCount(data.unreadCount);
                    }
                })
                .catch(err => console.error('Error fetching notifications:', err));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = (notificationId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
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

    const handleMarkAllAsRead = (e) => {
        e.preventDefault();
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setLocalUnreadCount(0);
            }
        });
    };

    const handleDelete = (notificationId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        router.delete(`/notifications/${notificationId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev => prev.filter(n => n.id !== notificationId));
                const deleted = localNotifications.find(n => n.id === notificationId);
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
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg border transition-colors ${
                    isOpen 
                        ? 'border-blue-200 bg-blue-50 text-blue-600' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
                <Bell className="w-5 h-5" />
                {localUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {localUnreadCount > 9 ? '9+' : localUnreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">
                            {t('notifications') || 'Notifications'}
                        </h3>
                        {localUnreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                {t('mark_all_read') || 'Mark all as read'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {localNotifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">
                                {t('no_notifications') || 'No notifications yet'}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {localNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 hover:bg-slate-50 transition-colors ${
                                            !notification.is_read ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl flex-shrink-0">
                                                {notification.icon || getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${
                                                            !notification.is_read 
                                                                ? 'text-slate-900' 
                                                                : 'text-slate-600'
                                                        }`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {formatTime(notification.created_at)}
                                                        </p>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                {notification.action_url && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Link
                                                            href={notification.action_url}
                                                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {t('view') || 'View'}
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                        className="p-1 text-slate-400 hover:text-green-600"
                                                        title={t('mark_as_read') || 'Mark as read'}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    className="p-1 text-slate-400 hover:text-red-600"
                                                    title={t('delete') || 'Delete'}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {localNotifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-100">
                            <Link
                                href="/notifications"
                                className="text-xs text-center text-blue-600 hover:text-blue-700 block"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('view_all_notifications') || 'View all notifications'}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

