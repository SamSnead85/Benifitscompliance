'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plug,
    Plus,
    Settings,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Zap,
    Database,
    Users,
    Calendar,
    ChevronRight,
    ExternalLink,
    Activity,
    ArrowUpRight,
    ArrowDownLeft,
    Loader2,
    X
} from 'lucide-react';

interface IntegrationHubProps {
    className?: string;
}

interface Integration {
    id: string;
    name: string;
    type: 'hris' | 'payroll' | 'benefits' | 'erp' | 'custom';
    provider: string;
    status: 'connected' | 'disconnected' | 'error' | 'syncing';
    lastSync: string;
    nextSync: string;
    recordsIn: number;
    recordsOut: number;
    errorCount: number;
    healthScore: number;
}

interface SyncLog {
    id: string;
    integrationId: string;
    timestamp: string;
    direction: 'inbound' | 'outbound';
    records: number;
    status: 'success' | 'partial' | 'failed';
    duration: string;
    errors?: number;
}

const integrationIcons: Record<string, string> = {
    'Workday': '🔵',
    'ADP': '🔴',
    'SAP': '🟡',
    'Oracle': '🔶',
    'Salesforce': '☁️',
    'Custom API': '⚙️',
};

const mockIntegrations: Integration[] = [
    { id: 'int1', name: 'Workday HRIS', type: 'hris', provider: 'Workday', status: 'connected', lastSync: '5 min ago', nextSync: 'in 55 min', recordsIn: 4256, recordsOut: 3891, errorCount: 0, healthScore: 100 },
    { id: 'int2', name: 'ADP Payroll', type: 'payroll', provider: 'ADP', status: 'connected', lastSync: '2 hours ago', nextSync: 'in 4 hours', recordsIn: 4256, recordsOut: 4256, errorCount: 3, healthScore: 95 },
    { id: 'int3', name: 'SAP Benefits', type: 'benefits', provider: 'SAP', status: 'syncing', lastSync: 'Now', nextSync: '-', recordsIn: 2150, recordsOut: 2100, errorCount: 0, healthScore: 98 },
    { id: 'int4', name: 'Oracle ERP', type: 'erp', provider: 'Oracle', status: 'error', lastSync: '1 day ago', nextSync: 'Paused', recordsIn: 0, recordsOut: 0, errorCount: 15, healthScore: 45 },
    { id: 'int5', name: 'Custom TPA Feed', type: 'custom', provider: 'Custom API', status: 'connected', lastSync: '30 min ago', nextSync: 'Daily 6AM', recordsIn: 890, recordsOut: 0, errorCount: 0, healthScore: 100 },
];

const mockSyncLogs: SyncLog[] = [
    { id: 'log1', integrationId: 'int1', timestamp: 'Today 2:35 PM', direction: 'inbound', records: 156, status: 'success', duration: '12s' },
    { id: 'log2', integrationId: 'int2', timestamp: 'Today 12:00 PM', direction: 'outbound', records: 4256, status: 'partial', duration: '3m 24s', errors: 3 },
    { id: 'log3', integrationId: 'int3', timestamp: 'Today 2:40 PM', direction: 'inbound', records: 2150, status: 'success', duration: '45s' },
    { id: 'log4', integrationId: 'int4', timestamp: 'Yesterday 8:00 AM', direction: 'inbound', records: 0, status: 'failed', duration: '5s', errors: 15 },
    { id: 'log5', integrationId: 'int1', timestamp: 'Today 1:35 PM', direction: 'inbound', records: 142, status: 'success', duration: '11s' },
];

