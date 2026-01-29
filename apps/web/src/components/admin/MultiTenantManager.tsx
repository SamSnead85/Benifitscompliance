'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Users,
    Settings,
    Shield,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    MapPin,
    Calendar,
    FileText,
    TrendingUp,
    X
} from 'lucide-react';

interface MultiTenantManagerProps {
    className?: string;
}

interface Tenant {
    id: string;
    name: string;
    ein: string;
    status: 'active' | 'pending' | 'suspended';
    employees: number;
    ftEligible: number;
    complianceScore: number;
    location: string;
    addedDate: string;
    lastSync: string;
    plan: 'enterprise' | 'professional' | 'starter';
}

const mockTenants: Tenant[] = [
    { id: 't1', name: 'Acme Corporation', ein: '12-3456789', status: 'active', employees: 2456, ftEligible: 2210, complianceScore: 99.2, location: 'New York, NY', addedDate: 'Jan 2024', lastSync: '5 min ago', plan: 'enterprise' },
    { id: 't2', name: 'TechStart Inc', ein: '98-7654321', status: 'active', employees: 890, ftEligible: 801, complianceScore: 98.1, location: 'San Francisco, CA', addedDate: 'Mar 2024', lastSync: '1 hour ago', plan: 'professional' },
    { id: 't3', name: 'Global Services LLC', ein: '45-6789012', status: 'active', employees: 567, ftEligible: 510, complianceScore: 97.5, location: 'Chicago, IL', addedDate: 'Jun 2024', lastSync: '2 hours ago', plan: 'professional' },
    { id: 't4', name: 'Innovation Labs', ein: '78-9012345', status: 'active', employees: 343, ftEligible: 309, complianceScore: 99.8, location: 'Austin, TX', addedDate: 'Sep 2024', lastSync: '30 min ago', plan: 'starter' },
    { id: 't5', name: 'New Client Corp', ein: '11-2233445', status: 'pending', employees: 0, ftEligible: 0, complianceScore: 0, location: 'Miami, FL', addedDate: 'Jan 2026', lastSync: '-', plan: 'professional' },
];

const planColors: Record<string, { bg: string; text: string }> = {
    enterprise: { bg: 'bg-[rgba(139,92,246,0.1)]', text: 'text-purple-400' },
    professional: { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]' },
    starter: { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]' },
};

export function MultiTenantManager({ className = '' }: MultiTenantManagerProps) {
    const [tenants] = useState<Tenant[]>(mockTenants);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredTenants = tenants.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.ein.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: tenants.length,
        active: tenants.filter(t => t.status === 'active').length,
        totalEmployees: tenants.reduce((acc, t) => acc + t.employees, 0),
        avgCompliance: Math.round(tenants.filter(t => t.status === 'active').reduce((acc, t) => acc + t.complianceScore, 0) / tenants.filter(t => t.status === 'active').length * 10) / 10,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Multi-Tenant Management</h2>
                            <p className="text-xs text-[var(--color-steel)]">Manage organizations and client accounts</p>
                        </div>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Organization
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Organizations</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Active</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.active}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Employees</p>
                        <p className="text-xl font-bold text-blue-400">{stats.totalEmployees.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Avg Compliance</p>
                        <p className="text-xl font-bold text-[var(--color-synapse-teal)]">{stats.avgCompliance}%</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search organizations..." className="w-full pl-10 pr-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]" />
                </div>
                <div className="flex items-center gap-1">
                    {['all', 'active', 'pending', 'suspended'].map(status => (
                        <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${filterStatus === status ? 'bg-[var(--color-synapse-teal)] text-black' : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'}`}>
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tenant List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {filteredTenants.map((tenant, index) => (
                    <motion.div key={tenant.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="p-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-[var(--color-synapse-teal)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-white">{tenant.name}</h4>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${tenant.status === 'active' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' : tenant.status === 'pending' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'}`}>
                                        {tenant.status}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${planColors[tenant.plan].bg} ${planColors[tenant.plan].text}`}>
                                        {tenant.plan}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[var(--color-steel)]">
                                    <span>EIN: {tenant.ein}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tenant.location}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Added {tenant.addedDate}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">{tenant.employees.toLocaleString()}</p>
                                    <p className="text-xs text-[var(--color-steel)]">Employees</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">{tenant.ftEligible.toLocaleString()}</p>
                                    <p className="text-xs text-[var(--color-steel)]">FT Eligible</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-medium ${tenant.complianceScore >= 98 ? 'text-[var(--color-success)]' : tenant.complianceScore >= 95 ? 'text-[var(--color-warning)]' : 'text-[var(--color-critical)]'}`}>
                                        {tenant.complianceScore > 0 ? `${tenant.complianceScore}%` : '-'}
                                    </p>
                                    <p className="text-xs text-[var(--color-steel)]">Compliance</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Add Organization</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Organization Name</label>
                                    <input type="text" placeholder="Enter organization name" className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">EIN</label>
                                    <input type="text" placeholder="XX-XXXXXXX" className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Plan</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="starter">Starter</option>
                                        <option value="professional">Professional</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                                <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Organization</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default MultiTenantManager;
