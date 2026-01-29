'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, Target,
    Zap, Brain, Sparkles, ArrowUpRight, ArrowDownRight, Activity, Shield,
    ChevronRight, Eye, Layers, BarChart3, PieChart as PieIcon, Clock,
    RefreshCw, Filter, Download, Share2, Maximize2, X, ArrowRight
} from 'lucide-react';

// ============================================================================
// PREMIUM DATA
// ============================================================================

const executiveKPIs = [
    {
        id: 'total-spend',
        title: 'Total Plan Spend',
        value: 8247532,
        previousValue: 7892145,
        format: 'currency' as const,
        trend: 'up',
        trendPercent: 4.5,
        sparkline: [65, 72, 68, 85, 78, 92, 88, 95],
        gradient: ['#F59E0B', '#EF4444'],
        insight: 'Trending 4.5% above prior year due to specialty pharmacy',
        aiConfidence: 94
    },
    {
        id: 'pmpm',
        title: 'Current PMPM',
        value: 542,
        previousValue: 525,
        format: 'currency' as const,
        trend: 'up',
        trendPercent: 3.2,
        sparkline: [520, 515, 528, 535, 542, 538, 545, 542],
        gradient: ['#8B5CF6', '#EC4899'],
        insight: 'Within 2% of budget target, pharmacy driving variance',
        aiConfidence: 91
    },
    {
        id: 'members',
        title: 'Active Members',
        value: 12847,
        previousValue: 12456,
        format: 'number' as const,
        trend: 'up',
        trendPercent: 3.1,
        sparkline: [12200, 12350, 12400, 12500, 12600, 12750, 12800, 12847],
        gradient: ['#06B6D4', '#3B82F6'],
        insight: 'Q4 open enrollment added 391 new members',
        aiConfidence: 99
    },
    {
        id: 'stop-loss',
        title: 'Stop-Loss Utilization',
        value: 78,
        previousValue: 65,
        format: 'percent' as const,
        trend: 'up',
        trendPercent: 20,
        sparkline: [45, 52, 58, 62, 68, 72, 75, 78],
        gradient: ['#EF4444', '#F97316'],
        insight: '3 members projected to breach specific deductible',
        aiConfidence: 87
    }
];

const pmpmTrendData = [
    { month: 'Jan', actual: 498, budget: 510, projected: null, lower: null, upper: null },
    { month: 'Feb', actual: 512, budget: 515, projected: null, lower: null, upper: null },
    { month: 'Mar', actual: 525, budget: 518, projected: null, lower: null, upper: null },
    { month: 'Apr', actual: 518, budget: 520, projected: null, lower: null, upper: null },
    { month: 'May', actual: 532, budget: 522, projected: null, lower: null, upper: null },
    { month: 'Jun', actual: 545, budget: 525, projected: null, lower: null, upper: null },
    { month: 'Jul', actual: 538, budget: 528, projected: null, lower: null, upper: null },
    { month: 'Aug', actual: 552, budget: 530, projected: null, lower: null, upper: null },
    { month: 'Sep', actual: 548, budget: 532, projected: null, lower: null, upper: null },
    { month: 'Oct', actual: 542, budget: 535, projected: null, lower: null, upper: null },
    { month: 'Nov', actual: null, budget: 538, projected: 555, lower: 545, upper: 565 },
    { month: 'Dec', actual: null, budget: 540, projected: 562, lower: 548, upper: 576 }
];

const costBreakdown = [
    { category: 'Inpatient', value: 2847234, percent: 34.5, color: '#F59E0B', trend: 8.2 },
    { category: 'Outpatient', value: 1523456, percent: 18.5, color: '#8B5CF6', trend: -2.1 },
    { category: 'Pharmacy', value: 1734567, percent: 21.0, color: '#EC4899', trend: 15.3 },
    { category: 'Professional', value: 987654, percent: 12.0, color: '#06B6D4', trend: 3.4 },
    { category: 'ER/Urgent', value: 654321, percent: 7.9, color: '#EF4444', trend: -5.2 },
    { category: 'Other', value: 500300, percent: 6.1, color: '#64748B', trend: 1.8 }
];

