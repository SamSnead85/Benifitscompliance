'use client';

import { motion } from 'framer-motion';
import {
    User,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    Shield,
    Heart,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    MoreHorizontal,
} from 'lucide-react';
import { StatusBadge, EligibilityBadge, CoverageTierBadge, ComplianceScorePill } from '../badges/HealthcareBadges';

interface EmployeeSummaryCardProps {
    employee: {
        id: string;
        name: string;
        employeeId: string;
        department?: string;
        position?: string;
        status: 'active' | 'terminated' | 'on_leave';
        eligibility: 'full_time' | 'part_time' | 'variable_hour' | 'seasonal' | 'new_hire' | 'terminated';
        hireDate: string;
        avgHours: number;
        coverageTier?: 'employee_only' | 'employee_spouse' | 'employee_children' | 'family';
        avatar?: string;
    };
    onClick?: () => void;
    className?: string;
}

/**
 * Employee Summary Card
 * Compact employee overview for lists and grids
 */
export function EmployeeSummaryCard({
    employee,
    onClick,
    className = '',
}: EmployeeSummaryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className={`
        glass-card p-4 cursor-pointer group transition-all duration-200
        hover:border-[rgba(255,255,255,0.12)]
        ${className}
      `}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-lg font-semibold text-cyan-400 flex-shrink-0">
                    {employee.avatar ? (
                        <img src={employee.avatar} alt={employee.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                        employee.name.charAt(0)
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white truncate">{employee.name}</h3>
                        <EligibilityBadge eligibility={employee.eligibility} />
                    </div>
                    <p className="text-xs text-[#64748B]">ID: {employee.employeeId}</p>
                    {employee.position && (
                        <p className="text-xs text-[#94A3B8]">{employee.position}</p>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <div>
                    <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Avg Hours</p>
                    <p className={`text-sm font-mono font-medium ${employee.avgHours >= 130 ? 'text-emerald-400' :
                            employee.avgHours >= 100 ? 'text-amber-400' : 'text-[#94A3B8]'
                        }`}>
                        {employee.avgHours}/wk
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Hire Date</p>
                    <p className="text-sm text-[#94A3B8]">{employee.hireDate}</p>
                </div>
                {employee.coverageTier && (
                    <div>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Coverage</p>
                        <CoverageTierBadge tier={employee.coverageTier} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * Plan Comparison Card
 * Side-by-side plan feature comparison
 */
interface PlanOption {
    id: string;
    name: string;
    tier: string;
    monthlyPremium: number;
    deductible: number;
    outOfPocketMax: number;
    copay: {
        primaryCare: number;
        specialist: number;
        emergency: number;
    };
    isRecommended?: boolean;
}

interface PlanComparisonCardProps {
    plan: PlanOption;
    onSelect?: () => void;
    isSelected?: boolean;
    className?: string;
}

export function PlanComparisonCard({
    plan,
    onSelect,
    isSelected,
    className = '',
}: PlanComparisonCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={onSelect}
            className={`
        relative glass-card p-5 cursor-pointer transition-all duration-200
        ${isSelected
                    ? 'border-cyan-500/50 ring-2 ring-cyan-500/20'
                    : 'hover:border-[rgba(255,255,255,0.12)]'
                }
        ${className}
      `}
        >
            {/* Recommended Badge */}
            {plan.isRecommended && (
                <div className="absolute -top-2 left-4 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-cyan-500 text-[#030712] rounded">
                    Recommended
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                    <p className="text-xs text-[#64748B]">{plan.tier}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold font-mono text-white">${plan.monthlyPremium}</p>
                    <p className="text-[10px] text-[#64748B]">per month</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-sm text-[#94A3B8]">Deductible</span>
                    <span className="text-sm font-mono font-medium text-white">${plan.deductible.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-sm text-[#94A3B8]">Out-of-Pocket Max</span>
                    <span className="text-sm font-mono font-medium text-white">${plan.outOfPocketMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-sm text-[#94A3B8]">Primary Care Visit</span>
                    <span className="text-sm font-mono font-medium text-white">${plan.copay.primaryCare}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-sm text-[#94A3B8]">Specialist Visit</span>
                    <span className="text-sm font-mono font-medium text-white">${plan.copay.specialist}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-[#94A3B8]">Emergency Room</span>
                    <span className="text-sm font-mono font-medium text-white">${plan.copay.emergency}</span>
                </div>
            </div>

            {/* Select Indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>
            )}
        </motion.div>
    );
}

/**
 * Period Status Card
 * Measurement/stability period visualization
 */
interface PeriodStatusCardProps {
    period: {
        type: 'measurement' | 'administrative' | 'stability';
        name: string;
        startDate: string;
        endDate: string;
        daysRemaining: number;
        totalDays: number;
        status: 'active' | 'complete' | 'upcoming';
    };
    className?: string;
}

export function PeriodStatusCard({ period, className = '' }: PeriodStatusCardProps) {
    const progress = ((period.totalDays - period.daysRemaining) / period.totalDays) * 100;

    const typeColors = {
        measurement: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
        administrative: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
        stability: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        glass-card p-4 bg-gradient-to-br ${typeColors[period.type]}
        ${className}
      `}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#64748B]" />
                    <h3 className="text-sm font-medium text-white">{period.name}</h3>
                </div>
                <StatusBadge
                    status={period.status}
                    variant={period.status === 'active' ? 'default' : period.status === 'complete' ? 'success' : 'neutral'}
                    pulse={period.status === 'active'}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
                <span>{period.startDate}</span>
                <span>{period.endDate}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${period.type === 'measurement' ? 'bg-cyan-400' :
                            period.type === 'administrative' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                />
            </div>

            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[#64748B]">
                    {period.daysRemaining} days remaining
                </p>
                <p className="text-xs font-mono text-white">
                    {Math.round(progress)}%
                </p>
            </div>
        </motion.div>
    );
}

/**
 * Deadline Countdown Card
 * Urgent deadline visualization
 */
interface DeadlineCountdownProps {
    deadline: {
        title: string;
        date: string;
        daysUntil: number;
        type: 'filing' | 'distribution' | 'election' | 'other';
        priority: 'critical' | 'high' | 'medium' | 'low';
    };
    className?: string;
}

export function DeadlineCountdown({ deadline, className = '' }: DeadlineCountdownProps) {
    const priorityColors = {
        critical: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
        high: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
        medium: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
        low: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        glass-card p-4 bg-gradient-to-br ${priorityColors[deadline.priority]}
        ${className}
      `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
                        {deadline.type}
                    </p>
                    <h3 className="text-sm font-medium text-white">{deadline.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{deadline.date}</p>
                </div>
                <div className="text-right">
                    <p className={`text-3xl font-bold font-mono ${deadline.daysUntil <= 7 ? 'text-red-400' :
                            deadline.daysUntil <= 30 ? 'text-amber-400' : 'text-white'
                        }`}>
                        {deadline.daysUntil}
                    </p>
                    <p className="text-[10px] text-[#64748B]">days left</p>
                </div>
            </div>

            {deadline.daysUntil <= 7 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Urgent: Action required soon
                </div>
            )}
        </motion.div>
    );
}

export default EmployeeSummaryCard;
