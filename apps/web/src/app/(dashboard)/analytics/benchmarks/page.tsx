'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import {
    Scale, TrendingUp, TrendingDown, Target, Award, Users, DollarSign,
    Building2, ChevronDown, ArrowUpRight, ArrowDownRight, Info,
    Factory, Briefcase, Heart, Activity, Shield, Pill, Calendar
} from 'lucide-react';

// ============================================================================
// BENCHMARK DATA
// ============================================================================

const industryComparison = [
    { metric: 'Total PMPM', yourPlan: 542, industry: 578, benchmark: 525, percentile: 62 },
    { metric: 'Medical PMPM', yourPlan: 412, industry: 445, benchmark: 398, percentile: 58 },
    { metric: 'Rx PMPM', yourPlan: 130, industry: 133, benchmark: 127, percentile: 55 },
    { metric: 'Inpatient/1K', yourPlan: 42, industry: 48, benchmark: 38, percentile: 72 },
    { metric: 'ER Visits/1K', yourPlan: 145, industry: 162, benchmark: 128, percentile: 65 },
    { metric: 'Generic Fill Rate', yourPlan: 87, industry: 84, benchmark: 90, percentile: 68 }
];

const radarData = [
    { metric: 'Cost Efficiency', yourPlan: 72, industry: 65, fullMark: 100 },
    { metric: 'Quality Score', yourPlan: 68, industry: 70, fullMark: 100 },
    { metric: 'Preventive Care', yourPlan: 78, industry: 72, fullMark: 100 },
    { metric: 'Chronic Care', yourPlan: 65, industry: 68, fullMark: 100 },
    { metric: 'Member Engagement', yourPlan: 58, industry: 62, fullMark: 100 },
    { metric: 'Rx Management', yourPlan: 82, industry: 75, fullMark: 100 }
];

const trendComparison = [
    { month: 'Jul', yourPlan: 525, industry: 565 },
    { month: 'Aug', yourPlan: 538, industry: 572 },
    { month: 'Sep', yourPlan: 512, industry: 568 },
    { month: 'Oct', yourPlan: 548, industry: 575 },
    { month: 'Nov', yourPlan: 532, industry: 580 },
    { month: 'Dec', yourPlan: 542, industry: 578 }
];

const categoryBenchmarks = [
    {
        category: 'Inpatient',
        metrics: [
            { name: 'Admits/1K', yourValue: 42, benchmark: 38, status: 'above' },
            { name: 'ALOS', yourValue: 4.2, benchmark: 4.0, status: 'above' },
            { name: 'Cost/Admit', yourValue: 18500, benchmark: 17200, status: 'above' }
        ]
    },
    {
        category: 'Outpatient',
        metrics: [
            { name: 'Visits/1K', yourValue: 2850, benchmark: 2920, status: 'below' },
            { name: 'ER Visits/1K', yourValue: 145, benchmark: 128, status: 'above' },
            { name: 'Urgent Care/1K', yourValue: 189, benchmark: 175, status: 'above' }
        ]
    },
    {
        category: 'Pharmacy',
        metrics: [
            { name: 'Rx PMPM', yourValue: 130, benchmark: 127, status: 'above' },
            { name: 'Generic Rate', yourValue: 87, benchmark: 90, status: 'below' },
            { name: 'Specialty %', yourValue: 48, benchmark: 45, status: 'above' }
        ]
    },
    {
        category: 'Preventive',
        metrics: [
            { name: 'Wellness Visits', yourValue: 78, benchmark: 72, status: 'exceeds' },
            { name: 'Cancer Screens', yourValue: 68, benchmark: 65, status: 'exceeds' },
            { name: 'Immunizations', yourValue: 82, benchmark: 78, status: 'exceeds' }
        ]
    }
];

const peerGroups = [
    { id: 'all', name: 'All Industries', members: 12500 },
    { id: 'manufacturing', name: 'Manufacturing', members: 2340 },
    { id: 'technology', name: 'Technology', members: 1890 },
    { id: 'healthcare', name: 'Healthcare', members: 1560 },
    { id: 'financial', name: 'Financial Services', members: 1420 },
    { id: 'retail', name: 'Retail', members: 1280 }
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

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
}

function getPercentileColor(percentile: number): string {
    if (percentile >= 75) return 'text-emerald-400';
    if (percentile >= 50) return 'text-amber-400';
    return 'text-rose-400';
}

function getStatusColor(status: string): string {
    if (status === 'exceeds') return 'text-emerald-400';
    if (status === 'below') return 'text-emerald-400';
    return 'text-rose-400';
}

function getStatusIcon(status: string) {
    if (status === 'exceeds' || status === 'below') {
        return <TrendingDown className="w-4 h-4 text-emerald-400" />;
    }
    return <TrendingUp className="w-4 h-4 text-rose-400" />;
}

// ============================================================================
// COMPONENTS
// ============================================================================

