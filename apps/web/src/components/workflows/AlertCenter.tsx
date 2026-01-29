'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle2,
    X,
    Clock,
    ChevronRight,
    Settings,
    Filter,
    BellOff
} from 'lucide-react';

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
    source: string;
    read: boolean;
    actionLabel?: string;
    actionHref?: string;
}

interface AlertCenterProps {
    alerts?: Alert[];
    onDismiss?: (id: string) => void;
    onMarkRead?: (id: string) => void;
    className?: string;
}

const defaultAlerts: Alert[] = [
    {
        id: '1',
        type: 'critical',
        title: 'Filing Deadline Approaching',
        message: '1095-C forms must be distributed to employees by January 31, 2026. 23 forms still pending review.',
        timestamp: '2 hours ago',
        source: 'Compliance Engine',
        read: false,
        actionLabel: 'Review Forms',
        actionHref: '/compliance'
    },
    {
        id: '2',
        type: 'warning',
        title: 'Affordability Threshold Alert',
        message: '15 employees have premium contributions exceeding the 9.12% safe harbor limit.',
        timestamp: '5 hours ago',
        source: 'ACA Monitor',
        read: false,
        actionLabel: 'View Details'
    },
    {
        id: '3',
        type: 'info',
        title: 'New HRIS Sync Available',
        message: 'Gusto has 142 new employee records ready for import. Last sync: 12 hours ago.',
        timestamp: '1 day ago',
        source: 'Integration Hub',
        read: false,
        actionLabel: 'Start Sync'
    },
    {
        id: '4',
        type: 'success',
        title: 'Q4 Compliance Audit Complete',
        message: 'All 1,247 employees passed compliance verification with 99.2% data quality score.',
        timestamp: '2 days ago',
        source: 'Compliance Engine',
        read: true
    },
    {
        id: '5',
        type: 'warning',
        title: 'Measurement Period Ending',
        message: 'Initial measurement period for Q3 2025 hires ends in 15 days. 87 employees affected.',
        timestamp: '3 days ago',
        source: 'Workflow Engine',
        read: true
    }
];

const typeConfig = {
    critical: { icon: AlertCircle, color: 'var(--color-critical)', bgColor: 'rgba(239,68,68,0.15)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', bgColor: 'rgba(245,158,11,0.15)' },
    info: { icon: Info, color: 'var(--color-synapse-cyan)', bgColor: 'rgba(34,211,238,0.15)' },
    success: { icon: CheckCircle2, color: 'var(--color-success)', bgColor: 'rgba(16,185,129,0.15)' }
};

export function AlertCenter({
    alerts = defaultAlerts,
    onDismiss,
    onMarkRead,
    className = ''
}: AlertCenterProps) {
    const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
    const [showRead, setShowRead] = useState(true);
    const [localAlerts, setLocalAlerts] = useState(alerts);

    const unreadCount = localAlerts.filter(a => !a.read).length;
    const filteredAlerts = localAlerts.filter(a => {
        if (!showRead && a.read) return false;
        if (filterType !== 'all' && a.type !== filterType) return false;
        return true;
    });

    const handleDismiss = (id: string) => {
        setLocalAlerts(prev => prev.filter(a => a.id !== id));
        onDismiss?.(id);
    };

    const handleMarkRead = (id: string) => {
        setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
        onMarkRead?.(id);
    };

    const markAllRead = () => {
        setLocalAlerts(prev => prev.map(a => ({ ...a, read: true })));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-critical)] text-white text-xs flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-white">Alert Center</h3>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs text-[var(--color-synapse-teal)] hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterType === type
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowRead(!showRead)}
                    className="flex items-center gap-1 text-xs text-[var(--color-steel)] hover:text-white"
                >
                    {showRead ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                    {showRead ? 'Hide read' : 'Show read'}
                </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                    {filteredAlerts.map((alert, i) => {
                        const config = typeConfig[alert.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10, height: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`p-4 rounded-lg border transition-colors ${alert.read
                                        ? 'bg-[var(--glass-bg)] border-[var(--glass-border)] opacity-70'
                                        : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                    }`}
                                style={{ borderLeftColor: config.color, borderLeftWidth: '3px' }}
                                onClick={() => !alert.read && handleMarkRead(alert.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: config.bgColor }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-white text-sm">{alert.title}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDismiss(alert.id);
                                                }}
                                                className="p-1 rounded hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-[var(--color-silver)] mb-2">{alert.message}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-[var(--color-steel)]">
                                                <Clock className="w-3 h-3" />
                                                <span>{alert.timestamp}</span>
                                                <span>•</span>
                                                <span>{alert.source}</span>
                                            </div>
                                            {alert.actionLabel && (
                                                <button className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                                                    {alert.actionLabel}
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredAlerts.length === 0 && (
                    <div className="text-center py-8 text-[var(--color-steel)]">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No alerts to display</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default AlertCenter;
