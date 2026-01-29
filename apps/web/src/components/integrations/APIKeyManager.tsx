'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Key,
    Plus,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    Clock,
    Shield,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

interface APIKeyManagerProps {
    className?: string;
}

interface APIKey {
    id: string;
    name: string;
    prefix: string;
    createdAt: Date;
    lastUsed?: Date;
    expiresAt?: Date;
    scopes: string[];
    status: 'active' | 'expired' | 'revoked';
}

const mockKeys: APIKey[] = [
    {
        id: 'key-1',
        name: 'Production API Key',
        prefix: 'syn_live_',
        createdAt: new Date(2025, 6, 15),
        lastUsed: new Date(),
        scopes: ['read:employees', 'write:employees', 'read:forms', 'write:forms'],
        status: 'active'
    },
    {
        id: 'key-2',
        name: 'Development Key',
        prefix: 'syn_test_',
        createdAt: new Date(2025, 9, 1),
        lastUsed: new Date(Date.now() - 86400000 * 7),
        scopes: ['read:employees', 'read:forms'],
        status: 'active'
    },
    {
        id: 'key-3',
        name: 'Legacy Integration',
        prefix: 'syn_live_',
        createdAt: new Date(2024, 3, 10),
        expiresAt: new Date(2025, 3, 10),
        scopes: ['read:employees'],
        status: 'expired'
    },
];

const scopeLabels: Record<string, string> = {
    'read:employees': 'Read Employees',
    'write:employees': 'Write Employees',
    'read:forms': 'Read Forms',
    'write:forms': 'Write Forms',
    'read:compliance': 'Read Compliance',
    'write:compliance': 'Write Compliance',
};

export function APIKeyManager({ className = '' }: APIKeyManagerProps) {
    const [keys, setKeys] = useState(mockKeys);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleReveal = (id: string) => {
        setRevealedKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const copyToClipboard = (id: string) => {
        navigator.clipboard.writeText(`${mockKeys.find(k => k.id === id)?.prefix}xxxxxxxxxxxxxxxxxxxx`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const revokeKey = (id: string) => {
        setKeys(prev => prev.map(k =>
            k.id === id ? { ...k, status: 'revoked' as const } : k
        ));
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                            <Key className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">API Keys</h2>
                            <p className="text-sm text-[var(--color-steel)]">Manage API access credentials</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Create Key
                    </button>
                </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 m-6 mb-0 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)]">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-white font-medium">Keep your API keys secure</p>
                        <p className="text-xs text-[var(--color-steel)] mt-1">
                            Never share API keys in public repositories or client-side code.
                            Rotate keys periodically for enhanced security.
                        </p>
                    </div>
                </div>
            </div>

            {/* Keys List */}
            <div className="p-6 space-y-4">
                {keys.map((apiKey, i) => (
                    <motion.div
                        key={apiKey.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl border transition-colors ${apiKey.status === 'active'
                                ? 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                : 'bg-[var(--glass-bg)] border-[var(--glass-border)] opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-white">{apiKey.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-xs ${apiKey.status === 'active'
                                            ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                            : apiKey.status === 'expired'
                                                ? 'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]'
                                                : 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                        }`}>
                                        {apiKey.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-sm">
                                    <span className="text-[var(--color-steel)]">
                                        {revealedKeys.has(apiKey.id)
                                            ? `${apiKey.prefix}xxxxxxxxxxxxxxxxxxxx`
                                            : `${apiKey.prefix}••••••••••••••••••••`
                                        }
                                    </span>
                                    <button
                                        onClick={() => toggleReveal(apiKey.id)}
                                        className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                                    >
                                        {revealedKeys.has(apiKey.id)
                                            ? <EyeOff className="w-4 h-4 text-[var(--color-steel)]" />
                                            : <Eye className="w-4 h-4 text-[var(--color-steel)]" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(apiKey.id)}
                                        className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                                    >
                                        {copiedId === apiKey.id
                                            ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                                            : <Copy className="w-4 h-4 text-[var(--color-steel)]" />
                                        }
                                    </button>
                                </div>
                            </div>
                            {apiKey.status === 'active' && (
                                <button
                                    onClick={() => revokeKey(apiKey.id)}
                                    className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.2)] text-[var(--color-steel)] hover:text-[var(--color-critical)] transition-colors"
                                    title="Revoke Key"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-[var(--color-steel)] mb-3">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {formatDate(apiKey.createdAt)}
                            </span>
                            {apiKey.lastUsed && (
                                <span>Last used {formatDate(apiKey.lastUsed)}</span>
                            )}
                            {apiKey.expiresAt && (
                                <span className={apiKey.status === 'expired' ? 'text-[var(--color-warning)]' : ''}>
                                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                                    Expired {formatDate(apiKey.expiresAt)}
                                </span>
                            )}
                        </div>

                        {/* Scopes */}
                        <div className="flex flex-wrap gap-2">
                            {apiKey.scopes.map(scope => (
                                <span
                                    key={scope}
                                    className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                >
                                    {scopeLabels[scope] || scope}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default APIKeyManager;
