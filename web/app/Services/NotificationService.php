<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class NotificationService
{
    /**
     * Create and send a notification
     */
    public function create(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        ?string $icon = null,
        string $priority = 'normal'
    ): Notification {
        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'action_url' => $actionUrl,
            'icon' => $icon,
            'priority' => $priority,
        ]);

        // Send push notification if user has active subscriptions
        $this->sendPushNotification($userId, $notification);

        return $notification;
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(
        array $userIds,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        ?string $icon = null,
        string $priority = 'normal'
    ): void {
        foreach ($userIds as $userId) {
            $this->create($userId, $type, $title, $message, $data, $actionUrl, $icon, $priority);
        }
    }

    /**
     * Send notification to all users of a specific type
     */
    public function sendToUserType(
        string $userType,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        ?string $icon = null,
        string $priority = 'normal'
    ): void {
        $userIds = User::where('user_type', $userType)->pluck('id')->toArray();
        $this->sendToUsers($userIds, $type, $title, $message, $data, $actionUrl, $icon, $priority);
    }

    /**
     * Send push notification via Web Push API
     */
    protected function sendPushNotification(int $userId, Notification $notification): void
    {
        $subscriptions = PushSubscription::where('user_id', $userId)
            ->where('is_active', true)
            ->get();

        if ($subscriptions->isEmpty()) {
            return;
        }

        $vapidPublicKey = config('services.webpush.vapid_public_key');
        $vapidPrivateKey = config('services.webpush.vapid_private_key');
        $vapidSubject = config('services.webpush.vapid_subject', config('app.url'));

        if (!$vapidPublicKey || !$vapidPrivateKey) {
            Log::warning('Web Push VAPID keys not configured');
            return;
        }

        $auth = [
            'VAPID' => [
                'subject' => $vapidSubject,
                'publicKey' => $vapidPublicKey,
                'privateKey' => $vapidPrivateKey,
            ],
        ];

        $webPush = new WebPush($auth);

        foreach ($subscriptions as $subscription) {
            try {
                $pushSubscription = Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'keys' => [
                        'p256dh' => $subscription->public_key,
                        'auth' => $subscription->auth_token,
                    ],
                ]);

                $payload = json_encode([
                    'title' => $notification->title,
                    'body' => $notification->message,
                    'icon' => $notification->icon ?? '/favicon.ico',
                    'badge' => '/favicon.ico',
                    'data' => [
                        'notification_id' => $notification->id,
                        'type' => $notification->type,
                        'action_url' => $notification->action_url,
                        'data' => $notification->data,
                    ],
                    'tag' => $notification->type,
                    'requireInteraction' => $notification->priority === 'urgent',
                ]);

                $webPush->queueNotification($pushSubscription, $payload);
            } catch (\Exception $e) {
                Log::error('Failed to send push notification', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);

                // Deactivate subscription if it's invalid
                if (str_contains($e->getMessage(), '410') || str_contains($e->getMessage(), 'expired')) {
                    $subscription->update(['is_active' => false]);
                }
            }
        }

        // Send all queued notifications
        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess()) {
                Log::error('Push notification failed', [
                    'endpoint' => $report->getEndpoint(),
                    'reason' => $report->getReason(),
                ]);
            }
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId, int $userId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->where('user_id', $userId)
            ->first();

        if ($notification) {
            $notification->markAsRead();
            return true;
        }

        return false;
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Delete notification
     */
    public function delete(int $notificationId, int $userId): bool
    {
        return Notification::where('id', $notificationId)
            ->where('user_id', $userId)
            ->delete() > 0;
    }

    /**
     * Get unread count for user
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Create order-related notifications
     */
    public function notifyOrderCreated(int $userId, $order): void
    {
        $this->create(
            $userId,
            'order',
            __('Order Created', [], 'en'),
            __('Your order #:order_number has been created successfully', ['order_number' => $order->order_number], 'en'),
            ['order_id' => $order->id, 'order_number' => $order->order_number],
            route('orders.show', $order->id),
            'shopping-cart',
            'high'
        );
    }

    public function notifyOrderStatusChanged(int $userId, $order): void
    {
        $statusMessages = [
            'confirmed' => __('Your order #:order_number has been confirmed', ['order_number' => $order->order_number], 'en'),
            'preparing' => __('Your order #:order_number is being prepared', ['order_number' => $order->order_number], 'en'),
            'ready' => __('Your order #:order_number is ready for pickup', ['order_number' => $order->order_number], 'en'),
            'out_for_delivery' => __('Your order #:order_number is out for delivery', ['order_number' => $order->order_number], 'en'),
            'delivered' => __('Your order #:order_number has been delivered', ['order_number' => $order->order_number], 'en'),
            'cancelled' => __('Your order #:order_number has been cancelled', ['order_number' => $order->order_number], 'en'),
        ];

        $message = $statusMessages[$order->status] ?? __('Your order #:order_number status has been updated', ['order_number' => $order->order_number], 'en');

        $this->create(
            $userId,
            'order',
            __('Order Status Updated', [], 'en'),
            $message,
            ['order_id' => $order->id, 'order_number' => $order->order_number, 'status' => $order->status],
            route('orders.show', $order->id),
            'package',
            'high'
        );
    }

    public function notifyDriverNewOrder($driverId, $order): void
    {
        $this->create(
            $driverId,
            'driver_order',
            __('New Order Available', [], 'en'),
            __('New order #:order_number is available for delivery', ['order_number' => $order->order_number], 'en'),
            ['order_id' => $order->id, 'order_number' => $order->order_number],
            route('dashboard.driver.orders'),
            'truck',
            'urgent'
        );
    }

    public function notifyStoreNewOrder($storeOwnerId, $order): void
    {
        $this->create(
            $storeOwnerId,
            'store_order',
            __('New Order Received', [], 'en'),
            __('You have received a new order #:order_number', ['order_number' => $order->order_number], 'en'),
            ['order_id' => $order->id, 'order_number' => $order->order_number],
            route('dashboard.store.orders.show', $order->id),
            'store',
            'high'
        );
    }
}

