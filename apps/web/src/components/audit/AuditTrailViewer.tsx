'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Search,
    Filter,
    Download,
    User,
    FileText,
    Settings,
    Database,
    Shield,
    Eye,
    Edit2,
    Trash2,
    Plus,
    LogIn,
    LogOut,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    Building2,
    X
} from 'lucide-react';

interface AuditTrailViewerProps {
    className?: string;
}

interface AuditEntry {
    id: string;
    timestamp: string;
    user: {
        name: string;
        email: string;
        role: string;
    };
    action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'approve';
    resource: string;
    resourceType: 'employee' | 'form' | 'organization' | 'user' | 'setting' | 'report';
    details: string;
    ipAddress: string;
    changes?: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
    organization?: string;
}

const mockAuditEntries: AuditEntry[] = [
    { id: 'a1', timestamp: '2026-01-28 14:35:22', user: { name: 'Sarah Johnson', email: 'sjohnson@company.com', role: 'HR Admin' }, action: 'update', resource: 'Employee #E001', resourceType: 'employee', details: 'Updated employee coverage information', ipAddress: '192.168.1.45', changes: [{ field: 'Coverage Level', oldValue: 'Employee Only', newValue: 'Employee + Family' }], organization: 'Acme Corp' },
    { id: 'a2', timestamp: '2026-01-28 14:22:15', user: { name: 'Michael Chen', email: 'mchen@company.com', role: 'Compliance Officer' }, action: 'export', resource: '1095-C Forms Batch', resourceType: 'report', details: 'Exported 4,256 1095-C forms for distribution', ipAddress: '192.168.1.67', organization: 'Acme Corp' },
    { id: 'a3', timestamp: '2026-01-28 13:55:08', user: { name: 'Emily Davis', email: 'edavis@company.com', role: 'System Admin' }, action: 'update', resource: 'System Settings', resourceType: 'setting', details: 'Modified ACA measurement period configuration', ipAddress: '10.0.0.15', changes: [{ field: 'Standard Measurement Period', oldValue: '12 months', newValue: '11 months' }] },
    { id: 'a4', timestamp: '2026-01-28 12:45:33', user: { name: 'James Wilson', email: 'jwilson@company.com', role: 'HR Manager' }, action: 'approve', resource: 'Form 1094-C', resourceType: 'form', details: 'Approved annual 1094-C filing for TY 2025', ipAddress: '192.168.1.89', organization: 'TechStart Inc' },
    { id: 'a5', timestamp: '2026-01-28 11:30:00', user: { name: 'Sarah Johnson', email: 'sjohnson@company.com', role: 'HR Admin' }, action: 'create', resource: 'Employee #E4257', resourceType: 'employee', details: 'Created new employee record', ipAddress: '192.168.1.45', organization: 'Acme Corp' },
    { id: 'a6', timestamp: '2026-01-28 10:15:42', user: { name: 'Admin Bot', email: 'system@synapse.io', role: 'System' }, action: 'login', resource: 'Scheduled Job', resourceType: 'user', details: 'Automated sync job initiated', ipAddress: '127.0.0.1' },
    { id: 'a7', timestamp: '2026-01-28 09:22:18', user: { name: 'Michael Chen', email: 'mchen@company.com', role: 'Compliance Officer' }, action: 'view', resource: 'Penalty Exposure Report', resourceType: 'report', details: 'Accessed penalty exposure analysis for Q4 2025', ipAddress: '192.168.1.67', organization: 'All Organizations' },
    { id: 'a8', timestamp: '2026-01-28 08:45:00', user: { name: 'Emily Davis', email: 'edavis@company.com', role: 'System Admin' }, action: 'delete', resource: 'Test Organization', resourceType: 'organization', details: 'Removed test organization from production', ipAddress: '10.0.0.15' },
    { id: 'a9', timestamp: '2026-01-27 17:30:55', user: { name: 'James Wilson', email: 'jwilson@company.com', role: 'HR Manager' }, action: 'logout', resource: 'User Session', resourceType: 'user', details: 'User logged out', ipAddress: '192.168.1.89' },
    { id: 'a10', timestamp: '2026-01-27 16:15:30', user: { name: 'Sarah Johnson', email: 'sjohnson@company.com', role: 'HR Admin' }, action: 'update', resource: 'Organization Settings', resourceType: 'organization', details: 'Updated EIN and contact information', ipAddress: '192.168.1.45', changes: [{ field: 'Contact Email', oldValue: 'hr@acme.com', newValue: 'benefits@acme.com' }], organization: 'Acme Corp' },
];

const actionConfig: Record<string, { icon: typeof Edit2; color: string; bgColor: string; label: string }> = {
    create: { icon: Plus, color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]', label: 'Create' },
    update: { icon: Edit2, color: 'text-blue-400', bgColor: 'bg-[rgba(59,130,246,0.1)]', label: 'Update' },
    delete: { icon: Trash2, color: 'text-[var(--color-critical)]', bgColor: 'bg-[rgba(239,68,68,0.1)]', label: 'Delete' },
    view: { icon: Eye, color: 'text-[var(--color-steel)]', bgColor: 'bg-[rgba(255,255,255,0.05)]', label: 'View' },
    login: { icon: LogIn, color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]', label: 'Login' },
    logout: { icon: LogOut, color: 'text-[var(--color-warning)]', bgColor: 'bg-[rgba(245,158,11,0.1)]', label: 'Logout' },
    export: { icon: Download, color: 'text-purple-400', bgColor: 'bg-[rgba(139,92,246,0.1)]', label: 'Export' },
    approve: { icon: Shield, color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]', label: 'Approve' },
};

