'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, ComposedChart, Bar as RechartsBar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
    Brain, Zap, AlertTriangle, TrendingUp, TrendingDown, Target, Shield,
    Activity, ChevronRight, Eye, Sparkles, Cpu, GitBranch, Layers,
    Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Settings, Play,
    Pause, BarChart2, PieChart, Users, DollarSign, Heart, X, Check,
    ChevronDown, Filter, Download, Bell, AlertCircle
} from 'lucide-react';

// ============================================================================
// PREMIUM DATA - AI PREDICTIONS
// ============================================================================

const riskDistribution = [
    { range: '0-20', count: 4521, percent: 35.2, label: 'Low Risk', color: '#10B981' },
    { range: '21-40', count: 3287, percent: 25.6, label: 'Moderate', color: '#22D3EE' },
    { range: '41-60', count: 2456, percent: 19.1, label: 'Elevated', color: '#FBBF24' },
    { range: '61-80', count: 1823, percent: 14.2, label: 'High', color: '#F97316' },
    { range: '81-100', count: 760, percent: 5.9, label: 'Critical', color: '#EF4444' }
];

const projectionData = [
    { month: 'Jul', actual: 6.8, predicted: null, lower: null, upper: null },
    { month: 'Aug', actual: 7.1, predicted: null, lower: null, upper: null },
    { month: 'Sep', actual: 7.4, predicted: null, lower: null, upper: null },
    { month: 'Oct', actual: 7.2, predicted: null, lower: null, upper: null },
    { month: 'Nov', actual: 7.8, predicted: null, lower: null, upper: null },
    { month: 'Dec', actual: null, predicted: 8.1, lower: 7.6, upper: 8.6 },
    { month: 'Jan', actual: null, predicted: 8.4, lower: 7.8, upper: 9.0 },
    { month: 'Feb', actual: null, predicted: 8.7, lower: 7.9, upper: 9.5 },
    { month: 'Mar', actual: null, predicted: 9.1, lower: 8.2, upper: 10.0 }
];

const breachProbabilities = [
    { type: 'Specific (Any)', probability: 78, trend: 'increasing', daysToRisk: 45, gradient: ['#EF4444', '#F97316'] },
    { type: 'Aggregate', probability: 23, trend: 'stable', daysToRisk: null, gradient: ['#10B981', '#22D3EE'] }
];

const modelMetrics = [
    { name: 'Prediction Accuracy', value: 94.2, target: 90, icon: Target },
    { name: 'Alert Precision', value: 87.5, target: 85, icon: Bell },
    { name: 'ROI Validation', value: 91.3, target: 88, icon: DollarSign },
    { name: 'F1 Score', value: 89.8, target: 85, icon: Activity }
];

const predictiveAlerts = [
    {
        id: 1,
        severity: 'critical',
        title: 'Imminent Stop-Loss Breach',
        member: 'M-4521',
        description: 'Member projected to breach $275K specific deductible within 45 days. Current trajectory: $312K YE projection.',
        probability: 94,
        impact: 45000,
        action: 'Initiate Care Management',
        timestamp: '2 hours ago'
    },
    {
        id: 2,
        severity: 'high',
        title: 'GLP-1 Spend Trajectory',
        description: 'Medication costs projected to increase 89% YoY if current enrollment trends continue. 23 new starts identified.',
        probability: 91,
        impact: 156000,
        action: 'Review Prior Auth Criteria',
        timestamp: '6 hours ago'
    },
    {
        id: 3,
        severity: 'medium',
        title: 'Emerging High-Cost Cohort',
        description: 'AI detected 12 members with rapid risk score acceleration. Early intervention could prevent $380K in projected claims.',
        probability: 88,
        impact: 380000,
        action: 'Deploy Outreach',
        timestamp: '1 day ago'
    },
    {
        id: 4,
        severity: 'low',
        title: 'Favorable Trend Detected',
        description: 'Musculoskeletal claims down 8.4% following physical therapy benefit enhancement. Projected annual savings: $127K.',
        probability: 96,
        impact: -127000,
        action: 'Expand Program',
        timestamp: '2 days ago'
    }
];

