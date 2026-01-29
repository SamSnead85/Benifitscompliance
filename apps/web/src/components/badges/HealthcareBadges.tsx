'use client';

import { motion } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Shield,
    Users,
    Calendar,
    Heart,
    Briefcase,
    DollarSign,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
    status: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    showIcon?: boolean;
    pulse?: boolean;
    className?: string;
}

/**
 * Status Badge
 * Universal status indicator for healthcare compliance
 */
export function StatusBadge({
    status,
    variant = 'default',
    size = 'md',
    showIcon = true,
    pulse = false,
    className = '',
}: StatusBadgeProps) {
    const variantStyles = {
        default: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        danger: 'bg-red-500/10 text-red-400 border-red-500/30',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        neutral: 'bg-[rgba(255,255,255,0.06)] text-[#94A3B8] border-[rgba(255,255,255,0.1)]',
    };

    const sizeStyles = {
        sm: 'px-1.5 py-0.5 text-[9px]',
        md: 'px-2 py-1 text-[10px]',
        lg: 'px-3 py-1.5 text-xs',
    };

    const iconSizes = {
        sm: 'w-2.5 h-2.5',
        md: 'w-3 h-3',
        lg: 'w-3.5 h-3.5',
    };

    const getIcon = () => {
        switch (variant) {
            case 'success': return <CheckCircle2 className={iconSizes[size]} />;
            case 'warning': return <AlertTriangle className={iconSizes[size]} />;
            case 'danger': return <XCircle className={iconSizes[size]} />;
            case 'info': return <Clock className={iconSizes[size]} />;
            default: return null;
        }
    };

    return (
        <span className={`
      inline-flex items-center gap-1 font-semibold uppercase tracking-wide
      rounded-md border
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `}>
            {showIcon && getIcon()}
            {pulse && (
                <span className={`relative flex h-2 w-2`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === 'success' ? 'bg-emerald-400' :
                            variant === 'warning' ? 'bg-amber-400' :
                                variant === 'danger' ? 'bg-red-400' : 'bg-cyan-400'
                        }`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${variant === 'success' ? 'bg-emerald-400' :
                            variant === 'warning' ? 'bg-amber-400' :
                                variant === 'danger' ? 'bg-red-400' : 'bg-cyan-400'
                        }`} />
                </span>
            )}
            {status}
        </span>
    );
}

/**
 * Eligibility Status Badge
 * Specific to ACA eligibility states
 */
interface EligibilityBadgeProps {
    eligibility: 'full_time' | 'part_time' | 'variable_hour' | 'seasonal' | 'new_hire' | 'terminated';
    showIcon?: boolean;
    className?: string;
}

export function EligibilityBadge({ eligibility, showIcon = true, className = '' }: EligibilityBadgeProps) {
    const config = {
        full_time: { label: 'Full-Time', variant: 'success' as BadgeVariant, icon: <Users className="w-3 h-3" /> },
        part_time: { label: 'Part-Time', variant: 'neutral' as BadgeVariant, icon: <Clock className="w-3 h-3" /> },
        variable_hour: { label: 'Variable Hour', variant: 'warning' as BadgeVariant, icon: <AlertTriangle className="w-3 h-3" /> },
        seasonal: { label: 'Seasonal', variant: 'info' as BadgeVariant, icon: <Calendar className="w-3 h-3" /> },
        new_hire: { label: 'New Hire', variant: 'default' as BadgeVariant, icon: <Users className="w-3 h-3" /> },
        terminated: { label: 'Terminated', variant: 'danger' as BadgeVariant, icon: <XCircle className="w-3 h-3" /> },
    };

    const { label, variant, icon } = config[eligibility];

    return (
        <StatusBadge
            status={label}
            variant={variant}
            showIcon={false}
            className={className}
        />
    );
}

/**
 * Coverage Tier Badge
 * Healthcare plan tier indicator
 */
interface CoverageTierBadgeProps {
    tier: 'employee_only' | 'employee_spouse' | 'employee_children' | 'family';
    className?: string;
}

