'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Settings,
    Check,
    X,
    AlertTriangle,
    FileText,
    Users,
    Calendar,
    Clock,
    ChevronRight,
    MoreHorizontal,
    Mail,
    Smartphone,
    Monitor,
    CheckCircle2,
    XCircle,
    Filter
} from 'lucide-react';

interface NotificationCenterProps {
    className?: string;
}

interface Notification {
    id: string;
    type: 'alert' | 'info' | 'success' | 'warning';
    category: 'compliance' | 'forms' | 'employees' | 'system';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionRequired?: boolean;
    actionLabel?: string;
}

const mockNotifications: Notification[] = [
    { id: 'n1', type: 'alert', category: 'compliance', title: '1095-C Distribution Deadline', message: 'You have 30 days to distribute 1095-C forms to employees', timestamp: '5 min ago', read: false, actionRequired: true, actionLabel: 'View Deadline' },
    { id: 'n2', type: 'warning', category: 'employees', title: '12 Employees Approaching FT Threshold', message: 'Variable hour employees may become FT eligible next month', timestamp: '1 hour ago', read: false, actionRequired: true, actionLabel: 'Review' },
    { id: 'n3', type: 'success', category: 'forms', title: 'Batch Generation Complete', message: '4,256 1095-C forms generated successfully', timestamp: '2 hours ago', read: false },
    { id: 'n4', type: 'info', category: 'system', title: 'Workday Sync Complete', message: '156 employee records updated from HRIS', timestamp: '3 hours ago', read: true },
    { id: 'n5', type: 'warning', category: 'compliance', title: 'Coverage Gap Detected', message: '3 FT employees missing coverage offer documentation', timestamp: 'Yesterday', read: true, actionRequired: true, actionLabel: 'Fix Issues' },
    { id: 'n6', type: 'info', category: 'system', title: 'Scheduled Report Complete', message: 'Weekly compliance summary has been generated', timestamp: 'Yesterday', read: true },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string }> = {
    alert: { icon: AlertTriangle, color: 'text-[var(--color-critical)]', bgColor: 'bg-[rgba(239,68,68,0.1)]' },
    warning: { icon: AlertTriangle, color: 'text-[var(--color-warning)]', bgColor: 'bg-[rgba(245,158,11,0.1)]' },
    success: { icon: CheckCircle2, color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]' },
    info: { icon: Bell, color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]' },
};

const categoryConfig: Record<string, { icon: typeof FileText; label: string }> = {
    compliance: { icon: FileText, label: 'Compliance' },
    forms: { icon: FileText, label: 'Forms' },
    employees: { icon: Users, label: 'Employees' },
    system: { icon: Monitor, label: 'System' },
};

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showSettings, setShowSettings] = useState(false);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n =>
        filterCategory === 'all' || n.category === filterCategory
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center relative">
                            <Bell className="w-5 h-5 text-white" />
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-critical)] text-white text-[10px] font-bold flex items-center justify-center">
                                    {unreadCount}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Notification Center</h2>
                            <p className="text-xs text-[var(--color-steel)]">{unreadCount} unread notifications</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={markAllRead} className="btn-secondary text-sm">Mark all read</button>
                        <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1">
                    {['all', 'compliance', 'forms', 'employees', 'system'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${filterCategory === cat ? 'bg-[var(--color-synapse-teal)] text-black' : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-[var(--glass-border)] max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                    {filteredNotifications.map((notification, index) => {
                        const typeCfg = typeConfig[notification.type];
                        const TypeIcon = typeCfg.icon;
                        const catCfg = categoryConfig[notification.category];

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.02 }}
                                className={`p-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors ${!notification.read ? 'bg-[rgba(6,182,212,0.02)]' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeCfg.bgColor}`}>
                                        <TypeIcon className={`w-5 h-5 ${typeCfg.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {!notification.read && <div className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />}
                                            <h4 className="font-medium text-white">{notification.title}</h4>
                                            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)] capitalize">
                                                {catCfg.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)] mb-2">{notification.message}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-[var(--color-steel)] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {notification.timestamp}
                                            </span>
                                            {notification.actionRequired && (
                                                <button className="text-xs font-medium text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                                                    {notification.actionLabel}
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!notification.read && (
                                            <button onClick={() => markAsRead(notification.id)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]" title="Mark as read">
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => dismissNotification(notification.id)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]" title="Dismiss">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredNotifications.length === 0 && (
                <div className="p-12 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-[var(--color-steel)]" />
                    <p className="text-[var(--color-steel)]">No notifications</p>
                </div>
            )}

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                                <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <h4 className="font-medium text-white text-sm">Delivery Channels</h4>
                                {[{ icon: Monitor, label: 'In-App', enabled: true }, { icon: Mail, label: 'Email', enabled: true }, { icon: Smartphone, label: 'SMS', enabled: false }].map((channel, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                        <div className="flex items-center gap-3">
                                            <channel.icon className="w-5 h-5 text-[var(--color-steel)]" />
                                            <span className="text-sm text-white">{channel.label}</span>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${channel.enabled ? 'bg-[var(--color-synapse-teal)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${channel.enabled ? 'translate-x-4' : ''}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end">
                                <button className="btn-primary">Save Settings</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default NotificationCenter;