const aiInsights = [
    {
        id: 1,
        type: 'critical',
        title: 'Stop-Loss Breach Imminent',
        description: 'Member M-4521 projected to exceed $275K specific deductible within 45 days based on current trajectory.',
        action: 'Review Case',
        savings: 45000,
        confidence: 94,
        timestamp: '2 hours ago'
    },
    {
        id: 2,
        type: 'warning',
        title: 'GLP-1 Spend Acceleration',
        description: 'Ozempic/Wegovy utilization up 89% YoY. 23 new starts in Q4. Projected $312K annual impact.',
        action: 'Analyze Trend',
        savings: 156000,
        confidence: 91,
        timestamp: '6 hours ago'
    },
    {
        id: 3,
        type: 'opportunity',
        title: 'Generic Substitution Opportunity',
        description: 'AI identified $127K in potential savings through therapeutic alternatives for 8 high-cost medications.',
        action: 'View Details',
        savings: 127000,
        confidence: 88,
        timestamp: '1 day ago'
    },
    {
        id: 4,
        type: 'positive',
        title: 'Care Management ROI',
        description: 'Diabetes management program showing 4.2x ROI. Hospital admits down 23% for enrolled members.',
        action: 'Expand Program',
        savings: 234000,
        confidence: 96,
        timestamp: '2 days ago'
    }
];

const highCostMembers = [
    { id: 'M-4521', riskScore: 94, ytdClaims: 248500, projected: 312000, trend: 'up', condition: 'Hemophilia A', intervention: 'Care Management' },
    { id: 'M-7832', riskScore: 87, ytdClaims: 189200, projected: 245000, trend: 'up', condition: 'Cancer - Breast', intervention: 'Oncology Review' },
    { id: 'M-2156', riskScore: 82, ytdClaims: 156800, projected: 198000, trend: 'stable', condition: 'Multiple Sclerosis', intervention: 'Specialty Pharmacy' },
    { id: 'M-9443', riskScore: 78, ytdClaims: 142300, projected: 175000, trend: 'down', condition: 'ESRD', intervention: 'Transplant Eval' },
    { id: 'M-3287', riskScore: 75, ytdClaims: 128900, projected: 158000, trend: 'up', condition: 'CHF', intervention: 'Remote Monitoring' }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
};

const pulseVariants = {
    pulse: {
        scale: [1, 1.02, 1],
        transition: { repeat: Infinity, duration: 2 }
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
    return value.toLocaleString();
}

// ============================================================================
// PREMIUM COMPONENTS
// ============================================================================

function GlassCard({ children, className = '', gradient = false, glow = false }: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
    glow?: boolean;
}) {
    return (
        <motion.div
            variants={itemVariants}
            className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                backdrop-blur-xl border border-white/[0.08]
                ${glow ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'shadow-2xl shadow-black/20'}
                ${className}
            `}
        >
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
            {children}
        </motion.div>
    );
}

function AnimatedValue({ value, format }: { value: number; format: 'currency' | 'number' | 'percent' }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    if (format === 'currency') return <>{formatCurrency(displayValue)}</>;
    if (format === 'percent') return <>{displayValue}%</>;
    return <>{formatNumber(displayValue)}</>;
}

function MiniSparkline({ data, gradient }: { data: number[]; gradient: string[] }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const height = 40;
    const width = 100;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const gradientId = `sparkline-${gradient[0].replace('#', '')}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradient[0]} />
                    <stop offset="100%" stopColor={gradient[1]} />
                </linearGradient>
            </defs>
            <motion.polyline
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Glow effect */}
            <motion.polyline
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{ filter: 'blur(4px)' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            />
        </svg>
    );
}

function ExecutiveKPICard({ kpi, index }: { kpi: typeof executiveKPIs[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showInsight, setShowInsight] = useState(false);

    return (
        <GlassCard gradient glow={kpi.id === 'stop-loss' && kpi.value > 75}>
            <motion.div
                className="p-6 cursor-pointer"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setShowInsight(!showInsight)}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: kpi.gradient[0] }}
                        />
                        <span className="text-sm text-[var(--text-secondary)] font-medium">{kpi.title}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: isHovered ? 45 : 0 }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </motion.div>
                </div>

                {/* Value */}
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <div className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                            <AnimatedValue value={kpi.value} format={kpi.format} />
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1 text-sm ${kpi.trend === 'up' ? (kpi.id === 'stop-loss' ? 'text-rose-400' : 'text-emerald-400') : 'text-emerald-400'
                            }`}>
                            {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-medium">{kpi.trendPercent}%</span>
                            <span className="text-[var(--text-tertiary)]">vs PY</span>
                        </div>
                    </div>
                    <MiniSparkline data={kpi.sparkline} gradient={kpi.gradient} />
                </div>

                {/* AI Insight Pill */}
                <AnimatePresence>
                    {(isHovered || showInsight) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-white/5"
                        >
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{kpi.insight}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] text-[var(--text-tertiary)]">AI Confidence</span>
                                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${kpi.gradient[0]}, ${kpi.gradient[1]})` }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${kpi.aiConfidence}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--accent-primary)]">{kpi.aiConfidence}%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </GlassCard>
    );
}

