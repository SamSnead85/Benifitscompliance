'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, ReferenceLine
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, Users, Activity, Target,
    AlertTriangle, CheckCircle, Brain, MessageSquare, Download, Filter,
    Calendar, ChevronDown, ChevronRight, Sparkles, BarChart3, PieChart as PieChartIcon,
    Layers, Shield, Pill, FileText, Zap, ArrowUpRight, ArrowDownRight,
    Search, RefreshCw, Eye, Clock
} from 'lucide-react';

// ============================================================================
// DEMO DATA - World-class analytics dataset
// ============================================================================

const executiveKPIs = {
    totalSpend: 8_247_892,
    totalSpendChange: -4.2,
    pmpm: 487.32,
    pmpmChange: 2.1,
    claimsCount: 12_847,
    claimsCountChange: 8.3,
    memberCount: 1_412,
    memberCountChange: 3.2,
    stopLossUtilization: 67,
    ibnrReserve: 892_450,
    budgetVariance: -16.1,
    highCostClaimants: 7
};

const pmpmTrendData = [
    { month: 'Jan 24', medical: 312, pharmacy: 124, dental: 38, admin: 15, total: 489, budget: 520 },
    { month: 'Feb 24', medical: 298, pharmacy: 131, dental: 35, admin: 15, total: 479, budget: 520 },
    { month: 'Mar 24', medical: 345, pharmacy: 118, dental: 42, admin: 15, total: 520, budget: 520 },
    { month: 'Apr 24', medical: 289, pharmacy: 142, dental: 36, admin: 15, total: 482, budget: 520 },
    { month: 'May 24', medical: 378, pharmacy: 128, dental: 44, admin: 15, total: 565, budget: 520 },
    { month: 'Jun 24', medical: 356, pharmacy: 135, dental: 39, admin: 15, total: 545, budget: 520 },
    { month: 'Jul 24', medical: 312, pharmacy: 141, dental: 37, admin: 15, total: 505, budget: 525 },
    { month: 'Aug 24', medical: 298, pharmacy: 156, dental: 34, admin: 15, total: 503, budget: 525 },
    { month: 'Sep 24', medical: 334, pharmacy: 148, dental: 41, admin: 15, total: 538, budget: 525 },
    { month: 'Oct 24', medical: 367, pharmacy: 152, dental: 38, admin: 15, total: 572, budget: 525 },
    { month: 'Nov 24', medical: 298, pharmacy: 147, dental: 35, admin: 15, total: 495, budget: 525 },
    { month: 'Dec 24', medical: 312, pharmacy: 138, dental: 37, admin: 15, total: 502, budget: 525 },
];

const costBreakdown = [
    { name: 'Medical Claims', value: 5_847_234, color: '#F59E0B', percent: 70.9 },
    { name: 'Pharmacy', value: 1_523_892, color: '#8B5CF6', percent: 18.5 },
    { name: 'Dental/Vision', value: 487_234, color: '#06B6D4', percent: 5.9 },
    { name: 'Admin Fees', value: 248_532, color: '#64748B', percent: 3.0 },
    { name: 'Stop-Loss Premium', value: 141_000, color: '#10B981', percent: 1.7 },
];

const topCostDrivers = [
    { category: 'Musculoskeletal', amount: 1_234_567, change: 12.4, claims: 342 },
    { category: 'Cardiovascular', amount: 987_654, change: -5.2, claims: 187 },
    { category: 'Oncology', amount: 876_543, change: 28.7, claims: 23 },
    { category: 'Mental Health', amount: 654_321, change: 18.9, claims: 456 },
    { category: 'Endocrine (GLP-1)', amount: 543_210, change: 67.3, claims: 89 },
    { category: 'Respiratory', amount: 432_109, change: -2.1, claims: 234 },
];

const stopLossData = {
    specific: {
        attachment: 175000,
        currentMax: 147892,
        claimantsApproaching: 3,
        utilized: 84.5
    },
    aggregate: {
        attachment: 9_500_000,
        currentTotal: 6_372_450,
        monthsRemaining: 4,
        utilized: 67.1
    }
};

const highCostClaimants = [
    { id: 'M-4521', diagnosis: 'Acute Myocardial Infarction', ytdClaims: 147892, riskScore: 94, trend: 'rising' },
    { id: 'M-3287', diagnosis: 'Malignant Neoplasm - Lung', ytdClaims: 134567, riskScore: 89, trend: 'stable' },
    { id: 'M-1893', diagnosis: 'Chronic Kidney Disease Stage 4', ytdClaims: 128934, riskScore: 87, trend: 'rising' },
    { id: 'M-5621', diagnosis: 'Multiple Sclerosis', ytdClaims: 112456, riskScore: 82, trend: 'stable' },
    { id: 'M-2945', diagnosis: 'Congestive Heart Failure', ytdClaims: 98234, riskScore: 78, trend: 'declining' },
];

