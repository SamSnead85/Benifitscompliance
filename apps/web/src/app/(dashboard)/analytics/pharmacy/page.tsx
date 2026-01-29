'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart
} from 'recharts';
import {
    Pill, TrendingUp, TrendingDown, DollarSign, AlertTriangle,
    ChevronDown, Calendar, Download, ArrowUpRight, ArrowDownRight,
    Activity, Target, Sparkles, Package, Beaker, ShieldCheck
} from 'lucide-react';

// ============================================================================
// PHARMACY DEMO DATA - GLP-1 & Specialty Drug Analytics
// ============================================================================

const pharmacyKPIs = {
    totalRxSpend: 1_523_892,
    rxSpendChange: 18.7,
    rxPmpm: 89.87,
    rxPmpmChange: 15.2,
    glp1Spend: 312_456,
    glp1Change: 67.3,
    specialtySpend: 487_234,
    specialtyChange: 24.8,
    genericRate: 87.4,
    mailOrderRate: 34.2,
};

const rxTrendData = [
    { month: 'Jan 24', generic: 42000, brand: 28000, specialty: 38000, glp1: 18000 },
    { month: 'Feb 24', generic: 44000, brand: 26000, specialty: 36000, glp1: 21000 },
    { month: 'Mar 24', generic: 43000, brand: 29000, specialty: 42000, glp1: 24000 },
    { month: 'Apr 24', generic: 45000, brand: 27000, specialty: 39000, glp1: 28000 },
    { month: 'May 24', generic: 44000, brand: 31000, specialty: 44000, glp1: 32000 },
    { month: 'Jun 24', generic: 46000, brand: 28000, specialty: 41000, glp1: 35000 },
    { month: 'Jul 24', generic: 45000, brand: 30000, specialty: 45000, glp1: 38000 },
    { month: 'Aug 24', generic: 47000, brand: 29000, specialty: 43000, glp1: 42000 },
    { month: 'Sep 24', generic: 46000, brand: 32000, specialty: 47000, glp1: 45000 },
    { month: 'Oct 24', generic: 48000, brand: 30000, specialty: 44000, glp1: 48000 },
    { month: 'Nov 24', generic: 47000, brand: 28000, specialty: 46000, glp1: 51000 },
    { month: 'Dec 24', generic: 49000, brand: 31000, specialty: 42000, glp1: 54000 },
];

const glp1Drugs = [
    { name: 'Ozempic (semaglutide)', spend: 124567, members: 34, pmpm: 3665, change: 72.4 },
    { name: 'Wegovy (semaglutide)', spend: 89234, members: 18, pmpm: 4957, change: 156.8 },
    { name: 'Mounjaro (tirzepatide)', spend: 67890, members: 12, pmpm: 5657, change: 234.2 },
    { name: 'Trulicity (dulaglutide)', spend: 23456, members: 28, pmpm: 838, change: -12.4 },
    { name: 'Rybelsus (oral sema)', spend: 7309, members: 8, pmpm: 914, change: 45.7 },
];

const specialtyDrugs = [
    { category: 'Oncology', spend: 187234, claims: 23, trend: 12.4 },
    { category: 'Autoimmune', spend: 134567, claims: 45, trend: 8.7 },
    { category: 'Multiple Sclerosis', spend: 98234, claims: 12, trend: -3.2 },
    { category: 'Hepatitis C', spend: 45678, claims: 8, trend: -18.4 },
    { category: 'Growth Hormone', spend: 21521, claims: 6, trend: 5.1 },
];

const therapeuticClasses = [
    { name: 'Antidiabetic Agents', value: 412456, color: '#F59E0B' },
    { name: 'Cardiovascular', value: 287234, color: '#3B82F6' },
    { name: 'Mental Health', value: 234567, color: '#8B5CF6' },
    { name: 'Pain Management', value: 189234, color: '#EF4444' },
    { name: 'Respiratory', value: 156789, color: '#10B981' },
    { name: 'Other', value: 243612, color: '#64748B' },
];

const genericOpportunities = [
    { brand: 'Lyrica', generic: 'Pregabalin', currentSpend: 34567, savingsOpportunity: 28934, members: 23 },
    { brand: 'Celebrex', generic: 'Celecoxib', currentSpend: 23456, savingsOpportunity: 19234, members: 18 },
    { brand: 'Crestor', generic: 'Rosuvastatin', currentSpend: 19234, savingsOpportunity: 15678, members: 45 },
    { brand: 'Lexapro', generic: 'Escitalopram', currentSpend: 15678, savingsOpportunity: 12234, members: 34 },
];

// ============================================================================
// COMPONENTS
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

function PharmacyKPICard({
    icon: Icon,
    label,
    value,
    change,
    format = 'currency',
    accentColor = '#F59E0B'
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    change?: number;
    format?: 'currency' | 'percent';
    accentColor?: string;
}) {
    const isPositive = change !== undefined && change < 0;
    const formattedValue = format === 'currency' ? formatCurrency(value, true) : `${value}%`;

    return (
        <motion.div
            variants={fadeInUp}
            className="relative p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110"
                style={{ backgroundColor: accentColor }} />

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
                        <Icon className="w-5 h-5" />
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
                    {formattedValue}
                </div>

                <div className="text-xs text-[var(--text-tertiary)] mt-2 uppercase tracking-wider">
                    {label}
                </div>
            </div>
        </motion.div>
    );
}

