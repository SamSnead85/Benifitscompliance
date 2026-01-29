'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Plus,
    Building2,
    Users,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    ChevronRight,
    Filter,
    ArrowUpDown,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

// Sample client data
const clients = [
    {
        id: '1',
        name: 'Apex Manufacturing Corp',
        ein: '12-3456789',
        employees: 2340,
        fteCount: 2180,
        status: 'compliant',
        dataQuality: 98,
        lastSync: '2 hours ago',
        syncStatus: 'connected',
        openRisks: 0
    },
    {
        id: '2',
        name: 'Horizon Healthcare Systems',
        ein: '98-7654321',
        employees: 1820,
        fteCount: 1650,
        status: 'at_risk',
        dataQuality: 87,
        lastSync: '4 hours ago',
        syncStatus: 'connected',
        openRisks: 3
    },
    {
        id: '3',
        name: 'Summit Logistics LLC',
        ein: '45-6789012',
        employees: 890,
        fteCount: 720,
        status: 'compliant',
        dataQuality: 95,
        lastSync: '6 hours ago',
        syncStatus: 'connected',
        openRisks: 0
    },
    {
        id: '4',
        name: 'Coastal Energy Partners',
        ein: '78-9012345',
        employees: 1560,
        fteCount: 1420,
        status: 'pending_review',
        dataQuality: 76,
        lastSync: '1 day ago',
        syncStatus: 'error',
        openRisks: 5
    },
    {
        id: '5',
        name: 'Metro Services Group',
        ein: '34-5678901',
        employees: 3200,
        fteCount: 2890,
        status: 'compliant',
        dataQuality: 92,
        lastSync: '3 hours ago',
        syncStatus: 'connected',
        openRisks: 1
    },
    {
        id: '6',
        name: 'TechVentures Inc',
        ein: '67-8901234',
        employees: 450,
        fteCount: 380,
        status: 'non_compliant',
        dataQuality: 65,
        lastSync: '3 days ago',
        syncStatus: 'disconnected',
        openRisks: 8
    },
];

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
        compliant: { label: 'Compliant', className: 'badge--success', icon: CheckCircle2 },
        at_risk: { label: 'At Risk', className: 'badge--warning', icon: AlertTriangle },
        non_compliant: { label: 'Non-Compliant', className: 'badge--critical', icon: XCircle },
        pending_review: { label: 'Pending', className: 'badge--info', icon: Clock },
    };

    const { label, className, icon: Icon } = config[status] || config.pending_review;

    return (
        <span className={`badge ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function SyncStatusIndicator({ status }: { status: string }) {
    const config: Record<string, { className: string; label: string }> = {
        connected: { className: 'bg-[var(--color-success)]', label: 'Connected' },
        syncing: { className: 'bg-[var(--color-synapse-teal)] animate-pulse', label: 'Syncing' },
        error: { className: 'bg-[var(--color-warning)]', label: 'Error' },
        disconnected: { className: 'bg-[var(--color-critical)]', label: 'Disconnected' },
    };

    const { className, label } = config[status] || config.disconnected;

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${className}`} />
            <span className="text-xs text-[var(--color-steel)]">{label}</span>
        </div>
    );
}

function DataQualityBar({ score }: { score: number }) {
    const color = score >= 90 ? 'var(--color-success)' : score >= 75 ? 'var(--color-warning)' : 'var(--color-critical)';

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-xs font-mono text-[var(--color-silver)]">{score}%</span>
        </div>
    );
}

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.ein.includes(searchQuery);
        const matchesStatus = !selectedStatus || client.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const statusFilters = [
        { value: null, label: 'All' },
        { value: 'compliant', label: 'Compliant' },
        { value: 'at_risk', label: 'At Risk' },
        { value: 'pending_review', label: 'Pending' },
        { value: 'non_compliant', label: 'Non-Compliant' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clients</h1>
                    <p className="text-[var(--color-steel)] mt-1">Manage your client portfolio and compliance status</p>
                </div>
                <Link href="/onboard" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Client
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search by name or EIN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-white placeholder-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    <div className="flex rounded-lg overflow-hidden border border-[var(--glass-border)]">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value || 'all'}
                                onClick={() => setSelectedStatus(filter.value)}
                                className={`px-4 py-2 text-sm transition-colors ${selectedStatus === filter.value
                                        ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]'
                                        : 'bg-[var(--glass-bg-light)] text-[var(--color-silver)] hover:text-white'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client Cards Grid */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
            >
                {filteredClients.map((client) => (
                    <motion.div
                        key={client.id}
                        variants={fadeInUp}
                        className="glass-card p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {/* Left: Client Info */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-[var(--color-void)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Link
                                            href={`/clients/${client.id}`}
                                            className="text-lg font-semibold text-white hover:text-[var(--color-synapse-teal)] transition-colors"
                                        >
                                            {client.name}
                                        </Link>
                                        <StatusBadge status={client.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-steel)]">
                                        <span>EIN: {client.ein}</span>
                                        <span>•</span>
                                        <SyncStatusIndicator status={client.syncStatus} />
                                        <span>•</span>
                                        <span>Last sync: {client.lastSync}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Metrics */}
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white font-mono">{client.employees.toLocaleString()}</div>
                                    <div className="text-xs text-[var(--color-steel)]">Employees</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white font-mono">{client.fteCount.toLocaleString()}</div>
                                    <div className="text-xs text-[var(--color-steel)]">FTEs</div>
                                </div>
                                <div className="w-24">
                                    <div className="text-xs text-[var(--color-steel)] mb-1">Data Quality</div>
                                    <DataQualityBar score={client.dataQuality} />
                                </div>
                                {client.openRisks > 0 && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[var(--color-warning)] font-mono">{client.openRisks}</div>
                                        <div className="text-xs text-[var(--color-steel)]">Open Risks</div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5 text-[var(--color-steel)]" />
                                    </button>

                                    {openMenuId === client.id && (
                                        <div className="absolute right-0 top-full mt-2 w-48 p-2 rounded-lg glass-strong border border-[var(--glass-border)] z-10">
                                            <Link
                                                href={`/clients/${client.id}`}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)] hover:text-white transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Link>
                                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)] hover:text-white transition-colors">
                                                <RefreshCw className="w-4 h-4" />
                                                Sync Now
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)] hover:text-white transition-colors">
                                                <Edit className="w-4 h-4" />
                                                Edit Client
                                            </button>
                                            <hr className="my-2 border-[var(--glass-border)]" />
                                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-coral)] hover:bg-[var(--glass-bg-light)] transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/clients/${client.id}`}
                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredClients.length === 0 && (
                <div className="text-center py-16">
                    <Building2 className="w-12 h-12 text-[var(--color-steel)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
                    <p className="text-[var(--color-steel)] mb-6">Try adjusting your search or filters</p>
                    <Link href="/onboard" className="btn-primary inline-flex">
                        <Plus className="w-4 h-4" />
                        Add Your First Client
                    </Link>
                </div>
            )}
        </div>
    );
}
