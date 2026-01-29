'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Zap,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Settings,
    Play,
    Pause,
    Calendar,
    Users,
    Database,
    AlertTriangle,
    Building2,
} from 'lucide-react';

interface SyncStatus {
    lastSync: string;
    nextSync: string;
    recordsSynced: number;
    status: 'idle' | 'syncing' | 'error' | 'paused';
    errorMessage?: string;
}

interface HRISConnectorProps {
    provider: 'workday' | 'adp' | 'ukg' | 'sftp' | 'api';
    name: string;
    isConnected: boolean;
    syncStatus: SyncStatus;
    onSync?: () => void;
    onPause?: () => void;
    onConfigure?: () => void;
    className?: string;
}

/**
 * HRIS Connector Card
 * Individual integration status and controls
 */
export function HRISConnectorCard({
    provider,
    name,
    isConnected,
    syncStatus,
    onSync,
    onPause,
    onConfigure,
    className = '',
}: HRISConnectorProps) {
    const providerLogos = {
        workday: '/logos/workday.svg',
        adp: '/logos/adp.svg',
        ukg: '/logos/ukg.svg',
        sftp: null,
        api: null,
    };

    const getStatusColor = () => {
        if (!isConnected) return 'text-[#64748B]';
        switch (syncStatus.status) {
            case 'syncing': return 'text-cyan-400';
            case 'error': return 'text-red-400';
            case 'paused': return 'text-amber-400';
            default: return 'text-emerald-400';
        }
    };

    const getStatusIcon = () => {
        if (!isConnected) return <XCircle className="w-4 h-4" />;
        switch (syncStatus.status) {
            case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
            case 'error': return <AlertTriangle className="w-4 h-4" />;
            case 'paused': return <Pause className="w-4 h-4" />;
            default: return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                        {providerLogos[provider] ? (
                            <img src={providerLogos[provider]} alt={name} className="w-8 h-8" />
                        ) : (
                            <Database className="w-6 h-6 text-cyan-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{name}</h3>
                        <div className={`flex items-center gap-1.5 text-xs ${getStatusColor()}`}>
                            {getStatusIcon()}
                            <span>
                                {!isConnected ? 'Not Connected' :
                                    syncStatus.status === 'syncing' ? 'Syncing...' :
                                        syncStatus.status === 'error' ? 'Error' :
                                            syncStatus.status === 'paused' ? 'Paused' : 'Connected'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onConfigure}
                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {isConnected && (
                <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                            <p className="text-lg font-bold font-mono text-white">{syncStatus.recordsSynced.toLocaleString()}</p>
                            <p className="text-[10px] text-[#64748B]">Records</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-[#94A3B8]">{syncStatus.lastSync}</p>
                            <p className="text-[10px] text-[#64748B]">Last Sync</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-[#94A3B8]">{syncStatus.nextSync}</p>
                            <p className="text-[10px] text-[#64748B]">Next Sync</p>
                        </div>
                    </div>

                    {syncStatus.errorMessage && (
                        <div className="mb-4 p-2 rounded-md bg-red-500/10 border border-red-500/30">
                            <p className="text-xs text-red-400">{syncStatus.errorMessage}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <motion.button
                            onClick={onSync}
                            disabled={syncStatus.status === 'syncing'}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.status === 'syncing' ? 'animate-spin' : ''}`} />
                            Sync Now
                        </motion.button>
                        {syncStatus.status !== 'paused' ? (
                            <button
                                onClick={onPause}
                                className="py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                            >
                                <Pause className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <button
                                onClick={onSync}
                                className="py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                            >
                                <Play className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </>
            )}

            {!isConnected && (
                <motion.button
                    onClick={onConfigure}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712]"
                >
                    <Zap className="w-4 h-4" />
                    Connect Integration
                </motion.button>
            )}
        </motion.div>
    );
}

/**
 * Integration Dashboard
 * Overview of all HRIS connections
 */
interface Integration {
    id: string;
    provider: 'workday' | 'adp' | 'ukg' | 'sftp' | 'api';
    name: string;
    isConnected: boolean;
    syncStatus: SyncStatus;
}

interface IntegrationDashboardProps {
    integrations: Integration[];
    onSyncAll?: () => void;
    onAddIntegration?: () => void;
    className?: string;
}

export function IntegrationDashboard({
    integrations,
    onSyncAll,
    onAddIntegration,
    className = '',
}: IntegrationDashboardProps) {
    const connectedCount = integrations.filter(i => i.isConnected).length;
    const totalRecords = integrations.reduce((sum, i) => sum + (i.isConnected ? i.syncStatus.recordsSynced : 0), 0);
    const hasSyncingIntegration = integrations.some(i => i.syncStatus.status === 'syncing');
    const hasErrorIntegration = integrations.some(i => i.syncStatus.status === 'error');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            HRIS Integrations
                        </h2>
                        <p className="text-xs text-[#64748B] mt-0.5">
                            {connectedCount} of {integrations.length} connected
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            onClick={onSyncAll}
                            disabled={hasSyncingIntegration || connectedCount === 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="py-2 px-4 rounded-lg text-sm font-medium flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${hasSyncingIntegration ? 'animate-spin' : ''}`} />
                            Sync All
                        </motion.button>
                        <motion.button
                            onClick={onAddIntegration}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="py-2 px-4 rounded-lg text-sm font-medium flex items-center gap-2 bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712]"
                        >
                            + Add
                        </motion.button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <p className="text-2xl font-bold font-mono text-white">{connectedCount}</p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Connected</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <p className="text-2xl font-bold font-mono text-white">{totalRecords.toLocaleString()}</p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Total Records</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <p className={`text-2xl font-bold font-mono ${hasSyncingIntegration ? 'text-cyan-400' : 'text-emerald-400'}`}>
                            {hasSyncingIntegration ? 'Syncing' : 'Idle'}
                        </p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Status</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <p className={`text-2xl font-bold font-mono ${hasErrorIntegration ? 'text-red-400' : 'text-emerald-400'}`}>
                            {hasErrorIntegration ? integrations.filter(i => i.syncStatus.status === 'error').length : 0}
                        </p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Errors</p>
                    </div>
                </div>
            </div>

            {/* Integration List */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                    <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <HRISConnectorCard
                            provider={integration.provider}
                            name={integration.name}
                            isConnected={integration.isConnected}
                            syncStatus={integration.syncStatus}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default HRISConnectorCard;
