'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Key,
    Plus,
    Copy,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Shield,
    Clock,
    Activity,
    Globe,
    Lock,
    Settings,
    ChevronDown,
    ChevronUp,
    Zap
} from 'lucide-react';

interface APIKeyManagerProps {
    className?: string;
}

interface APIKey {
    id: string;
    name: string;
    prefix: string;
    lastUsed: string | null;
    createdAt: string;
    expiresAt: string | null;
    status: 'active' | 'expired' | 'revoked';
    scopes: string[];
    rateLimit: number;
    usageCount: number;
    environment: 'production' | 'staging' | 'development';
}

const mockKeys: APIKey[] = [
    {
        id: 'key1',
        name: 'Production Integration',
        prefix: 'sk_live_7xK9',
        lastUsed: '2 minutes ago',
        createdAt: '2025-11-15',
        expiresAt: null,
        status: 'active',
        scopes: ['read:employees', 'write:employees', 'read:forms', 'write:forms'],
        rateLimit: 10000,
        usageCount: 45892,
        environment: 'production'
    },
    {
        id: 'key2',
        name: 'HRIS Sync Service',
        prefix: 'sk_live_3mP2',
        lastUsed: '1 hour ago',
        createdAt: '2025-12-01',
        expiresAt: '2026-12-01',
        status: 'active',
        scopes: ['read:employees', 'write:employees'],
        rateLimit: 5000,
        usageCount: 12456,
        environment: 'production'
    },
    {
        id: 'key3',
        name: 'Development Testing',
        prefix: 'sk_test_8nQ4',
        lastUsed: '3 days ago',
        createdAt: '2026-01-10',
        expiresAt: null,
        status: 'active',
        scopes: ['read:all', 'write:all'],
        rateLimit: 1000,
        usageCount: 892,
        environment: 'development'
    },
    {
        id: 'key4',
        name: 'Legacy System Bridge',
        prefix: 'sk_live_2xR5',
        lastUsed: 'Never',
        createdAt: '2025-06-01',
        expiresAt: '2025-12-31',
        status: 'expired',
        scopes: ['read:forms'],
        rateLimit: 2000,
        usageCount: 8945,
        environment: 'production'
    },
];

const availableScopes = [
    { id: 'read:employees', label: 'Read Employees', description: 'View employee data' },
    { id: 'write:employees', label: 'Write Employees', description: 'Create/update employees' },
    { id: 'read:forms', label: 'Read Forms', description: 'View 1095-C/1094-C forms' },
    { id: 'write:forms', label: 'Write Forms', description: 'Generate/update forms' },
    { id: 'read:reports', label: 'Read Reports', description: 'Access report data' },
    { id: 'read:all', label: 'Read All', description: 'Full read access' },
    { id: 'write:all', label: 'Write All', description: 'Full write access' },
];

function getEnvironmentStyle(env: string) {
    switch (env) {
        case 'production': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]' };
        case 'staging': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]' };
        case 'development': return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', border: 'border-[rgba(6,182,212,0.3)]' };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
    }
}

