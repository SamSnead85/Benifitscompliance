'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import {
    DollarSign, TrendingUp, TrendingDown, Target, Users, Calendar,
    Download, ChevronDown, ArrowUpRight, ArrowDownRight, Briefcase,
    PieChart, ClipboardCheck, Building2, Wallet, BadgeDollarSign, Scale
} from 'lucide-react';

// ============================================================================
// CFO FINANCIAL DASHBOARD DATA
// ============================================================================

const financialKPIs = {
    totalPlanCost: 8_247_892,
    totalPlanCostChange: 4.2,
    fundingLevel: 97.3,
    fundingChange: 2.1,
    claimsRatio: 82.4,
    claimsRatioChange: -1.8,
    adminRatio: 4.2,
    adminRatioChange: -0.3,
    ibnrReserve: 892_450,
    stopLossPremium: 1_248_000
};

const budgetComparison = [
    { category: 'Medical Claims', budget: 5_200_000, actual: 5_847_234, variance: 647_234, varPct: 12.4 },
    { category: 'Pharmacy', budget: 1_400_000, actual: 1_523_892, variance: 123_892, varPct: 8.9 },
    { category: 'Dental/Vision', budget: 500_000, actual: 487_234, variance: -12_766, varPct: -2.6 },
    { category: 'Admin Fees', budget: 260_000, actual: 248_532, variance: -11_468, varPct: -4.4 },
    { category: 'Stop-Loss', budget: 1_300_000, actual: 1_248_000, variance: -52_000, varPct: -4.0 },
    { category: 'Reserves (IBNR)', budget: 900_000, actual: 892_450, variance: -7_550, varPct: -0.8 },
];

const monthlyFinancials = [
    { month: 'Jan', claims: 612000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'Feb', claims: 598000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'Mar', claims: 687000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'Apr', claims: 634000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'May', claims: 712000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'Jun', claims: 689000, admin: 21000, stopLoss: 104000, funding: 720000 },
    { month: 'Jul', claims: 656000, admin: 21000, stopLoss: 104000, funding: 740000 },
    { month: 'Aug', claims: 678000, admin: 21000, stopLoss: 104000, funding: 740000 },
    { month: 'Sep', claims: 723000, admin: 21000, stopLoss: 104000, funding: 740000 },
    { month: 'Oct', claims: 745000, admin: 21000, stopLoss: 104000, funding: 740000 },
    { month: 'Nov', claims: 698000, admin: 21000, stopLoss: 104000, funding: 740000 },
    { month: 'Dec', claims: 715000, admin: 21000, stopLoss: 104000, funding: 740000 },
];

const waterfallBreakdown = [
    { name: 'Prior Year', value: 7_892_345, cumulative: 7_892_345, type: 'base' },
    { name: 'Trend', value: 631_388, cumulative: 8_523_733, type: 'increase' },
    { name: 'Enrollment', value: 284_892, cumulative: 8_808_625, type: 'increase' },
    { name: 'Plan Changes', value: -189_234, cumulative: 8_619_391, type: 'decrease' },
    { name: 'Network', value: -234_891, cumulative: 8_384_500, type: 'decrease' },
    { name: 'Utilization', value: -178_432, cumulative: 8_206_068, type: 'decrease' },
    { name: 'Other', value: 41_824, cumulative: 8_247_892, type: 'increase' },
    { name: 'Current Year', value: 8_247_892, cumulative: 8_247_892, type: 'total' },
];

const cashFlowProjection = [
    { month: 'Jan 25', inflow: 740000, outflow: 698000, balance: 42000 },
    { month: 'Feb 25', inflow: 740000, outflow: 712000, balance: 70000 },
    { month: 'Mar 25', inflow: 740000, outflow: 745000, balance: 65000 },
    { month: 'Apr 25', inflow: 740000, outflow: 678000, balance: 127000 },
    { month: 'May 25', inflow: 740000, outflow: 723000, balance: 144000 },
    { month: 'Jun 25', inflow: 740000, outflow: 734000, balance: 150000 },
];

const fundingComponents = [
    { component: 'Employer Contribution', amount: 6_847_234, percent: 78.2 },
    { component: 'Employee Contribution', amount: 1_248_658, percent: 14.3 },
    { component: 'Investment Income', amount: 152_000, percent: 1.7 },
    { component: 'Stop-Loss Recovery', amount: 508_000, percent: 5.8 },
];

// ============================================================================
// HELPERS & COMPONENTS
// ============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

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

