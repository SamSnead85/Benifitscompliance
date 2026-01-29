'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Users,
    DollarSign, Activity, Shield, Sparkles, ChevronRight, ChevronDown,
    Calendar, ArrowUpRight, ArrowDownRight, Bell, Eye, CheckCircle,
    Clock, Zap, Heart, MessageSquare, FileText
} from 'lucide-react';

// ============================================================================
// PREDICTIVE AI DATA
// ============================================================================

const riskScoreData = {
    avgScore: 42,
    highRiskCount: 23,
    mediumRiskCount: 156,
    lowRiskCount: 1233,
    scoreChange: -3.2
};

const stopLossPrediction = {
    specificBreachProb: 78,
    aggregateBreachProb: 23,
    projectedOverrun: 234000,
    confidenceLevel: 94
};

const highRiskMembers = [
    {
        id: 'M-4521',
        name: 'J. Morrison',
        age: 58,
        riskScore: 94,
        riskTrend: 'rising',
        primaryCondition: 'Acute MI',
        ytdClaims: 147892,
        projectedClaims: 215000,
        stopLossRisk: 'high',
        interventionRecommended: 'Care Management',
        potentialSavings: 45000
    },
    {
        id: 'M-3287',
        name: 'S. Chen',
        age: 62,
        riskScore: 89,
        riskTrend: 'stable',
        primaryCondition: 'Lung Cancer',
        ytdClaims: 134567,
        projectedClaims: 198000,
        stopLossRisk: 'high',
        interventionRecommended: 'Oncology Navigation',
        potentialSavings: 38000
    },
    {
        id: 'M-1893',
        name: 'M. Rodriguez',
        age: 54,
        riskScore: 87,
        riskTrend: 'rising',
        primaryCondition: 'CKD Stage 4',
        ytdClaims: 128934,
        projectedClaims: 178000,
        stopLossRisk: 'medium',
        interventionRecommended: 'Transplant Eval',
        potentialSavings: 52000
    },
    {
        id: 'M-5621',
        name: 'E. Thompson',
        age: 41,
        riskScore: 82,
        riskTrend: 'stable',
        primaryCondition: 'Multiple Sclerosis',
        ytdClaims: 112456,
        projectedClaims: 156000,
        stopLossRisk: 'medium',
        interventionRecommended: 'Specialty Pharmacy',
        potentialSavings: 28000
    },
    {
        id: 'M-2945',
        name: 'R. Kim',
        age: 67,
        riskScore: 78,
        riskTrend: 'declining',
        primaryCondition: 'CHF',
        ytdClaims: 98234,
        projectedClaims: 142000,
        stopLossRisk: 'medium',
        interventionRecommended: 'Remote Monitoring',
        potentialSavings: 35000
    },
    {
        id: 'M-8734',
        name: 'A. Patel',
        age: 45,
        riskScore: 76,
        riskTrend: 'rising',
        primaryCondition: 'T2 Diabetes + Obesity',
        ytdClaims: 67892,
        projectedClaims: 125000,
        stopLossRisk: 'low',
        interventionRecommended: 'GLP-1 Program',
        potentialSavings: 42000
    }
];

const riskDistribution = [
    { score: '0-20', count: 456, color: '#10B981' },
    { score: '21-40', count: 389, color: '#22C55E' },
    { score: '41-60', count: 234, color: '#F59E0B' },
    { score: '61-80', count: 156, color: '#EF4444' },
    { score: '81-100', count: 23, color: '#DC2626' }
];

const trendProjection = [
    { month: 'Jan', actual: 487, predicted: null, lower: null, upper: null },
    { month: 'Feb', actual: 479, predicted: null, lower: null, upper: null },
    { month: 'Mar', actual: 520, predicted: null, lower: null, upper: null },
    { month: 'Apr', actual: 482, predicted: null, lower: null, upper: null },
    { month: 'May', actual: 565, predicted: null, lower: null, upper: null },
    { month: 'Jun', actual: 545, predicted: null, lower: null, upper: null },
    { month: 'Jul', actual: 505, predicted: 505, lower: 485, upper: 525 },
    { month: 'Aug', actual: 503, predicted: 508, lower: 478, upper: 538 },
    { month: 'Sep', actual: 538, predicted: 525, lower: 485, upper: 565 },
    { month: 'Oct', actual: 572, predicted: 548, lower: 498, upper: 598 },
    { month: 'Nov', actual: 495, predicted: 535, lower: 475, upper: 595 },
    { month: 'Dec', actual: null, predicted: 542, lower: 472, upper: 612 },
    { month: 'Jan+', actual: null, predicted: 558, lower: 478, upper: 638 },
    { month: 'Feb+', actual: null, predicted: 565, lower: 475, upper: 655 },
    { month: 'Mar+', actual: null, predicted: 578, lower: 468, upper: 688 }
];

