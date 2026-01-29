'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Settings,
    Users,
    Database,
    Activity,
    Shield,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Zap,
    Globe,
    Lock,
    Unlock,
    Pause,
    Play,
    Trash2,
    Edit,
    ExternalLink
} from 'lucide-react';

interface TenantManagerProps {
    className?: string;
}

interface Tenant {
    id: string;
    name: string;
    ein: string;
    status: 'active' | 'suspended' | 'pending' | 'trial';
    employeeCount: number;
    storageUsedGB: number;
    storageLimitGB: number;
    complianceScore: number;
    lastActivity: string;
    plan: 'enterprise' | 'professional' | 'standard' | 'trial';
    createdAt: string;
    adminEmail: string;
}

const mockTenants: Tenant[] = [
    {
        id: 't1',
        name: 'Acme Corporation',
        ein: '12-3456789',
        status: 'active',
        employeeCount: 4256,
        storageUsedGB: 12.4,
        storageLimitGB: 50,
        complianceScore: 98,
        lastActivity: '2 minutes ago',
        plan: 'enterprise',
        createdAt: '2025-01-15',
        adminEmail: 'admin@acmecorp.com'
    },
    {
        id: 't2',
        name: 'TechStart Inc.',
        ein: '98-7654321',
        status: 'active',
        employeeCount: 892,
        storageUsedGB: 3.2,
        storageLimitGB: 20,
        complianceScore: 95,
        lastActivity: '1 hour ago',
        plan: 'professional',
        createdAt: '2025-03-22',
        adminEmail: 'hr@techstart.io'
    },
    {
        id: 't3',
        name: 'Global Manufacturing LLC',
        ein: '45-6789012',
        status: 'active',
        employeeCount: 8421,
        storageUsedGB: 28.7,
        storageLimitGB: 100,
        complianceScore: 92,
        lastActivity: '30 minutes ago',
        plan: 'enterprise',
        createdAt: '2024-11-08',
        adminEmail: 'benefits@globalmfg.com'
    },
    {
        id: 't4',
        name: 'Sunrise Healthcare',
        ein: '34-5678901',
        status: 'suspended',
        employeeCount: 2134,
        storageUsedGB: 8.1,
        storageLimitGB: 25,
        complianceScore: 78,
        lastActivity: '5 days ago',
        plan: 'professional',
        createdAt: '2025-02-14',
        adminEmail: 'compliance@sunrisehealth.org'
    },
    {
        id: 't5',
        name: 'NextGen Retail',
        ein: '23-4567890',
        status: 'trial',
        employeeCount: 156,
        storageUsedGB: 0.4,
        storageLimitGB: 5,
        complianceScore: 85,
        lastActivity: '3 hours ago',
        plan: 'trial',
        createdAt: '2026-01-20',
        adminEmail: 'demo@nextgenretail.com'
    },
    {
        id: 't6',
        name: 'Premier Financial Services',
        ein: '56-7890123',
        status: 'pending',
        employeeCount: 0,
        storageUsedGB: 0,
        storageLimitGB: 50,
        complianceScore: 0,
        lastActivity: 'Never',
        plan: 'enterprise',
        createdAt: '2026-01-28',
        adminEmail: 'onboarding@premierfinancial.com'
    }
];

function getStatusBadge(status: string) {
    switch (status) {
        case 'active':
            return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', border: 'border-[rgba(16,185,129,0.3)]', icon: CheckCircle2 };
        case 'suspended':
            return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]', icon: AlertTriangle };
        case 'pending':
            return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]', icon: Clock };
        case 'trial':
            return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', border: 'border-[rgba(6,182,212,0.3)]', icon: Zap };
        default:
            return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]', icon: Clock };
    }
}

function getPlanBadge(plan: string) {
    switch (plan) {
        case 'enterprise': return 'bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] text-black';
        case 'professional': return 'bg-[var(--color-synapse-amber)] text-black';
        case 'standard': return 'bg-[var(--color-silver)] text-black';
        case 'trial': return 'bg-[rgba(255,255,255,0.1)] text-[var(--color-silver)]';
        default: return 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]';
    }
}

