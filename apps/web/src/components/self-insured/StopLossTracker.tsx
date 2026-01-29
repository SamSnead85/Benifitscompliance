'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Users,
    CheckCircle2,
    Clock,
    FileText,
    ChevronDown
} from 'lucide-react';

interface StopLossPolicy {
    type: 'specific' | 'aggregate';
    carrier: string;
    policyNumber: string;
    effectiveDate: string;
    renewalDate: string;
    deductible: number;
    maxLiability: number;
    premium: number;
    status: 'active' | 'pending' | 'expired';
}

interface StopLossClaim {
    id: string;
    employeeId: string;
    claimDate: string;
    diagnosis: string;
    totalClaims: number;
    reimbursed: number;
    pending: number;
    status: 'approved' | 'pending' | 'denied' | 'under_review';
}

interface StopLossTrackerProps {
    className?: string;
}

const defaultPolicies: StopLossPolicy[] = [
    {
        type: 'specific',
        carrier: 'Sun Life',
        policyNumber: 'SL-2026-00123',
        effectiveDate: 'Jan 1, 2026',
        renewalDate: 'Dec 31, 2026',
        deductible: 175000,
        maxLiability: 2000000,
        premium: 245000,
        status: 'active'
    },
    {
        type: 'aggregate',
        carrier: 'Sun Life',
        policyNumber: 'SL-2026-00124',
        effectiveDate: 'Jan 1, 2026',
        renewalDate: 'Dec 31, 2026',
        deductible: 4800000,
        maxLiability: 10000000,
        premium: 125000,
        status: 'active'
    }
];

const defaultClaims: StopLossClaim[] = [
    { id: 'SLC-001', employeeId: 'EMP-1234', claimDate: 'Jan 15, 2026', diagnosis: 'Cardiovascular Surgery', totalClaims: 285000, reimbursed: 110000, pending: 0, status: 'approved' },
    { id: 'SLC-002', employeeId: 'EMP-2567', claimDate: 'Jan 22, 2026', diagnosis: 'Oncology Treatment', totalClaims: 240000, reimbursed: 0, pending: 65000, status: 'under_review' },
    { id: 'SLC-003', employeeId: 'EMP-3891', claimDate: 'Dec 18, 2025', diagnosis: 'Organ Transplant', totalClaims: 520000, reimbursed: 345000, pending: 0, status: 'approved' },
    { id: 'SLC-004', employeeId: 'EMP-4102', claimDate: 'Jan 28, 2026', diagnosis: 'Specialty Rx - Hemophilia', totalClaims: 198000, reimbursed: 0, pending: 23000, status: 'pending' },
];

const statusConfig = {
    approved: { color: 'var(--color-success)', label: 'Approved', icon: CheckCircle2 },
    pending: { color: 'var(--color-synapse-gold)', label: 'Pending', icon: Clock },
    denied: { color: 'var(--color-critical)', label: 'Denied', icon: AlertTriangle },
    under_review: { color: 'var(--color-synapse-cyan)', label: 'Under Review', icon: FileText }
};

export function StopLossTracker({ className = '' }: StopLossTrackerProps) {
    const [expandedPolicy, setExpandedPolicy] = useState<number | null>(0);

    const totalReimbursed = defaultClaims.reduce((sum, c) => sum + c.reimbursed, 0);
    const totalPending = defaultClaims.reduce((sum, c) => sum + c.pending, 0);
    const totalClaims = defaultClaims.reduce((sum, c) => sum + c.totalClaims, 0);
    const specificDeductible = defaultPolicies.find(p => p.type === 'specific')?.deductible || 0;
    const utilizationRate = ((totalReimbursed + totalPending) / (specificDeductible * defaultClaims.length)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-success)] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Stop-Loss Tracker</h2>
                        <p className="text-xs text-[var(--color-steel)]">Monitor excess loss coverage and claims</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Shield className="w-5 h-5 text-[var(--color-success)]" />
                        <span className="text-xs text-[var(--color-success)]">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mb-1">
                        ${(totalReimbursed / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-[var(--color-steel)]">Total Reimbursed</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Clock className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mb-1">
                        ${(totalPending / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-[var(--color-steel)]">Pending Review</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Users className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mb-1">{defaultClaims.length}</p>
                    <p className="text-sm text-[var(--color-steel)]">Active Claims</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-5 h-5 text-[var(--color-warning)]" />
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mb-1">
                        {utilizationRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-[var(--color-steel)]">Utilization Rate</p>
                </motion.div>
            </div>

            {/* Policies */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--glass-border)]">
                    <h3 className="font-semibold text-white">Active Policies</h3>
                </div>
                <div className="divide-y divide-[var(--glass-border)]">
                    {defaultPolicies.map((policy, i) => (
                        <div key={i}>
                            <div
                                onClick={() => setExpandedPolicy(expandedPolicy === i ? null : i)}
                                className="p-4 cursor-pointer hover:bg-[var(--glass-bg-light)] transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${policy.type === 'specific'
                                                ? 'bg-[rgba(6,182,212,0.2)]'
                                                : 'bg-[rgba(139,92,246,0.2)]'
                                            }`}>
                                            <Shield className={`w-5 h-5 ${policy.type === 'specific'
                                                    ? 'text-[var(--color-synapse-cyan)]'
                                                    : 'text-[#8B5CF6]'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {policy.type === 'specific' ? 'Specific Stop-Loss' : 'Aggregate Stop-Loss'}
                                            </p>
                                            <p className="text-xs text-[var(--color-steel)]">
                                                {policy.carrier} • {policy.policyNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-[var(--color-steel)]">Deductible</p>
                                            <p className="font-mono font-medium text-white">
                                                ${(policy.deductible / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                        <motion.div animate={{ rotate: expandedPolicy === i ? 180 : 0 }}>
                                            <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                            {expandedPolicy === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-4 pb-4"
                                >
                                    <div className="ml-14 p-4 rounded-lg bg-[var(--glass-bg)] grid grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Effective Date</p>
                                            <p className="text-sm text-white">{policy.effectiveDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Renewal Date</p>
                                            <p className="text-sm text-white">{policy.renewalDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Max Liability</p>
                                            <p className="text-sm text-white font-mono">${(policy.maxLiability / 1000000).toFixed(1)}M</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Annual Premium</p>
                                            <p className="text-sm text-white font-mono">${(policy.premium / 1000).toFixed(0)}K</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Claims */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
            >
                <div className="p-4 border-b border-[var(--glass-border)]">
                    <h3 className="font-semibold text-white">Stop-Loss Claims</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Claim ID</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Diagnosis</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Total Claims</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Reimbursed</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Pending</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)]">
                            {defaultClaims.map((claim, i) => {
                                const status = statusConfig[claim.status];
                                const StatusIcon = status.icon;

                                return (
                                    <motion.tr
                                        key={claim.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-[var(--glass-bg-light)] transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-mono text-white">{claim.id}</p>
                                            <p className="text-xs text-[var(--color-steel)]">{claim.claimDate}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-silver)]">{claim.diagnosis}</td>
                                        <td className="px-4 py-3 text-sm font-mono text-white">${(claim.totalClaims / 1000).toFixed(0)}K</td>
                                        <td className="px-4 py-3 text-sm font-mono text-[var(--color-success)]">${(claim.reimbursed / 1000).toFixed(0)}K</td>
                                        <td className="px-4 py-3 text-sm font-mono text-[var(--color-warning)]">
                                            {claim.pending > 0 ? `$${(claim.pending / 1000).toFixed(0)}K` : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"
                                                style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default StopLossTracker;