const highRiskMembers = [
    {
        id: 'M-4521',
        riskScore: 94,
        riskDelta: 12,
        condition: 'Hemophilia A',
        ytdClaims: 248500,
        projected: 312000,
        stopLossRisk: 'High',
        intervention: 'Care Management',
        savings: 45000,
        status: 'pending'
    },
    {
        id: 'M-7832',
        riskScore: 87,
        riskDelta: 8,
        condition: 'Cancer - Breast',
        ytdClaims: 189200,
        projected: 245000,
        stopLossRisk: 'High',
        intervention: 'Oncology Review',
        savings: 38000,
        status: 'in-progress'
    },
    {
        id: 'M-2156',
        riskScore: 82,
        riskDelta: -3,
        condition: 'Multiple Sclerosis',
        ytdClaims: 156800,
        projected: 198000,
        stopLossRisk: 'Medium',
        intervention: 'Specialty Pharmacy',
        savings: 28000,
        status: 'completed'
    },
    {
        id: 'M-9443',
        riskScore: 78,
        riskDelta: -8,
        condition: 'ESRD',
        ytdClaims: 142300,
        projected: 175000,
        stopLossRisk: 'Medium',
        intervention: 'Transplant Eval',
        savings: 52000,
        status: 'In-progress'
    },
    {
        id: 'M-3287',
        riskScore: 75,
        riskDelta: 5,
        condition: 'CHF',
        ytdClaims: 128900,
        projected: 158000,
        stopLossRisk: 'Medium',
        intervention: 'Remote Monitoring',
        savings: 24000,
        status: 'pending'
    }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
}

// ============================================================================
// PREMIUM COMPONENTS
// ============================================================================

function GlassCard({ children, className = '', gradient = false, glow = false, glowColor = 'amber' }: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
    glow?: boolean;
    glowColor?: string;
}) {
    const glowStyles: Record<string, string> = {
        amber: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]',
        rose: 'shadow-[0_0_40px_rgba(244,63,94,0.15)]',
        cyan: 'shadow-[0_0_40px_rgba(6,182,212,0.12)]',
        emerald: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]'
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                backdrop-blur-xl border border-white/[0.08]
                ${glow ? glowStyles[glowColor] : 'shadow-2xl shadow-black/20'}
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

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.round(current * 10) / 10);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <>{prefix}{display.toFixed(value % 1 === 0 ? 0 : 1)}{suffix}</>;
}

function NeuralNetworkVisualization() {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Neural network nodes */}
                {[...Array(5)].map((_, i) => (
                    <motion.circle
                        key={`input-${i}`}
                        cx="20"
                        cy={20 + i * 15}
                        r="3"
                        fill="var(--accent-primary)"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
                {[...Array(7)].map((_, i) => (
                    <motion.circle
                        key={`hidden-${i}`}
                        cx="100"
                        cy={10 + i * 12}
                        r="2.5"
                        fill="#22D3EE"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 + 0.5 }}
                    />
                ))}
                {[...Array(3)].map((_, i) => (
                    <motion.circle
                        key={`output-${i}`}
                        cx="180"
                        cy={30 + i * 20}
                        r="4"
                        fill="#10B981"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1 }}
                    />
                ))}
                {/* Connection lines */}
                {[...Array(5)].map((_, i) => (
                    [...Array(7)].map((_, j) => (
                        <motion.line
                            key={`line1-${i}-${j}`}
                            x1="23"
                            y1={20 + i * 15}
                            x2="97"
                            y2={10 + j * 12}
                            stroke="var(--accent-primary)"
                            strokeWidth="0.3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    ))
                ))}
            </svg>
        </div>
    );
}

