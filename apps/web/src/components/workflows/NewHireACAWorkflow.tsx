'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    ChevronRight,
    ChevronDown,
    Mail,
    FileText,
    Shield,
    Briefcase
} from 'lucide-react';

interface WorkflowStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending' | 'blocked';
    date?: string;
    assignee?: string;
    action?: string;
}

interface NewHireWorkflow {
    employeeId: string;
    employeeName: string;
    hireDate: string;
    department: string;
    eligibilityDate: string;
    status: 'on_track' | 'at_risk' | 'completed' | 'overdue';
    steps: WorkflowStep[];
}

interface NewHireACAWorkflowProps {
    workflows?: NewHireWorkflow[];
    className?: string;
}

const defaultWorkflows: NewHireWorkflow[] = [
    {
        employeeId: 'EMP-2841',
        employeeName: 'Jennifer Martinez',
        hireDate: 'Jan 15, 2026',
        department: 'Engineering',
        eligibilityDate: 'Apr 15, 2026',
        status: 'on_track',
        steps: [
            { id: '1', title: 'Initial Classification', description: 'Determine initial FTE status', status: 'completed', date: 'Jan 15' },
            { id: '2', title: 'Measurement Period', description: 'Begin initial measurement (3-12 months)', status: 'current', date: 'Jan 15 - Apr 15' },
            { id: '3', title: 'Coverage Offer', description: 'Generate and send offer letter', status: 'pending' },
            { id: '4', title: 'Enrollment', description: 'Process benefit elections', status: 'pending' },
            { id: '5', title: '1095-C Assignment', description: 'Assign codes for tax year', status: 'pending' }
        ]
    },
    {
        employeeId: 'EMP-2835',
        employeeName: 'Michael Thompson',
        hireDate: 'Dec 1, 2025',
        department: 'Sales',
        eligibilityDate: 'Mar 1, 2026',
        status: 'at_risk',
        steps: [
            { id: '1', title: 'Initial Classification', description: 'Determine initial FTE status', status: 'completed', date: 'Dec 1' },
            { id: '2', title: 'Measurement Period', description: 'Standard measurement started', status: 'completed', date: 'Dec 1 - Jan 31' },
            { id: '3', title: 'Coverage Offer', description: 'Offer letter pending approval', status: 'blocked', action: 'Approve offer letter' },
            { id: '4', title: 'Enrollment', description: 'Awaiting coverage offer', status: 'pending' },
            { id: '5', title: '1095-C Assignment', description: 'Assign codes for tax year', status: 'pending' }
        ]
    }
];

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'var(--color-success)', label: 'Completed' },
    current: { icon: Clock, color: 'var(--color-synapse-teal)', label: 'In Progress' },
    pending: { icon: Clock, color: 'var(--color-steel)', label: 'Pending' },
    blocked: { icon: AlertTriangle, color: 'var(--color-warning)', label: 'Action Required' }
};

const workflowStatusConfig = {
    on_track: { color: 'var(--color-success)', label: 'On Track' },
    at_risk: { color: 'var(--color-warning)', label: 'At Risk' },
    completed: { color: 'var(--color-synapse-teal)', label: 'Completed' },
    overdue: { color: 'var(--color-critical)', label: 'Overdue' }
};

export function NewHireACAWorkflow({
    workflows = defaultWorkflows,
    className = ''
}: NewHireACAWorkflowProps) {
    const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(workflows[0]?.employeeId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">New Hire ACA Workflows</h3>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                    {workflows.length} Active
                </span>
            </div>

            {/* Workflow List */}
            <div className="space-y-3">
                {workflows.map((workflow, i) => {
                    const isExpanded = expandedWorkflow === workflow.employeeId;
                    const statusInfo = workflowStatusConfig[workflow.status];
                    const currentStep = workflow.steps.find(s => s.status === 'current' || s.status === 'blocked');
                    const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;

                    return (
                        <motion.div
                            key={workflow.employeeId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-lg border border-[var(--glass-border)] overflow-hidden"
                        >
                            {/* Workflow Header */}
                            <button
                                onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.employeeId)}
                                className="w-full p-4 bg-[var(--glass-bg-light)] flex items-center justify-between hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{workflow.employeeName}</span>
                                            <span className="text-xs text-[var(--color-steel)]">{workflow.employeeId}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[var(--color-steel)]">
                                            <span>{workflow.department}</span>
                                            <span>•</span>
                                            <span>Hired {workflow.hireDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span
                                            className="px-2 py-1 rounded text-xs font-medium"
                                            style={{
                                                backgroundColor: `${statusInfo.color}20`,
                                                color: statusInfo.color
                                            }}
                                        >
                                            {statusInfo.label}
                                        </span>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">
                                            {completedSteps}/{workflow.steps.length} steps
                                        </p>
                                    </div>
                                    {isExpanded ? <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" /> : <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />}
                                </div>
                            </button>

                            {/* Expanded Steps */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-[var(--glass-border)]"
                                    >
                                        <div className="p-4">
                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-[var(--color-steel)]">Progress</span>
                                                    <span className="text-[var(--color-synapse-teal)]">{Math.round(completedSteps / workflow.steps.length * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-[var(--color-synapse-teal)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${completedSteps / workflow.steps.length * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Steps */}
                                            <div className="space-y-1">
                                                {workflow.steps.map((step, stepIndex) => {
                                                    const stepStatus = statusConfig[step.status];
                                                    const StepIcon = stepStatus.icon;

                                                    return (
                                                        <div
                                                            key={step.id}
                                                            className={`flex items-center gap-3 p-3 rounded-lg ${step.status === 'current' || step.status === 'blocked'
                                                                    ? 'bg-[var(--glass-bg-light)]'
                                                                    : ''
                                                                }`}
                                                        >
                                                            <div
                                                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                                                style={{
                                                                    backgroundColor: `${stepStatus.color}20`,
                                                                    color: stepStatus.color
                                                                }}
                                                            >
                                                                <StepIcon className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-white">{step.title}</p>
                                                                <p className="text-xs text-[var(--color-steel)]">{step.description}</p>
                                                            </div>
                                                            {step.date && (
                                                                <span className="text-xs text-[var(--color-steel)]">{step.date}</span>
                                                            )}
                                                            {step.action && (
                                                                <button className="btn-primary text-xs py-1 px-2">
                                                                    {step.action}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default NewHireACAWorkflow;
