'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Shield,
    ChevronRight,
    Filter,
    Download,
    RefreshCw,
    Building2,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface ClientPortfolioDashboardProps {
    className?: string;
}

interface ClientSummary {
    id: string;
    name: string;
    employeeCount: number;
    complianceScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    pendingForms: number;
    revenue: number;
    trend: 'up' | 'down' | 'stable';
    lastSync: string;
}

const mockClients: ClientSummary[] = [
    { id: 'c1', name: 'Acme Corporation', employeeCount: 4256, complianceScore: 98, riskLevel: 'low', pendingForms: 12, revenue: 125000, trend: 'up', lastSync: '2 min ago' },
    { id: 'c2', name: 'TechStart Inc.', employeeCount: 892, complianceScore: 95, riskLevel: 'low', pendingForms: 5, revenue: 45000, trend: 'up', lastSync: '15 min ago' },
    { id: 'c3', name: 'Global Manufacturing LLC', employeeCount: 8421, complianceScore: 87, riskLevel: 'medium', pendingForms: 156, revenue: 245000, trend: 'stable', lastSync: '1 hour ago' },
    { id: 'c4', name: 'Sunrise Healthcare', employeeCount: 2134, complianceScore: 72, riskLevel: 'high', pendingForms: 342, revenue: 89000, trend: 'down', lastSync: '3 hours ago' },
    { id: 'c5', name: 'Midwest Logistics', employeeCount: 1567, complianceScore: 94, riskLevel: 'low', pendingForms: 23, revenue: 67000, trend: 'up', lastSync: '45 min ago' },
    { id: 'c6', name: 'Premier Financial Services', employeeCount: 3241, complianceScore: 65, riskLevel: 'critical', pendingForms: 512, revenue: 156000, trend: 'down', lastSync: '6 hours ago' },
];

const portfolioStats = {
    totalClients: 24,
    totalEmployees: 45892,
    avgComplianceScore: 89,
    atRiskClients: 4,
    pendingForms: 1847,
    monthlyRevenue: 892000,
    revenueChange: 12.4,
    complianceChange: 2.1
};

function getRiskBadge(risk: string) {
    switch (risk) {
        case 'low': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', border: 'border-[rgba(16,185,129,0.3)]' };
        case 'medium': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]' };
        case 'high': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]' };
        case 'critical': return { bg: 'bg-[var(--color-critical)]', text: 'text-white', border: 'border-[var(--color-critical)]' };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
    }
}

function getScoreColor(score: number) {
    if (score >= 90) return 'text-[var(--color-success)]';
    if (score >= 75) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-critical)]';
}

export function ClientPortfolioDashboard({ className = '' }: ClientPortfolioDashboardProps) {
    const [sortBy, setSortBy] = useState<'name' | 'risk' | 'compliance'>('risk');
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

    const sortedClients = [...mockClients].sort((a, b) => {
        if (sortBy === 'risk') {
            const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        }
        if (sortBy === 'compliance') {
            return a.complianceScore - b.complianceScore;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-emerald)] flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">Client Portfolio Dashboard</h1>
                        <p className="text-sm text-[var(--color-steel)]">Aggregate view across all managed organizations</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                        {['7d', '30d', '90d', '1y'].map(tf => (
                            <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${selectedTimeframe === tf
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'text-[var(--color-silver)] hover:text-white'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh All
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.1)] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                            <ArrowUpRight className="w-3 h-3" />
                            +3 this month
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{portfolioStats.totalClients}</p>
                    <p className="text-sm text-[var(--color-steel)]">Total Clients</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--color-success)]" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{portfolioStats.totalEmployees.toLocaleString()}</p>
                    <p className="text-sm text-[var(--color-steel)]">Managed Employees</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.1)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs ${portfolioStats.complianceChange >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
                            {portfolioStats.complianceChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {portfolioStats.complianceChange >= 0 ? '+' : ''}{portfolioStats.complianceChange}%
                        </span>
                    </div>
                    <p className={`text-3xl font-bold mb-1 ${getScoreColor(portfolioStats.avgComplianceScore)}`}>
                        {portfolioStats.avgComplianceScore}%
                    </p>
                    <p className="text-sm text-[var(--color-steel)]">Avg. Compliance Score</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-critical)]" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-critical)] mb-1">{portfolioStats.atRiskClients}</p>
                    <p className="text-sm text-[var(--color-steel)]">At-Risk Clients</p>
                </div>
            </div>

            {/* Risk Heat Map & Revenue */}
            <div className="grid grid-cols-3 gap-6">
                {/* Compliance Heat Map */}
                <div className="col-span-2 glass-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-white">Client Risk Overview</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSortBy('risk')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${sortBy === 'risk' ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)] hover:text-white'}`}
                            >
                                By Risk
                            </button>
                            <button
                                onClick={() => setSortBy('compliance')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${sortBy === 'compliance' ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)] hover:text-white'}`}
                            >
                                By Score
                            </button>
                            <button
                                onClick={() => setSortBy('name')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${sortBy === 'name' ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)] hover:text-white'}`}
                            >
                                A-Z
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedClients.map((client, index) => {
                            const riskStyle = getRiskBadge(client.riskLevel);
                            return (
                                <motion.div
                                    key={client.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group flex items-center gap-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskStyle.bg} ${riskStyle.text}`}>
                                        <span className="text-sm font-bold">{client.complianceScore}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white truncate">{client.name}</p>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                                                {client.riskLevel}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-[var(--color-steel)]">
                                            <span>{client.employeeCount.toLocaleString()} employees</span>
                                            <span>•</span>
                                            <span>{client.pendingForms} pending forms</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-white">${(client.revenue / 1000).toFixed(0)}k</p>
                                            <p className="text-xs text-[var(--color-steel)]">MRR</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[var(--color-steel)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Revenue Summary */}
                <div className="space-y-4">
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Revenue</h3>
                            <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                                <TrendingUp className="w-3 h-3" />
                                +{portfolioStats.revenueChange}%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            ${(portfolioStats.monthlyRevenue / 1000).toFixed(0)}k
                        </p>
                        <p className="text-sm text-[var(--color-steel)]">Monthly Recurring Revenue</p>
                        <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-[var(--color-steel)]">Enterprise</span>
                                <span className="text-white font-medium">$542k</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-[var(--color-steel)]">Professional</span>
                                <span className="text-white font-medium">$289k</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-steel)]">Standard</span>
                                <span className="text-white font-medium">$61k</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="font-semibold text-white mb-4">Pending Actions</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                                <XCircle className="w-5 h-5 text-[var(--color-critical)]" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Critical Reviews</p>
                                    <p className="text-xs text-[var(--color-steel)]">2 clients need attention</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                                <Clock className="w-5 h-5 text-[var(--color-warning)]" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Pending Forms</p>
                                    <p className="text-xs text-[var(--color-steel)]">{portfolioStats.pendingForms.toLocaleString()} awaiting review</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                                <Activity className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Sync Required</p>
                                    <p className="text-xs text-[var(--color-steel)]">5 clients need data refresh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ClientPortfolioDashboard;
