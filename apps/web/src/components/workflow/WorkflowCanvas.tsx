'use client';

import { useCallback, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Save, Trash2, Undo, Redo, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { TriggerNode, ActionNode, ConditionNode, AgentNode, OutputNode } from './WorkflowNodes';
import { WorkflowSidebar } from './WorkflowSidebar';

// Custom node types
const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
    agent: AgentNode,
    output: OutputNode,
};

// Initial nodes for demo
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'New Claims Data', triggerType: 'schedule', schedule: 'Daily at 6:00 AM' },
    },
    {
        id: '2',
        type: 'agent',
        position: { x: 350, y: 100 },
        data: { label: 'Analyze Claims', agentType: 'analyzer', model: 'gemini-2.0' },
    },
    {
        id: '3',
        type: 'condition',
        position: { x: 600, y: 100 },
        data: { label: 'High Cost?', condition: 'claim_amount > $50,000' },
    },
    {
        id: '4',
        type: 'action',
        position: { x: 850, y: 50 },
        data: { label: 'Alert Reviewer', actionType: 'notification' },
    },
    {
        id: '5',
        type: 'output',
        position: { x: 850, y: 180 },
        data: { label: 'Generate Report', outputType: 'pdf' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4', label: 'Yes', style: { stroke: '#059669' } },
    { id: 'e3-5', source: '3', target: '5', label: 'No', style: { stroke: '#64748B' } },
];

interface WorkflowCanvasProps {
    workflowId?: string;
    workflowName?: string;
}

export function WorkflowCanvas({ workflowName = 'Claims Processing Workflow' }: WorkflowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = {
                x: event.clientX - 300,
                y: event.clientY - 100,
            };

            const newNode: Node = {
                id: `${Date.now()}`,
                type,
                position,
                data: { label: `New ${type}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleRun = () => {
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 3000);
    };

    const handleSave = () => {
        console.log('Saving workflow:', { nodes, edges });
    };

    const handleClear = () => {
        setNodes([]);
        setEdges([]);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden">
            {/* Sidebar */}
            <WorkflowSidebar selectedNode={selectedNode} />

            {/* Canvas */}
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-[#FAFBFC]"
                >
                    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#CBD5E1" />
                    <Controls
                        showZoom={false}
                        showFitView={false}
                        showInteractive={false}
                        className="!bg-white !border-[#E2E8F0] !shadow-sm"
                    />
                    <MiniMap
                        nodeColor={(node) => {
                            switch (node.type) {
                                case 'trigger': return '#0D9488';
                                case 'agent': return '#7C3AED';
                                case 'condition': return '#D97706';
                                case 'action': return '#0284C7';
                                case 'output': return '#059669';
                                default: return '#64748B';
                            }
                        }}
                        className="!bg-white !border-[#E2E8F0]"
                        maskColor="rgba(241, 245, 249, 0.7)"
                    />

                    {/* Top Toolbar */}
                    <Panel position="top-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                            <span className="text-sm font-semibold text-[#0F172A]">{workflowName}</span>
                            <div className="w-px h-5 bg-[#E2E8F0]" />
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#64748B]">
                                    <Undo className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#64748B]">
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="w-px h-5 bg-[#E2E8F0]" />
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#64748B]">
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-[#64748B] w-10 text-center">100%</span>
                                <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#64748B]">
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded hover:bg-[#F1F5F9] text-[#64748B]">
                                    <Maximize className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Panel>

                    {/* Bottom Actions */}
                    <Panel position="bottom-center">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-[#0D9488] hover:bg-[#0F766E] rounded transition-colors disabled:opacity-50"
                            >
                                <Play className="w-4 h-4" />
                                {isRunning ? 'Running...' : 'Run Workflow'}
                            </button>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
}
