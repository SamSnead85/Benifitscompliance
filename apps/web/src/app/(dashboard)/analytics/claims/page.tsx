'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap
} from 'recharts';
import {
    FileText, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Search,
    Filter, Download, Eye, ChevronRight, ChevronDown, ChevronUp, X, Sparkles,
    Calendar, Clock, User, Building2, Activity, Zap, ArrowUpRight, ArrowDownRight,
    BarChart2, PieChart as PieIcon, Layers, RefreshCw, SlidersHorizontal, Check,
    AlertCircle, Info, ExternalLink, Brain, Target, GitBranch, Hash
} from 'lucide-react';

// ============================================================================
// PREMIUM DATA
// ============================================================================

const claimsTrendData = [
    { month: 'Jan', medical: 4.2, pharmacy: 1.8, total: 6.0 },
    { month: 'Feb', medical: 4.5, pharmacy: 1.7, total: 6.2 },
    { month: 'Mar', medical: 4.8, pharmacy: 1.9, total: 6.7 },
    { month: 'Apr', medical: 4.3, pharmacy: 2.1, total: 6.4 },
    { month: 'May', medical: 4.9, pharmacy: 2.0, total: 6.9 },
    { month: 'Jun', medical: 5.2, pharmacy: 2.2, total: 7.4 },
    { month: 'Jul', medical: 4.8, pharmacy: 2.3, total: 7.1 },
    { month: 'Aug', medical: 5.1, pharmacy: 2.4, total: 7.5 },
    { month: 'Sep', medical: 5.4, pharmacy: 2.1, total: 7.5 },
    { month: 'Oct', medical: 5.0, pharmacy: 2.5, total: 7.5 }
];

const anomalyBreakdown = [
    { type: 'Duplicate Claims', count: 23, amount: 45230, severity: 'high', color: '#EF4444' },
    { type: 'Unusual Charges', count: 18, amount: 89450, severity: 'medium', color: '#F97316' },
    { type: 'Pattern Anomaly', count: 12, amount: 34200, severity: 'medium', color: '#FBBF24' },
    { type: 'Provider Outlier', count: 8, amount: 67800, severity: 'high', color: '#EC4899' },
    { type: 'Timing Anomaly', count: 15, amount: 23400, severity: 'low', color: '#8B5CF6' }
];

const categoryTreemap = [
    { name: 'Inpatient', size: 2847234, fill: '#F59E0B' },
    { name: 'Outpatient', size: 1523456, fill: '#8B5CF6' },
    { name: 'Pharmacy', size: 1734567, fill: '#EC4899' },
    { name: 'Professional', size: 987654, fill: '#06B6D4' },
    { name: 'ER', size: 654321, fill: '#EF4444' },
    { name: 'Lab', size: 345678, fill: '#10B981' },
    { name: 'Imaging', size: 234567, fill: '#3B82F6' }
];