function GLP1DrugRow({ drug }: { drug: typeof glp1Drugs[0] }) {
    return (
        <tr className="border-t border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors">
            <td className="py-3 px-4">
                <span className="text-sm text-[var(--text-primary)]">{drug.name}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-mono text-sm text-[var(--text-primary)]">{formatCurrency(drug.spend)}</span>
            </td>
            <td className="py-3 px-4 text-center">
                <span className="text-sm text-[var(--text-secondary)]">{drug.members}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-mono text-sm text-[var(--text-primary)]">${drug.pmpm.toLocaleString()}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className={`text-sm font-medium ${drug.change >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {drug.change >= 0 ? '+' : ''}{drug.change}%
                </span>
            </td>
        </tr>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PharmacyIntelligencePage() {
    const [selectedView, setSelectedView] = useState<'overview' | 'glp1' | 'specialty' | 'savings'>('overview');

    const totalSavingsOpportunity = genericOpportunities.reduce((sum, o) => sum + o.savingsOpportunity, 0);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Pill className="w-7 h-7 text-purple-400" />
                        Pharmacy Intelligence
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        GLP-1 impact analysis, specialty drug trends, and generic optimization
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm">
                        <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span>2024</span>
                        <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* GLP-1 Alert Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                        GLP-1 medications now represent <span className="text-amber-400">20.5%</span> of total pharmacy spend
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Year-over-year increase of 67.3% driven by Ozempic, Wegovy, and Mounjaro
                    </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-colors">
                    View Strategy
                </button>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] w-fit">
                {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'glp1', label: 'GLP-1 Analysis', icon: Beaker },
                    { id: 'specialty', label: 'Specialty Drugs', icon: Package },
                    { id: 'savings', label: 'Savings Opportunities', icon: Sparkles }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedView(tab.id as typeof selectedView)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === tab.id
                            ? 'bg-purple-500/20 text-purple-400'
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
                    {/* KPI Row */}
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-4 gap-4">
                        <PharmacyKPICard
                            icon={DollarSign}
                            label="Total Rx Spend"
                            value={pharmacyKPIs.totalRxSpend}
                            change={pharmacyKPIs.rxSpendChange}
                            accentColor="#8B5CF6"
                        />
                        <PharmacyKPICard
                            icon={Pill}
                            label="GLP-1 Spend"
                            value={pharmacyKPIs.glp1Spend}
                            change={pharmacyKPIs.glp1Change}
                            accentColor="#F59E0B"
                        />
                        <PharmacyKPICard
                            icon={Package}
                            label="Specialty Spend"
                            value={pharmacyKPIs.specialtySpend}
                            change={pharmacyKPIs.specialtyChange}
                            accentColor="#3B82F6"
                        />
                        <PharmacyKPICard
                            icon={ShieldCheck}
                            label="Generic Fill Rate"
                            value={pharmacyKPIs.genericRate}
                            format="percent"
                            accentColor="#10B981"
                        />
                    </motion.div>

                    {/* Main Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-medium text-[var(--text-primary)]">Pharmacy Spend Trend by Category</h2>
                                <p className="text-sm text-[var(--text-secondary)]">12-month rolling analysis</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-[#10B981]" /> Generic
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-[#3B82F6]" /> Brand
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-[#8B5CF6]" /> Specialty
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> GLP-1
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={rxTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                                    <Area type="monotone" dataKey="generic" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="brand" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="specialty" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="glp1" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Dual Column - GLP-1 Table & Therapeutic Classes */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* GLP-1 Drug Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-[var(--text-primary)]">GLP-1 Drug Breakdown</h2>
                                <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                                    {glp1Drugs.reduce((s, d) => s + d.members, 0)} members
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                            <th className="text-left py-2 px-4">Drug</th>
                                            <th className="text-right py-2 px-4">Spend</th>
                                            <th className="text-center py-2 px-4">Members</th>
                                            <th className="text-right py-2 px-4">PMPM</th>
                                            <th className="text-right py-2 px-4">YoY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {glp1Drugs.map((drug) => (
                                            <GLP1DrugRow key={drug.name} drug={drug} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Therapeutic Class Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                        >
                            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-6">Therapeutic Class Distribution</h2>
                            <div className="flex items-center gap-8">
                                <div className="w-40 h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={therapeuticClasses}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {therapeuticClasses.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => value !== undefined ? formatCurrency(Number(value)) : ''} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {therapeuticClasses.map((tc) => (
                                        <div key={tc.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tc.color }} />
                                                <span className="text-sm text-[var(--text-secondary)]">{tc.name}</span>
                                            </div>
                                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                                {formatCurrency(tc.value, true)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Generic Savings Opportunities */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--text-primary)]">AI-Identified Generic Savings</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">Potential annual savings through generic substitution</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-emerald-400">
                                {formatCurrency(totalSavingsOpportunity)}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                            {genericOpportunities.map((opp) => (
                                <div key={opp.brand} className="p-4 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                                    <div className="text-sm font-medium text-[var(--text-primary)] mb-1">{opp.brand} → {opp.generic}</div>
                                    <div className="text-xs text-[var(--text-secondary)] mb-2">{opp.members} members</div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xs text-[var(--text-tertiary)]">Savings</span>
                                        <span className="text-sm font-mono text-emerald-400">{formatCurrency(opp.savingsOpportunity)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* GLP-1 Analysis Tab */}
            {selectedView === 'glp1' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Beaker className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">GLP-1 Deep Dive</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Detailed analysis of GLP-1 utilization patterns, member journeys, and cost containment strategies.
                    </p>
                </motion.div>
            )}

            {/* Specialty Tab */}
            {selectedView === 'specialty' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Specialty Drug Analysis</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Comprehensive tracking of high-cost specialty medications and biosimilar opportunities.
                    </p>
                </motion.div>
            )}

            {/* Savings Tab */}
            {selectedView === 'savings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center">
                    <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2">Cost Optimization Center</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        AI-powered savings recommendations, generic substitution opportunities, and PBM optimization.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
