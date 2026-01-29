'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    History,
    User,
    FileText,
    Database,
    Settings,
    Download,
    Search,
    Filter,
    ChevronRight,
    Clock
} from 'lucide-react';

interface AuditEntry {
    id: string;
    action: string;
    category: 'employee' | 'form' | 'system' | 'integration' | 'settings';
    description: string;
    user: { name: string; email: string };
    timestamp: string;
    entityId?: string;
    entityType?: string;
    changes?: { field: string; oldValue: string; newValue: string }[];
}

interface AuditLogViewerProps {
    entries?: AuditEntry[];
    onExport?: () => void;
    onEntryClick?: (entry: AuditEntry) => void;
    className?: string;
}

const defaultEntries: AuditEntry[] = [
    {
        id: '1',
        action: 'UPDATE',
        category: 'employee',
        description: 'Updated coverage status for employee',
        user: { name: 'John Smith', email: 'john@company.com' },
        timestamp: '2026-01-28T10:45:00',
        entityId: 'EMP-1247',
        entityType: 'Employee',
        changes: [
            { field: 'coverageStatus', oldValue: 'pending', newValue: 'enrolled' }
        ]
    },
    {
        id: '2',
        action: 'GENERATE',
        category: 'form',
        description: 'Generated 1095-C forms batch',
        user: { name: 'Sarah Johnson', email: 'sarah@company.com' },
        timestamp: '2026-01-28T10:30:00',
        entityId: 'BATCH-456',
        entityType: 'Form Batch'
    },
    {
        id: '3',
        action: 'IMPORT',
        category: 'integration',
        description: 'Imported employee data from Workday',
        user: { name: 'System', email: 'system@synapse.io' },
        timestamp: '2026-01-28T09:00:00',
        entityId: 'SYNC-789',
        entityType: 'Data Import'
    },
    {
        id: '4',
        action: 'UPDATE',
        category: 'settings',
        description: 'Modified safe harbor settings',
        user: { name: 'Mike Wilson', email: 'mike@company.com' },
        timestamp: '2026-01-28T08:30:00',
        changes: [
            { field: 'safeHarborMethod', oldValue: 'W2', newValue: 'FPL' }
        ]
    },
    {
        id: '5',
        action: 'DELETE',
        category: 'employee',
        description: 'Removed terminated employee record',
        user: { name: 'Emily Chen', email: 'emily@company.com' },
        timestamp: '2026-01-27T16:00:00',
        entityId: 'EMP-892',
        entityType: 'Employee'
    },
];

const categoryConfig = {
    employee: { color: 'var(--color-synapse-cyan)', icon: User, label: 'Employee' },
    form: { color: 'var(--color-synapse-gold)', icon: FileText, label: 'Forms' },
    system: { color: 'var(--color-synapse-violet)', icon: Settings, label: 'System' },
    integration: { color: 'var(--color-synapse-teal)', icon: Database, label: 'Integration' },
    settings: { color: 'var(--color-steel)', icon: Settings, label: 'Settings' },
};

const actionColors = {
    CREATE: 'var(--color-success)',
    UPDATE: 'var(--color-synapse-cyan)',
    DELETE: 'var(--color-critical)',
    IMPORT: 'var(--color-synapse-teal)',
    EXPORT: 'var(--color-synapse-gold)',
    GENERATE: 'var(--color-synapse-violet)',
};

export function AuditLogViewer({
    entries = defaultEntries,
    onExport,
    onEntryClick,
    className = ''
}: AuditLogViewerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const categories = ['all', 'employee', 'form', 'system', 'integration', 'settings'];

    const filteredEntries = entries.filter(entry =>
        (filterCategory === 'all' || entry.category === filterCategory) &&
        (entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.action.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-violet)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Audit Log</h3>
                            <p className="text-xs text-[var(--color-steel)]">{entries.length} entries</p>
                        </div>
                    </div>
                    <button onClick={onExport} className="btn-secondary text-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search audit log..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)]"
                        />
                    </div>
                    <div className="flex gap-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${filterCategory === cat
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                    }`}
                            >
                                {cat === 'all' ? 'All' : categoryConfig[cat as keyof typeof categoryConfig]?.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Entries */}
            <div className="divide-y divide-[var(--glass-border)] max-h-[500px] overflow-y-auto">
                {filteredEntries.map((entry, i) => {
                    const config = categoryConfig[entry.category];
                    const Icon = config.icon;
                    const isExpanded = expandedId === entry.id;

                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            className="p-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{
                                                backgroundColor: `${actionColors[entry.action as keyof typeof actionColors] || 'var(--color-steel)'}20`,
                                                color: actionColors[entry.action as keyof typeof actionColors] || 'var(--color-steel)'
                                            }}
                                        >
                                            {entry.action}
                                        </span>
                                        <span className="text-sm text-white">{entry.description}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[var(--color-steel)]">
                                        <span>{entry.user.name}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimestamp(entry.timestamp)}
                                        </span>
                                        {entry.entityId && (
                                            <>
                                                <span>•</span>
                                                <span>{entry.entityType}: {entry.entityId}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Expand icon */}
                                {entry.changes && entry.changes.length > 0 && (
                                    <ChevronRight className={`w-5 h-5 text-[var(--color-steel)] transition-transform ${isExpanded ? 'rotate-90' : ''
                                        }`} />
                                )}
                            </div>

                            {/* Expanded changes */}
                            {isExpanded && entry.changes && entry.changes.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-3 ml-14 overflow-hidden"
                                >
                                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                                        <p className="text-xs text-[var(--color-steel)] mb-2">Changes:</p>
                                        {entry.changes.map((change, j) => (
                                            <div key={j} className="flex items-center gap-3 text-sm">
                                                <span className="text-[var(--color-steel)]">{change.field}:</span>
                                                <span className="text-[var(--color-critical)] line-through">{change.oldValue}</span>
                                                <span className="text-[var(--color-steel)]">→</span>
                                                <span className="text-[var(--color-success)]">{change.newValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default AuditLogViewer;
