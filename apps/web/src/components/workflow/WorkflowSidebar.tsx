'use client';

import { Node } from '@xyflow/react';
import {
    Clock,
    Zap,
    GitBranch,
    Brain,
    FileOutput,
    GripVertical,
    Settings,
    ChevronRight
} from 'lucide-react';

const nodeTemplates = [
    { type: 'trigger', label: 'Trigger', icon: Clock, color: '#0D9488', description: 'Start a workflow' },
    { type: 'action', label: 'Action', icon: Zap, color: '#0284C7', description: 'Perform an operation' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: '#D97706', description: 'Add branching logic' },
    { type: 'agent', label: 'AI Agent', icon: Brain, color: '#7C3AED', description: 'Process with AI' },
    { type: 'output', label: 'Output', icon: FileOutput, color: '#059669', description: 'Generate results' },
];

interface WorkflowSidebarProps {
    selectedNode: Node | null;
}

export function WorkflowSidebar({ selectedNode }: WorkflowSidebarProps) {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col">
            {/* Node Palette */}
            <div className="p-4 border-b border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Nodes</h3>
                <div className="space-y-2">
                    {nodeTemplates.map((node) => (
                        <div
                            key={node.type}
                            draggable
                            onDragStart={(e) => onDragStart(e, node.type)}
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-grab hover:border-[#CBD5E1] hover:shadow-sm transition-all active:cursor-grabbing"
                        >
                            <div className="text-[#94A3B8]">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: `${node.color}15` }}
                            >
                                <node.icon className="w-4 h-4" style={{ color: node.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[#0F172A]">{node.label}</div>
                                <div className="text-xs text-[#64748B] truncate">{node.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Node Properties */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#0F172A]">Properties</h3>
                    <Settings className="w-4 h-4 text-[#64748B]" />
                </div>

                {selectedNode ? (
                    <div className="space-y-4">
                        {/* Node Type */}
                        <div>
                            <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                Type
                            </label>
                            <div className="mt-1 px-3 py-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] capitalize">
                                {selectedNode.type}
                            </div>
                        </div>

                        {/* Node Label */}
                        <div>
                            <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                Label
                            </label>
                            <input
                                type="text"
                                defaultValue={selectedNode.data.label as string}
                                className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                            />
                        </div>

                        {/* Type-specific properties */}
                        {selectedNode.type === 'trigger' && (
                            <div>
                                <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                    Trigger Type
                                </label>
                                <select className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]">
                                    <option value="schedule">Schedule</option>
                                    <option value="webhook">Webhook</option>
                                    <option value="data">Data Change</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>
                        )}

                        {selectedNode.type === 'agent' && (
                            <>
                                <div>
                                    <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                        Agent Type
                                    </label>
                                    <select className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]">
                                        <option value="analyzer">Analyzer</option>
                                        <option value="classifier">Classifier</option>
                                        <option value="extractor">Extractor</option>
                                        <option value="summarizer">Summarizer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                        Model
                                    </label>
                                    <select className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]">
                                        <option value="gemini-2.0">Gemini 2.0 Pro</option>
                                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                        <option value="claude-3.5">Claude 3.5 Sonnet</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {selectedNode.type === 'condition' && (
                            <div>
                                <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                    Condition Expression
                                </label>
                                <textarea
                                    defaultValue={selectedNode.data.condition as string}
                                    rows={3}
                                    className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] font-mono focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                                />
                            </div>
                        )}

                        {selectedNode.type === 'output' && (
                            <div>
                                <label className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                    Output Format
                                </label>
                                <select className="mt-1 w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]">
                                    <option value="pdf">PDF Report</option>
                                    <option value="excel">Excel Spreadsheet</option>
                                    <option value="email">Email Notification</option>
                                    <option value="webhook">Webhook POST</option>
                                </select>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                            <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
                        </div>
                        <p className="text-sm text-[#64748B]">
                            Select a node to view its properties
                        </p>
                    </div>
                )}
            </div>

            {/* Execution Stats */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                        <div className="text-lg font-bold text-[#0F172A]">5</div>
                        <div className="text-xs text-[#64748B]">Nodes</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-[#0F172A]">4</div>
                        <div className="text-xs text-[#64748B]">Connections</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