function RiskGauge({ probability, label, trend, daysToRisk, gradient }: {
    probability: number;
    label: string;
    trend: string;
    daysToRisk: number | null;
    gradient: string[];
}) {
    const radius = 70;
    const strokeWidth = 12;
    const circumference = Math.PI * radius;
    const offset = circumference - (probability / 100) * circumference;
    const gradientId = `gauge-${gradient[0].replace('#', '')}`;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: 160, height: 90 }}>
                <svg width="160" height="90" className="overflow-visible">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={gradient[0]} />
                            <stop offset="100%" stopColor={gradient[1]} />
                        </linearGradient>
                        <filter id="glow-gauge">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background arc */}
                    <path
                        d={`M 10 85 A ${radius} ${radius} 0 0 1 150 85`}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <motion.path
                        d={`M 10 85 A ${radius} ${radius} 0 0 1 150 85`}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        filter="url(#glow-gauge)"
                    />
                    {/* Tick marks */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const angle = (tick / 100) * Math.PI;
                        const x1 = 80 - Math.cos(Math.PI - angle) * 58;
                        const y1 = 85 - Math.sin(Math.PI - angle) * 58;
                        const x2 = 80 - Math.cos(Math.PI - angle) * 52;
                        const y2 = 85 - Math.sin(Math.PI - angle) * 52;
                        return (
                            <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        );
                    })}
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <motion.div
                        className="text-4xl font-bold"
                        style={{ color: gradient[0] }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatedNumber value={probability} suffix="%" />
                    </motion.div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                    {trend === 'increasing' ? (
                        <TrendingUp className="w-3 h-3 text-rose-400" />
                    ) : (
                        <Activity className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="text-xs text-[var(--text-tertiary)]">
                        {trend === 'increasing' ? 'Increasing' : 'Stable'}
                    </span>
                </div>
                {daysToRisk && (
                    <div className="mt-2 px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs">
                        {daysToRisk} days to risk
                    </div>
                )}
            </div>
        </div>
    );
}

function ModelMetricCard({ metric, index }: { metric: typeof modelMetrics[0]; index: number }) {
    const isAboveTarget = metric.value >= metric.target;
    const Icon = metric.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/5"
        >
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-4 h-4 text-[var(--text-tertiary)]" />
                {isAboveTarget ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                <AnimatedNumber value={metric.value} suffix="%" />
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">{metric.name}</div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isAboveTarget ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
            </div>
            <div className="mt-1 text-[10px] text-[var(--text-tertiary)]">Target: {metric.target}%</div>
        </motion.div>
    );
}

function PredictiveAlertCard({ alert, index }: { alert: typeof predictiveAlerts[0]; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const severityStyles = {
        critical: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: AlertTriangle, color: 'text-rose-400', glow: 'shadow-rose-500/20' },
        high: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Zap, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
        medium: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: Activity, color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
        low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: TrendingUp, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
    };

    const style = severityStyles[alert.severity as keyof typeof severityStyles];
    const Icon = style.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-xl ${style.bg} border ${style.border} overflow-hidden cursor-pointer hover:shadow-lg ${style.glow} transition-shadow`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-black/20 ${style.color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{alert.title}</h4>
                            <span className="text-[10px] text-[var(--text-tertiary)] whitespace-nowrap ml-2">{alert.timestamp}</span>
                        </div>
                        {alert.member && (
                            <div className="text-xs text-[var(--text-tertiary)] mb-2">Member: {alert.member}</div>
                        )}
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{alert.description}</p>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                                <Brain className="w-3 h-3 text-[var(--accent-primary)]" />
                                <span className="text-xs text-[var(--text-tertiary)]">{alert.probability}% confidence</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <DollarSign className="w-3 h-3 text-[var(--accent-primary)]" />
                                <span className={`text-xs font-mono ${alert.impact > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {alert.impact > 0 ? '+' : ''}{formatCurrency(alert.impact)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                    >
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                                <span className="text-xs text-[var(--text-secondary)]">Recommended Action</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-black text-xs font-medium hover:opacity-90 transition-opacity">
                                {alert.action}
                                <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function RiskDistributionChart() {
    return (
        <div className="space-y-3">
            {riskDistribution.map((item, index) => (
                <motion.div
                    key={item.range}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-20 text-xs text-[var(--text-tertiary)]">{item.label}</div>
                    <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                        <motion.div
                            className="h-full rounded-lg flex items-center justify-end pr-3"
                            style={{ backgroundColor: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                        >
                            <span className="text-xs font-bold text-black/70">{item.count.toLocaleString()}</span>
                        </motion.div>
                    </div>
                    <div className="w-12 text-right text-xs font-mono text-[var(--text-secondary)]">{item.percent}%</div>
                </motion.div>
            ))}
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PredictiveIntelligencePage() {
    const [isModelRunning, setIsModelRunning] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    const handleRunModel = () => {
        setIsModelRunning(true);
        setTimeout(() => setIsModelRunning(false), 3000);
    };

    return (
        <div className="space-y-8">
            {/* Premium Header with Neural Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                                <Brain className="w-8 h-8 text-[var(--accent-primary)]" />
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                                Predictive Intelligence
                            </h1>
                            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                                AI-Powered
                            </span>
                        </div>
                        <p className="text-[var(--text-secondary)] flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-[var(--text-tertiary)]" />
                            Real-time risk scoring • Stop-loss forecasting • Intervention recommendations
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] text-sm hover:bg-white/10 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Model Settings
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRunModel}
                            disabled={isModelRunning}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                        >
                            {isModelRunning ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Running Model...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Run Prediction
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stop-Loss Breach Gauges Row */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid lg:grid-cols-3 gap-6"
            >
                {/* Breach Probability Gauges */}
                <GlassCard className="lg:col-span-2 p-6" glow glowColor="rose">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Stop-Loss Breach Risk</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">AI-calculated probability of policy breach</p>
                        </div>
                        <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="flex items-center justify-around">
                        {breachProbabilities.map((item, index) => (
                            <RiskGauge
                                key={item.type}
                                probability={item.probability}
                                label={item.type}
                                trend={item.trend}
                                daysToRisk={item.daysToRisk}
                                gradient={item.gradient}
                            />
                        ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="text-sm font-medium text-[var(--text-primary)] mb-1">Projected Overrun</div>
                                <div className="text-2xl font-bold text-rose-400 mb-2">$234K</div>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    Based on current trajectory, 3 members are projected to exceed specific deductibles
                                    with a combined exposure of $234K above stop-loss thresholds.
                                </p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Model Performance */}
                <GlassCard className="p-6 relative overflow-hidden" gradient>
                    <NeuralNetworkVisualization />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Model Performance</h2>
                            <Cpu className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {modelMetrics.map((metric, index) => (
                                <ModelMetricCard key={metric.name} metric={metric} index={index} />
                            ))}
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-emerald-400">All models operating within target parameters</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Trend Projection Chart */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Claims Cost Projection</h2>
                        <p className="text-sm text-[var(--text-tertiary)]">Monthly trend with AI forecast and confidence bands</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-1 rounded bg-[var(--accent-primary)]" />
                            Actual
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-1 rounded bg-cyan-400" />
                            Predicted
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-1 rounded bg-cyan-400/30" />
                            95% CI
                        </span>
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="actualCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="predictedCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} domain={[6, 11]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    backdropFilter: 'blur(10px)'
                                }}
                                formatter={(value) => value !== undefined ? [`$${value}M`, ''] : ['', '']}
                            />
                            {/* Confidence band */}
                            <Area type="monotone" dataKey="upper" stroke="none" fill="#06B6D4" fillOpacity={0.1} />
                            <Area type="monotone" dataKey="lower" stroke="none" fill="var(--surface-primary)" />
                            {/* Actual line */}
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="var(--accent-primary)"
                                strokeWidth={3}
                                fill="url(#actualCost)"
                                dot={{ fill: 'var(--accent-primary)', strokeWidth: 0, r: 5 }}
                            />
                            {/* Predicted line */}
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#06B6D4"
                                strokeWidth={3}
                                strokeDasharray="8 4"
                                dot={{ fill: '#06B6D4', strokeWidth: 0, r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Two Column: Alerts + Risk Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Predictive Alerts */}
                <GlassCard className="p-6" gradient>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Predictive Alerts</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                                1 critical
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {predictiveAlerts.map((alert, index) => (
                            <PredictiveAlertCard key={alert.id} alert={alert} index={index} />
                        ))}
                    </div>
                </GlassCard>

                {/* Risk Distribution */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Risk Distribution</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">Member population by risk score</p>
                        </div>
                        <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <RiskDistributionChart />
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">AI Insight</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            760 members (5.9%) are in critical risk tier. Early intervention for this cohort could
                            prevent an estimated $1.2M in avoidable claims over the next 12 months.
                        </p>
                    </div>
                </GlassCard>
            </div>

            {/* High-Risk Members Table */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">High-Risk Member Interventions</h2>
                        <p className="text-sm text-[var(--text-tertiary)]">AI-recommended actions with projected savings</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[var(--text-secondary)] text-xs hover:bg-white/10 transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[var(--text-secondary)] text-xs hover:bg-white/10 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Export Care List
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4">Member</th>
                                <th className="text-center py-3 px-4">Risk Score</th>
                                <th className="text-center py-3 px-4">Trend</th>
                                <th className="text-left py-3 px-4">Primary Condition</th>
                                <th className="text-right py-3 px-4">YTD Claims</th>
                                <th className="text-right py-3 px-4">Projected</th>
                                <th className="text-center py-3 px-4">Stop-Loss</th>
                                <th className="text-left py-3 px-4">Intervention</th>
                                <th className="text-right py-3 px-4">Potential Savings</th>
                                <th className="text-center py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highRiskMembers.map((member, index) => (
                                <motion.tr
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-t border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => setSelectedMember(member.id)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{member.id}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${member.riskScore >= 90 ? 'bg-rose-500 animate-pulse' :
                                                member.riskScore >= 80 ? 'bg-amber-500' : 'bg-yellow-500'
                                                }`} />
                                            <span className={`text-sm font-bold ${member.riskScore >= 90 ? 'text-rose-400' :
                                                member.riskScore >= 80 ? 'text-amber-400' : 'text-yellow-400'
                                                }`}>
                                                {member.riskScore}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`inline-flex items-center gap-1 text-xs ${member.riskDelta > 0 ? 'text-rose-400' : 'text-emerald-400'
                                            }`}>
                                            {member.riskDelta > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {Math.abs(member.riskDelta)}
                                        </span>
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.stopLossRisk === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {member.stopLossRisk}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">
                                            <Target className="w-3 h-3" />
                                            {member.intervention}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-sm font-mono text-emerald-400">{formatCurrency(member.savings)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                            member.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                                                'bg-white/10 text-[var(--text-tertiary)]'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Summary Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <span className="text-[var(--text-tertiary)]">Total at Risk: </span>
                            <span className="font-mono text-[var(--text-primary)]">{formatCurrency(highRiskMembers.reduce((sum, m) => sum + m.projected, 0))}</span>
                        </div>
                        <div>
                            <span className="text-[var(--text-tertiary)]">Potential Savings: </span>
                            <span className="font-mono text-emerald-400">{formatCurrency(highRiskMembers.reduce((sum, m) => sum + m.savings, 0))}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium hover:bg-[var(--accent-primary)]/20 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        Generate Intervention Plan
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