function FinancialKPICard({
    icon: Icon,
    label,
    value,
    change,
    format = 'currency',
    good = 'down'
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    change?: number;
    format?: 'currency' | 'percent';
    good?: 'up' | 'down';
}) {
    const isPositive = change !== undefined && (
        (good === 'down' && change < 0) || (good === 'up' && change > 0)
    );
    const formattedValue = format === 'currency' ? formatCurrency(value, true) : `${value}%`;

    return (
        <motion.div
            variants={fadeInUp}
            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
                    <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                        {change < 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>

            <div className="text-3xl font-semibold text-[var(--text-primary)] font-mono tracking-tight">
                {formattedValue}
            </div>

            <div className="text-xs text-[var(--text-tertiary)] mt-2 uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
}

function BudgetVarianceRow({ item }: { item: typeof budgetComparison[0] }) {
    const isOver = item.variance > 0;

    return (
        <tr className="border-t border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors">
            <td className="py-3 px-4 text-sm text-[var(--text-primary)]">{item.category}</td>
            <td className="py-3 px-4 text-right font-mono text-sm text-[var(--text-secondary)]">
                {formatCurrency(item.budget)}
            </td>
            <td className="py-3 px-4 text-right font-mono text-sm text-[var(--text-primary)]">
                {formatCurrency(item.actual)}
            </td>
            <td className="py-3 px-4 text-right">
                <span className={`font-mono text-sm ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isOver ? '+' : ''}{formatCurrency(item.variance)}
                </span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isOver ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                    {isOver ? '+' : ''}{item.varPct}%
                </span>
            </td>
        </tr>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CFODashboardPage() {
    const [selectedView, setSelectedView] = useState<'overview' | 'budget' | 'cashflow' | 'funding'>('overview');

    const totalVariance = budgetComparison.reduce((sum, item) => sum + item.variance, 0);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Briefcase className="w-7 h-7 text-emerald-400" />
                        CFO Financial Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Executive financial intelligence for self-insured plan management
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm">
                        <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span>FY 2024</span>
                        <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Board Report
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] w-fit">
                {[
                    { id: 'overview', label: 'Financial Overview', icon: PieChart },
                    { id: 'budget', label: 'Budget Analysis', icon: Target },
                    { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
                    { id: 'funding', label: 'Funding Status', icon: Building2 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedView(tab.id as typeof selectedView)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === tab.id
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {selectedView === 'overview' && (
                <div className="space-y-6">
                    {/* KPI Grid */}
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-4 gap-4">
                        <FinancialKPICard
                            icon={DollarSign}
                            label="Total Plan Cost"
                            value={financialKPIs.totalPlanCost}
                            change={financialKPIs.totalPlanCostChange}
                            good="down"
                        />
                        <FinancialKPICard
                            icon={Scale}
                            label="Funding Level"
                            value={financialKPIs.fundingLevel}
                            change={financialKPIs.fundingChange}
                            format="percent"
                            good="up"
                        />
                        <FinancialKPICard
                            icon={ClipboardCheck}
                            label="Claims Ratio"
                            value={financialKPIs.claimsRatio}
                            change={financialKPIs.claimsRatioChange}
                            format="percent"
                            good="down"
                        />
                        <FinancialKPICard
                            icon={BadgeDollarSign}
                            label="Admin Ratio"
                            value={financialKPIs.adminRatio}
                            change={financialKPIs.adminRatioChange}
                            format="percent"
                            good="down"
                        />
                    </motion.div>

                    {/* Monthly Financials Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-medium text-[var(--text-primary)]">Monthly Financial Performance</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Claims, admin, and funding comparison</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-amber-500" /> Claims
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-slate-500" /> Admin
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-purple-500" /> Stop-Loss
                                </span>
                                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                    <span className="w-8 border-t-2 border-emerald-400" /> Funding
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--surface-secondary)',
                                            border: '1px solid var(--border-primary)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value) => value !== undefined ? formatCurrency(Number(value)) : ''}
                                    />
                                    <Bar dataKey="claims" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="admin" stackId="a" fill="#64748B" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="stopLoss" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="funding" stroke="#10B981" strokeWidth={2} dot={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Budget Variance Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-[var(--text-primary)]">Budget vs Actual Analysis</h2>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${totalVariance > 0
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                Net Variance: {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance, true)}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                        <th className="text-left py-2 px-4">Category</th>
                                        <th className="text-right py-2 px-4">Budget</th>
                                        <th className="text-right py-2 px-4">Actual</th>
                                        <th className="text-right py-2 px-4">Variance</th>
                                        <th className="text-right py-2 px-4">% Var</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgetComparison.map((item) => (
                                        <BudgetVarianceRow key={item.category} item={item} />
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[var(--border-primary)] bg-[var(--surface-secondary)]">
                                        <td className="py-3 px-4 text-sm font-semibold text-[var(--text-primary)]">Total</td>
                                        <td className="py-3 px-4 text-right font-mono text-sm font-semibold text-[var(--text-primary)]">
                                            {formatCurrency(budgetComparison.reduce((s, i) => s + i.budget, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono text-sm font-semibold text-[var(--text-primary)]">
                                            {formatCurrency(budgetComparison.reduce((s, i) => s + i.actual, 0))}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`font-mono text-sm font-semibold ${totalVariance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${totalVariance > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {((totalVariance / budgetComparison.reduce((s, i) => s + i.budget, 0)) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </motion.div>

                    {/* Funding Components */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                    >
                        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Funding Sources</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {fundingComponents.map((fc, i) => (
                                <div key={fc.component} className="p-4 rounded-lg bg-[var(--surface-secondary)]">
                                    <div className="text-sm text-[var(--text-secondary)] mb-2">{fc.component}</div>
                                    <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                                        {formatCurrency(fc.amount, true)}
                                    </div>
                                    <div className="text-xs text-[var(--text-tertiary)] mt-1">{fc.percent}% of total</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Budget Analysis Tab */}
            {selectedView === 'budget' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Detailed Budget Analysis</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Granular budget variance with drill-down to individual line items and departments.
                    </p>
                </motion.div>
            )}

            {/* Cash Flow Tab */}
            {selectedView === 'cashflow' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Wallet className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Cash Flow Projection</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        12-month forward projection with scenario modeling for contribution planning.
                    </p>
                </motion.div>
            )}

            {/* Funding Tab */}
            {selectedView === 'funding' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Building2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Funding Status</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        IBNR reserve levels, stop-loss recovery tracking, and funding adequacy analysis.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