function PercentileGauge({ percentile, label }: { percentile: number; label: string }) {
    const getColor = (p: number) => {
        if (p >= 75) return '#10B981';
        if (p >= 50) return '#FBBF24';
        return '#EF4444';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--border-primary)"
                        strokeWidth="6"
                    />
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke={getColor(percentile)}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(percentile / 100) * 226} 226`}
                        initial={{ strokeDasharray: '0 226' }}
                        animate={{ strokeDasharray: `${(percentile / 100) * 226} 226` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{percentile}</span>
                </div>
            </div>
            <span className="text-xs text-[var(--text-tertiary)] mt-2 text-center">{label}</span>
        </div>
    );
}

function MetricComparisonCard({ metric, yourPlan, industry, benchmark, percentile }: {
    metric: string;
    yourPlan: number;
    industry: number;
    benchmark: number;
    percentile: number;
}) {
    const isBetter = yourPlan <= industry;
    const vsIndustry = ((yourPlan - industry) / industry * 100).toFixed(1);

    return (
        <motion.div
            variants={fadeInUp}
            className="p-4 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-primary)]">{metric}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${percentile >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
                        percentile >= 50 ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                    }`}>
                    {percentile}th percentile
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <div className="text-xs text-[var(--text-tertiary)]">Your Plan</div>
                    <div className="text-lg font-semibold font-mono text-[var(--accent-primary)]">
                        {metric.includes('PMPM') || metric.includes('Cost') ? formatCurrency(yourPlan) : yourPlan}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-[var(--text-tertiary)]">Industry Avg</div>
                    <div className="text-lg font-semibold font-mono text-[var(--text-secondary)]">
                        {metric.includes('PMPM') || metric.includes('Cost') ? formatCurrency(industry) : industry}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-[var(--text-tertiary)]">Benchmark</div>
                    <div className="text-lg font-semibold font-mono text-[var(--text-secondary)]">
                        {metric.includes('PMPM') || metric.includes('Cost') ? formatCurrency(benchmark) : benchmark}
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border-primary)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">vs Industry</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${isBetter ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isBetter ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    {Math.abs(Number(vsIndustry))}%
                </span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BenchmarkingPage() {
    const [selectedPeerGroup, setSelectedPeerGroup] = useState('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState('ytd');

    const overallPercentile = Math.round(
        industryComparison.reduce((sum, m) => sum + m.percentile, 0) / industryComparison.length
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Scale className="w-7 h-7 text-[var(--accent-primary)]" />
                        Industry Benchmarking
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Compare your plan performance against industry standards
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeerGroup}
                        onChange={(e) => setSelectedPeerGroup(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                    >
                        {peerGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name} ({group.members.toLocaleString()} plans)
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                    >
                        <option value="q4">Q4 2024</option>
                        <option value="ytd">Year to Date</option>
                        <option value="12m">Rolling 12 Months</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] col-span-1"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Overall Ranking</span>
                        <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <PercentileGauge percentile={overallPercentile} label="Percentile" />
                        <div>
                            <div className={`text-2xl font-bold ${getPercentileColor(overallPercentile)}`}>
                                {overallPercentile >= 75 ? 'Excellent' : overallPercentile >= 50 ? 'Good' : 'Needs Improvement'}
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] mt-1">
                                Better than {overallPercentile}% of peers
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Cost vs Industry</span>
                        <DollarSign className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="text-2xl font-semibold font-mono text-emerald-400">-6.2%</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">$36 lower PMPM</div>
                    <div className="mt-3 h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                        <div className="h-full w-[62%] bg-emerald-400 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Quality Score</span>
                        <Heart className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="text-2xl font-semibold font-mono text-[var(--text-primary)]">68/100</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">Industry avg: 70</div>
                    <div className="mt-3 h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                        <div className="h-full w-[68%] bg-amber-400 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">Opportunity</span>
                        <Target className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="text-2xl font-semibold font-mono text-amber-400">$234K</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">Annual savings potential</div>
                    <button className="mt-3 text-xs text-[var(--accent-primary)] flex items-center gap-1 hover:underline">
                        View opportunities <ArrowUpRight className="w-3 h-3" />
                    </button>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[var(--text-primary)]">Performance Comparison</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[var(--accent-primary)]" />
                                Your Plan
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[#64748B]" />
                                Industry Avg
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="var(--border-primary)" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Your Plan" dataKey="yourPlan" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.3} strokeWidth={2} />
                                <Radar name="Industry" dataKey="industry" stroke="#64748B" fill="#64748B" fillOpacity={0.1} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Trend Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[var(--text-primary)]">PMPM Trend vs Industry</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[var(--accent-primary)]" />
                                Your Plan
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 bg-[#64748B]" />
                                Industry
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendComparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={[480, 620]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface-secondary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value) => value !== undefined ? [`$${value}`, ''] : ['', '']}
                                />
                                <Line type="monotone" dataKey="industry" stroke="#64748B" strokeWidth={2} strokeDasharray="6 3" dot={false} />
                                <Line type="monotone" dataKey="yourPlan" stroke="var(--accent-primary)" strokeWidth={2} dot={{ fill: 'var(--accent-primary)', strokeWidth: 0, r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Metric Comparison Grid */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {industryComparison.map((metric) => (
                    <MetricComparisonCard
                        key={metric.metric}
                        metric={metric.metric}
                        yourPlan={metric.yourPlan}
                        industry={metric.industry}
                        benchmark={metric.benchmark}
                        percentile={metric.percentile}
                    />
                ))}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--border-primary)]">
                    <h2 className="font-medium text-[var(--text-primary)]">Category Benchmarks</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--border-primary)]">
                    {categoryBenchmarks.map((category) => (
                        <div key={category.category} className="p-4">
                            <div className="font-medium text-[var(--text-primary)] mb-3">{category.category}</div>
                            <div className="space-y-3">
                                {category.metrics.map((metric) => (
                                    <div key={metric.name} className="flex items-center justify-between">
                                        <span className="text-xs text-[var(--text-secondary)]">{metric.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                                {typeof metric.yourValue === 'number' && metric.yourValue >= 1000
                                                    ? formatCurrency(metric.yourValue)
                                                    : metric.yourValue}
                                            </span>
                                            {getStatusIcon(metric.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
