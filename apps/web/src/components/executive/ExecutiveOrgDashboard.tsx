'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Building2,
    Users,
    Shield,
    AlertTriangle,
    CheckCircle2,
    Clock,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    MoreVertical,
    ExternalLink,
    Settings,
    ChevronRight,
    Sparkles,
    Target,
} from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    ein: string;
    employeeCount: number;
    ftEligibleCount: number;
    complianceScore: number;
    status: 'compliant' | 'at_risk' | 'non_compliant';
    monthlyPremium: number;
    penaltyExposure: number;
    lastUpdated: string;
    controlGroup?: string;
}

interface ExecutiveOrgDashboardProps {
    organizations: Organization[];
    totalEmployees: number;
    totalExposure: number;
    overallScore: number;
    className?: string;
}

/**
 * Executive Organization Dashboard
 * Multi-entity compliance overview for C-suite visibility
 */
export function ExecutiveOrgDashboard({
    organizations,
    totalEmployees,
    totalExposure,
    overallScore,
    className = '',
}: ExecutiveOrgDashboardProps) {
    const [sortBy, setSortBy] = useState<'name' | 'score' | 'exposure'>('score');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'compliant':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    label: 'Compliant'
                };
            case 'at_risk':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-400',
                    border: 'border-amber-500/30',
                    icon: <AlertTriangle className="w-4 h-4" />,
                    label: 'At Risk'
                };
            case 'non_compliant':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    icon: <Shield className="w-4 h-4" />,
                    label: 'Non-Compliant'
                };
            default:
                return {
                    bg: 'bg-cyan-500/10',
                    text: 'text-cyan-400',
                    border: 'border-cyan-500/30',
                    icon: <Clock className="w-4 h-4" />,
                    label: 'Pending'
                };
        }
    };

    const filteredOrgs = organizations
        .filter(org => filterStatus === 'all' || org.status === filterStatus)
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'score') return b.complianceScore - a.complianceScore;
            return b.penaltyExposure - a.penaltyExposure;
        });

    const statusCounts = {
        compliant: organizations.filter(o => o.status === 'compliant').length,
        at_risk: organizations.filter(o => o.status === 'at_risk').length,
        non_compliant: organizations.filter(o => o.status === 'non_compliant').length,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Organization Overview
                            </h2>
                            <p className="text-sm text-[#64748B]">Multi-entity compliance status</p>
                        </div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] text-[#64748B] hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-[#64748B]" />
                            <span className="text-xs text-[#64748B] uppercase tracking-wider">Organizations</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white">{organizations.length}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-[#64748B]" />
                            <span className="text-xs text-[#64748B] uppercase tracking-wider">Total Employees</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white">{totalEmployees.toLocaleString()}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-[#64748B]" />
                            <span className="text-xs text-[#64748B] uppercase tracking-wider">Avg. Score</span>
                        </div>
                        <p className={`text-2xl font-bold font-mono ${overallScore >= 90 ? 'text-emerald-400' :
                                overallScore >= 70 ? 'text-amber-400' : 'text-red-400'
                            }`}>{overallScore}%</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-[#64748B]" />
                            <span className="text-xs text-[#64748B] uppercase tracking-wider">Total Exposure</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-red-400">${totalExposure.toLocaleString()}</p>
                    </div>
                </div>

                {/* Status Filters */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${filterStatus === 'all'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'
                            }`}
                    >
                        All ({organizations.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('compliant')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${filterStatus === 'compliant'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'
                            }`}
                    >
                        Compliant ({statusCounts.compliant})
                    </button>
                    <button
                        onClick={() => setFilterStatus('at_risk')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${filterStatus === 'at_risk'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'
                            }`}
                    >
                        At Risk ({statusCounts.at_risk})
                    </button>
                    <button
                        onClick={() => setFilterStatus('non_compliant')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${filterStatus === 'non_compliant'
                                ? 'bg-red-500/20 text-red-400'
                                : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'
                            }`}
                    >
                        Non-Compliant ({statusCounts.non_compliant})
                    </button>
                </div>
            </div>

            {/* Organizations Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[rgba(255,255,255,0.02)]">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                                Organization
                            </th>
                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                                Status
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                                Employees
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                                Score
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                                Exposure
                            </th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                        {filteredOrgs.map((org, index) => {
                            const statusConfig = getStatusConfig(org.status);

                            return (
                                <motion.tr
                                    key={org.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                                >
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">{org.name}</p>
                                            <p className="text-xs text-[#64748B]">EIN: {org.ein}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-center">
                                            <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md
                        ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}
                      `}>
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <p className="text-sm font-mono text-white">{org.employeeCount.toLocaleString()}</p>
                                        <p className="text-xs text-[#64748B]">{org.ftEligibleCount} FT eligible</p>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <p className={`text-sm font-mono font-bold ${org.complianceScore >= 90 ? 'text-emerald-400' :
                                                org.complianceScore >= 70 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {org.complianceScore}%
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <p className="text-sm font-mono text-red-400">
                                            ${org.penaltyExposure.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

/**
 * Compliance Health Score Widget
 * Executive-level summary with visual indicators
 */
interface ComplianceHealthScoreProps {
    score: number;
    previousScore: number;
    breakdown: Array<{
        category: string;
        score: number;
        weight: number;
    }>;
    className?: string;
}

export function ComplianceHealthScore({
    score,
    previousScore,
    breakdown,
    className = '',
}: ComplianceHealthScoreProps) {
    const trend = score - previousScore;
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (score / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        Compliance Health
                    </h2>
                    <p className="text-sm text-[#64748B]">Overall organization score</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Radial Score */}
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="10"
                        />
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke={score >= 90 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444'}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                filter: `drop-shadow(0 0 8px ${score >= 90 ? 'rgba(16,185,129,0.4)' : score >= 70 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'})`
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold font-mono ${score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                            {score}
                        </span>
                        <span className="text-xs text-[#64748B] uppercase tracking-wider">Score</span>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-3">
                    {breakdown.map((item, index) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[#94A3B8]">{item.category}</span>
                                <span className="text-xs font-mono text-white">{item.score}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${item.score >= 90 ? 'bg-emerald-400' :
                                            item.score >= 70 ? 'bg-amber-400' : 'bg-red-400'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.score}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Trend */}
            <div className={`
        mt-6 p-3 rounded-lg flex items-center justify-between
        ${trend >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}
      `}>
                <div className="flex items-center gap-2">
                    {trend >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% from last month
                    </span>
                </div>
                <span className="text-xs text-[#64748B]">
                    Previous: {previousScore}%
                </span>
            </div>
        </motion.div>
    );
}

export default ExecutiveOrgDashboard;
