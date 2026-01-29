'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Sankey, Layer, Rectangle
} from 'recharts';
import {
    FileText, Search, Filter, Download, ChevronDown, ChevronRight, ChevronUp,
    AlertTriangle, CheckCircle, Clock, DollarSign, Users, Activity,
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Flag,
    Calendar, Building2, Stethoscope, Pill, Heart, Brain, Sparkles,
    AlertCircle, XCircle, MoreHorizontal, ExternalLink
} from 'lucide-react';

// ============================================================================
// DEMO DATA - Claims Intelligence Dataset
// ============================================================================

const claimsKPIs = {
    totalClaims: 12847,
    totalClaimsChange: 8.3,
    avgClaimAmount: 642,
    avgClaimAmountChange: -2.1,
    anomaliesDetected: 23,
    anomaliesChange: 45,
    pendingReview: 156,
    processingTime: 4.2
};

const claimsData = [
    {
        id: 'CLM-2024-14892',
        memberId: 'M-4521',
        memberName: 'John D.',
        serviceDate: '2024-12-15',
        provider: 'Metro General Hospital',
        providerType: 'Hospital Inpatient',
        diagnosis: 'Acute Myocardial Infarction',
        diagnosisCode: 'I21.9',
        procedureCode: '92928',
        billedAmount: 147892,
        allowedAmount: 98450,
        paidAmount: 78760,
        memberResponsibility: 19690,
        status: 'paid',
        anomalyFlag: 'high_cost',
        anomalyScore: 94
    },
    {
        id: 'CLM-2024-14567',
        memberId: 'M-3287',
        memberName: 'Sarah M.',
        serviceDate: '2024-12-12',
        provider: 'Oncology Specialists PC',
        providerType: 'Specialist',
        diagnosis: 'Malignant Neoplasm - Lung',
        diagnosisCode: 'C34.90',
        procedureCode: '96413',
        billedAmount: 24567,
        allowedAmount: 18234,
        paidAmount: 14587,
        memberResponsibility: 3647,
        status: 'paid',
        anomalyFlag: null,
        anomalyScore: 12
    },
    {
        id: 'CLM-2024-14234',
        memberId: 'M-1893',
        memberName: 'Michael R.',
        serviceDate: '2024-12-10',
        provider: 'Advanced Dialysis Center',
        providerType: 'Facility',
        diagnosis: 'Chronic Kidney Disease Stage 4',
        diagnosisCode: 'N18.4',
        procedureCode: '90935',
        billedAmount: 8945,
        allowedAmount: 6234,
        paidAmount: 4987,
        memberResponsibility: 1247,
        status: 'paid',
        anomalyFlag: 'frequency',
        anomalyScore: 67
    },
    {
        id: 'CLM-2024-14101',
        memberId: 'M-5621',
        memberName: 'Emily T.',
        serviceDate: '2024-12-08',
        provider: 'Neurology Associates',
        providerType: 'Specialist',
        diagnosis: 'Multiple Sclerosis',
        diagnosisCode: 'G35',
        procedureCode: 'J2323',
        billedAmount: 12456,
        allowedAmount: 11234,
        paidAmount: 8987,
        memberResponsibility: 2247,
        status: 'pending',
        anomalyFlag: 'specialty_drug',
        anomalyScore: 78
    },
    {
        id: 'CLM-2024-13987',
        memberId: 'M-2945',
        memberName: 'Robert K.',
        serviceDate: '2024-12-05',
        provider: 'CardioHealth Clinic',
        providerType: 'Specialist',
        diagnosis: 'Congestive Heart Failure',
        diagnosisCode: 'I50.9',
        procedureCode: '93306',
        billedAmount: 4567,
        allowedAmount: 3456,
        paidAmount: 2765,
        memberResponsibility: 691,
        status: 'paid',
        anomalyFlag: null,
        anomalyScore: 8
    },
    {
        id: 'CLM-2024-13854',
        memberId: 'M-7823',
        memberName: 'Lisa W.',
        serviceDate: '2024-12-03',
        provider: 'Mental Health Partners',
        providerType: 'Behavioral Health',
        diagnosis: 'Major Depressive Disorder',
        diagnosisCode: 'F33.1',
        procedureCode: '90837',
        billedAmount: 285,
        allowedAmount: 245,
        paidAmount: 196,
        memberResponsibility: 49,
        status: 'paid',
        anomalyFlag: null,
        anomalyScore: 3
    },
    {
        id: 'CLM-2024-13721',
        memberId: 'M-4892',
        memberName: 'David C.',
        serviceDate: '2024-12-01',
        provider: 'Express Pharmacy',
        providerType: 'Pharmacy',
        diagnosis: 'Type 2 Diabetes',
        diagnosisCode: 'E11.9',
        procedureCode: 'NDC-123',
        billedAmount: 1847,
        allowedAmount: 1456,
        paidAmount: 1165,
        memberResponsibility: 291,
        status: 'paid',
        anomalyFlag: 'duplicate',
        anomalyScore: 89
    },
    {
        id: 'CLM-2024-13598',
        memberId: 'M-3156',
        memberName: 'Amanda P.',
        serviceDate: '2024-11-28',
        provider: 'Orthopedic Surgical Center',
        providerType: 'Ambulatory Surgery',
        diagnosis: 'Lumbar Disc Herniation',
        diagnosisCode: 'M51.16',
        procedureCode: '63030',
        billedAmount: 34567,
        allowedAmount: 24890,
        paidAmount: 19912,
        memberResponsibility: 4978,
        status: 'denied',
        anomalyFlag: 'prior_auth',
        anomalyScore: 95
    }
];