function AIInsightCard({ insight, index }: { insight: typeof aiInsights[0]; index: number }) {
    const typeStyles = {
        critical: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertTriangle, iconColor: 'text-rose-400' },
        warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Zap, iconColor: 'text-amber-400' },
        opportunity: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Target, iconColor: 'text-cyan-400' },
        positive: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: TrendingUp, iconColor: 'text-emerald-400' }
    };

    const style = typeStyles[insight.type as keyof typeof typeStyles];
    const Icon = style.icon;

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ x: 4, scale: 1.01 }}
            className={`p-4 rounded-xl ${style.bg} border ${style.border} cursor-pointer group`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-black/20 ${style.iconColor}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">{insight.title}</h4>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{insight.timestamp}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[var(--accent-primary)]">
                                {formatCurrency(insight.savings)} potential
                            </span>
                            <span className="text-[10px] text-[var(--text-tertiary)]">
                                {insight.confidence}% confidence
                            </span>
                        </div>
                        <button className="flex items-center gap-1 text-xs text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                            {insight.action}
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function CircularProgress({ value, size = 120, strokeWidth = 10, gradient }: {
    value: number;
    size?: number;
    strokeWidth?: number;
    gradient: string[];
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const gradientId = `circular-${gradient[0].replace('#', '')}`;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradient[0]} />
                        <stop offset="100%" stopColor={gradient[1]} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    filter="url(#glow)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{value}%</span>
                <span className="text-[10px] text-[var(--text-tertiary)]">Utilized</span>
            </div>
        </div>
    );
}