const aiAlerts = [
    {
        id: 1,
        severity: 'critical',
        title: 'Imminent Stop-Loss Breach',
        message: 'Member M-4521 is projected to breach specific stop-loss within 45 days. Immediate care management intervention recommended.',
        timestamp: '2 hours ago',
        actionable: true,
        icon: AlertTriangle
    },
    {
        id: 2,
        severity: 'warning',
        title: 'GLP-1 Spend Trajectory',
        message: 'GLP-1 medication costs projected to increase 89% YoY if current enrollment trends continue. Consider prior authorization criteria.',
        timestamp: '6 hours ago',
        actionable: true,
        icon: TrendingUp
    },
    {
        id: 3,
        severity: 'warning',
        title: 'Emerging High-Cost Cohort',
        message: 'AI detected 12 members with rapid risk score acceleration. Early intervention could prevent $380K in projected claims.',
        timestamp: '1 day ago',
        actionable: true,
        icon: Users
    },
    {
        id: 4,
        severity: 'info',
        title: 'Favorable Trend Detected',
        message: 'Musculoskeletal claims down 8.4% following physical therapy benefit enhancement. Projected annual savings: $127K.',
        timestamp: '2 days ago',
        actionable: false,
        icon: CheckCircle
    }
];

const interventionROI = [
    { intervention: 'Care Management', enrolled: 45, savings: 892000, costAvoidance: 234000, roi: 3.2 },
    { intervention: 'Specialty Pharmacy', enrolled: 89, savings: 456000, costAvoidance: 178000, roi: 2.8 },
    { intervention: 'Remote Monitoring', enrolled: 34, savings: 234000, costAvoidance: 89000, roi: 4.1 },
    { intervention: 'Disease Coaching', enrolled: 156, savings: 567000, costAvoidance: 156000, roi: 2.4 }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(value: number, compact = false): string {
    if (compact && Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (compact && Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

// ============================================================================
// COMPONENTS
// ============================================================================

function RiskScoreGauge({ score, size = 'lg' }: { score: number; size?: 'sm' | 'lg' }) {
    const radius = size === 'lg' ? 60 : 30;
    const strokeWidth = size === 'lg' ? 10 : 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 80) return '#EF4444';
        if (s >= 60) return '#F59E0B';
        if (s >= 40) return '#FBBF24';
        return '#10B981';
    };

    const svgSize = (radius + strokeWidth) * 2;

    return (
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke="var(--border-primary)"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-bold font-mono text-[var(--text-primary)] ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}>
                    {score}
                </span>
            </div>
        </div>
    );
}

function RiskTrendBadge({ trend }: { trend: string }) {
    const configs: Record<string, { icon: React.ComponentType<{ className?: string }>; className: string }> = {
        rising: { icon: TrendingUp, className: 'text-rose-400' },
        stable: { icon: Activity, className: 'text-amber-400' },
        declining: { icon: TrendingDown, className: 'text-emerald-400' }
    };
    const config = configs[trend] || configs.stable;
    const Icon = config.icon;

    return <Icon className={`w-4 h-4 ${config.className}`} />;
}

function StopLossRiskBadge({ risk }: { risk: string }) {
    const configs: Record<string, { label: string; className: string }> = {
        high: { label: 'High Risk', className: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
        medium: { label: 'Medium', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        low: { label: 'Low', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
    };
    const config = configs[risk] || configs.low;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
            {config.label}
        </span>
    );
}

function AlertCard({ alert }: { alert: typeof aiAlerts[0] }) {
    const Icon = alert.icon;
    const severityColors: Record<string, string> = {
        critical: 'border-rose-500/30 bg-rose-500/5',
        warning: 'border-amber-500/30 bg-amber-500/5',
        info: 'border-emerald-500/30 bg-emerald-500/5'
    };
    const iconColors: Record<string, string> = {
        critical: 'text-rose-400 bg-rose-500/20',
        warning: 'text-amber-400 bg-amber-500/20',
        info: 'text-emerald-400 bg-emerald-500/20'
    };

    const severityClass = severityColors[alert.severity] || severityColors.info;
    const iconClass = iconColors[alert.severity] || iconColors.info;

    return (
        <motion.div
            variants={fadeInUp}
            className={`p-4 rounded-lg border ${severityClass} group cursor-pointer hover:bg-white/[0.02] transition-colors`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${iconClass}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{alert.title}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{alert.message}</p>
                    {alert.actionable && (
                        <button className="text-xs text-[var(--accent-primary)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Take Action <ChevronRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function PredictiveIntelligencePage() {
    const [selectedMember, setSelectedMember] = useState<typeof highRiskMembers[0] | null>(null);

    const totalPotentialSavings = useMemo(() => {
        return highRiskMembers.reduce((sum, m) => sum + m.potentialSavings, 0);
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Brain className="w-7 h-7 text-[var(--accent-primary)]" />
                        Predictive Intelligence
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        AI-powered risk scoring, forecasting, and intervention recommendations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                        <Bell className="w-4 h-4" />
                        Alert Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Sparkles className="w-4 h-4" />
                        Run Prediction
                    </button>
                </div>
            </div>

            {/* Top Row - Key Metrics */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-4 gap-4"
            >
                {/* Risk Score Summary */}
                <motion.div
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Population Risk Score</span>
                        <div className={`flex items-center gap-1 text-xs font-medium ${riskScoreData.scoreChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {riskScoreData.scoreChange < 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {Math.abs(riskScoreData.scoreChange)}%
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <RiskScoreGauge score={riskScoreData.avgScore} />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span className="text-xs text-[var(--text-secondary)]">High: {riskScoreData.highRiskCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="text-xs text-[var(--text-secondary)]">Medium: {riskScoreData.mediumRiskCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-xs text-[var(--text-secondary)]">Low: {formatNumber(riskScoreData.lowRiskCount)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stop-Loss Breach Probability */}
                <motion.div
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Stop-Loss Breach Risk</span>
                        <Shield className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--text-secondary)]">Specific (any member)</span>
                                <span className={`font-mono ${stopLossPrediction.specificBreachProb >= 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                                    {stopLossPrediction.specificBreachProb}%
                                </span>
                            </div>
                            <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stopLossPrediction.specificBreachProb}%` }}
                                    transition={{ duration: 0.8 }}
                                    className="h-full rounded-full bg-rose-400"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--text-secondary)]">Aggregate</span>
                                <span className={`font-mono ${stopLossPrediction.aggregateBreachProb >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {stopLossPrediction.aggregateBreachProb}%
                                </span>
                            </div>
                            <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stopLossPrediction.aggregateBreachProb}%` }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    className="h-full rounded-full bg-emerald-400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border-primary)]">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Projected Overrun</span>
                            <span className="font-mono text-rose-400">{formatCurrency(stopLossPrediction.projectedOverrun, true)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Intervention Potential */}
                <motion.div
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Intervention Opportunity</span>
                        <Target className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="text-3xl font-semibold font-mono text-emerald-400 mb-2">
                        {formatCurrency(totalPotentialSavings, true)}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                        Potential savings from recommended interventions
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-2xl font-semibold font-mono text-[var(--text-primary)]">{highRiskMembers.length}</span>
                        <span className="text-xs text-[var(--text-secondary)]">members flagged for intervention</span>
                    </div>
                </motion.div>

                {/* AI Confidence */}
                <motion.div
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Model Performance</span>
                        <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--text-secondary)]">Prediction Accuracy</span>
                                <span className="font-mono text-[var(--text-primary)]">94%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                <div className="h-full w-[94%] rounded-full bg-[var(--accent-primary)]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--text-secondary)]">Alert Precision</span>
                                <span className="font-mono text-[var(--text-primary)]">87%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                <div className="h-full w-[87%] rounded-full bg-[var(--accent-primary)]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--text-secondary)]">ROI Validation</span>
                                <span className="font-mono text-[var(--text-primary)]">91%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                <div className="h-full w-[91%] rounded-full bg-[var(--accent-primary)]" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Middle Row - Trend Projection & Alerts */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* PMPM Trend Projection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-[var(--text-primary)]">PMPM Trend Projection</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Historical data with 3-month forecast</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                                Actual
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 bg-[#8B5CF6]" />
                                Predicted
                            </span>
                            <span className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
                                <span className="w-3 h-3 bg-[#8B5CF6]/20 rounded-sm" />
                                Confidence
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={[400, 700]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface-secondary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value) => value !== undefined ? [`$${value}`, ''] : ['', '']}
                                />
                                <Area type="monotone" dataKey="upper" stroke="transparent" fill="#8B5CF6" fillOpacity={0.1} />
                                <Area type="monotone" dataKey="lower" stroke="transparent" fill="var(--surface-primary)" fillOpacity={1} />
                                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                                <Line type="monotone" dataKey="actual" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-[var(--text-primary)] flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[var(--accent-primary)]" />
                            Predictive Alerts
                        </h2>
                        <span className="text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full">
                            {aiAlerts.filter(a => a.severity === 'critical').length} critical
                        </span>
                    </div>
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                        {aiAlerts.map((alert) => (
                            <AlertCard key={alert.id} alert={alert} />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* High Risk Members Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                    <div>
                        <h2 className="font-medium text-[var(--text-primary)]">High-Risk Members - Intervention Recommendations</h2>
                        <p className="text-sm text-[var(--text-secondary)]">AI-identified members with actionable savings opportunities</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                        <Zap className="w-4 h-4" />
                        Export Care List
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-primary)]">
                                <th className="text-left py-3 px-4">Member</th>
                                <th className="text-center py-3 px-4">Risk Score</th>
                                <th className="text-center py-3 px-4">Trend</th>
                                <th className="text-left py-3 px-4">Primary Condition</th>
                                <th className="text-right py-3 px-4">YTD Claims</th>
                                <th className="text-right py-3 px-4">Projected</th>
                                <th className="text-center py-3 px-4">Stop-Loss</th>
                                <th className="text-left py-3 px-4">Recommended Intervention</th>
                                <th className="text-right py-3 px-4">Potential Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highRiskMembers.map((member) => (
                                <tr
                                    key={member.id}
                                    className="border-b border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <td className="py-3 px-4">
                                        <div className="text-sm text-[var(--text-primary)]">{member.name}</div>
                                        <div className="text-xs text-[var(--text-tertiary)] font-mono">{member.id} • Age {member.age}</div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center">
                                            <RiskScoreGauge score={member.riskScore} size="sm" />
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <RiskTrendBadge trend={member.riskTrend} />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">{member.primaryCondition}</td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="font-mono text-sm text-[var(--text-primary)]">{formatCurrency(member.ytdClaims, true)}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="font-mono text-sm text-amber-400">{formatCurrency(member.projectedClaims, true)}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <StopLossRiskBadge risk={member.stopLossRisk} />
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                                            <Heart className="w-3 h-3" />
                                            {member.interventionRecommended}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="font-mono text-sm text-emerald-400">{formatCurrency(member.potentialSavings, true)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Bottom Row - Risk Distribution & Intervention ROI */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Population Risk Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                <XAxis dataKey="score" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface-secondary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Intervention ROI */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Intervention Program ROI</h2>
                    <div className="space-y-4">
                        {interventionROI.map((program) => (
                            <div key={program.intervention} className="p-4 rounded-lg bg-[var(--surface-secondary)]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{program.intervention}</span>
                                    <span className="text-lg font-semibold font-mono text-emerald-400">{program.roi}x ROI</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="text-[var(--text-tertiary)]">Enrolled</span>
                                        <div className="font-mono text-[var(--text-primary)]">{program.enrolled}</div>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-tertiary)]">Savings</span>
                                        <div className="font-mono text-[var(--text-primary)]">{formatCurrency(program.savings, true)}</div>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-tertiary)]">Cost Avoided</span>
                                        <div className="font-mono text-emerald-400">{formatCurrency(program.costAvoidance, true)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