export function IntegrationHub({ className = '' }: IntegrationHubProps) {
    const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
    const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'integrations' | 'logs'>('integrations');

    // Simulate syncing progress
    useEffect(() => {
        const interval = setInterval(() => {
            setIntegrations(prev => prev.map(int => {
                if (int.status === 'syncing') {
                    return { ...int, status: 'connected', lastSync: 'Just now' };
                }
                return int;
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'connected': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', icon: CheckCircle2 };
            case 'syncing': return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', icon: RefreshCw };
            case 'error': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', icon: XCircle };
            case 'disconnected': return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', icon: AlertTriangle };
            default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', icon: Clock };
        }
    };

    const getHealthColor = (score: number) => {
        if (score >= 90) return 'text-[var(--color-success)]';
        if (score >= 70) return 'text-[var(--color-warning)]';
        return 'text-[var(--color-critical)]';
    };

    const triggerSync = (id: string) => {
        setIntegrations(prev => prev.map(int =>
            int.id === id ? { ...int, status: 'syncing' } : int
        ));
    };

    const stats = {
        total: integrations.length,
        connected: integrations.filter(i => i.status === 'connected' || i.status === 'syncing').length,
        errors: integrations.filter(i => i.status === 'error').length,
        totalRecords: integrations.reduce((acc, i) => acc + i.recordsIn, 0),
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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Plug className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Integration Hub</h2>
                            <p className="text-xs text-[var(--color-steel)]">HRIS, Payroll & Benefits integrations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Integration
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Integrations</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Connected</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.connected}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">With Errors</p>
                        <p className="text-xl font-bold text-[var(--color-critical)]">{stats.errors}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Records Synced</p>
                        <p className="text-xl font-bold text-[var(--color-synapse-teal)]">{stats.totalRecords.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'integrations'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Integrations
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'logs'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Sync Logs
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                {activeTab === 'integrations' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {integrations.map((integration, index) => {
                            const statusStyle = getStatusStyle(integration.status);
                            const StatusIcon = statusStyle.icon;

                            return (
                                <motion.div
                                    key={integration.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedIntegration === integration.id
                                        ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal-muted)]'
                                        : 'border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                    onClick={() => setSelectedIntegration(integration.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{integrationIcons[integration.provider] || '🔗'}</div>
                                            <div>
                                                <h4 className="font-medium text-white">{integration.name}</h4>
                                                <p className="text-xs text-[var(--color-steel)]">{integration.provider}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                            <StatusIcon className={`w-3 h-3 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                                            <span className="capitalize">{integration.status}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div className="p-2 rounded bg-[rgba(255,255,255,0.03)]">
                                            <div className="flex items-center gap-1 text-[var(--color-steel)] mb-1">
                                                <ArrowDownLeft className="w-3 h-3" />
                                                <span className="text-[10px]">Records In</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{integration.recordsIn.toLocaleString()}</p>
                                        </div>
                                        <div className="p-2 rounded bg-[rgba(255,255,255,0.03)]">
                                            <div className="flex items-center gap-1 text-[var(--color-steel)] mb-1">
                                                <ArrowUpRight className="w-3 h-3" />
                                                <span className="text-[10px]">Records Out</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{integration.recordsOut.toLocaleString()}</p>
                                        </div>
                                        <div className="p-2 rounded bg-[rgba(255,255,255,0.03)]">
                                            <div className="flex items-center gap-1 text-[var(--color-steel)] mb-1">
                                                <Activity className="w-3 h-3" />
                                                <span className="text-[10px]">Health</span>
                                            </div>
                                            <p className={`text-sm font-medium ${getHealthColor(integration.healthScore)}`}>{integration.healthScore}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <div className="text-[var(--color-steel)]">
                                            <span>Last: {integration.lastSync}</span>
                                            <span className="mx-2">•</span>
                                            <span>Next: {integration.nextSync}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); triggerSync(integration.id); }}
                                                disabled={integration.status === 'syncing'}
                                                className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)] hover:text-[var(--color-synapse-teal)] disabled:opacity-50"
                                                title="Sync Now"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]"
                                                title="Settings"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {mockSyncLogs.map((log, index) => {
                            const integration = integrations.find(i => i.id === log.integrationId);
                            const statusColor = log.status === 'success'
                                ? 'text-[var(--color-success)]'
                                : log.status === 'partial'
                                    ? 'text-[var(--color-warning)]'
                                    : 'text-[var(--color-critical)]';

                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] flex items-center gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${log.direction === 'inbound' ? 'bg-[rgba(6,182,212,0.1)]' : 'bg-[rgba(139,92,246,0.1)]'}`}>
                                        {log.direction === 'inbound'
                                            ? <ArrowDownLeft className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                            : <ArrowUpRight className="w-5 h-5 text-purple-400" />
                                        }
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{integration?.name || 'Unknown'}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${statusColor} bg-current/10`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)]">
                                            {log.direction === 'inbound' ? 'Received' : 'Sent'} {log.records.toLocaleString()} records
                                            {log.errors ? ` • ${log.errors} errors` : ''}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-white">{log.timestamp}</p>
                                        <p className="text-xs text-[var(--color-steel)]">Duration: {log.duration}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Integration Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Add Integration</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5">
                                <p className="text-sm text-[var(--color-silver)] mb-4">Select an integration type to configure:</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { type: 'hris', label: 'HRIS System', icon: Users, providers: ['Workday', 'BambooHR', 'UKG'] },
                                        { type: 'payroll', label: 'Payroll', icon: Database, providers: ['ADP', 'Paychex', 'Gusto'] },
                                        { type: 'benefits', label: 'Benefits Admin', icon: Zap, providers: ['SAP', 'Benefitfocus'] },
                                        { type: 'erp', label: 'ERP', icon: Database, providers: ['Oracle', 'SAP', 'NetSuite'] },
                                    ].map(item => (
                                        <button
                                            key={item.type}
                                            className="p-4 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--color-synapse-teal)] transition-all text-left group"
                                        >
                                            <item.icon className="w-8 h-8 text-[var(--color-synapse-teal)] mb-2" />
                                            <p className="font-medium text-white group-hover:text-[var(--color-synapse-teal)]">{item.label}</p>
                                            <p className="text-xs text-[var(--color-steel)]">{item.providers.join(', ')}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default IntegrationHub;