function DrillDownModal({ data, onClose }: { data: typeof costBreakdown[0] | null; onClose: () => void }) {
    if (!data) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-2xl bg-[var(--surface-primary)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{data.category} Deep Dive</h2>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5 text-[var(--text-tertiary)]" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5">
                                <div className="text-xs text-[var(--text-tertiary)] mb-1">Total Spend</div>
                                <div className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(data.value)}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <div className="text-xs text-[var(--text-tertiary)] mb-1">% of Total</div>
                                <div className="text-xl font-bold text-[var(--text-primary)]">{data.percent}%</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <div className="text-xs text-[var(--text-tertiary)] mb-1">YoY Change</div>
                                <div className={`text-xl font-bold ${data.trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.trend > 0 ? '+' : ''}{data.trend}%
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent border border-[var(--accent-primary)]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-4 h-4 text-[var(--accent-primary)]" />
                                <span className="text-sm font-medium text-[var(--text-primary)]">AI Analysis</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {data.category} costs are trending {data.trend > 0 ? 'above' : 'below'} industry benchmarks.
                                Top drivers include high-cost procedures and specialty care coordination gaps.
                                Recommend reviewing provider network efficiency.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AnalyticsCommandCenter() {
    const [selectedCategory, setSelectedCategory] = useState<typeof costBreakdown[0] | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <Brain className="w-8 h-8 text-[var(--accent-primary)]" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                            Analytics Command Center
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                        AI-powered insights • Real-time analysis • Predictive intelligence
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] text-sm hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-amber-400 text-black text-sm font-medium shadow-lg shadow-amber-500/25"
                    >
                        <Zap className="w-4 h-4" />
                        AI Deep Dive
                    </motion.button>
                </div>
            </motion.div>

            {/* Executive KPIs */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {executiveKPIs.map((kpi, index) => (
                    <ExecutiveKPICard key={kpi.id} kpi={kpi} index={index} />
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* PMPM Trend Chart */}
                <GlassCard className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">PMPM Trend & Forecast</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">Actual vs Budget with AI Projections</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 rounded bg-[var(--accent-primary)]" />
                                Actual
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 rounded bg-white/30" style={{ borderStyle: 'dashed' }} />
                                Budget
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 rounded bg-cyan-400" />
                                Projected
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pmpmTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={[480, 600]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    formatter={(value) => value !== undefined ? [`$${value}`, ''] : ['', '']}
                                />
                                {/* Confidence band */}
                                <Area type="monotone" dataKey="upper" stroke="none" fill="#06B6D4" fillOpacity={0.1} />
                                <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" />
                                {/* Budget line */}
                                <Line type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                                {/* Actual area */}
                                <Area type="monotone" dataKey="actual" stroke="var(--accent-primary)" strokeWidth={3} fill="url(#actualGradient)" dot={{ fill: 'var(--accent-primary)', strokeWidth: 0, r: 4 }} />
                                {/* Projected area */}
                                <Area type="monotone" dataKey="projected" stroke="#06B6D4" strokeWidth={3} strokeDasharray="6 4" fill="url(#projectedGradient)" dot={{ fill: '#06B6D4', strokeWidth: 0, r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Stop-Loss Gauge */}
                <GlassCard className="p-6" glow>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Stop-Loss Status</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">Aggregate Utilization</p>
                        </div>
                        <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="flex justify-center mb-6">
                        <CircularProgress value={78} gradient={['#EF4444', '#F97316']} />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[var(--text-secondary)]">Specific (any member)</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" />
                                </div>
                                <span className="text-sm font-mono text-rose-400">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-sm text-[var(--text-secondary)]">Aggregate</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[42%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                                </div>
                                <span className="text-sm font-mono text-emerald-400">42%</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <div className="flex items-center gap-2 text-rose-400">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-medium">3 members at breach risk</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Cost Breakdown & AI Insights Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Cost Breakdown */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cost Distribution</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">Click segments to drill down</p>
                        </div>
                        <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {costBreakdown.map((item, index) => (
                            <motion.button
                                key={item.category}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCategory(item)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-left group"
                            >
                                <div
                                    className="w-3 h-10 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex-1">
                                    <div className="text-sm text-[var(--text-primary)]">{item.category}</div>
                                    <div className="text-xs text-[var(--text-tertiary)]">{item.percent}% of total</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-mono text-[var(--text-primary)]">{formatCurrency(item.value)}</div>
                                    <div className={`text-xs ${item.trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {item.trend > 0 ? '+' : ''}{item.trend}%
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </GlassCard>

                {/* AI Insights */}
                <GlassCard className="p-6" gradient>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI Insights</h2>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-medium">
                            4 new
                        </span>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        {aiInsights.map((insight, index) => (
                            <AIInsightCard key={insight.id} insight={insight} index={index} />
                        ))}
                    </motion.div>
                </GlassCard>
            </div>

            {/* High-Cost Members Table */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">High-Cost Members</h2>
                        <p className="text-sm text-[var(--text-tertiary)]">AI risk-scored with intervention recommendations</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[var(--text-secondary)] text-xs hover:bg-white/10 transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[var(--text-secondary)] text-xs hover:bg-white/10 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                <th className="text-left py-3 px-4">Member ID</th>
                                <th className="text-center py-3 px-4">Risk Score</th>
                                <th className="text-left py-3 px-4">Primary Condition</th>
                                <th className="text-right py-3 px-4">YTD Claims</th>
                                <th className="text-right py-3 px-4">Projected</th>
                                <th className="text-center py-3 px-4">Trend</th>
                                <th className="text-left py-3 px-4">Intervention</th>
                                <th className="text-center py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highCostMembers.map((member, index) => (
                                <motion.tr
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-mono text-[var(--text-primary)]">{member.id}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${member.riskScore >= 90 ? 'bg-rose-500 animate-pulse' :
                                                member.riskScore >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`} />
                                            <span className={`text-sm font-bold ${member.riskScore >= 90 ? 'text-rose-400' :
                                                member.riskScore >= 80 ? 'text-amber-400' : 'text-emerald-400'
                                                }`}>
                                                {member.riskScore}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[var(--text-secondary)]">{member.condition}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-sm font-mono text-[var(--text-primary)]">{formatCurrency(member.ytdClaims)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-sm font-mono text-[var(--accent-primary)]">{formatCurrency(member.projected)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {member.trend === 'up' && <TrendingUp className="w-4 h-4 text-rose-400 mx-auto" />}
                                        {member.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-400 mx-auto" />}
                                        {member.trend === 'stable' && <Activity className="w-4 h-4 text-amber-400 mx-auto" />}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">
                                            <Target className="w-3 h-3" />
                                            {member.intervention}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
                                            <Eye className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)]" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Drill-down Modal */}
            {selectedCategory && (
                <DrillDownModal data={selectedCategory} onClose={() => setSelectedCategory(null)} />
            )}
        </div>
    );
}
