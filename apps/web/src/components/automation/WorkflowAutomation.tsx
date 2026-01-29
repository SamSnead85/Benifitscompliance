'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Plus,
    Play,
    Pause,
    Settings,
    Trash2,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    GitBranch,
    Target,
    Filter,
    Users,
    FileText,
    Mail,
    Bell,
    Calendar,
    ArrowRight,
    Loader2,
    X,
    Copy
} from 'lucide-react';

interface WorkflowAutomationProps {
    className?: string;
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    trigger: {
        type: 'event' | 'schedule' | 'manual';
        config: string;
    };
    status: 'active' | 'paused' | 'error';
    lastRun?: string;
    nextRun?: string;
    runsToday: number;
    successRate: number;
    steps: WorkflowStep[];
}

interface WorkflowStep {
    id: string;
    type: 'condition' | 'action' | 'notification';
    name: string;
    config: Record<string, unknown>;
}

interface ExecutionLog {
    id: string;
    workflowId: string;
    startTime: string;
    duration: string;
    status: 'success' | 'failed' | 'running';
    trigger: string;
    stepsCompleted: number;
    totalSteps: number;
}

const mockWorkflows: Workflow[] = [
    {
        id: 'wf1',
        name: 'New Hire Onboarding',
        description: 'Automatically process new employee records and initiate coverage determination',
        trigger: { type: 'event', config: 'Employee Created' },
        status: 'active',
        lastRun: '2 hours ago',
        nextRun: 'On event',
        runsToday: 12,
        successRate: 100,
        steps: [
            { id: 's1', type: 'condition', name: 'Check FT Status', config: {} },
            { id: 's2', type: 'action', name: 'Assign Measurement Period', config: {} },
            { id: 's3', type: 'notification', name: 'Notify HR Team', config: {} },
        ]
    },
    {
        id: 'wf2',
        name: 'Monthly Hours Review',
        description: 'Review employee hours and update eligibility status based on measurement periods',
        trigger: { type: 'schedule', config: '1st of month at 6:00 AM' },
        status: 'active',
        lastRun: '28 days ago',
        nextRun: 'Feb 1, 2026',
        runsToday: 0,
        successRate: 98,
        steps: [
            { id: 's1', type: 'action', name: 'Fetch Hours Data', config: {} },
            { id: 's2', type: 'condition', name: 'Evaluate FT Threshold', config: {} },
            { id: 's3', type: 'action', name: 'Update Status', config: {} },
            { id: 's4', type: 'notification', name: 'Generate Report', config: {} },
        ]
    },
    {
        id: 'wf3',
        name: 'Coverage Lapse Alert',
        description: 'Monitor for coverage gaps and send alerts to compliance team',
        trigger: { type: 'schedule', config: 'Daily at 7:00 AM' },
        status: 'active',
        lastRun: '5 hours ago',
        nextRun: 'Tomorrow 7:00 AM',
        runsToday: 1,
        successRate: 100,
        steps: [
            { id: 's1', type: 'action', name: 'Scan Coverage Records', config: {} },
            { id: 's2', type: 'condition', name: 'Identify Gaps', config: {} },
            { id: 's3', type: 'notification', name: 'Alert Compliance Team', config: {} },
        ]
    },
    {
        id: 'wf4',
        name: 'Form 1095-C Generation',
        description: 'Automated form generation for eligible employees',
        trigger: { type: 'manual', config: 'Manual trigger' },
        status: 'paused',
        lastRun: '15 days ago',
        runsToday: 0,
        successRate: 95,
        steps: [
            { id: 's1', type: 'action', name: 'Fetch Employee Data', config: {} },
            { id: 's2', type: 'action', name: 'Calculate Codes', config: {} },
            { id: 's3', type: 'action', name: 'Generate Forms', config: {} },
            { id: 's4', type: 'action', name: 'Queue for Review', config: {} },
        ]
    },
    {
        id: 'wf5',
        name: 'HRIS Sync Handler',
        description: 'Process incoming HRIS data changes and reconcile records',
        trigger: { type: 'event', config: 'HRIS Sync Received' },
        status: 'error',
        lastRun: '1 hour ago',
        runsToday: 45,
        successRate: 78,
        steps: [
            { id: 's1', type: 'action', name: 'Parse Sync Data', config: {} },
            { id: 's2', type: 'condition', name: 'Validate Records', config: {} },
            { id: 's3', type: 'action', name: 'Apply Changes', config: {} },
        ]
    },
];

