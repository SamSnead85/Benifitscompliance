'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Calendar,
    Download,
    Filter,
    ChevronDown,
    PieChart,
    Activity,
    Target,
    FileSpreadsheet,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

// Sample data for Self-Insured Reporting
const budgetSummary = {
    actualYTD: 706148,
    budgetedYTD: 4387113,
    variance: -16.1,
    isUnderBudget: true
};

const monthlyMetrics = {
    avgPlanCost: 460121,
    pepm: 1246,
    pmpm: 360,
    budgetedCost: 548389,
    budgetedPepm: 1485,
    budgetedPmpm: 429
};

const claimsByMonth = [
    { month: 'Jul', medical: 185000, pharmacy: 42000, dental: 18000, fixed: 25000 },
    { month: 'Aug', medical: 210000, pharmacy: 38000, dental: 22000, fixed: 25000 },
    { month: 'Sep', medical: 195000, pharmacy: 45000, dental: 19000, fixed: 25000 },
    { month: 'Oct', medical: 280000, pharmacy: 52000, dental: 24000, fixed: 25000 },
    { month: 'Nov', medical: 320000, pharmacy: 48000, dental: 21000, fixed: 25000 },
    { month: 'Dec', medical: 410000, pharmacy: 55000, dental: 28000, fixed: 25000 },
    { month: 'Jan', medical: 520000, pharmacy: 62000, dental: 32000, fixed: 25000 },
    { month: 'Feb', medical: 380000, pharmacy: 47000, dental: 26000, fixed: 25000 },
];

const underwritingPeriods = [
    { period: 'Experience Period 1', from: 'Mar-19', to: 'Feb-20', midpoint: 'Aug-19', credibility: 70, trendMonths: 16.05, trendAssumption: 9 },
    { period: 'Experience Period 2', from: 'Mar-18', to: 'Feb-19', midpoint: 'Aug-18', credibility: 30, trendMonths: 28.06, trendAssumption: 9 },
];

const claimsDetail = [
    { month: 'Mar-19', period1: 145532, period2: 246066 },
    { month: 'Apr-19', period1: 223783, period2: 308671 },
    { month: 'May-19', period1: 376141, period2: 299469 },
    { month: 'Jun-19', period1: 114865, period2: 337264 },
    { month: 'Jul-19', period1: 229114, period2: 433895 },
    { month: 'Aug-19', period1: 187897, period2: 174466 },
    { month: 'Sep-19', period1: 216461, period2: 130030 },
    { month: 'Oct-19', period1: 237799, period2: 152390 },
    { month: 'Nov-19', period1: 464859, period2: 402264 },
    { month: 'Dec-19', period1: 198498, period2: 248308 },
    { month: 'Jan-20', period1: 517684, period2: 276168 },
    { month: 'Feb-20', period1: 359537, period2: 215526 },
];

const summaryStats = {
    period1: { totalClaims: 3272172, enrollment: 15210, claimsPerMember: 215.13, trendFactor: 1.1221 },
    period2: { totalClaims: 3224517, enrollment: 13408, claimsPerMember: 240.49, trendFactor: 1.223 },
};