const claimsByCategory = [
    { name: 'Medical', value: 5847234, percent: 70.9, color: '#F59E0B' },
    { name: 'Pharmacy', value: 1523892, percent: 18.5, color: '#8B5CF6' },
    { name: 'Behavioral', value: 487234, percent: 5.9, color: '#06B6D4' },
    { name: 'Dental', value: 248532, percent: 3.0, color: '#10B981' },
    { name: 'Vision', value: 141000, percent: 1.7, color: '#64748B' }
];

const claimsTrend = [
    { month: 'Jul', claims: 1892, amount: 1234567, anomalies: 12 },
    { month: 'Aug', claims: 2134, amount: 1456789, anomalies: 18 },
    { month: 'Sep', claims: 1987, amount: 1345678, anomalies: 15 },
    { month: 'Oct', claims: 2456, amount: 1678901, anomalies: 21 },
    { month: 'Nov', claims: 2123, amount: 1523456, anomalies: 19 },
    { month: 'Dec', claims: 2255, amount: 1587234, anomalies: 23 }
];

const anomalyTypes = [
    { type: 'High Cost', count: 7, icon: DollarSign, color: '#EF4444' },
    { type: 'Duplicate', count: 5, icon: AlertCircle, color: '#F59E0B' },
    { type: 'Frequency', count: 4, icon: Activity, color: '#8B5CF6' },
    { type: 'Prior Auth', count: 4, icon: Shield, color: '#06B6D4' },
    { type: 'Specialty Drug', count: 3, icon: Pill, color: '#EC4899' }
];

import { Shield } from 'lucide-react';

// Sankey data for claims flow
const sankeyData = {
    nodes: [
        { name: 'Submitted' },
        { name: 'Auto-Adjudicated' },
        { name: 'Manual Review' },
        { name: 'Paid' },
        { name: 'Denied' },
        { name: 'Pending' }
    ],
    links: [
        { source: 0, target: 1, value: 8500 },
        { source: 0, target: 2, value: 4347 },
        { source: 1, target: 3, value: 8200 },
        { source: 1, target: 4, value: 300 },
        { source: 2, target: 3, value: 3800 },
        { source: 2, target: 4, value: 391 },
        { source: 2, target: 5, value: 156 }
    ]
};

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

function ClaimStatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
        paid: { label: 'Paid', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
        pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
        denied: { label: 'Denied', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle },
        review: { label: 'In Review', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Eye }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

function AnomalyBadge({ flag, score }: { flag: string | null; score: number }) {
    if (!flag) return null;

    const configs: Record<string, { label: string; className: string }> = {
        high_cost: { label: 'High Cost', className: 'bg-rose-500/20 text-rose-400' },
        duplicate: { label: 'Duplicate', className: 'bg-amber-500/20 text-amber-400' },
        frequency: { label: 'Frequency', className: 'bg-purple-500/20 text-purple-400' },
        prior_auth: { label: 'Prior Auth', className: 'bg-cyan-500/20 text-cyan-400' },
        specialty_drug: { label: 'Specialty', className: 'bg-pink-500/20 text-pink-400' }
    };
    const config = configs[flag] || { label: flag, className: 'bg-slate-500/20 text-slate-400' };

    return (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
                <AlertTriangle className="w-3 h-3" />
                {config.label}
            </span>
            <span className={`text-xs font-mono ${score >= 80 ? 'text-rose-400' : score >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                {score}
            </span>
        </div>
    );
}

function KPICard({
    icon: Icon,
    label,
    value,
    change,
    format = 'number',
    suffix = ''
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    change?: number;
    format?: 'currency' | 'number' | 'percent';
    suffix?: string;
}) {
    const formattedValue = useMemo(() => {
        if (format === 'currency') return formatCurrency(value, true);
        if (format === 'percent') return `${value}`;
        return formatNumber(value);
    }, [value, format]);

    const isPositive = change !== undefined && change < 0;

    return (
        <motion.div
            variants={fadeInUp}
            className="relative group p-5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
                        <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
                <div className="text-2xl font-semibold text-[var(--text-primary)] font-mono tracking-tight">
                    {formattedValue}{suffix}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-wider">
                    {label}
                </div>
            </div>
        </motion.div>
    );
}

function ClaimsTable({ claims, onSelectClaim }: { claims: typeof claimsData; onSelectClaim: (claim: typeof claimsData[0]) => void }) {
    const [sortField, setSortField] = useState<'serviceDate' | 'billedAmount' | 'anomalyScore'>('serviceDate');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const sortedClaims = useMemo(() => {
        return [...claims].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (sortField === 'serviceDate') {
                aVal = new Date(aVal as string).getTime();
                bVal = new Date(bVal as string).getTime();
            }
            return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        });
    }, [claims, sortField, sortDir]);

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-primary)]">
                        <th className="text-left py-3 px-4">Claim ID</th>
                        <th className="text-left py-3 px-4">Member</th>
                        <th className="text-left py-3 px-4 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('serviceDate')}>
                            <div className="flex items-center gap-1">
                                Service Date
                                {sortField === 'serviceDate' && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                            </div>
                        </th>
                        <th className="text-left py-3 px-4">Provider</th>
                        <th className="text-left py-3 px-4">Diagnosis</th>
                        <th className="text-right py-3 px-4 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('billedAmount')}>
                            <div className="flex items-center justify-end gap-1">
                                Billed
                                {sortField === 'billedAmount' && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                            </div>
                        </th>
                        <th className="text-right py-3 px-4">Paid</th>
                        <th className="text-center py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('anomalyScore')}>
                            <div className="flex items-center gap-1">
                                Anomaly
                                {sortField === 'anomalyScore' && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                            </div>
                        </th>
                        <th className="text-center py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedClaims.map((claim) => (
                        <tr
                            key={claim.id}
                            className="border-b border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors cursor-pointer"
                            onClick={() => onSelectClaim(claim)}
                        >
                            <td className="py-3 px-4">
                                <span className="font-mono text-sm text-[var(--accent-primary)]">{claim.id}</span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="text-sm text-[var(--text-primary)]">{claim.memberName}</div>
                                <div className="text-xs text-[var(--text-tertiary)]">{claim.memberId}</div>
                            </td>
                            <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                {new Date(claim.serviceDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                                <div className="text-sm text-[var(--text-primary)] max-w-[180px] truncate">{claim.provider}</div>
                                <div className="text-xs text-[var(--text-tertiary)]">{claim.providerType}</div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="text-sm text-[var(--text-secondary)] max-w-[160px] truncate">{claim.diagnosis}</div>
                                <div className="text-xs text-[var(--text-tertiary)] font-mono">{claim.diagnosisCode}</div>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <span className="font-mono text-sm text-[var(--text-primary)]">{formatCurrency(claim.billedAmount)}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <span className="font-mono text-sm text-[var(--text-primary)]">{formatCurrency(claim.paidAmount)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <ClaimStatusBadge status={claim.status} />
                            </td>
                            <td className="py-3 px-4">
                                <AnomalyBadge flag={claim.anomalyFlag} score={claim.anomalyScore} />
                            </td>
                            <td className="py-3 px-4 text-center">
                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-[var(--text-tertiary)]" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ClaimDetailPanel({ claim, onClose }: { claim: typeof claimsData[0]; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-0 top-0 h-full w-[480px] bg-[var(--surface-primary)] border-l border-[var(--border-primary)] shadow-2xl z-50 overflow-y-auto"
        >
            <div className="p-6 border-b border-[var(--border-primary)] flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-[var(--text-primary)]">Claim Details</h2>
                    <p className="text-sm text-[var(--accent-primary)] font-mono">{claim.id}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                    <XCircle className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Member Info */}
                <div>
                    <h3 className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-3">Member Information</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Name</span>
                            <span className="text-[var(--text-primary)]">{claim.memberName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Member ID</span>
                            <span className="text-[var(--text-primary)] font-mono">{claim.memberId}</span>
                        </div>
                    </div>
                </div>

                {/* Service Info */}
                <div>
                    <h3 className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-3">Service Information</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Date of Service</span>
                            <span className="text-[var(--text-primary)]">{new Date(claim.serviceDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Provider</span>
                            <span className="text-[var(--text-primary)] text-right max-w-[200px]">{claim.provider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Provider Type</span>
                            <span className="text-[var(--text-primary)]">{claim.providerType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Diagnosis</span>
                            <span className="text-[var(--text-primary)] text-right max-w-[200px]">{claim.diagnosis}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">ICD-10 Code</span>
                            <span className="text-[var(--text-primary)] font-mono">{claim.diagnosisCode}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Procedure Code</span>
                            <span className="text-[var(--text-primary)] font-mono">{claim.procedureCode}</span>
                        </div>
                    </div>
                </div>

                {/* Financial Info */}
                <div>
                    <h3 className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-3">Financial Breakdown</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Billed Amount</span>
                            <span className="text-[var(--text-primary)] font-mono">{formatCurrency(claim.billedAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Allowed Amount</span>
                            <span className="text-[var(--text-primary)] font-mono">{formatCurrency(claim.allowedAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Plan Paid</span>
                            <span className="text-emerald-400 font-mono">{formatCurrency(claim.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Member Responsibility</span>
                            <span className="text-amber-400 font-mono">{formatCurrency(claim.memberResponsibility)}</span>
                        </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-[var(--surface-secondary)]">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-[var(--text-secondary)]">Network Discount</span>
                            <span className="text-emerald-400 font-mono">
                                -{formatCurrency(claim.billedAmount - claim.allowedAmount)}
                                <span className="text-xs text-[var(--text-tertiary)] ml-1">
                                    ({((1 - claim.allowedAmount / claim.billedAmount) * 100).toFixed(0)}%)
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status & Anomaly */}
                <div>
                    <h3 className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-3">Status & Flags</h3>
                    <div className="flex items-center gap-4">
                        <ClaimStatusBadge status={claim.status} />
                        {claim.anomalyFlag && (
                            <AnomalyBadge flag={claim.anomalyFlag} score={claim.anomalyScore} />
                        )}
                    </div>
                    {claim.anomalyFlag && (
                        <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-rose-400">AI Anomaly Detection</div>
                                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                                        This claim has been flagged for review based on pattern analysis.
                                        Anomaly confidence score: {claim.anomalyScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Eye className="w-4 h-4" />
                        Full EOB
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)] text-sm hover:bg-[var(--surface-secondary)] transition-colors">
                        <Flag className="w-4 h-4" />
                        Flag for Review
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ClaimsIntelligencePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [anomalyFilter, setAnomalyFilter] = useState<boolean>(false);
    const [selectedClaim, setSelectedClaim] = useState<typeof claimsData[0] | null>(null);
    const [dateRange, setDateRange] = useState('30d');

    const filteredClaims = useMemo(() => {
        return claimsData.filter(claim => {
            if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
            if (anomalyFilter && !claim.anomalyFlag) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return claim.id.toLowerCase().includes(q) ||
                    claim.memberName.toLowerCase().includes(q) ||
                    claim.provider.toLowerCase().includes(q) ||
                    claim.diagnosis.toLowerCase().includes(q);
            }
            return true;
        });
    }, [searchQuery, statusFilter, anomalyFilter]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <FileText className="w-7 h-7 text-[var(--accent-primary)]" />
                        Claims Intelligence
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        AI-powered claims analysis with anomaly detection
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="ytd">Year to Date</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Export Claims
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-5 gap-4"
            >
                <KPICard
                    icon={FileText}
                    label="Total Claims"
                    value={claimsKPIs.totalClaims}
                    change={claimsKPIs.totalClaimsChange}
                />
                <KPICard
                    icon={DollarSign}
                    label="Avg Claim Amount"
                    value={claimsKPIs.avgClaimAmount}
                    change={claimsKPIs.avgClaimAmountChange}
                    format="currency"
                />
                <KPICard
                    icon={AlertTriangle}
                    label="Anomalies Detected"
                    value={claimsKPIs.anomaliesDetected}
                    change={claimsKPIs.anomaliesChange}
                />
                <KPICard
                    icon={Clock}
                    label="Pending Review"
                    value={claimsKPIs.pendingReview}
                />
                <KPICard
                    icon={Activity}
                    label="Avg Processing"
                    value={claimsKPIs.processingTime}
                    suffix=" days"
                />
            </motion.div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Claims Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[var(--text-primary)]">Claims Trend</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                                Claims
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                                Anomalies
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={claimsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface-secondary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area type="monotone" dataKey="claims" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                                <Area type="monotone" dataKey="anomalies" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Anomaly Types */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-[var(--text-primary)]">Anomaly Types</h2>
                        <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="space-y-3">
                        {anomalyTypes.map((anomaly) => {
                            const Icon = anomaly.icon;
                            return (
                                <div key={anomaly.type} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${anomaly.color}20` }}>
                                            <Icon className="w-4 h-4" style={{ color: anomaly.color }} />
                                        </div>
                                        <span className="text-sm text-[var(--text-primary)]">{anomaly.type}</span>
                                    </div>
                                    <span className="text-lg font-semibold font-mono text-[var(--text-primary)]">{anomaly.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        placeholder="Search claims by ID, member, provider, or diagnosis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-tertiary)]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="denied">Denied</option>
                </select>
                <button
                    onClick={() => setAnomalyFilter(!anomalyFilter)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${anomalyFilter
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-[var(--surface-primary)] border-[var(--border-primary)] text-[var(--text-secondary)]'
                        }`}
                >
                    <AlertTriangle className="w-4 h-4" />
                    Anomalies Only
                </button>
            </div>

            {/* Claims Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                    <h2 className="font-medium text-[var(--text-primary)]">
                        Claims ({filteredClaims.length})
                    </h2>
                    <div className="text-xs text-[var(--text-tertiary)]">
                        Click a row to view claim details
                    </div>
                </div>
                <ClaimsTable claims={filteredClaims} onSelectClaim={setSelectedClaim} />
            </motion.div>

            {/* Claim Detail Panel */}
            <AnimatePresence>
                {selectedClaim && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setSelectedClaim(null)}
                        />
                        <ClaimDetailPanel claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
