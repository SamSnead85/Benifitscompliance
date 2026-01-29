'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Mail,
    Printer,
    FileText,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    Play,
    Download
} from 'lucide-react';

interface FormDistributionPanelProps {
    className?: string;
}

interface DistributionMethod {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    count: number;
}

const methods: DistributionMethod[] = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Send electronically via email', count: 3245 },
    { id: 'portal', name: 'Employee Portal', icon: Users, description: 'Available in self-service portal', count: 420 },
    { id: 'print', name: 'Print & Mail', icon: Printer, description: 'Physical mail delivery', count: 182 },
];

const stats = {
    total: 3847,
    distributed: 2890,
    pending: 812,
    failed: 145,
};

export function FormDistributionPanel({ className = '' }: FormDistributionPanelProps) {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isDistributing, setIsDistributing] = useState(false);

    const handleDistribute = async () => {
        if (!selectedMethod) return;
        setIsDistributing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsDistributing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                        <Send className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Form Distribution</h2>
                        <p className="text-sm text-[var(--color-steel)]">Distribute 1095-C forms to employees</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                            <span className="text-xs text-[var(--color-steel)]">Total Forms</span>
                        </div>
                        <p className="text-lg font-bold text-white">{stats.total.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                            <span className="text-xs text-[var(--color-steel)]">Distributed</span>
                        </div>
                        <p className="text-lg font-bold text-white">{stats.distributed.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-[var(--color-warning)]" />
                            <span className="text-xs text-[var(--color-steel)]">Pending</span>
                        </div>
                        <p className="text-lg font-bold text-white">{stats.pending.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-[var(--color-critical)]" />
                            <span className="text-xs text-[var(--color-steel)]">Failed</span>
                        </div>
                        <p className="text-lg font-bold text-white">{stats.failed.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Distribution Methods */}
            <div className="p-5">
                <p className="text-sm font-medium text-[var(--color-steel)] mb-3">Select Distribution Method</p>
                <div className="space-y-2 mb-4">
                    {methods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;

                        return (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`w-full p-4 rounded-xl border transition-all text-left ${isSelected
                                        ? 'bg-[rgba(20,184,166,0.1)] border-[var(--color-synapse-teal)]'
                                        : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? 'rgba(20,184,166,0.2)'
                                                : 'var(--glass-bg)'
                                        }}
                                    >
                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{method.name}</p>
                                        <p className="text-sm text-[var(--color-steel)]">{method.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">{method.count.toLocaleString()}</p>
                                        <p className="text-xs text-[var(--color-steel)]">recipients</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="btn-secondary flex-1">
                        <Download className="w-4 h-4" />
                        Download All
                    </button>
                    <button
                        onClick={handleDistribute}
                        disabled={!selectedMethod || isDistributing}
                        className="btn-primary flex-1"
                    >
                        {isDistributing ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                                />
                                Distributing...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Start Distribution
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default FormDistributionPanel;
