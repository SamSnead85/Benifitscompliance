'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    X,
    Check,
    AlertTriangle,
    Info,
    CheckCircle2,
    Clock,
    Settings,
    Filter,
    Trash2
} from 'lucide-react';

interface NotificationCenterProps {
    className?: string;
}

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionLabel?: string;
    actionUrl?: string;
}

const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'success',
        title: 'Data Import Complete',
        message: '4,521 employee records successfully imported from Gusto.',
        timestamp: new Date(Date.now() - 300000),
        read: false
    },
    {
        id: 'notif-2',
        type: 'warning',
        title: 'FTE Threshold Alert',
        message: 'You have 48 FTEs. Hiring 2+ more triggers ACA reporting requirements.',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionLabel: 'View Details'
    },
    {
        id: 'notif-3',
        type: 'error',
        title: 'Sync Failed',
        message: 'Workday HCM sync failed due to authentication error. Please reconnect.',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        actionLabel: 'Reconnect'
    },
    {
        id: 'notif-4',
        type: 'info',
        title: 'Forms Ready for Review',
        message: '1,245 1095-C forms have been generated and are awaiting approval.',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
        actionLabel: 'Review Forms'
    },
    {
        id: 'notif-5',
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for Sunday 2AM-4AM EST.',
        timestamp: new Date(Date.now() - 172800000),
        read: true
    },
];

const typeConfig = {
    success: { icon: CheckCircle2, color: 'var(--color-success)', bg: 'rgba(34,197,94,0.2)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.2)' },
    error: { icon: AlertTriangle, color: 'var(--color-critical)', bg: 'rgba(239,68,68,0.2)' },
    info: { icon: Info, color: 'var(--color-synapse-cyan)', bg: 'rgba(6,182,212,0.2)' },
};

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const formatTimeAgo = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <h3 className="font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-critical)] text-white">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={markAllAsRead} className="text-xs text-[var(--color-synapse-teal)] hover:underline">
                            Mark all read
                        </button>
                        <button onClick={clearAll} className="text-xs text-[var(--color-steel)] hover:text-white">
                            Clear all
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['all', 'unread'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${filter === f
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {f === 'all' ? 'All' : `Unread (${unreadCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification, i) => {
                        const config = typeConfig[notification.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 border-b border-[var(--glass-border)] hover:bg-[var(--glass-bg-light)] transition-colors ${!notification.read ? 'bg-[var(--glass-bg-light)]' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: config.bg }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium text-white">{notification.title}</p>
                                            {!notification.read && (
                                                <span className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mb-2">{notification.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[var(--color-steel)] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTimeAgo(notification.timestamp)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {notification.actionLabel && (
                                                    <button className="text-xs text-[var(--color-synapse-teal)] hover:underline">
                                                        {notification.actionLabel}
                                                    </button>
                                                )}
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-1 rounded hover:bg-[var(--glass-bg)]"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-3 h-3 text-[var(--color-steel)]" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-1 rounded hover:bg-[var(--glass-bg)]"
                                                    title="Delete"
                                                >
                                                    <X className="w-3 h-3 text-[var(--color-steel)]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredNotifications.length === 0 && (
                    <div className="p-8 text-center">
                        <Bell className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                        <p className="text-sm text-[var(--color-steel)]">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default NotificationCenter;