const claimsData = [
    {
        id: 'CLM-2024-78432',
        memberId: 'M-4521',
        memberName: 'Rodriguez, Maria',
        serviceDate: '2024-10-28',
        provider: 'Memorial Hospital',
        category: 'Inpatient',
        procedure: 'Hip Replacement',
        billed: 85420,
        allowed: 72108,
        paid: 57686,
        status: 'paid',
        anomalyFlags: ['unusual'],
        riskScore: 78,
        daysToProcess: 12
    },
    {
        id: 'CLM-2024-78433',
        memberId: 'M-3287',
        memberName: 'Chen, William',
        serviceDate: '2024-10-27',
        provider: 'CardioHealth Associates',
        category: 'Professional',
        procedure: 'Cardiac Catheterization',
        billed: 42350,
        allowed: 38500,
        paid: 30800,
        status: 'paid',
        anomalyFlags: [],
        riskScore: 45,
        daysToProcess: 8
    },
    {
        id: 'CLM-2024-78434',
        memberId: 'M-7832',
        memberName: 'Johnson, Patricia',
        serviceDate: '2024-10-26',
        provider: 'Oncology Specialists',
        category: 'Professional',
        procedure: 'Chemotherapy Administration',
        billed: 28940,
        allowed: 25200,
        paid: 20160,
        status: 'paid',
        anomalyFlags: ['pattern'],
        riskScore: 82,
        daysToProcess: 6
    },
    {
        id: 'CLM-2024-78435',
        memberId: 'M-2156',
        memberName: 'Thompson, James',
        serviceDate: '2024-10-25',
        provider: 'Specialty Pharmacy Inc',
        category: 'Pharmacy',
        procedure: 'Ocrevus Injection',
        billed: 34500,
        allowed: 34500,
        paid: 27600,
        status: 'pending',
        anomalyFlags: ['duplicate'],
        riskScore: 91,
        daysToProcess: null
    },
    {
        id: 'CLM-2024-78436',
        memberId: 'M-9443',
        memberName: 'Davis, Robert',
        serviceDate: '2024-10-24',
        provider: 'Dialysis Center',
        category: 'Outpatient',
        procedure: 'Hemodialysis Session',
        billed: 2850,
        allowed: 2200,
        paid: 1760,
        status: 'paid',
        anomalyFlags: [],
        riskScore: 35,
        daysToProcess: 4
    },
    {
        id: 'CLM-2024-78437',
        memberId: 'M-5521',
        memberName: 'Wilson, Sarah',
        serviceDate: '2024-10-23',
        provider: 'Emergency Medical Center',
        category: 'ER',
        procedure: 'Emergency Room Visit',
        billed: 8420,
        allowed: 6500,
        paid: 5200,
        status: 'paid',
        anomalyFlags: ['unusual', 'timing'],
        riskScore: 72,
        daysToProcess: 15
    }
];

const kpiCards = [
    { label: 'Total Claims YTD', value: 8247532, format: 'currency', trend: 4.5, icon: DollarSign, gradient: ['#F59E0B', '#EF4444'] },
    { label: 'Claims Volume', value: 45892, format: 'number', trend: 8.2, icon: FileText, gradient: ['#8B5CF6', '#EC4899'] },
    { label: 'Avg Processing Days', value: 7.2, format: 'decimal', trend: -12.5, icon: Clock, gradient: ['#06B6D4', '#3B82F6'] },
    { label: 'Anomalies Detected', value: 76, format: 'number', trend: 15.3, icon: AlertTriangle, gradient: ['#EF4444', '#F97316'] }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
}

function formatValue(value: number, format: string): string {
    if (format === 'currency') return formatCurrency(value);
    if (format === 'decimal') return value.toFixed(1);
    return value.toLocaleString();
}

// ============================================================================
// COMPONENTS
// ============================================================================

function GlassCard({ children, className = '', gradient = false }: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                backdrop-blur-xl border border-white/[0.08]
                shadow-2xl shadow-black/20
                ${className}
            `}
        >
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />
            )}
            {children}
        </motion.div>
    );
}

function KPICard({ data, index }: { data: typeof kpiCards[0]; index: number }) {
    const Icon = data.icon;
    const isPositive = data.label.includes('Processing') ? data.trend < 0 : data.trend > 0;
    const trendColor = data.label.includes('Anomalies')
        ? (data.trend > 0 ? 'text-rose-400' : 'text-emerald-400')
        : (isPositive ? 'text-emerald-400' : 'text-rose-400');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] overflow-hidden cursor-pointer group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${data.gradient[0]}20, ${data.gradient[1]}20)` }}
                    >
                        <Icon className="w-4 h-4" style={{ color: data.gradient[0] }} />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                        {data.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(data.trend)}%
                    </span>
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    {formatValue(data.value, data.format)}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">{data.label}</div>
            </div>
        </motion.div>
    );
}