function formatCurrency(value: number, compact = false): string {
    if (compact && value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (compact && value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function MetricCard({
    label,
    value,
    subValue,
    trend,
    icon: Icon
}: {
    label: string;
    value: string;
    subValue?: string;
    trend?: { value: number; isPositive: boolean };
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <motion.div variants={fadeInUp} className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
            <div className="flex items-center justify-between mb-4">
                <Icon className="w-5 h-5 text-[#64748B]" />
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {trend.isPositive ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div className="text-3xl font-semibold text-white font-mono tracking-tight">{value}</div>
            {subValue && <div className="text-sm text-[#64748B] mt-1">{subValue}</div>}
            <div className="text-xs text-[#475569] mt-2 uppercase tracking-wider">{label}</div>
        </motion.div>
    );
}

function ClaimsChart() {
    const maxValue = Math.max(...claimsByMonth.map(d => d.medical + d.pharmacy + d.dental + d.fixed));

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                    <span className="text-[#94A3B8]">Medical Claims</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#8B5CF6]" />
                    <span className="text-[#94A3B8]">Pharmacy</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#F97316]" />
                    <span className="text-[#94A3B8]">Dental</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#1E293B]" />
                    <span className="text-[#94A3B8]">Fixed Costs</span>
                </div>
            </div>

            <div className="flex items-end gap-3 h-64">
                {claimsByMonth.map((data, i) => {
                    const total = data.medical + data.pharmacy + data.dental + data.fixed;
                    const heightPercent = (total / maxValue) * 100;

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse"
                                style={{ height: `${heightPercent}%` }}
                            >
                                <div className="bg-[#1E293B]" style={{ height: `${(data.fixed / total) * 100}%` }} />
                                <div className="bg-[#F97316]" style={{ height: `${(data.dental / total) * 100}%` }} />
                                <div className="bg-[#8B5CF6]" style={{ height: `${(data.pharmacy / total) * 100}%` }} />
                                <div className="bg-[#F59E0B]" style={{ height: `${(data.medical / total) * 100}%` }} />
                            </div>
                            <span className="text-xs text-[#64748B]">{data.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function SelfInsuredReportingPage() {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'claims' | 'underwriting' | 'projections'>('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('2024-2025');

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Self-Insured Reporting</h1>
                    <p className="text-[#64748B] mt-1">Claims analysis, budget tracking, and renewal projections</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1A1A24] text-white text-sm">
                        <Calendar className="w-4 h-4 text-[#64748B]" />
                        <span>{selectedPeriod}</span>
                        <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1A1A24] text-[#94A3B8] text-sm hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg bg-[#0A0A0F] border border-[#1A1A24] w-fit">
                {[
                    { id: 'overview', label: 'Budget Overview', icon: BarChart3 },
                    { id: 'claims', label: 'Claims Detail', icon: FileSpreadsheet },
                    { id: 'underwriting', label: 'Underwriting', icon: Target },
                    { id: 'projections', label: 'Renewal Projections', icon: TrendingUp }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as 'overview' | 'claims' | 'underwriting' | 'projections')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTab === tab.id
                                ? 'bg-[#1A1A24] text-white'
                                : 'text-[#64748B] hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="space-y-6">
                    {/* Top Metrics Row */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-4 gap-4"
                    >
                        <MetricCard
                            icon={DollarSign}
                            label="Actual Costs YTD"
                            value={formatCurrency(budgetSummary.actualYTD)}
                            trend={{ value: budgetSummary.variance, isPositive: budgetSummary.isUnderBudget }}
                        />
                        <MetricCard
                            icon={Target}
                            label="Budgeted YTD"
                            value={formatCurrency(budgetSummary.budgetedYTD, true)}
                            subValue="Total target"
                        />
                        <MetricCard
                            icon={Activity}
                            label="Avg Plan Cost / Month"
                            value={formatCurrency(monthlyMetrics.avgPlanCost)}
                            subValue={`$${monthlyMetrics.pepm} PEPM`}
                        />
                        <MetricCard
                            icon={Users}
                            label="Budgeted Cost / Month"
                            value={formatCurrency(monthlyMetrics.budgetedCost)}
                            subValue={`$${monthlyMetrics.budgetedPepm} PEPM`}
                        />
                    </motion.div>

                    {/* Charts Row */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-medium text-white">Total Paid Plan Costs by Month</h2>
                                    <p className="text-sm text-[#64748B]">Plan Year 2024-2025</p>
                                </div>
                            </div>
                            <ClaimsChart />
                        </motion.div>

                        {/* Summary Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            {/* Under Budget Card */}
                            <div className="p-6 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#10B981] font-medium">Under Budget</span>
                                    <TrendingDown className="w-5 h-5 text-[#10B981]" />
                                </div>
                                <div className="text-3xl font-bold text-white font-mono">16.1%</div>
                                <div className="text-sm text-[#64748B] mt-1">vs. projected spend</div>
                            </div>

                            {/* PEPM Breakdown */}
                            <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                                <h3 className="text-sm font-medium text-white mb-4">Cost Breakdown (PEPM)</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Medical', value: 892, color: '#F59E0B' },
                                        { label: 'Pharmacy', value: 248, color: '#8B5CF6' },
                                        { label: 'Dental', value: 67, color: '#F97316' },
                                        { label: 'Fixed', value: 39, color: '#1E293B' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm text-[#94A3B8]">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-mono text-white">${item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trend Summary */}
                            <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                                <h3 className="text-sm font-medium text-white mb-4">Trend Analysis</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#64748B]">Trend Factor</span>
                                        <span className="text-sm font-mono text-white">1.122</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#64748B]">Credibility</span>
                                        <span className="text-sm font-mono text-white">70%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#64748B]">Projected Claims/Member</span>
                                        <span className="text-sm font-mono text-white">$257.22</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Claims Detail Tab */}
            {selectedTab === 'claims' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white">Medical Claims by Period</h2>
                            <div className="text-sm text-[#64748B]">
                                Projected Claims / Member / Mo: <span className="text-white font-mono">$257.22</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Period 1 */}
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A1A24]">
                                    <h3 className="text-sm font-medium text-white">Period 1</h3>
                                    <span className="text-xs text-[#64748B]">Mar-19 to Feb-20</span>
                                </div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-[#64748B] uppercase tracking-wider">
                                            <th className="text-left py-2">Month-Year</th>
                                            <th className="text-right py-2">Net Claims</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claimsDetail.map((row, i) => (
                                            <tr key={i} className="border-t border-[#1A1A24]/50">
                                                <td className="py-2.5 text-sm text-[#94A3B8]">{row.month}</td>
                                                <td className="py-2.5 text-sm text-white text-right font-mono">{formatCurrency(row.period1)}</td>
                                            </tr>
                                        ))}
                                        <tr className="border-t border-[#1A1A24] bg-[#1A1A24]/30">
                                            <td className="py-3 text-sm font-medium text-white">Total Net Claims</td>
                                            <td className="py-3 text-sm font-bold text-white text-right font-mono">{formatCurrency(summaryStats.period1.totalClaims)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-4 pt-4 border-t border-[#1A1A24] space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Period Member Enrollment</span>
                                        <span className="text-white font-mono">{summaryStats.period1.enrollment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Net Claims / Member / Mo</span>
                                        <span className="text-white font-mono">${summaryStats.period1.claimsPerMember}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Trend Factor</span>
                                        <span className="text-white font-mono">{summaryStats.period1.trendFactor}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Period 2 */}
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A1A24]">
                                    <h3 className="text-sm font-medium text-white">Period 2</h3>
                                    <span className="text-xs text-[#64748B]">Mar-18 to Feb-19</span>
                                </div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-[#64748B] uppercase tracking-wider">
                                            <th className="text-left py-2">Month-Year</th>
                                            <th className="text-right py-2">Net Claims</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claimsDetail.map((row, i) => (
                                            <tr key={i} className="border-t border-[#1A1A24]/50">
                                                <td className="py-2.5 text-sm text-[#94A3B8]">{row.month.replace('-19', '-18').replace('-20', '-19')}</td>
                                                <td className="py-2.5 text-sm text-white text-right font-mono">{formatCurrency(row.period2)}</td>
                                            </tr>
                                        ))}
                                        <tr className="border-t border-[#1A1A24] bg-[#1A1A24]/30">
                                            <td className="py-3 text-sm font-medium text-white">Total Net Claims</td>
                                            <td className="py-3 text-sm font-bold text-white text-right font-mono">{formatCurrency(summaryStats.period2.totalClaims)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-4 pt-4 border-t border-[#1A1A24] space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Period Member Enrollment</span>
                                        <span className="text-white font-mono">{summaryStats.period2.enrollment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Net Claims / Member / Mo</span>
                                        <span className="text-white font-mono">${summaryStats.period2.claimsPerMember}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#64748B]">Trend Factor</span>
                                        <span className="text-white font-mono">{summaryStats.period2.trendFactor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Underwriting Tab */}
            {selectedTab === 'underwriting' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                        <h2 className="text-lg font-medium text-white mb-6">Underwriting Assumptions</h2>

                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-[#64748B] uppercase tracking-wider">
                                    <th className="text-left py-3 px-4 bg-[#1A1A24]/50 rounded-l-lg">Period</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50">From</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50">To</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50">Period Mid-Point</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50">Credibility %</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50">Trend Months</th>
                                    <th className="text-center py-3 px-4 bg-[#1A1A24]/50 rounded-r-lg">Trend Assumption</th>
                                </tr>
                            </thead>
                            <tbody>
                                {underwritingPeriods.map((period, i) => (
                                    <tr key={i} className="border-t border-[#1A1A24]">
                                        <td className="py-4 px-4 text-sm font-medium text-white">{period.period}</td>
                                        <td className="py-4 px-4 text-sm text-center text-[#94A3B8]">{period.from}</td>
                                        <td className="py-4 px-4 text-sm text-center text-[#94A3B8]">{period.to}</td>
                                        <td className="py-4 px-4 text-sm text-center text-[#94A3B8]">{period.midpoint}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-[#1A1A24] text-white">
                                                {period.credibility}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-center font-mono text-white">{period.trendMonths}</td>
                                        <td className="py-4 px-4 text-sm text-center font-mono text-white">{period.trendAssumption}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Assumption Cards */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                            <h3 className="text-sm font-medium text-[#64748B] mb-3">Blended Credibility</h3>
                            <div className="text-3xl font-bold text-white font-mono">100%</div>
                            <p className="text-xs text-[#475569] mt-2">Combined experience weight</p>
                        </div>
                        <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                            <h3 className="text-sm font-medium text-[#64748B] mb-3">Annual Trend</h3>
                            <div className="text-3xl font-bold text-white font-mono">9.0%</div>
                            <p className="text-xs text-[#475569] mt-2">Applied industry trend</p>
                        </div>
                        <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                            <h3 className="text-sm font-medium text-[#64748B] mb-3">Projected PMPM</h3>
                            <div className="text-3xl font-bold text-white font-mono">$257.22</div>
                            <p className="text-xs text-[#475569] mt-2">Renewal rate basis</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Projections Tab */}
            {selectedTab === 'projections' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                        <h2 className="text-lg font-medium text-white mb-6">Renewal Projections</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Current vs Projected */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-[#94A3B8]">Current Plan Year</h3>
                                <div className="p-4 rounded-lg bg-[#1A1A24]/50 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">Monthly Premium</span>
                                        <span className="text-white font-mono">$548,389</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">Annual Premium</span>
                                        <span className="text-white font-mono">$6,580,668</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">PEPM</span>
                                        <span className="text-white font-mono">$1,485</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-[#94A3B8]">Projected Renewal</h3>
                                <div className="p-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">Monthly Premium</span>
                                        <span className="text-white font-mono">$597,944</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">Annual Premium</span>
                                        <span className="text-white font-mono">$7,175,328</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#64748B]">PEPM</span>
                                        <span className="text-white font-mono">$1,619</span>
                                    </div>
                                    <div className="pt-2 border-t border-[#F59E0B]/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#F59E0B]">Projected Increase</span>
                                            <span className="text-[#F59E0B] font-bold">+9.0%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scenario Modeling */}
                    <div className="p-6 rounded-lg bg-[#0A0A0F] border border-[#1A1A24]">
                        <h2 className="text-lg font-medium text-white mb-6">Scenario Modeling</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { scenario: 'Conservative', trend: '7%', pepm: '$1,573', increase: '+5.9%', highlight: false },
                                { scenario: 'Expected', trend: '9%', pepm: '$1,619', increase: '+9.0%', highlight: true },
                                { scenario: 'Aggressive', trend: '12%', pepm: '$1,692', increase: '+13.9%', highlight: false },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    className={`p-5 rounded-lg border ${s.highlight ? 'border-white/20 bg-white/5' : 'border-[#1A1A24] bg-[#1A1A24]/30'}`}
                                >
                                    <div className="text-sm font-medium text-white mb-4">{s.scenario}</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#64748B]">Trend</span>
                                            <span className="text-white font-mono">{s.trend}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#64748B]">PEPM</span>
                                            <span className="text-white font-mono">{s.pepm}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t border-[#1A1A24]">
                                            <span className="text-[#64748B]">YoY Change</span>
                                            <span className={`font-medium ${s.highlight ? 'text-[#F59E0B]' : 'text-white'}`}>{s.increase}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
