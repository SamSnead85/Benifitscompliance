'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
    Clock,
    Zap,
    GitBranch,
    Brain,
    FileOutput,
    Mail,
    Database,
    Webhook,
    FileText,
    Bell
} from 'lucide-react';

// Base node wrapper
function NodeWrapper({
    children,
    color,
    icon: Icon,
    label,
    selected
}: {
    children?: React.ReactNode;
    color: string;
    icon: React.ElementType;
    label: string;
    selected?: boolean;
}) {
    return (
        <div
            className={`
                min-w-[180px] bg-white rounded-xl border-2 shadow-sm transition-all
                ${selected ? 'border-[#0D9488] shadow-md' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}
            `}
        >
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
                style={{ background: `${color}10` }}
            >
                <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: color }}
                >
                    <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
            </div>
            {children && (
                <div className="px-3 py-2 text-xs text-[#64748B]">
                    {children}
                </div>
            )}
        </div>
    );
}

// Trigger Node
export const TriggerNode = memo(({ data, selected }: NodeProps) => {
    const triggerType = String(data.triggerType || 'schedule');
    const schedule = String(data.schedule || triggerType);

    return (
        <>
            <NodeWrapper
                color="#0D9488"
                icon={Clock}
                label={String(data.label)}
                selected={selected}
            >
                <div className="flex items-center gap-2">
                    {triggerType === 'schedule' && <Clock className="w-3 h-3" />}
                    {triggerType === 'webhook' && <Webhook className="w-3 h-3" />}
                    {triggerType === 'data' && <Database className="w-3 h-3" />}
                    <span>{schedule}</span>
                </div>
            </NodeWrapper>
            <Handle type="source" position={Position.Right} className="!bg-[#0D9488] !w-3 !h-3 !border-2 !border-white" />
        </>
    );
});
TriggerNode.displayName = 'TriggerNode';

// Action Node
export const ActionNode = memo(({ data, selected }: NodeProps) => {
    const actionType = String(data.actionType || 'action');

    return (
        <>
            <Handle type="target" position={Position.Left} className="!bg-[#0284C7] !w-3 !h-3 !border-2 !border-white" />
            <NodeWrapper
                color="#0284C7"
                icon={Zap}
                label={String(data.label)}
                selected={selected}
            >
                <div className="flex items-center gap-2">
                    {actionType === 'notification' && <Bell className="w-3 h-3" />}
                    {actionType === 'email' && <Mail className="w-3 h-3" />}
                    {actionType === 'update' && <Database className="w-3 h-3" />}
                    <span>{actionType}</span>
                </div>
            </NodeWrapper>
            <Handle type="source" position={Position.Right} className="!bg-[#0284C7] !w-3 !h-3 !border-2 !border-white" />
        </>
    );
});
ActionNode.displayName = 'ActionNode';

// Condition Node
export const ConditionNode = memo(({ data, selected }: NodeProps) => {
    return (
        <>
            <Handle type="target" position={Position.Left} className="!bg-[#D97706] !w-3 !h-3 !border-2 !border-white" />
            <NodeWrapper
                color="#D97706"
                icon={GitBranch}
                label={String(data.label)}
                selected={selected}
            >
                <div className="font-mono text-[10px] bg-[#FEF3C7] px-2 py-1 rounded">
                    {String(data.condition || 'if condition')}
                </div>
            </NodeWrapper>
            <Handle type="source" position={Position.Right} id="yes" style={{ top: '30%' }} className="!bg-[#059669] !w-3 !h-3 !border-2 !border-white" />
            <Handle type="source" position={Position.Right} id="no" style={{ top: '70%' }} className="!bg-[#64748B] !w-3 !h-3 !border-2 !border-white" />
        </>
    );
});
ConditionNode.displayName = 'ConditionNode';

// Agent Node
export const AgentNode = memo(({ data, selected }: NodeProps) => {
    return (
        <>
            <Handle type="target" position={Position.Left} className="!bg-[#7C3AED] !w-3 !h-3 !border-2 !border-white" />
            <NodeWrapper
                color="#7C3AED"
                icon={Brain}
                label={String(data.label)}
                selected={selected}
            >
                <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#7C3AED] font-semibold">
                        {String(data.agentType || 'analyzer')}
                    </span>
                    <div className="text-[10px] text-[#94A3B8]">
                        Model: {String(data.model || 'gemini-2.0')}
                    </div>
                </div>
            </NodeWrapper>
            <Handle type="source" position={Position.Right} className="!bg-[#7C3AED] !w-3 !h-3 !border-2 !border-white" />
        </>
    );
});
AgentNode.displayName = 'AgentNode';

// Output Node
export const OutputNode = memo(({ data, selected }: NodeProps) => {
    return (
        <>
            <Handle type="target" position={Position.Left} className="!bg-[#059669] !w-3 !h-3 !border-2 !border-white" />
            <NodeWrapper
                color="#059669"
                icon={FileOutput}
                label={String(data.label)}
                selected={selected}
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>{String(data.outputType || 'PDF Report')}</span>
                </div>
            </NodeWrapper>
        </>
    );
});
OutputNode.displayName = 'OutputNode';