export function TenantManager({ className = '' }: TenantManagerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
    const [showProvisionModal, setShowProvisionModal] = useState(false);

    const stats = {
        total: mockTenants.length,
        active: mockTenants.filter(t => t.status === 'active').length,
        suspended: mockTenants.filter(t => t.status === 'suspended').length,
        totalEmployees: mockTenants.reduce((acc, t) => acc + t.employeeCount, 0),
        totalStorageGB: mockTenants.reduce((acc, t) => acc + t.storageUsedGB, 0)
    };

    const filteredTenants = mockTenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tenant.ein.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-amber)] to-[var(--color-synapse-coral)] flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-white">Tenant Manager</h1>
                            <p className="text-sm text-[var(--color-steel)]">Multi-organization management console</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowProvisionModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Provision New Tenant
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-5 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Total Tenants</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-success)] mb-1">Active</p>
                        <p className="text-2xl font-bold text-[var(--color-success)]">{stats.active}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <p className="text-xs text-[var(--color-critical)] mb-1">Suspended</p>
                        <p className="text-2xl font-bold text-[var(--color-critical)]">{stats.suspended}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Total Employees</p>
                        <p className="text-2xl font-bold text-white">{stats.totalEmployees.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Storage Used</p>
                        <p className="text-2xl font-bold text-white">{stats.totalStorageGB.toFixed(1)} GB</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search by name or EIN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['all', 'active', 'suspended', 'pending', 'trial'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${statusFilter === status
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[rgba(255,255,255,0.03)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.08)]'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tenant List */}
            <div className="glass-card overflow-hidden">
                <table className="data-table w-full">
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Status</th>
                            <th>Plan</th>
                            <th>Employees</th>
                            <th>Storage</th>
                            <th>Compliance</th>
                            <th>Last Activity</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTenants.map((tenant, index) => {
                            const statusStyle = getStatusBadge(tenant.status);
                            const StatusIcon = statusStyle.icon;
                            const storagePercent = (tenant.storageUsedGB / tenant.storageLimitGB) * 100;

                            return (
                                <motion.tr
                                    key={tenant.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`group cursor-pointer ${selectedTenant === tenant.id ? 'bg-[var(--color-synapse-teal-muted)]' : ''}`}
                                    onClick={() => setSelectedTenant(selectedTenant === tenant.id ? null : tenant.id)}
                                >
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center text-black font-bold text-sm">
                                                {tenant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white group-hover:text-[var(--color-synapse-teal)] transition-colors">
                                                    {tenant.name}
                                                </p>
                                                <p className="text-xs text-[var(--color-steel)]">EIN: {tenant.ein}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getPlanBadge(tenant.plan)}`}>
                                            {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[var(--color-steel)]" />
                                            <span className="text-[var(--color-silver)]">{tenant.employeeCount.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="w-32">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-[var(--color-silver)]">{tenant.storageUsedGB.toFixed(1)} GB</span>
                                                <span className="text-[var(--color-steel)]">/ {tenant.storageLimitGB} GB</span>
                                            </div>
                                            <div className="h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${storagePercent > 80 ? 'bg-[var(--color-critical)]' : storagePercent > 60 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-synapse-teal)]'}`}
                                                    style={{ width: `${Math.min(storagePercent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tenant.complianceScore >= 90
                                                ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                                : tenant.complianceScore >= 75
                                                    ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                    : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                                }`}>
                                                {tenant.complianceScore || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-[var(--color-silver)]">
                                        {tenant.lastActivity}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)] hover:text-white transition-colors" title="Settings">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)] hover:text-white transition-colors" title="Open">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredTenants.length === 0 && (
                    <div className="p-12 text-center">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-[var(--color-steel)]" />
                        <p className="text-[var(--color-silver)]">No tenants match your search criteria</p>
                    </div>
                )}
            </div>

            {/* Provision Modal */}
            <AnimatePresence>
                {showProvisionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowProvisionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)]">
                                <h2 className="text-lg font-semibold text-white">Provision New Tenant</h2>
                                <p className="text-sm text-[var(--color-steel)]">Create a new organization workspace</p>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Organization Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter organization name..."
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">EIN (Employer Identification Number)</label>
                                    <input
                                        type="text"
                                        placeholder="XX-XXXXXXX"
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Admin Email</label>
                                    <input
                                        type="email"
                                        placeholder="admin@organization.com"
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Plan</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Enterprise', 'Professional', 'Standard'].map(plan => (
                                            <button
                                                key={plan}
                                                className="p-3 text-sm font-medium rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[var(--color-synapse-teal)] transition-colors"
                                            >
                                                {plan}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button
                                    onClick={() => setShowProvisionModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button className="btn-primary">
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Create Tenant
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default TenantManager;
