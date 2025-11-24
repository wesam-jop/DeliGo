/**
 * Service Worker for Web Push Notifications
 */

self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    
    const title = data.title || 'Notification';
    const options = {
        body: data.body || '',
        icon: data.icon || '/favicon.ico',
        badge: data.badge || '/favicon.ico',
        tag: data.tag || 'notification',
        data: data.data || {},
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const data = event.notification.data;
    const actionUrl = data?.action_url || '/';

    event.waitUntil(
        clients.openWindow(actionUrl)
    );
});

self.addEventListener('notificationclose', function(event) {
    // Handle notification close if needed
});

