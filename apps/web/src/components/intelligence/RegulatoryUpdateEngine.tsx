'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Bell,
    AlertTriangle,
    Info,
    Calendar,
    ExternalLink,
    ChevronDown,
    FileText,
    Clock,
    CheckCircle2,
    BookOpen,
} from 'lucide-react';

interface RegulatoryUpdate {
    id: string;
    title: string;
    source: string;
    date: string;
    category: 'aca' | 'irs' | 'dol' | 'hhs' | 'state';
    severity: 'info' | 'warning' | 'critical';
    summary: string;
    actionRequired?: string;
    effectiveDate?: string;
    documentUrl?: string;
    isRead?: boolean;
}

interface RegulatoryUpdateEngineProps {
    updates: RegulatoryUpdate[];
    onMarkRead?: (id: string) => void;
    className?: string;
}

/**
 * Regulatory Update Engine
 * Real-time IRS/DOL guidance tracking with actionable alerts
 */
export function RegulatoryUpdateEngine({
    updates,
    onMarkRead,
    className = '',
}: RegulatoryUpdateEngineProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Updates' },
        { id: 'aca', label: 'ACA' },
        { id: 'irs', label: 'IRS' },
        { id: 'dol', label: 'DOL' },
        { id: 'hhs', label: 'HHS' },
        { id: 'state', label: 'State' },
    ];

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
                    badge: 'bg-red-500/20 text-red-400',
                };
            case 'warning':
                return {
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    icon: <Bell className="w-4 h-4 text-amber-400" />,
                    badge: 'bg-amber-500/20 text-amber-400',
                };
            default:
                return {
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/30',
                    icon: <Info className="w-4 h-4 text-cyan-400" />,
                    badge: 'bg-cyan-500/20 text-cyan-400',
                };
        }
    };

    const filteredUpdates = updates.filter(
        update => filterCategory === 'all' || update.category === filterCategory
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Regulatory Updates
                            </h2>
                            <p className="text-sm text-[#64748B]">Real-time guidance tracking</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400">
                        {updates.filter(u => !u.isRead).length} new
                    </span>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`
                px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap
                transition-all duration-200
                ${filterCategory === cat.id
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                }
              `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Updates List */}
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filteredUpdates.map((update, index) => {
                    const config = getSeverityConfig(update.severity);
                    const isExpanded = expandedId === update.id;

                    return (
                        <motion.div
                            key={update.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className={`p-4 ${!update.isRead ? 'bg-[rgba(255,255,255,0.01)]' : ''}`}
                        >
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : update.id)}
                                className="flex items-start gap-3 cursor-pointer"
                            >
                                <div className={`mt-0.5 p-2 rounded-lg ${config.bg}`}>
                                    {config.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${config.badge}`}>
                                            {update.category}
                                        </span>
                                        <span className="text-xs text-[#64748B]">{update.source}</span>
                                        {!update.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                        )}
                                    </div>

                                    <h3 className="text-sm font-medium text-white mb-1">{update.title}</h3>

                                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {update.date}
                                        </span>
                                        {update.effectiveDate && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Effective: {update.effectiveDate}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    className="text-[#64748B]"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-12 pt-3 space-y-3">
                                            <p className="text-sm text-[#94A3B8]">{update.summary}</p>

                                            {update.actionRequired && (
                                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                                    <p className="text-xs font-semibold text-amber-400 mb-1">Action Required</p>
                                                    <p className="text-sm text-white">{update.actionRequired}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                {update.documentUrl && (
                                                    <a
                                                        href={update.documentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        View Document
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {!update.isRead && onMarkRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMarkRead(update.id);
                                                        }}
                                                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Mark as Read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/**
 * Regulatory Alert Banner
 */
interface RegulatoryAlertProps {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    className?: string;
}

export function RegulatoryAlert({
    title,
    message,
    severity,
    actionLabel,
    onAction,
    onDismiss,
    className = '',
}: RegulatoryAlertProps) {
    const severityStyles = {
        info: 'bg-cyan-500/10 border-cyan-500/30',
        warning: 'bg-amber-500/10 border-amber-500/30',
        critical: 'bg-red-500/10 border-red-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${severityStyles[severity]} ${className}`}
        >
            <div className="flex items-start gap-3">
                {severity === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                ) : severity === 'warning' ? (
                    <Bell className="w-5 h-5 text-amber-400 mt-0.5" />
                ) : (
                    <Info className="w-5 h-5 text-cyan-400 mt-0.5" />
                )}

                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <p className="text-sm text-[#94A3B8] mt-1">{message}</p>

                    {(actionLabel || onDismiss) && (
                        <div className="flex items-center gap-3 mt-3">
                            {actionLabel && onAction && (
                                <button
                                    onClick={onAction}
                                    className="text-xs font-medium text-cyan-400 hover:underline"
                                >
                                    {actionLabel}
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className="text-xs text-[#64748B] hover:text-white"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Regulatory Timeline
 */
interface RegulatoryTimelineProps {
    events: Array<{
        id: string;
        date: string;
        title: string;
        description: string;
        type: 'deadline' | 'update' | 'filing';
        isComplete?: boolean;
    }>;
    className?: string;
}

export function RegulatoryTimeline({ events, className = '' }: RegulatoryTimelineProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {events.map((event, index) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                >
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                        <div className={`
              w-3 h-3 rounded-full
              ${event.isComplete ? 'bg-emerald-400' :
                                event.type === 'deadline' ? 'bg-red-400' : 'bg-cyan-400'}
            `} />
                        {index < events.length - 1 && (
                            <div className="w-px flex-1 bg-[rgba(255,255,255,0.1)] mt-2" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#64748B]">{event.date}</span>
                            <span className={`
                px-2 py-0.5 text-[10px] font-bold uppercase rounded
                ${event.type === 'deadline' ? 'bg-red-500/20 text-red-400' :
                                    event.type === 'filing' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-cyan-500/20 text-cyan-400'}
              `}>
                                {event.type}
                            </span>
                        </div>
                        <h4 className="text-sm font-medium text-white">{event.title}</h4>
                        <p className="text-xs text-[#94A3B8] mt-1">{event.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default RegulatoryUpdateEngine;