export function APIKeyManager({ className = '' }: APIKeyManagerProps) {
    const [keys, setKeys] = useState<APIKey[]>(mockKeys);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [newKeyVisible, setNewKeyVisible] = useState(false);

    // New key form state
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyScopes, setNewKeyScopes] = useState<string[]>([]);
    const [newKeyEnv, setNewKeyEnv] = useState<'production' | 'staging' | 'development'>('development');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    const activeKeys = keys.filter(k => k.status === 'active').length;
    const totalUsage = keys.reduce((acc, k) => acc + k.usageCount, 0);

    const handleCopy = (prefix: string) => {
        navigator.clipboard.writeText(`${prefix}...XXXX`);
        setCopiedKey(prefix);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleCreateKey = () => {
        const newKey = `sk_${newKeyEnv === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}`;
        setGeneratedKey(newKey);
        setNewKeyVisible(true);
    };

    const handleRevokeKey = (id: string) => {
        setKeys(prev => prev.map(k =>
            k.id === id ? { ...k, status: 'revoked' as const } : k
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-amber)] to-[var(--color-synapse-coral)] flex items-center justify-center">
                            <Key className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">API Key Manager</h2>
                            <p className="text-xs text-[var(--color-steel)]">Manage API keys for programmatic access</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create API Key
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Total Keys</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{keys.length}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                            <span className="text-xs text-[var(--color-steel)]">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-success)]">{activeKeys}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Total Requests</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{totalUsage.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-[var(--color-critical)]" />
                            <span className="text-xs text-[var(--color-steel)]">Expired</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-critical)]">
                            {keys.filter(k => k.status === 'expired').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Key List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {keys.map((key, index) => {
                    const envStyle = getEnvironmentStyle(key.environment);

                    return (
                        <motion.div
                            key={key.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <div
                                className={`p-4 cursor-pointer transition-colors ${expandedKey === key.id ? 'bg-[rgba(255,255,255,0.03)]' : 'hover:bg-[rgba(255,255,255,0.02)]'} ${key.status !== 'active' ? 'opacity-60' : ''}`}
                                onClick={() => setExpandedKey(expandedKey === key.id ? null : key.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${key.status === 'active'
                                        ? 'bg-[rgba(16,185,129,0.1)]'
                                        : 'bg-[rgba(255,255,255,0.05)]'
                                        }`}>
                                        <Key className={`w-5 h-5 ${key.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-steel)]'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{key.name}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${envStyle.bg} ${envStyle.text} ${envStyle.border}`}>
                                                {key.environment}
                                            </span>
                                            {key.status !== 'active' && (
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${key.status === 'expired'
                                                    ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                    : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                                    }`}>
                                                    {key.status}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                            <span className="font-mono">{key.prefix}...XXXX</span>
                                            <span>Created: {key.createdAt}</span>
                                            {key.expiresAt && <span>Expires: {key.expiresAt}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-white">{key.usageCount.toLocaleString()}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Requests</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-[var(--color-synapse-teal)]">{key.scopes.length}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Scopes</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[var(--color-steel)]">Last used</p>
                                            <p className="text-sm text-white">{key.lastUsed || 'Never'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(key.prefix);
                                            }}
                                            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)] hover:text-white transition-colors"
                                            title="Copy Key"
                                        >
                                            {copiedKey === key.prefix ? (
                                                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        {expandedKey === key.id ? (
                                            <ChevronUp className="w-4 h-4 text-[var(--color-steel)]" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedKey === key.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-[var(--glass-border)]"
                                    >
                                        <div className="p-4 bg-[rgba(255,255,255,0.01)]">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-[var(--color-steel)] mb-2">Scopes</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {key.scopes.map(scope => (
                                                            <span
                                                                key={scope}
                                                                className="px-2 py-1 text-xs font-mono rounded bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]"
                                                            >
                                                                {scope}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--color-steel)] mb-2">Rate Limit</p>
                                                    <p className="text-sm text-white">{key.rateLimit.toLocaleString()} requests/hour</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                                <button className="btn-secondary flex items-center gap-2 text-sm">
                                                    <RefreshCw className="w-4 h-4" />
                                                    Rotate Key
                                                </button>
                                                {key.status === 'active' && (
                                                    <button
                                                        onClick={() => handleRevokeKey(key.id)}
                                                        className="px-3 py-1.5 text-sm font-medium text-[var(--color-critical)] bg-[rgba(239,68,68,0.1)] rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Revoke
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Create Key Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowCreateModal(false);
                            setGeneratedKey(null);
                            setNewKeyVisible(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)]">
                                <h2 className="text-lg font-semibold text-white">Create API Key</h2>
                                <p className="text-sm text-[var(--color-steel)]">Generate a new API key for programmatic access</p>
                            </div>

                            {!newKeyVisible ? (
                                <>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Key Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Production Integration"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Environment</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(['development', 'staging', 'production'] as const).map(env => (
                                                    <button
                                                        key={env}
                                                        onClick={() => setNewKeyEnv(env)}
                                                        className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${newKeyEnv === env
                                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)] text-[var(--color-synapse-teal)]'
                                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] text-[var(--color-silver)] hover:border-[var(--glass-border-hover)]'
                                                            }`}
                                                    >
                                                        {env}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Scopes</label>
                                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                                                {availableScopes.map(scope => (
                                                    <label
                                                        key={scope.id}
                                                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${newKeyScopes.includes(scope.id)
                                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={newKeyScopes.includes(scope.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setNewKeyScopes([...newKeyScopes, scope.id]);
                                                                } else {
                                                                    setNewKeyScopes(newKeyScopes.filter(s => s !== scope.id));
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <span className={`text-xs ${newKeyScopes.includes(scope.id) ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-silver)]'}`}>
                                                            {scope.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                        <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                                        <button onClick={handleCreateKey} className="btn-primary flex items-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Generate Key
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-5">
                                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                            <span className="font-medium text-[var(--color-success)]">API Key Created Successfully</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mb-3">
                                            Copy this key now. You won't be able to see it again!
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 px-3 py-2 rounded bg-[var(--color-obsidian)] border border-[var(--glass-border)] text-sm font-mono text-white">
                                                {generatedKey}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedKey || '');
                                                    setCopiedKey(generatedKey);
                                                    setTimeout(() => setCopiedKey(null), 2000);
                                                }}
                                                className="p-2 rounded-lg bg-[var(--color-synapse-teal)] text-black hover:opacity-90 transition-opacity"
                                            >
                                                {copiedKey === generatedKey ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-warning)]">Important Security Notice</p>
                                                <p className="text-xs text-[var(--color-steel)] mt-1">
                                                    This API key provides access to sensitive data. Store it securely and never expose it in client-side code or public repositories.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setGeneratedKey(null);
                                                setNewKeyVisible(false);
                                            }}
                                            className="btn-primary"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default APIKeyManager;
