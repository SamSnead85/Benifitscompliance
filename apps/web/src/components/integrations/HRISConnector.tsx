'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Link2,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Settings,
    Clock,
    Play,
    Pause,
    Calendar,
    Database,
    Users,
    Shield,
    ExternalLink
} from 'lucide-react';

interface HRISConnectorProps {
    className?: string;
}

interface Integration {
    id: string;
    name: string;
    provider: 'gusto' | 'rippling' | 'adp' | 'ukg' | 'workday' | 'bamboo' | 'paylocity';
    status: 'connected' | 'disconnected' | 'error' | 'syncing';
    lastSync?: Date;
    nextSync?: Date;
    recordCount?: number;
    syncFrequency: string;
}

const providerLogos: Record<string, { color: string; abbrev: string }> = {
    gusto: { color: '#f45d48', abbrev: 'G' },
    rippling: { color: '#7c3aed', abbrev: 'R' },
    adp: { color: '#d0271d', abbrev: 'ADP' },
    ukg: { color: '#00a651', abbrev: 'UKG' },
    workday: { color: '#0875e1', abbrev: 'WD' },
    bamboo: { color: '#73c41d', abbrev: 'BH' },
    paylocity: { color: '#ff6b00', abbrev: 'PL' },
};

const mockIntegrations: Integration[] = [
    {
        id: 'int-1',
        name: 'Gusto Payroll',
        provider: 'gusto',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000),
        nextSync: new Date(Date.now() + 7200000),
        recordCount: 4521,
        syncFrequency: 'Every 2 hours'
    },
    {
        id: 'int-2',
        name: 'ADP Workforce',
        provider: 'adp',
        status: 'connected',
        lastSync: new Date(Date.now() - 86400000),
        nextSync: new Date(Date.now() + 3600000),
        recordCount: 12340,
        syncFrequency: 'Daily'
    },
    {
        id: 'int-3',
        name: 'Workday HCM',
        provider: 'workday',
        status: 'error',
        lastSync: new Date(Date.now() - 172800000),
        syncFrequency: 'Every 6 hours'
    },
];

const availableProviders = ['rippling', 'ukg', 'bamboo', 'paylocity'];

export function HRISConnector({ className = '' }: HRISConnectorProps) {
    const [integrations, setIntegrations] = useState(mockIntegrations);
    const [showAddModal, setShowAddModal] = useState(false);
    const [syncingId, setSyncingId] = useState<string | null>(null);

    const handleSync = async (id: string) => {
        setSyncingId(id);
        await new Promise(r => setTimeout(r, 2000));
        setIntegrations(prev => prev.map(i =>
            i.id === id
                ? { ...i, status: 'connected', lastSync: new Date() }
                : i
        ));
        setSyncingId(null);
    };

    const formatTimeAgo = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">HRIS Integrations</h2>
                            <p className="text-sm text-[var(--color-steel)]">Connect and sync employee data</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary"
                    >
                        <Link2 className="w-4 h-4" />
                        Add Integration
                    </button>
                </div>
            </div>

            {/* Connected Integrations */}
            <div className="p-6 space-y-4">
                <h3 className="text-sm font-medium text-[var(--color-steel)]">Connected Systems</h3>

                {integrations.map((integration, i) => {
                    const logo = providerLogos[integration.provider];
                    const isSyncing = syncingId === integration.id || integration.status === 'syncing';

                    return (
                        <motion.div
                            key={integration.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Provider Logo */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: logo.color }}
                                >
                                    {logo.abbrev}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-white">{integration.name}</h4>
                                        <span className={`px-2 py-0.5 rounded text-xs ${integration.status === 'connected'
                                                ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                                : integration.status === 'error'
                                                    ? 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                                    : 'bg-[rgba(156,163,175,0.2)] text-[var(--color-steel)]'
                                            }`}>
                                            {integration.status === 'connected' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                            {integration.status === 'error' && <XCircle className="w-3 h-3 inline mr-1" />}
                                            {integration.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        {integration.recordCount && (
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {integration.recordCount.toLocaleString()} records
                                            </span>
                                        )}
                                        {integration.lastSync && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Last sync: {formatTimeAgo(integration.lastSync)}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {integration.syncFrequency}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleSync(integration.id)}
                                        disabled={isSyncing}
                                        className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors disabled:opacity-50"
                                        title="Sync Now"
                                    >
                                        <RefreshCw className={`w-4 h-4 text-[var(--color-steel)] ${isSyncing ? 'animate-spin' : ''}`} />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors" title="Settings">
                                        <Settings className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                </div>
                            </div>

                            {/* Sync Progress Bar (when syncing) */}
                            {isSyncing && (
                                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-[var(--color-steel)]">Syncing employee data...</span>
                                        <span className="text-[var(--color-synapse-teal)]">Processing</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2 }}
                                            className="h-full bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Available Integrations */}
            <div className="p-6 pt-0">
                <h3 className="text-sm font-medium text-[var(--color-steel)] mb-4">Available Integrations</h3>
                <div className="grid grid-cols-4 gap-3">
                    {availableProviders.map((provider) => {
                        const logo = providerLogos[provider];
                        return (
                            <button
                                key={provider}
                                className="p-4 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-all hover:scale-105 flex flex-col items-center gap-2"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: logo.color }}
                                >
                                    {logo.abbrev}
                                </div>
                                <span className="text-xs text-[var(--color-steel)] capitalize">{provider}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default HRISConnector;