const mockExecutionLogs: ExecutionLog[] = [
    { id: 'log1', workflowId: 'wf1', startTime: 'Today 12:35 PM', duration: '1.2s', status: 'success', trigger: 'Employee Created', stepsCompleted: 3, totalSteps: 3 },
    { id: 'log2', workflowId: 'wf5', startTime: 'Today 12:30 PM', duration: '0.8s', status: 'failed', trigger: 'HRIS Sync', stepsCompleted: 2, totalSteps: 3 },
    { id: 'log3', workflowId: 'wf3', startTime: 'Today 7:00 AM', duration: '45.2s', status: 'success', trigger: 'Scheduled', stepsCompleted: 3, totalSteps: 3 },
    { id: 'log4', workflowId: 'wf1', startTime: 'Today 10:15 AM', duration: '1.1s', status: 'success', trigger: 'Employee Created', stepsCompleted: 3, totalSteps: 3 },
];

const triggerTypeConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string }> = {
    event: { icon: Zap, color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]' },
    schedule: { icon: Calendar, color: 'text-purple-400', bgColor: 'bg-[rgba(139,92,246,0.1)]' },
    manual: { icon: Target, color: 'text-[var(--color-warning)]', bgColor: 'bg-[rgba(245,158,11,0.1)]' },
};

const stepTypeConfig: Record<string, { icon: typeof Filter; color: string }> = {
    condition: { icon: GitBranch, color: 'text-[var(--color-warning)]' },
    action: { icon: Zap, color: 'text-[var(--color-synapse-teal)]' },
    notification: { icon: Bell, color: 'text-purple-400' },
};

