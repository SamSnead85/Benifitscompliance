'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Check,
    X,
    AlertTriangle,
    Info,
    CheckCircle2,
    Clock,
    ChevronRight,
    Settings,
    Filter
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    action?: { label: string; onClick: () => void };
    category: 'compliance' | 'system' | 'employee' | 'integration';
}

interface NotificationCenterProps {
    notifications?: Notification[];
    onMarkRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    onDismiss?: (id: string) => void;
    className?: string;
}

const defaultNotifications: Notification[] = [
    {
        id: '1',
        type: 'warning',
        title: 'Compliance Deadline Approaching',
        message: '1094-C transmittal deadline is in 5 days. Ensure all forms are generated.',
        timestamp: '2026-01-28T10:00:00',
        read: false,
        action: { label: 'View Deadlines', onClick: () => { } },
        category: 'compliance'
    },
    {
        id: '2',
        type: 'success',
        title: 'Data Import Complete',
        message: '1,247 employee records successfully imported from Workday.',
        timestamp: '2026-01-28T09:30:00',
        read: false,
        category: 'integration'
    },
    {
        id: '3',
        type: 'error',
        title: 'Integration Error',
        message: 'Failed to sync with ADP. Connection timeout after 30 seconds.',
        timestamp: '2026-01-28T08:45:00',
        read: false,
        action: { label: 'Retry Connection', onClick: () => { } },
        category: 'integration'
    },
    {
        id: '4',
        type: 'info',
        title: 'New Employee Added',
        message: 'Sarah Johnson has been added to the employee roster.',
        timestamp: '2026-01-28T08:00:00',
        read: true,
        category: 'employee'
    },
    {
        id: '5',
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance window on Feb 1st from 2-4 AM EST.',
        timestamp: '2026-01-27T16:00:00',
        read: true,
        category: 'system'
    },
];

const typeConfig = {
    info: { color: 'var(--color-synapse-cyan)', icon: Info },
    success: { color: 'var(--color-success)', icon: CheckCircle2 },
    warning: { color: 'var(--color-warning)', icon: AlertTriangle },
    error: { color: 'var(--color-critical)', icon: AlertTriangle },
};

const categoryLabels = {
    compliance: 'Compliance',
    system: 'System',
    employee: 'Employees',
    integration: 'Integrations',
};

export function NotificationPanel({
    notifications = defaultNotifications,
    onMarkRead,
    onMarkAllRead,
    onDismiss,
    className = ''
}: NotificationCenterProps) {
    const [filter, setFilter] = useState<string>('all');

    const categories = ['all', 'compliance', 'system', 'employee', 'integration'];

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.category === filter);

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-violet)] to-[var(--color-synapse-cyan)] flex items-center justify-center relative">
                            <Bell className="w-5 h-5 text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-critical)] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <p className="text-xs text-[var(--color-steel)]">{unreadCount} unread</p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllRead}
                            className="text-xs text-[var(--color-synapse-teal)] hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === cat
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {cat === 'all' ? 'All' : categoryLabels[cat as keyof typeof categoryLabels]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications list */}
            <div className="divide-y divide-[var(--glass-border)] max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                    {filteredNotifications.map((notification, i) => {
                        const config = typeConfig[notification.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.03 }}
                                className={`p-4 flex gap-3 hover:bg-[var(--glass-bg)] transition-colors ${!notification.read ? 'bg-[var(--glass-bg)]' : ''
                                    }`}
                            >
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {!notification.read && (
                                            <span className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                                        )}
                                        <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)] mb-2">{notification.message}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {formatTime(notification.timestamp)}
                                        </span>
                                        {notification.action && (
                                            <button
                                                onClick={notification.action.onClick}
                                                className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1"
                                            >
                                                {notification.action.label}
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1">
                                    {!notification.read && (
                                        <button
                                            onClick={() => onMarkRead?.(notification.id)}
                                            className="p-1.5 rounded hover:bg-[var(--glass-bg-light)] transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check className="w-3 h-3 text-[var(--color-steel)]" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDismiss?.(notification.id)}
                                        className="p-1.5 rounded hover:bg-[var(--glass-bg-light)] transition-colors"
                                        title="Dismiss"
                                    >
                                        <X className="w-3 h-3 text-[var(--color-steel)]" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredNotifications.length === 0 && (
                    <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-[var(--color-steel)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-steel)]">No notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationPanel;