function AnomalyBadge({ type }: { type: string }) {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
        unusual: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <AlertCircle className="w-3 h-3" /> },
        duplicate: { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: <Hash className="w-3 h-3" /> },
        pattern: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: <GitBranch className="w-3 h-3" /> },
        timing: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: <Clock className="w-3 h-3" /> }
    };

    const style = styles[type] || styles.unusual;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text}`}>
            {style.icon}
            {type}
        </span>
    );
}

function ClaimDetailPanel({ claim, onClose }: { claim: typeof claimsData[0]; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[480px] bg-[var(--surface-primary)] border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
        >
            <div className="sticky top-0 bg-[var(--surface-primary)] border-b border-white/5 p-6 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs text-[var(--text-tertiary)]">Claim Details</span>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] font-mono">{claim.id}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <X className="w-5 h-5 text-[var(--text-tertiary)]" />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* AI Risk Assessment */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent border border-[var(--accent-primary)]/20">
                    <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">AI Risk Assessment</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[var(--text-tertiary)]">Risk Score</span>
                                <span className={`text-sm font-bold ${claim.riskScore >= 80 ? 'text-rose-400' :
                                        claim.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>{claim.riskScore}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${claim.riskScore >= 80 ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                                            claim.riskScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                                'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${claim.riskScore}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                    {claim.anomalyFlags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {claim.anomalyFlags.map((flag) => (
                                <AnomalyBadge key={flag} type={flag} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Member Info */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-tertiary)]" />
                        Member Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[var(--text-tertiary)]">Member ID</div>
                            <div className="text-sm font-mono text-[var(--text-primary)]">{claim.memberId}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[var(--text-tertiary)]">Name</div>
                            <div className="text-sm text-[var(--text-primary)]">{claim.memberName}</div>
                        </div>
                    </div>
                </div>

                {/* Claim Info */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
                        Claim Details
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-xs text-[var(--text-tertiary)]">Service Date</span>
                            <span className="text-sm text-[var(--text-primary)]">{claim.serviceDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-xs text-[var(--text-tertiary)]">Provider</span>
                            <span className="text-sm text-[var(--text-primary)]">{claim.provider}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-xs text-[var(--text-tertiary)]">Category</span>
                            <span className="text-sm text-[var(--text-primary)]">{claim.category}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-xs text-[var(--text-tertiary)]">Procedure</span>
                            <span className="text-sm text-[var(--text-primary)]">{claim.procedure}</span>
                        </div>
                    </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[var(--text-tertiary)]" />
                        Financial Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[var(--text-tertiary)]">Billed</div>
                            <div className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(claim.billed)}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[var(--text-tertiary)]">Allowed</div>
                            <div className="text-lg font-bold text-[var(--accent-primary)]">{formatCurrency(claim.allowed)}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[var(--text-tertiary)]">Paid</div>
                            <div className="text-lg font-bold text-emerald-400">{formatCurrency(claim.paid)}</div>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-tertiary)]">Member Responsibility</span>
                            <span className="text-sm font-bold text-rose-400">{formatCurrency(claim.allowed - claim.paid)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[var(--text-secondary)] text-sm hover:bg-white/10 transition-colors">
                        <Target className="w-4 h-4" />
                        Flag for Review
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Sparkles className="w-4 h-4" />
                        AI Analysis
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ClaimsIntelligencePage() {
    const [selectedClaim, setSelectedClaim] = useState<typeof claimsData[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'serviceDate', direction: 'desc' });
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const filteredAndSortedClaims = useMemo(() => {
        let result = [...claimsData];

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.id.toLowerCase().includes(query) ||
                c.memberId.toLowerCase().includes(query) ||
                c.memberName.toLowerCase().includes(query) ||
                c.provider.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (filterCategory !== 'all') {
            result = result.filter(c => c.category === filterCategory);
        }

        // Sort
        result.sort((a, b) => {
            const aValue = (a as Record<string, unknown>)[sortConfig.key];
            const bValue = (b as Record<string, unknown>)[sortConfig.key];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });

        return result;
    }, [searchQuery, filterCategory, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'desc' ?
            <ChevronDown className="w-3 h-3" /> :
            <ChevronUp className="w-3 h-3" />;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <span className="text-[8px] font-bold text-white">!</span>
                            </motion.div>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                            Claims Intelligence
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                        AI-powered anomaly detection • Real-time analytics • Deep drill-down
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] text-sm hover:bg-white/10 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-amber-400 text-black text-sm font-medium shadow-lg shadow-amber-500/25"
                    >
                        <Zap className="w-4 h-4" />
                        Run Analysis
                    </motion.button>
                </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, index) => (
                    <KPICard key={kpi.label} data={kpi} index={index} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Claims Trend */}
                <GlassCard className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Claims Trend</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">Medical vs Pharmacy spend by month</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-1 rounded bg-[var(--accent-primary)]" />
                                Medical
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-1 rounded bg-[#EC4899]" />
                                Pharmacy
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={claimsTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="medicalGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="pharmacyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value) => value !== undefined ? [`$${value}M`, ''] : ['', '']}
                                />
                                <Area type="monotone" dataKey="medical" stroke="var(--accent-primary)" strokeWidth={3} fill="url(#medicalGradient)" />
                                <Area type="monotone" dataKey="pharmacy" stroke="#EC4899" strokeWidth={3} fill="url(#pharmacyGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Anomaly Breakdown */}
                <GlassCard className="p-6 ">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Anomalies Detected</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">AI-flagged claims</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="space-y-3">
                        {anomalyBreakdown.map((item, index) => (
                            <motion.div
                                key={item.type}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-[var(--text-primary)]">{item.type}</div>
                                    <div className="text-xs text-[var(--text-tertiary)]">{item.count} claims</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-mono text-[var(--accent-primary)]">{formatCurrency(item.amount)}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Claims Table */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Claims Explorer</h2>
                        <p className="text-sm text-[var(--text-tertiary)]">Click any claim to view details and AI analysis</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                            <input
                                type="text"
                                placeholder="Search claims..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]/50"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--text-primary)] focus:outline-none"
                        >
                            <option value="all">All Categories</option>
                            <option value="Inpatient">Inpatient</option>
                            <option value="Outpatient">Outpatient</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Professional">Professional</option>
                            <option value="ER">ER</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('id')}>
                                    <span className="flex items-center gap-1">Claim ID <SortIcon column="id" /></span>
                                </th>
                                <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('memberName')}>
                                    <span className="flex items-center gap-1">Member <SortIcon column="memberName" /></span>
                                </th>
                                <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleSort('serviceDate')}>
                                    <span className="flex items-center gap-1">Service Date <SortIcon column="serviceDate" /></span>
                                </th>
                                <th className="text-left py-3 px-4">Provider</th>
                                <th className="text-left py-3 px-4">Procedure</th>
                                <th className="text-right py-3 px-4 cursor-pointer" onClick={() => handleSort('billed')}>
                                    <span className="flex items-center justify-end gap-1">Billed <SortIcon column="billed" /></span>
                                </th>
                                <th className="text-right py-3 px-4 cursor-pointer" onClick={() => handleSort('paid')}>
                                    <span className="flex items-center justify-end gap-1">Paid <SortIcon column="paid" /></span>
                                </th>
                                <th className="text-center py-3 px-4">Risk</th>
                                <th className="text-center py-3 px-4">Flags</th>
                                <th className="text-center py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedClaims.map((claim, index) => (
                                <motion.tr
                                    key={claim.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`border-t border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer ${claim.anomalyFlags.length > 0 ? 'bg-rose-500/[0.02]' : ''
                                        }`}
                                    onClick={() => setSelectedClaim(claim)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-mono text-[var(--accent-primary)]">{claim.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="text-sm text-[var(--text-primary)]">{claim.memberName}</div>
                                            <div className="text-xs text-[var(--text-tertiary)]">{claim.memberId}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[var(--text-secondary)]">{claim.serviceDate}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[var(--text-secondary)] truncate max-w-[150px] block">{claim.provider}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[var(--text-secondary)]">{claim.procedure}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-sm font-mono text-[var(--text-primary)]">{formatCurrency(claim.billed)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-sm font-mono text-emerald-400">{formatCurrency(claim.paid)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="inline-flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${claim.riskScore >= 80 ? 'bg-rose-500' :
                                                    claim.riskScore >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`} />
                                            <span className={`text-xs font-medium ${claim.riskScore >= 80 ? 'text-rose-400' :
                                                    claim.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                                                }`}>{claim.riskScore}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {claim.anomalyFlags.length > 0 ? (
                                            <div className="flex items-center justify-center gap-1">
                                                {claim.anomalyFlags.map((flag) => (
                                                    <AnomalyBadge key={flag} type={flag} />
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-[var(--text-tertiary)]">—</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedClaim(claim); }}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                                        >
                                            <Eye className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)]" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Detail Panel */}
            <AnimatePresence>
                {selectedClaim && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setSelectedClaim(null)}
                        />
                        <ClaimDetailPanel claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