export function CoverageTierBadge({ tier, className = '' }: CoverageTierBadgeProps) {
    const config = {
        employee_only: { label: 'EE Only', icon: <Users className="w-3 h-3" />, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
        employee_spouse: { label: 'EE + Spouse', icon: <Heart className="w-3 h-3" />, color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
        employee_children: { label: 'EE + Children', icon: <Users className="w-3 h-3" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
        family: { label: 'Family', icon: <Heart className="w-3 h-3" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    };

    const { label, icon, color } = config[tier];

    return (
        <span className={`
      inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide
      rounded-md border ${color} ${className}
    `}>
            {icon}
            {label}
        </span>
    );
}

/**
 * Compliance Score Pill
 * Dynamic score visualization
 */
interface ComplianceScorePillProps {
    score: number;
    maxScore?: number;
    showTrend?: boolean;
    trend?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ComplianceScorePill({
    score,
    maxScore = 100,
    showTrend = false,
    trend,
    size = 'md',
    className = '',
}: ComplianceScorePillProps) {
    const percentage = (score / maxScore) * 100;

    const getColor = () => {
        if (percentage >= 90) return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400';
        if (percentage >= 70) return 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400';
        return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400';
    };

    const sizeStyles = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    return (
        <span className={`
      inline-flex items-center gap-2 font-mono font-bold
      bg-gradient-to-r ${getColor()}
      rounded-full border
      ${sizeStyles[size]}
      ${className}
    `}>
            <span>{score}</span>
            {maxScore !== 100 && <span className="opacity-60">/ {maxScore}</span>}
            {showTrend && trend !== undefined && (
                <span className={`flex items-center text-[10px] ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend >= 0 ? '+' : ''}{trend}%
                </span>
            )}
        </span>
    );
}

/**
 * Risk Level Tag
 * Visual risk indicator with severity scaling
 */
interface RiskLevelTagProps {
    level: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
    showLabel?: boolean;
    animate?: boolean;
    className?: string;
}

export function RiskLevelTag({
    level,
    showLabel = true,
    animate = false,
    className = ''
}: RiskLevelTagProps) {
    const config = {
        critical: {
            label: 'Critical',
            bg: 'bg-red-500',
            container: 'bg-red-500/10 border-red-500/30',
            text: 'text-red-400'
        },
        high: {
            label: 'High',
            bg: 'bg-orange-500',
            container: 'bg-orange-500/10 border-orange-500/30',
            text: 'text-orange-400'
        },
        medium: {
            label: 'Medium',
            bg: 'bg-amber-500',
            container: 'bg-amber-500/10 border-amber-500/30',
            text: 'text-amber-400'
        },
        low: {
            label: 'Low',
            bg: 'bg-cyan-500',
            container: 'bg-cyan-500/10 border-cyan-500/30',
            text: 'text-cyan-400'
        },
        minimal: {
            label: 'Minimal',
            bg: 'bg-emerald-500',
            container: 'bg-emerald-500/10 border-emerald-500/30',
            text: 'text-emerald-400'
        },
    };

    const { label, bg, container, text } = config[level];

    return (
        <span className={`
      inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide
      rounded-md border ${container} ${text}
      ${className}
    `}>
            <span className="relative flex h-2 w-2">
                {animate && (level === 'critical' || level === 'high') && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bg}`} />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${bg}`} />
            </span>
            {showLabel && label}
        </span>
    );
}

/**
 * Plan Type Indicator
 * Healthcare plan type visualization
 */
interface PlanTypeIndicatorProps {
    type: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'hsa' | 'fsa';
    className?: string;
}

export function PlanTypeIndicator({ type, className = '' }: PlanTypeIndicatorProps) {
    const config = {
        medical: { label: 'Medical', icon: <Heart className="w-3.5 h-3.5" />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
        dental: { label: 'Dental', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
        vision: { label: 'Vision', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
        life: { label: 'Life', icon: <Heart className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
        disability: { label: 'Disability', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
        hsa: { label: 'HSA', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
        fsa: { label: 'FSA', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    };

    const { label, icon, color } = config[type];

    return (
        <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
      rounded-lg border ${color} ${className}
    `}>
            {icon}
            {label}
        </span>
    );
}

export default StatusBadge;
