'use client';

import { motion } from 'framer-motion';
import { Workflow, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { WorkflowCanvas } from '@/components/workflow';

const savedWorkflows = [
    { id: '1', name: 'Claims Processing Workflow', status: 'active', lastRun: '2 hours ago', runs: 142 },
    { id: '2', name: 'Monthly SIR Report', status: 'active', lastRun: '1 day ago', runs: 12 },
    { id: '3', name: 'High Claimant Alert', status: 'paused', lastRun: '3 days ago', runs: 67 },
    { id: '4', name: 'Data Sync Automation', status: 'error', lastRun: '5 hours ago', runs: 89 },
];

function StatusBadge({ status }: { status: string }) {
    const config = {
        active: { label: 'Active', bg: 'bg-[#059669]/10', text: 'text-[#059669]', icon: CheckCircle2 },
        paused: { label: 'Paused', bg: 'bg-[#64748B]/10', text: 'text-[#64748B]', icon: Clock },
        error: { label: 'Error', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', icon: AlertCircle },
    }[status] || { label: status, bg: 'bg-[#64748B]/10', text: 'text-[#64748B]', icon: Clock };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <config.icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

export default function WorkflowBuilderPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Workflow Builder</h1>
                    <p className="text-[#64748B] mt-1">Create and manage automated workflows with AI agents</p>
                </div>
                <Link
                    href="/workflow-builder/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Workflow
                </Link>
            </div>

            {/* Active Workflow Canvas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <WorkflowCanvas workflowName="Claims Processing Workflow" />
            </motion.div>

            {/* Saved Workflows */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Workflow className="w-5 h-5 text-[#0D9488]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">Saved Workflows</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E2E8F0]">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Workflow</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Run</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Runs</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedWorkflows.map((workflow) => (
                                <tr key={workflow.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                                                <Workflow className="w-4 h-4 text-[#0D9488]" />
                                            </div>
                                            <span className="text-sm font-medium text-[#0F172A]">{workflow.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4"><StatusBadge status={workflow.status} /></td>
                                    <td className="py-3 px-4 text-sm text-[#64748B]">{workflow.lastRun}</td>
                                    <td className="py-3 px-4 text-sm font-mono text-[#334155]">{workflow.runs}</td>
                                    <td className="py-3 px-4">
                                        <button className="text-sm text-[#0D9488] font-medium hover:underline">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
