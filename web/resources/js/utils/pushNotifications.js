/**
 * Web Push Notifications Utility
 * Handles browser push notification subscription and management
 */

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const isPushNotificationSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const requestNotificationPermission = async () => {
    if (!isPushNotificationSupported()) {
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

export const subscribeToPushNotifications = async (vapidPublicKey) => {
    if (!isPushNotificationSupported()) {
        throw new Error('Push notifications are not supported in this browser');
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
        throw new Error('Notification permission denied');
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: btoa(
                    String.fromCharCode.apply(
                        null,
                        new Uint8Array(subscription.getKey('p256dh'))
                    )
                ),
                auth: btoa(
                    String.fromCharCode.apply(
                        null,
                        new Uint8Array(subscription.getKey('auth'))
                    )
                ),
            },
        };

        // Send subscription to server
        const response = await fetch('/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify(subscriptionData),
        });

        if (!response.ok) {
            throw new Error('Failed to save subscription');
        }

        return subscriptionData;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        throw error;
    }
};

export const unsubscribeFromPushNotifications = async () => {
    if (!isPushNotificationSupported()) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();

            // Notify server
            await fetch('/notifications/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                }),
            });
        }
    } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
    }
};

export const initializePushNotifications = async (vapidPublicKey) => {
    if (!isPushNotificationSupported() || !vapidPublicKey) {
        return false;
    }

    try {
        // Register service worker
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered:', registration);

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            // Check if already subscribed
            const registration_ready = await navigator.serviceWorker.ready;
            const existingSubscription = await registration_ready.pushManager.getSubscription();

            if (existingSubscription) {
                // Update subscription on server
                const subscriptionData = {
                    endpoint: existingSubscription.endpoint,
                    keys: {
                        p256dh: btoa(
                            String.fromCharCode.apply(
                                null,
                                new Uint8Array(existingSubscription.getKey('p256dh'))
                            )
                        ),
                        auth: btoa(
                            String.fromCharCode.apply(
                                null,
                                new Uint8Array(existingSubscription.getKey('auth'))
                            )
                        ),
                    },
                };

                try {
                    await fetch('/notifications/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                        },
                        body: JSON.stringify(subscriptionData),
                    });
                } catch (error) {
                    console.error('Error updating subscription:', error);
                }
            }
            // Note: We don't automatically request permission here
            // The NotificationPermissionPrompt component will handle that
        }

        return true;
    } catch (error) {
        console.error('Error initializing push notifications:', error);
        return false;
    }
};

