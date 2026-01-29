'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Check,
    Loader2,
    ExternalLink,
    Key,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Database
} from 'lucide-react';

interface HRISConnectionModalProps {
    provider: 'gusto' | 'rippling' | 'adp' | 'sftp';
    isOpen: boolean;
    onClose: () => void;
    onConnect: (credentials: any) => Promise<boolean>;
}

const providerConfig = {
    gusto: {
        name: 'Gusto',
        description: 'Connect to Gusto via OAuth 2.0 for automatic payroll and employee data sync.',
        authType: 'oauth',
        color: '#f45d48',
        scopes: ['employees:read', 'payrolls:read', 'companies:read']
    },
    rippling: {
        name: 'Rippling',
        description: 'Connect to Rippling using your API key for workforce management data.',
        authType: 'api_key',
        color: '#1a1a2e',
        fields: ['API Key', 'Company ID']
    },
    adp: {
        name: 'ADP Workforce Now',
        description: 'Enterprise payroll integration (coming soon).',
        authType: 'coming_soon',
        color: '#d0271d',
    },
    sftp: {
        name: 'SFTP Server',
        description: 'Configure secure file transfer for automated data imports.',
        authType: 'sftp',
        color: '#4a5568',
        fields: ['Host', 'Port', 'Username', 'Password', 'Remote Path']
    }
};

export function HRISConnectionModal({ provider, isOpen, onClose, onConnect }: HRISConnectionModalProps) {
    const [step, setStep] = useState<'config' | 'connecting' | 'success' | 'error'>('config');
    const [apiKey, setApiKey] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [sftpConfig, setSftpConfig] = useState({
        host: '',
        port: '22',
        username: '',
        password: '',
        remotePath: '/data/exports'
    });
    const [errorMessage, setErrorMessage] = useState('');

    const config = providerConfig[provider];

    const handleOAuthConnect = async () => {
        setStep('connecting');

        // Simulate OAuth flow
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In production, redirect to OAuth authorization URL
        // window.location.href = `https://api.gusto.com/oauth/authorize?client_id=...`;

        const success = await onConnect({ type: 'oauth', provider });
        setStep(success ? 'success' : 'error');
        if (!success) setErrorMessage('OAuth authorization failed. Please try again.');
    };

    const handleAPIKeyConnect = async () => {
        if (!apiKey || !companyId) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        setStep('connecting');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = await onConnect({ type: 'api_key', apiKey, companyId, provider });
        setStep(success ? 'success' : 'error');
        if (!success) setErrorMessage('Invalid API credentials. Please check and try again.');
    };

    const handleSFTPConnect = async () => {
        if (!sftpConfig.host || !sftpConfig.username) {
            setErrorMessage('Please fill in required fields.');
            return;
        }

        setStep('connecting');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = await onConnect({ type: 'sftp', ...sftpConfig, provider });
        setStep(success ? 'success' : 'error');
        if (!success) setErrorMessage('SFTP connection failed. Please verify your credentials.');
    };

    const handleClose = () => {
        setStep('config');
        setApiKey('');
        setCompanyId('');
        setErrorMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card w-full max-w-md p-6 m-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${config.color}20` }}
                            >
                                <Database className="w-5 h-5" style={{ color: config.color }} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Connect {config.name}</h2>
                                <p className="text-xs text-[var(--color-steel)]">{config.authType === 'oauth' ? 'OAuth 2.0' : 'API Integration'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content based on step */}
                    {step === 'config' && (
                        <div className="space-y-4">
                            <p className="text-sm text-[var(--color-silver)]">{config.description}</p>

                            {config.authType === 'coming_soon' && (
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center">
                                    <p className="text-[var(--color-steel)]">This integration is coming soon.</p>
                                    <p className="text-xs text-[var(--color-steel)] mt-1">Contact support for early access.</p>
                                </div>
                            )}

                            {config.authType === 'oauth' && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                        <p className="text-xs text-[var(--color-steel)] mb-2">Requested permissions:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {'scopes' in config && config.scopes?.map((scope: string) => (
                                                <span key={scope} className="text-xs px-2 py-1 rounded bg-[var(--glass-bg)] text-[var(--color-silver)]">
                                                    {scope}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleOAuthConnect} className="btn-primary w-full">
                                        <ExternalLink className="w-4 h-4" />
                                        Authorize with {config.name}
                                    </button>
                                </div>
                            )}

                            {config.authType === 'api_key' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">API Key</label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Enter your API key"
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Company ID</label>
                                        <input
                                            type="text"
                                            value={companyId}
                                            onChange={(e) => setCompanyId(e.target.value)}
                                            placeholder="e.g., company_123456"
                                            className="form-input"
                                        />
                                    </div>
                                    {errorMessage && (
                                        <p className="text-sm text-[var(--color-warning)]">{errorMessage}</p>
                                    )}
                                    <button onClick={handleAPIKeyConnect} className="btn-primary w-full">
                                        <Key className="w-4 h-4" />
                                        Connect
                                    </button>
                                </div>
                            )}

                            {config.authType === 'sftp' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-silver)] mb-1">Host</label>
                                            <input
                                                type="text"
                                                value={sftpConfig.host}
                                                onChange={(e) => setSftpConfig(prev => ({ ...prev, host: e.target.value }))}
                                                placeholder="sftp.example.com"
                                                className="form-input text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--color-silver)] mb-1">Port</label>
                                            <input
                                                type="text"
                                                value={sftpConfig.port}
                                                onChange={(e) => setSftpConfig(prev => ({ ...prev, port: e.target.value }))}
                                                className="form-input text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--color-silver)] mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={sftpConfig.username}
                                            onChange={(e) => setSftpConfig(prev => ({ ...prev, username: e.target.value }))}
                                            className="form-input text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--color-silver)] mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={sftpConfig.password}
                                            onChange={(e) => setSftpConfig(prev => ({ ...prev, password: e.target.value }))}
                                            className="form-input text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--color-silver)] mb-1">Remote Path</label>
                                        <input
                                            type="text"
                                            value={sftpConfig.remotePath}
                                            onChange={(e) => setSftpConfig(prev => ({ ...prev, remotePath: e.target.value }))}
                                            className="form-input text-sm"
                                        />
                                    </div>
                                    {errorMessage && (
                                        <p className="text-sm text-[var(--color-warning)]">{errorMessage}</p>
                                    )}
                                    <button onClick={handleSFTPConnect} className="btn-primary w-full">
                                        <Database className="w-4 h-4" />
                                        Test & Connect
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'connecting' && (
                        <div className="py-8 text-center">
                            <Loader2 className="w-12 h-12 text-[var(--color-synapse-teal)] mx-auto mb-4 animate-spin" />
                            <p className="text-white font-medium">Connecting to {config.name}...</p>
                            <p className="text-sm text-[var(--color-steel)] mt-1">This may take a moment</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 text-center">
                            <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4" />
                            <p className="text-white font-medium">Successfully connected!</p>
                            <p className="text-sm text-[var(--color-steel)] mt-1">{config.name} is now linked to your account</p>
                            <button onClick={handleClose} className="btn-primary mt-6">
                                Done
                            </button>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="py-8 text-center">
                            <AlertCircle className="w-12 h-12 text-[var(--color-warning)] mx-auto mb-4" />
                            <p className="text-white font-medium">Connection Failed</p>
                            <p className="text-sm text-[var(--color-steel)] mt-1">{errorMessage}</p>
                            <div className="flex gap-3 justify-center mt-6">
                                <button onClick={() => setStep('config')} className="btn-secondary">
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                                <button onClick={handleClose} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default HRISConnectionModal;