export function WorkflowAutomation({ className = '' }: WorkflowAutomationProps) {
    const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
    const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'workflows' | 'executions'>('workflows');

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', label: 'Active' };
            case 'paused': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', label: 'Paused' };
            case 'error': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', label: 'Error' };
            default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', label: status };
        }
    };

    const toggleWorkflowStatus = (id: string) => {
        setWorkflows(prev => prev.map(wf => {
            if (wf.id === id) {
                return { ...wf, status: wf.status === 'active' ? 'paused' : 'active' };
            }
            return wf;
        }));
    };

    const stats = {
        total: workflows.length,
        active: workflows.filter(wf => wf.status === 'active').length,
        runsToday: workflows.reduce((acc, wf) => acc + wf.runsToday, 0),
        avgSuccessRate: Math.round(workflows.reduce((acc, wf) => acc + wf.successRate, 0) / workflows.length),
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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Zap className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Workflow Automation</h2>
                            <p className="text-xs text-[var(--color-steel)]">Automated compliance workflows and processes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Workflow
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Workflows</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Active</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.active}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Runs Today</p>
                        <p className="text-xl font-bold text-[var(--color-synapse-teal)]">{stats.runsToday}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Avg Success Rate</p>
                        <p className="text-xl font-bold text-purple-400">{stats.avgSuccessRate}%</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('workflows')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'workflows'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Workflows
                </button>
                <button
                    onClick={() => setActiveTab('executions')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'executions'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Execution History
                </button>
            </div>

            {/* Content */}
            <div className="divide-y divide-[var(--glass-border)]">
                {activeTab === 'workflows' ? (
                    workflows.map((workflow, index) => {
                        const statusStyle = getStatusStyle(workflow.status);
                        const triggerCfg = triggerTypeConfig[workflow.trigger.type];
                        const TriggerIcon = triggerCfg.icon;

                        return (
                            <motion.div
                                key={workflow.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${triggerCfg.bgColor}`}>
                                        <TriggerIcon className={`w-5 h-5 ${triggerCfg.color}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-white">{workflow.name}</h4>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${statusStyle.bg} ${statusStyle.text}`}>
                                                {statusStyle.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)] mb-2">{workflow.description}</p>

                                        {/* Workflow Steps Preview */}
                                        <div className="flex items-center gap-2 mt-3">
                                            {workflow.steps.map((step, i) => {
                                                const stepCfg = stepTypeConfig[step.type];
                                                const StepIcon = stepCfg.icon;
                                                return (
                                                    <div key={step.id} className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                                                            <StepIcon className={`w-3 h-3 ${stepCfg.color}`} />
                                                            <span className="text-xs text-[var(--color-steel)]">{step.name}</span>
                                                        </div>
                                                        {i < workflow.steps.length - 1 && (
                                                            <ArrowRight className="w-3 h-3 text-[var(--color-steel)]" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div>
                                                <p className="text-[var(--color-steel)] text-xs">Last run</p>
                                                <p className="text-white">{workflow.lastRun || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[var(--color-steel)] text-xs">Today</p>
                                                <p className="text-white">{workflow.runsToday} runs</p>
                                            </div>
                                            <div>
                                                <p className="text-[var(--color-steel)] text-xs">Success</p>
                                                <p className={workflow.successRate >= 90 ? 'text-[var(--color-success)]' : workflow.successRate >= 70 ? 'text-[var(--color-warning)]' : 'text-[var(--color-critical)]'}>
                                                    {workflow.successRate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleWorkflowStatus(workflow.id)}
                                            className={`p-2 rounded-lg transition-colors ${workflow.status === 'active'
                                                ? 'text-[var(--color-warning)] hover:bg-[rgba(245,158,11,0.1)]'
                                                : 'text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.1)]'
                                                }`}
                                            title={workflow.status === 'active' ? 'Pause' : 'Resume'}
                                        >
                                            {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </button>
                                        <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    mockExecutionLogs.map((log, index) => {
                        const workflow = workflows.find(wf => wf.id === log.workflowId);
                        const statusColor = log.status === 'success'
                            ? 'text-[var(--color-success)]'
                            : log.status === 'failed'
                                ? 'text-[var(--color-critical)]'
                                : 'text-[var(--color-synapse-teal)]';

                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-4 flex items-center gap-4"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${log.status === 'success'
                                        ? 'bg-[rgba(16,185,129,0.1)]'
                                        : log.status === 'failed'
                                            ? 'bg-[rgba(239,68,68,0.1)]'
                                            : 'bg-[rgba(6,182,212,0.1)]'
                                    }`}>
                                    {log.status === 'success'
                                        ? <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                        : log.status === 'failed'
                                            ? <XCircle className="w-5 h-5 text-[var(--color-critical)]" />
                                            : <Loader2 className="w-5 h-5 text-[var(--color-synapse-teal)] animate-spin" />
                                    }
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-medium text-white">{workflow?.name || 'Unknown Workflow'}</h4>
                                    <p className="text-xs text-[var(--color-steel)]">
                                        Triggered by: {log.trigger} • {log.stepsCompleted}/{log.totalSteps} steps
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <p className="text-white">{log.startTime}</p>
                                        <p className="text-xs text-[var(--color-steel)]">Started</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white">{log.duration}</p>
                                        <p className="text-xs text-[var(--color-steel)]">Duration</p>
                                    </div>
                                    <div className="text-center">
                                        <p className={statusColor + ' capitalize'}>{log.status}</p>
                                        <p className="text-xs text-[var(--color-steel)]">Status</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Create Workflow Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Create Workflow</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Workflow Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., New Hire Processing"
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Description</label>
                                    <textarea
                                        placeholder="Describe what this workflow does..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Trigger Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Object.entries(triggerTypeConfig).map(([type, cfg]) => {
                                            const Icon = cfg.icon;
                                            return (
                                                <button
                                                    key={type}
                                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--color-synapse-teal)]`}
                                                >
                                                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                                                    <span className="text-xs text-white capitalize">{type}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Template</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="">Start from scratch</option>
                                        <option value="onboarding">New Hire Onboarding</option>
                                        <option value="termination">Employee Termination</option>
                                        <option value="eligibility">Eligibility Review</option>
                                        <option value="form_generation">Form Generation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button className="btn-primary flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Create Workflow
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default WorkflowAutomation;
