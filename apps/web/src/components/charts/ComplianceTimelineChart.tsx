'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    Calendar,
    ArrowRight,
    FileText,
    Users,
    DollarSign,
} from 'lucide-react';

interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description?: string;
    type: 'milestone' | 'deadline' | 'filing' | 'period_start' | 'period_end' | 'event';
    status: 'complete' | 'current' | 'upcoming' | 'overdue';
    metadata?: {
        affectedCount?: number;
        amount?: number;
        documentId?: string;
    };
}

interface ComplianceTimelineChartProps {
    events: TimelineEvent[];
    showConnectors?: boolean;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

/**
 * Compliance Timeline Chart
 * Elegant visualization of compliance events and deadlines
 */
export function ComplianceTimelineChart({
    events,
    showConnectors = true,
    orientation = 'vertical',
    className = '',
}: ComplianceTimelineChartProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'complete':
                return {
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-500/50',
                    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                    dot: 'bg-emerald-400',
                    line: 'bg-emerald-500/30',
                };
            case 'current':
                return {
                    bg: 'bg-cyan-500/20',
                    border: 'border-cyan-500/50',
                    icon: <Clock className="w-4 h-4 text-cyan-400" />,
                    dot: 'bg-cyan-400 animate-pulse',
                    line: 'bg-cyan-500/30',
                };
            case 'overdue':
                return {
                    bg: 'bg-red-500/20',
                    border: 'border-red-500/50',
                    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
                    dot: 'bg-red-400',
                    line: 'bg-red-500/30',
                };
            default:
                return {
                    bg: 'bg-[rgba(255,255,255,0.05)]',
                    border: 'border-[rgba(255,255,255,0.1)]',
                    icon: <Calendar className="w-4 h-4 text-[#64748B]" />,
                    dot: 'bg-[#64748B]',
                    line: 'bg-[rgba(255,255,255,0.1)]',
                };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'filing': return <FileText className="w-3.5 h-3.5" />;
            case 'period_start':
            case 'period_end': return <Calendar className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    if (orientation === 'horizontal') {
        return (
            <div className={`overflow-x-auto ${className}`}>
                <div className="flex items-start gap-0 min-w-max py-4">
                    {events.map((event, index) => {
                        const config = getStatusConfig(event.status);

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative flex flex-col items-center"
                                style={{ minWidth: '180px' }}
                            >
                                {/* Connector Line */}
                                {showConnectors && index < events.length - 1 && (
                                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${config.line}`} />
                                )}

                                {/* Dot */}
                                <div className={`relative z-10 w-3 h-3 rounded-full ${config.dot} shadow-lg`}>
                                    <div className={`absolute inset-0 rounded-full ${config.dot} animate-ping opacity-30`} />
                                </div>

                                {/* Content */}
                                <div className="mt-4 text-center px-2">
                                    <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">
                                        {event.date}
                                    </p>
                                    <p className="text-sm font-medium text-white mt-1">{event.title}</p>
                                    {event.description && (
                                        <p className="text-xs text-[#94A3B8] mt-1">{event.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-0 ${className}`}>
            {events.map((event, index) => {
                const config = getStatusConfig(event.status);

                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative flex gap-4 pb-6 last:pb-0"
                    >
                        {/* Timeline Line & Dot */}
                        <div className="flex flex-col items-center">
                            <div className={`relative z-10 w-3 h-3 rounded-full ${config.dot} shadow-lg ring-4 ring-[#0A0A0F]`} />
                            {showConnectors && index < events.length - 1 && (
                                <div className={`w-0.5 flex-1 mt-2 ${config.line}`} />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-[#64748B]">{event.date}</span>
                                <span className={`
                  px-1.5 py-0.5 text-[9px] font-bold uppercase rounded
                  ${config.bg} ${config.border} border
                `}>
                                    {event.status}
                                </span>
                            </div>

                            <div className={`
                p-4 rounded-lg border transition-colors
                ${config.bg} ${config.border}
                hover:bg-[rgba(255,255,255,0.05)]
              `}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                        {event.description && (
                                            <p className="text-xs text-[#94A3B8] mt-1">{event.description}</p>
                                        )}

                                        {event.metadata && (
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                                                {event.metadata.affectedCount && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {event.metadata.affectedCount} employees
                                                    </span>
                                                )}
                                                {event.metadata.amount && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        ${event.metadata.amount.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-2 rounded-lg ${config.bg}`}>
                                        {config.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

/**
 * Eligibility Flow Diagram
 * Visual representation of measurement periods
 */
interface PeriodSegment {
    id: string;
    label: string;
    startDate: string;
    endDate: string;
    type: 'lookback' | 'administrative' | 'stability' | 'initial' | 'standard';
    status: 'active' | 'complete' | 'upcoming';
}

interface EligibilityFlowDiagramProps {
    periods: PeriodSegment[];
    currentDate?: string;
    className?: string;
}

export function EligibilityFlowDiagram({
    periods,
    currentDate,
    className = '',
}: EligibilityFlowDiagramProps) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'lookback': return 'from-cyan-500/30 to-cyan-600/30 border-cyan-500/50';
            case 'administrative': return 'from-amber-500/30 to-amber-600/30 border-amber-500/50';
            case 'stability': return 'from-emerald-500/30 to-emerald-600/30 border-emerald-500/50';
            case 'initial': return 'from-indigo-500/30 to-indigo-600/30 border-indigo-500/50';
            default: return 'from-purple-500/30 to-purple-600/30 border-purple-500/50';
        }
    };

    return (
        <div className={`glass-card p-6 ${className}`}>
            <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Measurement Period Flow
            </h3>

            <div className="relative">
                {/* Period Segments */}
                <div className="flex gap-2">
                    {periods.map((period, index) => (
                        <motion.div
                            key={period.id}
                            initial={{ opacity: 0, scaleX: 0.8 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-1 relative"
                        >
                            <div className={`
                h-12 rounded-lg bg-gradient-to-r border
                flex items-center justify-center
                ${getTypeColor(period.type)}
                ${period.status === 'active' ? 'ring-2 ring-white/20' : ''}
              `}>
                                <span className="text-xs font-medium text-white">{period.label}</span>
                            </div>

                            {/* Arrow connector */}
                            {index < periods.length - 1 && (
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                    <ArrowRight className="w-4 h-4 text-[#64748B]" />
                                </div>
                            )}

                            {/* Date labels */}
                            <div className="flex justify-between mt-2 px-1">
                                <span className="text-[9px] text-[#64748B]">{period.startDate}</span>
                                <span className="text-[9px] text-[#64748B]">{period.endDate}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-500/50 to-cyan-600/50" />
                        <span className="text-[10px] text-[#94A3B8]">Look-Back</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500/50 to-amber-600/50" />
                        <span className="text-[10px] text-[#94A3B8]">Administrative</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500/50 to-emerald-600/50" />
                        <span className="text-[10px] text-[#94A3B8]">Stability</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComplianceTimelineChart;
