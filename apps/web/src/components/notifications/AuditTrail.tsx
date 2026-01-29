'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    History,
    User,
    FileText,
    Settings,
    Edit2,
    Trash2,
    Download,
    Upload,
    Eye,
    Shield,
    Search,
    Calendar,
    Filter,
    ChevronDown
} from 'lucide-react';

interface AuditEntry {
    id: string;
    timestamp: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'login' | 'settings';
    resource: string;
    resourceId?: string;
    details: string;
    ipAddress: string;
    userAgent: string;
}

interface AuditTrailProps {
    entries?: AuditEntry[];
    className?: string;
}

const defaultEntries: AuditEntry[] = [
    {
        id: 'audit-001',
        timestamp: 'Jan 28, 2026 10:45 AM',
        user: { name: 'Sarah Mitchell', email: 'sarah.m@company.com' },
        action: 'export',
        resource: 'Form 1095-C',
        resourceId: 'BATCH-2026-001',
        details: 'Exported 4,521 forms as PDF',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 122.0 / macOS'
    },
    {
        id: 'audit-002',
        timestamp: 'Jan 28, 2026 10:30 AM',
        user: { name: 'Michael Chen', email: 'michael.c@company.com' },
        action: 'update',
        resource: 'Employee',
        resourceId: 'EMP-1234',
        details: 'Updated coverage status from "Pending" to "Covered"',
        ipAddress: '192.168.1.105',
        userAgent: 'Safari 17.0 / macOS'
    },
    {
        id: 'audit-003',
        timestamp: 'Jan 28, 2026 10:15 AM',
        user: { name: 'Emily Davis', email: 'emily.d@company.com' },
        action: 'create',
        resource: 'Report',
        resourceId: 'RPT-2026-045',
        details: 'Generated monthly compliance summary',
        ipAddress: '192.168.1.110',
        userAgent: 'Firefox 121.0 / Windows'
    },
    {
        id: 'audit-004',
        timestamp: 'Jan 28, 2026 09:45 AM',
        user: { name: 'James Wilson', email: 'james.w@company.com' },
        action: 'import',
        resource: 'Employee Data',
        details: 'Imported 2,145 records from Gusto HRIS',
        ipAddress: '192.168.1.115',
        userAgent: 'Chrome 122.0 / Windows'
    },
    {
        id: 'audit-005',
        timestamp: 'Jan 28, 2026 09:30 AM',
        user: { name: 'Lisa Thompson', email: 'lisa.t@company.com' },
        action: 'settings',
        resource: 'Notification Preferences',
        details: 'Enabled email notifications for form errors',
        ipAddress: '192.168.1.120',
        userAgent: 'Edge 121.0 / Windows'
    },
    {
        id: 'audit-006',
        timestamp: 'Jan 28, 2026 09:00 AM',
        user: { name: 'Admin User', email: 'admin@company.com' },
        action: 'login',
        resource: 'System',
        details: 'Successful login from new device',
        ipAddress: '192.168.1.125',
        userAgent: 'Chrome 122.0 / macOS'
    }
];

const actionConfig = {
    create: { icon: FileText, color: 'var(--color-success)', label: 'Created' },
    update: { icon: Edit2, color: 'var(--color-synapse-cyan)', label: 'Updated' },
    delete: { icon: Trash2, color: 'var(--color-critical)', label: 'Deleted' },
    view: { icon: Eye, color: 'var(--color-steel)', label: 'Viewed' },
    export: { icon: Download, color: 'var(--color-synapse-gold)', label: 'Exported' },
    import: { icon: Upload, color: 'var(--color-synapse-teal)', label: 'Imported' },
    login: { icon: Shield, color: 'var(--color-synapse-cyan)', label: 'Login' },
    settings: { icon: Settings, color: 'var(--color-warning)', label: 'Settings' }
};

export function AuditTrail({
    entries = defaultEntries,
    className = ''
}: AuditTrailProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');
    const [dateRange, setDateRange] = useState('7d');
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

    const filteredEntries = entries.filter(e => {
        if (searchQuery && !e.details.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !e.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterAction !== 'all' && e.action !== filterAction) return false;
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <h3 className="font-semibold text-white">Audit Trail</h3>
                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                            {entries.length} entries
                        </span>
                    </div>
                    <button className="btn-secondary text-sm">
                        <Download className="w-4 h-4" />
                        Export Log
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search activity..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="all">All Actions</option>
                        {Object.entries(actionConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Entries List */}
            <div className="max-h-[500px] overflow-y-auto">
                {filteredEntries.map((entry, i) => {
                    const action = actionConfig[entry.action];
                    const ActionIcon = action.icon;
                    const isExpanded = expandedEntry === entry.id;

                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className="border-b border-[var(--glass-border)]"
                        >
                            <div
                                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                                className="p-4 cursor-pointer hover:bg-[var(--glass-bg-light)] transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Action Icon */}
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${action.color}20` }}
                                    >
                                        <ActionIcon className="w-5 h-5" style={{ color: action.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-white">{entry.user.name}</span>
                                                    <span
                                                        className="px-2 py-0.5 rounded text-xs"
                                                        style={{ backgroundColor: `${action.color}20`, color: action.color }}
                                                    >
                                                        {action.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--color-steel)]">{entry.details}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs text-[var(--color-steel)]">{entry.timestamp}</p>
                                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                    <ChevronDown className="w-4 h-4 text-[var(--color-steel)] mt-1 ml-auto" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-4 pb-4"
                                >
                                    <div className="ml-14 p-4 rounded-lg bg-[var(--glass-bg)] grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">User Email</p>
                                            <p className="text-white">{entry.user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Resource</p>
                                            <p className="text-white">{entry.resource} {entry.resourceId && `(${entry.resourceId})`}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">IP Address</p>
                                            <p className="text-white font-mono">{entry.ipAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">User Agent</p>
                                            <p className="text-white">{entry.userAgent}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}

                {filteredEntries.length === 0 && (
                    <div className="p-8 text-center">
                        <History className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                        <p className="text-[var(--color-steel)]">No activity found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default AuditTrail;
