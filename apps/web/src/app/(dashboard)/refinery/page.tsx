'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Workflow,
    Zap,
    Brain,
    Shield,
    FileCheck,
    Play,
    Pause,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowRight,
    ChevronDown,
    Database,
    GitBranch
} from 'lucide-react';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

// Pipeline stages configuration
const pipelineStages = [
    {
        id: 'connector',
        name: 'Connector',
        icon: Zap,
        color: 'var(--color-synapse-teal)',
        description: 'Ingesting raw data from source systems'
    },
    {
        id: 'normalizer',
        name: 'Normalizer',
        icon: Brain,
        color: 'var(--color-synapse-cyan)',
        description: 'Mapping and validating data fields'
    },
    {
        id: 'compliance',
        name: 'Compliance',
        icon: Shield,
        color: 'var(--color-synapse-emerald)',
        description: 'Applying ACA rules and calculations'
    },
    {
        id: 'reporter',
        name: 'Reporter',
        icon: FileCheck,
        color: 'var(--color-synapse-amber)',
        description: 'Generating forms and reports'
    }
];

// Sample transformation data
const sampleTransformations = [
    { field: 'emp_status', source: 'A', target: 'active', type: 'mapping', confidence: 98 },
    { field: 'hire_dt', source: '12/15/2023', target: '2023-12-15', type: 'validation', confidence: 100 },
    { field: 'hours_weekly', source: '38.5', target: '38.5', type: 'validation', confidence: 100 },
    { field: 'employment_type', source: null, target: 'full_time', type: 'inference', confidence: 87 },
    { field: 'fte_status', source: null, target: 'true', type: 'inference', confidence: 92 },
];

// Sample records flowing through pipeline
const sampleRecords = [
    { id: 'EMP-001', name: 'John Smith', status: 'processing', stage: 1 },
    { id: 'EMP-002', name: 'Sarah Johnson', status: 'completed', stage: 3 },
    { id: 'EMP-003', name: 'Michael Chen', status: 'processing', stage: 2 },
    { id: 'EMP-004', name: 'Emily Davis', status: 'queued', stage: 0 },
    { id: 'EMP-005', name: 'Robert Wilson', status: 'flagged', stage: 2 },
];

