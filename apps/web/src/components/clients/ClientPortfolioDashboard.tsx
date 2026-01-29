'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Users,
    BarChart3,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';

interface Client {
    id: string;
    name: string;
    ein: string;
    employees: number;
    complianceScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    trend: 'up' | 'down' | 'stable';
    lastSync: string;
    pendingForms: number;
    tags?: string[];
}

interface ClientPortfolioDashboardProps {
    clients?: Client[];
    className?: string;
}

const defaultClients: Client[] = [
    { id: '1', name: 'Acme Corporation', ein: '12-3456789', employees: 4521, complianceScore: 98.5, riskLevel: 'low', trend: 'up', lastSync: '2 hours ago', pendingForms: 0, tags: ['Enterprise', 'Healthcare'] },
    { id: '2', name: 'TechStart Inc.', ein: '98-7654321', employees: 287, complianceScore: 94.2, riskLevel: 'low', trend: 'stable', lastSync: '1 day ago', pendingForms: 12, tags: ['SMB', 'Tech'] },
    { id: '3', name: 'Global Retail Group', ein: '45-6789012', employees: 8934, complianceScore: 87.3, riskLevel: 'medium', trend: 'down', lastSync: '5 hours ago', pendingForms: 45, tags: ['Enterprise', 'Retail'] },
    { id: '4', name: 'HealthCare Partners', ein: '67-8901234', employees: 2156, complianceScore: 91.8, riskLevel: 'low', trend: 'up', lastSync: '12 hours ago', pendingForms: 8, tags: ['Healthcare'] },
    { id: '5', name: 'Manufacturing Co.', ein: '23-4567890', employees: 1543, complianceScore: 72.4, riskLevel: 'high', trend: 'down', lastSync: '3 days ago', pendingForms: 89, tags: ['Manufacturing'] },
];

const riskConfig = {
    low: { color: 'var(--color-success)', label: 'Low Risk' },
    medium: { color: 'var(--color-warning)', label: 'Medium Risk' },
    high: { color: 'var(--color-critical)', label: 'High Risk' }
};

export function ClientPortfolioDashboard({
    clients = defaultClients,
    className = ''
}: ClientPortfolioDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRisk, setSelectedRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'score' | 'employees'>('score');

    const totalEmployees = clients.reduce((sum, c) => sum + c.employees, 0);
    const avgScore = clients.reduce((sum, c) => sum + c.complianceScore, 0) / clients.length;
    const atRiskClients = clients.filter(c => c.riskLevel === 'high').length;

    const filteredClients = clients
        .filter(c => {
            if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (selectedRisk !== 'all' && c.riskLevel !== selectedRisk) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'score') return b.complianceScore - a.complianceScore;
            if (sortBy === 'employees') return b.employees - a.employees;
            return a.name.localeCompare(b.name);
        });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Client Portfolio</h3>
                </div>
                <span className="text-sm text-[var(--color-steel)]">{clients.length} Clients</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Total Employees</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{totalEmployees.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs">Avg Compliance</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-synapse-teal)] font-mono">{avgScore.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Low Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-success)] font-mono">
                        {clients.filter(c => c.riskLevel === 'low').length}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
                    <div className="flex items-center gap-2 text-[var(--color-critical)] mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">At Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-critical)] font-mono">{atRiskClients}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    {(['all', 'low', 'medium', 'high'] as const).map((risk) => (
                        <button
                            key={risk}
                            onClick={() => setSelectedRisk(risk)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedRisk === risk
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {risk.charAt(0).toUpperCase() + risk.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client List */}
            <div className="space-y-2">
                {filteredClients.map((client, i) => {
                    const risk = riskConfig[client.riskLevel];

                    return (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] cursor-pointer transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Risk Indicator */}
                                <div
                                    className="w-2 h-12 rounded-full"
                                    style={{ backgroundColor: risk.color }}
                                />

                                {/* Client Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{client.name}</span>
                                        <span className="text-xs text-[var(--color-steel)]">{client.ein}</span>
                                        {client.tags?.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <span>{client.employees.toLocaleString()} employees</span>
                                        <span>•</span>
                                        <span>Synced {client.lastSync}</span>
                                        {client.pendingForms > 0 && (
                                            <>
                                                <span>•</span>
                                                <span className="text-[var(--color-warning)]">
                                                    {client.pendingForms} pending forms
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xl font-bold text-white font-mono">
                                            {client.complianceScore}%
                                        </span>
                                        {client.trend === 'up' && <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />}
                                        {client.trend === 'down' && <TrendingDown className="w-4 h-4 text-[var(--color-critical)]" />}
                                    </div>
                                    <span
                                        className="text-xs"
                                        style={{ color: risk.color }}
                                    >
                                        {risk.label}
                                    </span>
                                </div>

                                <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default ClientPortfolioDashboard;