const aiInsights = [
    {
        type: 'alert',
        severity: 'high',
        title: 'Stop-Loss Breach Risk',
        message: '3 members within 15% of specific attachment. Consider care management intervention.',
        action: 'View Members',
        icon: AlertTriangle
    },
    {
        type: 'insight',
        severity: 'medium',
        title: 'GLP-1 Spend Accelerating',
        message: 'Pharmacy spend on GLP-1 medications up 67% YoY. Now represents 8.2% of total Rx spend.',
        action: 'Analyze Impact',
        icon: Pill
    },
    {
        type: 'opportunity',
        severity: 'low',
        title: 'Generic Substitution Opportunity',
        message: 'AI identified $47,890 potential annual savings through generic alternatives.',
        action: 'Review Savings',
        icon: Sparkles
    },
    {
        type: 'compliance',
        severity: 'medium',
        title: 'MHPAEA Documentation Due',
        message: 'Mental Health Parity comparative analysis due in 23 days.',
        action: 'Start Analysis',
        icon: Shield
    }
];

const waterfallData = [
    { name: 'Prior Year', value: 7_892_345, isTotal: true },
    { name: 'Trend', value: 631_388, isPositive: false },
    { name: 'Enrollment', value: 284_892, isPositive: false },
    { name: 'Plan Changes', value: -189_234, isPositive: true },
    { name: 'High-Cost Cases', value: 312_456, isPositive: false },
    { name: 'Utilization', value: -178_432, isPositive: true },
    { name: 'Network Savings', value: -234_891, isPositive: true },
    { name: 'Current Year', value: 8_247_892, isTotal: true },
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

const pulse = {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity }
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

function KPICard({
    icon: Icon,
    label,
    value,
    change,
    format = 'currency',
    suffix = '',
    description
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    change?: number;
    format?: 'currency' | 'number' | 'percent';
    suffix?: string;
    description?: string;
}) {
    const formattedValue = useMemo(() => {
        if (format === 'currency') return formatCurrency(value, true);
        if (format === 'percent') return `${value}%`;
        return formatNumber(value);
    }, [value, format]);

    const isPositive = change !== undefined && change < 0;

    return (
        <motion.div
            variants={fadeInUp}
            className="relative group p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
                        <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            {isPositive ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>

                <div className="text-3xl font-semibold text-[var(--text-primary)] font-mono tracking-tight">
                    {formattedValue}{suffix}
                </div>

                <div className="text-xs text-[var(--text-tertiary)] mt-2 uppercase tracking-wider">
                    {label}
                </div>

                {description && (
                    <div className="text-sm text-[var(--text-secondary)] mt-2">
                        {description}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function AIInsightCard({ insight }: { insight: typeof aiInsights[0] }) {
    const Icon = insight.icon;
    const severityColors = {
        high: 'border-rose-500/30 bg-rose-500/5',
        medium: 'border-amber-500/30 bg-amber-500/5',
        low: 'border-emerald-500/30 bg-emerald-500/5'
    };
    const iconColors = {
        high: 'text-rose-400',
        medium: 'text-amber-400',
        low: 'text-emerald-400'
    };
    const severity = insight.severity as keyof typeof severityColors;

    return (
        <motion.div
            variants={fadeInUp}
            className={`p-4 rounded-lg border ${severityColors[severity]} group cursor-pointer hover:bg-white/[0.02] transition-colors`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-[var(--surface-secondary)] ${iconColors[severity]}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)]">{insight.title}</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{insight.message}</div>
                    <button className="text-xs text-[var(--accent-primary)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {insight.action} <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function StopLossGauge({ type, data }: { type: 'specific' | 'aggregate'; data: typeof stopLossData.specific | typeof stopLossData.aggregate }) {
    const percentage = data.utilized;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (pct: number) => {
        if (pct >= 90) return '#EF4444';
        if (pct >= 75) return '#F59E0B';
        return '#10B981';
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="56"
                        cy="56"
                        r="45"
                        fill="none"
                        stroke="var(--border-primary)"
                        strokeWidth="8"
                    />
                    <motion.circle
                        cx="56"
                        cy="56"
                        r="45"
                        fill="none"
                        stroke={getColor(percentage)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                        {percentage.toFixed(0)}%
                    </span>
                </div>
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium text-[var(--text-primary)] capitalize mb-2">
                    {type} Stop-Loss
                </div>
                <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                        <span>Attachment:</span>
                        <span className="font-mono">{formatCurrency('attachment' in data ? data.attachment : 0, true)}</span>
                    </div>
                    {'currentMax' in data && (
                        <div className="flex justify-between">
                            <span>Current Max:</span>
                            <span className="font-mono">{formatCurrency(data.currentMax, true)}</span>
                        </div>
                    )}
                    {'currentTotal' in data && (
                        <div className="flex justify-between">
                            <span>YTD Total:</span>
                            <span className="font-mono">{formatCurrency(data.currentTotal, true)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HighCostClaimantRow({ claimant }: { claimant: typeof highCostClaimants[0] }) {
    const trendColors = {
        rising: 'text-rose-400',
        stable: 'text-amber-400',
        declining: 'text-emerald-400'
    };
    const trendIcons = {
        rising: TrendingUp,
        stable: Activity,
        declining: TrendingDown
    };
    const TrendIcon = trendIcons[claimant.trend as keyof typeof trendIcons];

    return (
        <tr className="border-t border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors">
            <td className="py-3 px-4">
                <span className="font-mono text-sm text-[var(--text-primary)]">{claimant.id}</span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-[var(--text-secondary)]">{claimant.diagnosis}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-mono text-sm text-[var(--text-primary)]">{formatCurrency(claimant.ytdClaims)}</span>
            </td>
            <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center justify-center w-10 h-6 rounded-full text-xs font-medium ${claimant.riskScore >= 90 ? 'bg-rose-500/20 text-rose-400' :
                    claimant.riskScore >= 80 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                    }`}>
                    {claimant.riskScore}
                </span>
            </td>
            <td className="py-3 px-4 text-center">
                <TrendIcon className={`w-4 h-4 mx-auto ${trendColors[claimant.trend as keyof typeof trendColors]}`} />
            </td>
        </tr>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AnalyticsCommandCenterPage() {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'claims' | 'costs' | 'predictive'>('overview');
    const [dateRange, setDateRange] = useState('2024');
    const [nlQuery, setNlQuery] = useState('');

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Brain className="w-7 h-7 text-[var(--accent-primary)]" />
                        Analytics Command Center
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        AI-powered intelligence for self-insured plan management
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm hover:bg-[var(--surface-secondary)] transition-colors">
                        <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span>{dateRange}</span>
                        <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Natural Language Query Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                    <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                    <input
                        type="text"
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value)}
                        placeholder="Ask anything... 'Show me claims over $50k this quarter' or 'Which members are at risk of stop-loss breach?'"
                        className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none text-sm"
                    />
                    <button className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        Analyze
                    </button>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] w-fit">
                {[
                    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
                    { id: 'claims', label: 'Claims Intelligence', icon: FileText },
                    { id: 'costs', label: 'Cost Analytics', icon: PieChartIcon },
                    { id: 'predictive', label: 'Predictive AI', icon: Brain }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTab === tab.id
                            ? 'bg-[var(--surface-secondary)] text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Executive Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="space-y-6">
                    {/* KPI Grid */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-4 gap-4"
                    >
                        <KPICard
                            icon={DollarSign}
                            label="Total Plan Spend"
                            value={executiveKPIs.totalSpend}
                            change={executiveKPIs.totalSpendChange}
                            format="currency"
                        />
                        <KPICard
                            icon={Activity}
                            label="PMPM"
                            value={executiveKPIs.pmpm}
                            change={executiveKPIs.pmpmChange}
                            format="currency"
                            suffix=""
                        />
                        <KPICard
                            icon={Users}
                            label="Active Members"
                            value={executiveKPIs.memberCount}
                            change={executiveKPIs.memberCountChange}
                            format="number"
                        />
                        <KPICard
                            icon={Target}
                            label="Budget Variance"
                            value={Math.abs(executiveKPIs.budgetVariance)}
                            format="percent"
                            suffix=""
                            description={executiveKPIs.budgetVariance < 0 ? 'Under budget' : 'Over budget'}
                        />
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* PMPM Trend Chart - 2 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--text-primary)]">PMPM Trend Analysis</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">24-month rolling with budget comparison</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                                        Medical
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-sm bg-[#8B5CF6]" />
                                        Pharmacy
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-sm bg-[#06B6D4]" />
                                        Dental
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                        <span className="w-8 border-t-2 border-dashed border-rose-400" />
                                        Budget
                                    </span>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={pmpmTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="var(--text-tertiary)"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="var(--text-tertiary)"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `$${v}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--surface-secondary)',
                                                border: '1px solid var(--border-primary)',
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => value !== undefined ? [`$${value}`, ''] : ['', '']}
                                        />
                                        <Bar dataKey="medical" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="pharmacy" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="dental" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="admin" stackId="a" fill="#64748B" radius={[4, 4, 0, 0]} />
                                        <Line
                                            type="monotone"
                                            dataKey="budget"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            strokeDasharray="6 4"
                                            dot={false}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* AI Insights Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-[var(--text-primary)] flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                                    AI Insights
                                </h2>
                                <span className="text-xs text-[var(--text-tertiary)]">Updated 2m ago</span>
                            </div>
                            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                                {aiInsights.map((insight, i) => (
                                    <AIInsightCard key={i} insight={insight} />
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Second Row - Stop Loss & High Cost Claimants */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Stop-Loss Tracking */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-medium text-[var(--text-primary)]">Stop-Loss Utilization</h2>
                                <Shield className="w-5 h-5 text-[var(--text-secondary)]" />
                            </div>
                            <div className="space-y-6">
                                <StopLossGauge type="specific" data={stopLossData.specific} />
                                <div className="border-t border-[var(--border-primary)]" />
                                <StopLossGauge type="aggregate" data={stopLossData.aggregate} />
                            </div>
                        </motion.div>

                        {/* High-Cost Claimants */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-2 p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-[var(--text-primary)]">High-Cost Claimants</h2>
                                <span className="text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full">
                                    {highCostClaimants.length} members approaching attachment
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                            <th className="text-left py-2 px-4">Member ID</th>
                                            <th className="text-left py-2 px-4">Primary Diagnosis</th>
                                            <th className="text-right py-2 px-4">YTD Claims</th>
                                            <th className="text-center py-2 px-4">Risk Score</th>
                                            <th className="text-center py-2 px-4">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {highCostClaimants.map((claimant) => (
                                            <HighCostClaimantRow key={claimant.id} claimant={claimant} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    {/* Third Row - Cost Breakdown & Top Drivers */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Cost Breakdown Donut */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Cost Breakdown</h2>
                            <div className="flex items-center gap-8">
                                <div className="w-48 h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={costBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {costBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => value !== undefined ? formatCurrency(Number(value)) : ''}
                                                contentStyle={{
                                                    backgroundColor: 'var(--surface-secondary)',
                                                    border: '1px solid var(--border-primary)',
                                                    borderRadius: '8px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {costBreakdown.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-mono text-[var(--text-primary)]">
                                                    {formatCurrency(item.value, true)}
                                                </span>
                                                <span className="text-xs text-[var(--text-tertiary)] ml-2">
                                                    {item.percent}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Cost Drivers */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Top Cost Drivers</h2>
                            <div className="space-y-4">
                                {topCostDrivers.map((driver, i) => {
                                    const maxAmount = topCostDrivers[0].amount;
                                    const barWidth = (driver.amount / maxAmount) * 100;

                                    return (
                                        <div key={driver.category} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--text-secondary)]">{driver.category}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-[var(--text-primary)]">
                                                        {formatCurrency(driver.amount, true)}
                                                    </span>
                                                    <span className={`text-xs ${driver.change >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {driver.change >= 0 ? '+' : ''}{driver.change}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${barWidth}%` }}
                                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        backgroundColor: driver.change >= 20 ? '#EF4444' :
                                                            driver.change >= 0 ? '#F59E0B' : '#10B981'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Claims Intelligence Tab */}
            {selectedTab === 'claims' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center"
                >
                    <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Claims Intelligence Module</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Advanced claims analysis with drill-down capabilities, anomaly detection, and Sankey flow visualization.
                    </p>
                </motion.div>
            )}

            {/* Cost Analytics Tab */}
            {selectedTab === 'costs' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center"
                >
                    <PieChartIcon className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Cost Analytics Module</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        TreeMaps, waterfall charts, and year-over-year variance analysis.
                    </p>
                </motion.div>
            )}

            {/* Predictive AI Tab */}
            {selectedTab === 'predictive' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center"
                >
                    <Brain className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Predictive Intelligence Module</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        ML-driven risk scoring, stop-loss forecasting, and renewal projections.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
