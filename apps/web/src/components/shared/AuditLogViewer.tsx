'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    History,
    Search,
    Filter,
    Download,
    User,
    Calendar,
    Clock,
    FileEdit,
    UserPlus,
    Trash2,
    Key,
    Settings,
    Shield,
    Database,
    RefreshCw
} from 'lucide-react';

interface AuditLogViewerProps {
    className?: string;
}

interface AuditEntry {
    id: string;
    action: string;
    category: 'user' | 'data' | 'security' | 'system' | 'compliance';
    actor: string;
    actorRole: string;
    target?: string;
    details?: string;
    ipAddress: string;
    timestamp: Date;
    status: 'success' | 'failure';
}

const mockAuditLog: AuditEntry[] = [
    { id: 'aud-1', action: 'Employee Data Updated', category: 'data', actor: 'Admin User', actorRole: 'Admin', target: 'John Smith (EMP-001)', details: 'Updated hours for March 2026', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 300000), status: 'success' },
    { id: 'aud-2', action: 'User Login', category: 'security', actor: 'Sarah Chen', actorRole: 'Manager', ipAddress: '10.0.0.45', timestamp: new Date(Date.now() - 1800000), status: 'success' },
    { id: 'aud-3', action: 'API Key Generated', category: 'security', actor: 'Admin User', actorRole: 'Admin', target: 'Production API Key', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 3600000), status: 'success' },
    { id: 'aud-4', action: '1095-C Forms Generated', category: 'compliance', actor: 'System', actorRole: 'System', details: 'Batch generated 4,521 forms for 2025', ipAddress: 'localhost', timestamp: new Date(Date.now() - 7200000), status: 'success' },
    { id: 'aud-5', action: 'Data Import', category: 'data', actor: 'Compliance Officer', actorRole: 'Manager', target: 'employee_data_jan2026.csv', details: 'Imported 4,521 records', ipAddress: '10.0.0.23', timestamp: new Date(Date.now() - 86400000), status: 'success' },
    { id: 'aud-6', action: 'Failed Login Attempt', category: 'security', actor: 'unknown@email.com', actorRole: 'Unknown', ipAddress: '45.33.21.100', timestamp: new Date(Date.now() - 172800000), status: 'failure' },
    { id: 'aud-7', action: 'User Created', category: 'user', actor: 'Admin User', actorRole: 'Admin', target: 'James Wilson', details: 'Role: Viewer', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 259200000), status: 'success' },
    { id: 'aud-8', action: 'Organization Settings Updated', category: 'system', actor: 'Admin User', actorRole: 'Admin', details: 'Updated fiscal year start', ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 345600000), status: 'success' },
];

const categoryConfig = {
    user: { icon: UserPlus, color: 'var(--color-synapse-cyan)', label: 'User' },
    data: { icon: Database, color: 'var(--color-synapse-teal)', label: 'Data' },
    security: { icon: Shield, color: 'var(--color-warning)', label: 'Security' },
    system: { icon: Settings, color: 'var(--color-steel)', label: 'System' },
    compliance: { icon: FileEdit, color: 'var(--color-synapse-gold)', label: 'Compliance' },
};

export function AuditLogViewer({ className = '' }: AuditLogViewerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredLogs = mockAuditLog.filter(log => {
        if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !log.actor.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !(log.target?.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return false;
        }
        if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
        if (statusFilter !== 'all' && log.status !== statusFilter) return false;
        return true;
    });

    const formatTimestamp = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-steel)] to-[var(--color-charcoal)] flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Audit Log</h2>
                            <p className="text-sm text-[var(--color-steel)]">System activity and security events</p>
                        </div>
                    </div>
                    <button className="btn-secondary">
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
                            placeholder="Search actions, users, targets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="all">All Categories</option>
                        {Object.entries(categoryConfig).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="failure">Failure</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Timestamp</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Action</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Category</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Actor</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Target</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">IP Address</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {filteredLogs.map((log, i) => {
                            const config = categoryConfig[log.category];
                            const Icon = config.icon;

                            return (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="hover:bg-[var(--glass-bg-light)] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-[var(--color-steel)] font-mono">
                                            {formatTimestamp(log.timestamp)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white">{log.action}</p>
                                        {log.details && (
                                            <p className="text-xs text-[var(--color-steel)]">{log.details}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className="px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"
                                            style={{ backgroundColor: `${config.color}20`, color: config.color }}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white">{log.actor}</p>
                                        <p className="text-xs text-[var(--color-steel)]">{log.actorRole}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[var(--color-steel)]">
                                            {log.target || '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-[var(--color-steel)] font-mono">
                                            {log.ipAddress}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${log.status === 'success'
                                                ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                                : 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredLogs.length === 0 && (
                <div className="p-8 text-center">
                    <History className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                    <p className="text-[var(--color-steel)]">No audit entries match your filters</p>
                </div>
            )}
        </motion.div>
    );
}

export default AuditLogViewer;