const resourceTypeConfig: Record<string, { icon: typeof User; color: string }> = {
    employee: { icon: User, color: 'text-blue-400' },
    form: { icon: FileText, color: 'text-purple-400' },
    organization: { icon: Building2, color: 'text-[var(--color-synapse-teal)]' },
    user: { icon: User, color: 'text-[var(--color-warning)]' },
    setting: { icon: Settings, color: 'text-[var(--color-steel)]' },
    report: { icon: FileText, color: 'text-pink-400' },
};

export function AuditTrailViewer({ className = '' }: AuditTrailViewerProps) {
    const [entries] = useState<AuditEntry[]>(mockAuditEntries);
    const [expandedEntries, setExpandedEntries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');
    const [filterResourceType, setFilterResourceType] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const toggleExpand = (id: string) => {
        setExpandedEntries(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const filteredEntries = entries.filter(entry => {
        const matchesSearch =
            entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAction = filterAction === 'all' || entry.action === filterAction;
        const matchesResourceType = filterResourceType === 'all' || entry.resourceType === filterResourceType;
        return matchesSearch && matchesAction && matchesResourceType;
    });

    const stats = {
        total: entries.length,
        creates: entries.filter(e => e.action === 'create').length,
        updates: entries.filter(e => e.action === 'update').length,
        deletes: entries.filter(e => e.action === 'delete').length,
        exports: entries.filter(e => e.action === 'export').length,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Audit Trail</h2>
                            <p className="text-xs text-[var(--color-steel)]">Complete activity log and change history</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'border-[var(--color-synapse-teal)]' : ''}`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <button className="btn-primary flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Log
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Events</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Creates</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.creates}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Updates</p>
                        <p className="text-xl font-bold text-blue-400">{stats.updates}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Deletes</p>
                        <p className="text-xl font-bold text-[var(--color-critical)]">{stats.deletes}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Exports</p>
                        <p className="text-xl font-bold text-purple-400">{stats.exports}</p>
                    </div>
                </div>
            </div>

            {/* Search and Advanced Filters */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by user, resource, or details..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                        />
                    </div>
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="px-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    >
                        <option value="all">All Actions</option>
                        <option value="create">Create</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                        <option value="view">View</option>
                        <option value="export">Export</option>
                        <option value="approve">Approve</option>
                    </select>
                    <select
                        value={filterResourceType}
                        onChange={(e) => setFilterResourceType(e.target.value)}
                        className="px-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    >
                        <option value="all">All Resources</option>
                        <option value="employee">Employees</option>
                        <option value="form">Forms</option>
                        <option value="organization">Organizations</option>
                        <option value="user">Users</option>
                        <option value="setting">Settings</option>
                        <option value="report">Reports</option>
                    </select>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">User</label>
                                    <select className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="all">All Users</option>
                                        <option value="sjohnson">Sarah Johnson</option>
                                        <option value="mchen">Michael Chen</option>
                                        <option value="edavis">Emily Davis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Organization</label>
                                    <select className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="all">All Organizations</option>
                                        <option value="acme">Acme Corp</option>
                                        <option value="techstart">TechStart Inc</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Audit Entries */}
            <div className="divide-y divide-[var(--glass-border)] max-h-[600px] overflow-y-auto">
                {filteredEntries.map((entry, index) => {
                    const actionCfg = actionConfig[entry.action];
                    const ActionIcon = actionCfg.icon;
                    const resourceCfg = resourceTypeConfig[entry.resourceType];
                    const ResourceIcon = resourceCfg.icon;
                    const isExpanded = expandedEntries.includes(entry.id);

                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Action Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionCfg.bgColor}`}>
                                        <ActionIcon className={`w-5 h-5 ${actionCfg.color}`} />
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{entry.user.name}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${actionCfg.bgColor} ${actionCfg.color}`}>
                                                {actionCfg.label}
                                            </span>
                                            <div className="flex items-center gap-1 text-[var(--color-steel)]">
                                                <ResourceIcon className={`w-3 h-3 ${resourceCfg.color}`} />
                                                <span className="text-sm text-white">{entry.resource}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)]">{entry.details}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-steel)]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {entry.timestamp}
                                            </span>
                                            <span>{entry.ipAddress}</span>
                                            {entry.organization && (
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {entry.organization}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expand Button */}
                                    {entry.changes && entry.changes.length > 0 && (
                                        <button
                                            onClick={() => toggleExpand(entry.id)}
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>

                                {/* Change Details */}
                                <AnimatePresence>
                                    {isExpanded && entry.changes && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 ml-14 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                                <p className="text-xs font-medium text-[var(--color-steel)] mb-3">Change Details</p>
                                                <div className="space-y-2">
                                                    {entry.changes.map((change, i) => (
                                                        <div key={i} className="flex items-center gap-4">
                                                            <span className="text-sm text-[var(--color-silver)] w-40">{change.field}</span>
                                                            <span className="text-sm text-[var(--color-critical)] line-through">{change.oldValue}</span>
                                                            <span className="text-xs text-[var(--color-steel)]">→</span>
                                                            <span className="text-sm text-[var(--color-success)]">{change.newValue}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredEntries.length === 0 && (
                <div className="p-12 text-center">
                    <History className="w-12 h-12 mx-auto mb-4 text-[var(--color-steel)]" />
                    <p className="text-[var(--color-steel)]">No audit entries found matching your filters</p>
                </div>
            )}
        </motion.div>
    );
}

export default AuditTrailViewer;
