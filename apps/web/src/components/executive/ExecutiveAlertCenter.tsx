'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Bell,
    AlertTriangle,
    Info,
    CheckCircle2,
    Clock,
    X,
    ChevronRight,
    Filter,
    MoreHorizontal,
    Calendar,
    Users,
    DollarSign,
    Shield,
    FileText,
} from 'lucide-react';

interface ExecutiveAlert {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    category: 'compliance' | 'deadline' | 'financial' | 'workforce' | 'regulatory';
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    actionLabel?: string;
    actionUrl?: string;
    metadata?: {
        affectedCount?: number;
        potentialImpact?: string;
        deadline?: string;
    };
}

interface ExecutiveAlertCenterProps {
    alerts: ExecutiveAlert[];
    onMarkRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
    onAction?: (id: string) => void;
    className?: string;
}

/**
 * Executive Alert Center
 * Priority-ranked notifications for C-suite visibility
 */
export function ExecutiveAlertCenter({
    alerts,
    onMarkRead,
    onDismiss,
    onAction,
    className = '',
}: ExecutiveAlertCenterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const unreadCount = alerts.filter(a => !a.isRead).length;
    const criticalCount = alerts.filter(a => a.type === 'critical' && !a.isRead).length;

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'critical':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-400',
                    icon: <AlertTriangle className="w-4 h-4" />,
                };
            case 'warning':
                return {
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    text: 'text-amber-400',
                    icon: <Clock className="w-4 h-4" />,
                };
            case 'success':
                return {
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/30',
                    text: 'text-emerald-400',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                };
            default:
                return {
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/30',
                    text: 'text-cyan-400',
                    icon: <Info className="w-4 h-4" />,
                };
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'deadline': return <Calendar className="w-3.5 h-3.5" />;
            case 'financial': return <DollarSign className="w-3.5 h-3.5" />;
            case 'workforce': return <Users className="w-3.5 h-3.5" />;
            case 'regulatory': return <FileText className="w-3.5 h-3.5" />;
            default: return <Shield className="w-3.5 h-3.5" />;
        }
    };

    const filteredAlerts = alerts.filter(
        a => filterCategory === 'all' || a.category === filterCategory
    );

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'compliance', label: 'Compliance' },
        { id: 'deadline', label: 'Deadlines' },
        { id: 'financial', label: 'Financial' },
        { id: 'workforce', label: 'Workforce' },
        { id: 'regulatory', label: 'Regulatory' },
    ];

    return (
        <div className={`relative ${className}`}>
            {/* Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          relative p-2.5 rounded-lg transition-all
          ${isOpen
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'hover:bg-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white'
                    }
        `}
            >
                <Bell className="w-5 h-5" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
              absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
              text-[10px] font-bold rounded-full
              ${criticalCount > 0
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-cyan-500 text-[#030712]'
                            }
            `}
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Alert Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute right-0 top-full mt-2 z-50 w-[420px] max-h-[70vh] bg-[#0A0A0F] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-cyan-400" />
                                        <h3 className="text-sm font-semibold text-white">Alert Center</h3>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-400">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Category Filters */}
                                <div className="flex gap-1.5 overflow-x-auto pb-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFilterCategory(cat.id)}
                                            className={`
                        px-2.5 py-1 text-[10px] font-medium rounded-md whitespace-nowrap
                        ${filterCategory === cat.id
                                                    ? 'bg-cyan-500/20 text-cyan-400'
                                                    : 'text-[#64748B] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                                }
                      `}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Alerts List */}
                            <div className="max-h-[400px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                                {filteredAlerts.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                                        <p className="text-sm text-white">All caught up!</p>
                                        <p className="text-xs text-[#64748B]">No alerts to display</p>
                                    </div>
                                ) : (
                                    filteredAlerts.map((alert, index) => {
                                        const config = getTypeConfig(alert.type);

                                        return (
                                            <motion.div
                                                key={alert.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.02 }}
                                                className={`
                          p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors
                          ${!alert.isRead ? 'bg-[rgba(255,255,255,0.01)]' : ''}
                        `}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`p-2 rounded-lg ${config.bg}`}>
                                                        <span className={config.text}>{config.icon}</span>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded flex items-center gap-1 ${config.bg} ${config.text}`}>
                                                                        {getCategoryIcon(alert.category)}
                                                                        {alert.category}
                                                                    </span>
                                                                    {!alert.isRead && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                                    )}
                                                                </div>
                                                                <h4 className="text-sm font-medium text-white leading-tight">
                                                                    {alert.title}
                                                                </h4>
                                                            </div>
                                                            <span className="text-[10px] text-[#64748B] whitespace-nowrap">
                                                                {alert.timestamp}
                                                            </span>
                                                        </div>

                                                        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                                                            {alert.description}
                                                        </p>

                                                        {alert.metadata && (
                                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                                                                {alert.metadata.affectedCount && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Users className="w-3 h-3" />
                                                                        {alert.metadata.affectedCount} affected
                                                                    </span>
                                                                )}
                                                                {alert.metadata.deadline && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {alert.metadata.deadline}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {alert.actionLabel && (
                                                            <button
                                                                onClick={() => onAction?.(alert.id)}
                                                                className="mt-2 text-xs font-medium text-cyan-400 hover:underline flex items-center gap-1"
                                                            >
                                                                {alert.actionLabel}
                                                                <ChevronRight className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {onDismiss && (
                                                        <button
                                                            onClick={() => onDismiss(alert.id)}
                                                            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-all"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                                <button className="w-full text-center text-xs text-cyan-400 hover:underline">
                                    View All Alerts
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ExecutiveAlertCenter;