function PipelineNode({
    stage,
    isActive,
    recordsIn,
    recordsOut,
    index
}: {
    stage: typeof pipelineStages[0];
    isActive: boolean;
    recordsIn: number;
    recordsOut: number;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex-1 ${isActive ? 'pipeline-node--active' : ''}`}
        >
            <div className="glass-card p-6 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                            background: `rgba(${stage.color === 'var(--color-synapse-teal)' ? '6, 182, 212' : stage.color === 'var(--color-synapse-cyan)' ? '34, 211, 238' : stage.color === 'var(--color-synapse-emerald)' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
                            border: `1px solid rgba(${stage.color === 'var(--color-synapse-teal)' ? '6, 182, 212' : stage.color === 'var(--color-synapse-cyan)' ? '34, 211, 238' : stage.color === 'var(--color-synapse-emerald)' ? '16, 185, 129' : '245, 158, 11'}, 0.3)`
                        }}
                    >
                        <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
                    </div>
                    {isActive && (
                        <span className="flex items-center gap-1 text-xs text-[var(--color-synapse-teal)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)] animate-pulse" />
                            Processing
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-1">{stage.name}</h3>
                <p className="text-xs text-[var(--color-steel)] mb-6">{stage.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-bold text-white font-mono">{recordsIn.toLocaleString()}</div>
                        <div className="text-xs text-[var(--color-steel)]">Records In</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono" style={{ color: stage.color }}>{recordsOut.toLocaleString()}</div>
                        <div className="text-xs text-[var(--color-steel)]">Records Out</div>
                    </div>
                </div>

                {/* Progress Bar */}
                {isActive && (
                    <div className="mt-4">
                        <div className="h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 2, ease: 'easeInOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: stage.color }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function DataFlowConnector({ isActive }: { isActive: boolean }) {
    return (
        <div className="flex items-center justify-center w-16 flex-shrink-0">
            <div className={`relative w-full h-0.5 ${isActive ? 'bg-[var(--color-synapse-teal)]' : 'bg-[var(--glass-border)]'}`}>
                {isActive && (
                    <motion.div
                        initial={{ left: '-20%' }}
                        animate={{ left: '120%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1/2 -translate-y-1/2 w-8 h-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, var(--color-synapse-cyan), transparent)'
                        }}
                    />
                )}
                <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
            </div>
        </div>
    );
}

function TransformationCard({ transform }: { transform: typeof sampleTransformations[0] }) {
    const typeColors = {
        mapping: 'var(--color-synapse-teal)',
        validation: 'var(--color-success)',
        inference: 'var(--color-synapse-amber)',
        enrichment: 'var(--color-synapse-cyan)'
    };

    return (
        <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[var(--color-synapse-teal)]">{transform.field}</span>
                <span className="badge badge--info text-[0.65rem]">{transform.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--color-steel)] font-mono">
                    {transform.source || 'null'}
                </span>
                <ArrowRight className="w-3 h-3 text-[var(--color-steel)]" />
                <span className="text-white font-mono font-medium">
                    {transform.target}
                </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${transform.confidence}%`,
                            backgroundColor: transform.confidence >= 90 ? 'var(--color-success)' : 'var(--color-warning)'
                        }}
                    />
                </div>
                <span className="text-xs font-mono text-[var(--color-silver)]">{transform.confidence}%</span>
            </div>
        </div>
    );
}

export default function RefineryPage() {
    const [isRunning, setIsRunning] = useState(true);
    const [activeStage, setActiveStage] = useState(1);
    const [selectedClient, setSelectedClient] = useState('horizon-healthcare');

    // Simulate pipeline progression
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setActiveStage(prev => (prev + 1) % 4);
        }, 3000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const pipelineStats = [
        { recordsIn: 1820, recordsOut: 1820 },
        { recordsIn: 1820, recordsOut: 1798 },
        { recordsIn: 1798, recordsOut: 1792 },
        { recordsIn: 1792, recordsOut: 1792 },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Workflow className="w-7 h-7 text-[var(--color-synapse-teal)]" />
                        Data Refinery
                    </h1>
                    <p className="text-[var(--color-steel)] mt-1">Watch AI agents transform your data in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Client Selector */}
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-white">
                            <Database className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                            <span>Horizon Healthcare</span>
                            <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                        </button>
                    </div>

                    {/* Pipeline Controls */}
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`p-3 rounded-lg transition-colors ${isRunning
                                ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]'
                                : 'bg-[var(--glass-bg-light)] text-[var(--color-silver)]'
                            }`}
                    >
                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-3 rounded-lg bg-[var(--glass-bg-light)] text-[var(--color-silver)] hover:text-white transition-colors">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Pipeline Status Bar */}
            <div className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        {isRunning ? (
                            <span className="flex items-center gap-2 text-[var(--color-synapse-teal)]">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)] animate-pulse" />
                                Pipeline Running
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-[var(--color-steel)]">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-steel)]" />
                                Pipeline Paused
                            </span>
                        )}
                    </div>
                    <div className="h-4 w-px bg-[var(--glass-border)]" />
                    <div className="text-sm text-[var(--color-silver)]">
                        <span className="font-mono text-white">1,820</span> records total
                    </div>
                    <div className="h-4 w-px bg-[var(--glass-border)]" />
                    <div className="text-sm text-[var(--color-silver)]">
                        <span className="font-mono text-[var(--color-success)]">1,792</span> compliant
                    </div>
                    <div className="h-4 w-px bg-[var(--glass-border)]" />
                    <div className="text-sm text-[var(--color-silver)]">
                        <span className="font-mono text-[var(--color-warning)]">22</span> flagged
                    </div>
                </div>
                <div className="text-sm text-[var(--color-steel)]">
                    Last updated: <span className="text-[var(--color-silver)]">2 minutes ago</span>
                </div>
            </div>

            {/* Pipeline Visualization */}
            <div className="flex items-stretch gap-0">
                {pipelineStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-stretch flex-1">
                        <PipelineNode
                            stage={stage}
                            isActive={activeStage === index}
                            recordsIn={pipelineStats[index].recordsIn}
                            recordsOut={pipelineStats[index].recordsOut}
                            index={index}
                        />
                        {index < pipelineStages.length - 1 && (
                            <DataFlowConnector isActive={activeStage >= index} />
                        )}
                    </div>
                ))}
            </div>

            {/* Transformation Details */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Active Transformations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            Active Transformations
                        </h2>
                        <span className="text-sm text-[var(--color-steel)]">
                            Stage: <span className="text-[var(--color-synapse-teal)]">{pipelineStages[activeStage].name}</span>
                        </span>
                    </div>
                    <div className="space-y-3">
                        {sampleTransformations.map((transform, i) => (
                            <TransformationCard key={i} transform={transform} />
                        ))}
                    </div>
                </motion.div>

                {/* Record Queue */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            Record Queue
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {sampleRecords.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${record.status === 'completed' ? 'bg-[var(--color-success)]' :
                                            record.status === 'processing' ? 'bg-[var(--color-synapse-teal)] animate-pulse' :
                                                record.status === 'flagged' ? 'bg-[var(--color-warning)]' :
                                                    'bg-[var(--color-steel)]'
                                        }`} />
                                    <div>
                                        <div className="text-sm font-medium text-white">{record.name}</div>
                                        <div className="text-xs text-[var(--color-steel)] font-mono">{record.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {pipelineStages.map((stage, i) => (
                                            <div
                                                key={stage.id}
                                                className={`w-6 h-1 rounded-full transition-colors ${i < record.stage ? 'bg-[var(--color-success)]' :
                                                        i === record.stage && record.status === 'processing' ? 'bg-[var(--color-synapse-teal)]' :
                                                            'bg-[var(--glass-border)]'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {record.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />}
                                    {record.status === 'flagged' && <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
