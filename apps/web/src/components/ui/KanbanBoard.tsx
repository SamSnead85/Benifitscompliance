'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    MoreHorizontal,
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronRight
} from 'lucide-react';

interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
}

interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    cards: KanbanCard[];
}

interface KanbanBoardProps {
    columns?: KanbanColumn[];
    onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
    className?: string;
}

const defaultColumns: KanbanColumn[] = [
    {
        id: 'pending',
        title: 'Pending Review',
        color: 'var(--color-warning)',
        cards: [
            { id: '1', title: 'Missing 1095-C for Smith, John', description: 'Coverage code needs verification', assignee: 'Sarah M.', dueDate: 'Jan 28', priority: 'high', tags: ['1095-C'] },
            { id: '2', title: 'Hours discrepancy - Q4', description: 'Variable hour employee classification', assignee: 'Mike R.', dueDate: 'Jan 30', priority: 'medium', tags: ['Classification'] },
        ]
    },
    {
        id: 'in_progress',
        title: 'In Progress',
        color: 'var(--color-synapse-cyan)',
        cards: [
            { id: '3', title: 'Affordability calculation review', description: '15 employees flagged', assignee: 'Sarah M.', priority: 'high', tags: ['Affordability'] },
        ]
    },
    {
        id: 'awaiting',
        title: 'Awaiting Info',
        color: 'var(--color-steel)',
        cards: [
            { id: '4', title: 'HRIS sync verification', description: 'Waiting for Gusto confirmation', assignee: 'Admin', dueDate: 'Feb 1', priority: 'low', tags: ['Integration'] },
        ]
    },
    {
        id: 'resolved',
        title: 'Resolved',
        color: 'var(--color-success)',
        cards: [
            { id: '5', title: 'Safe harbor documentation', description: 'Completed', assignee: 'Mike R.', tags: ['Compliance'] },
        ]
    }
];

const priorityConfig = {
    high: { color: 'var(--color-critical)', icon: AlertCircle },
    medium: { color: 'var(--color-warning)', icon: Clock },
    low: { color: 'var(--color-steel)', icon: CheckCircle2 }
};

export function KanbanBoard({
    columns = defaultColumns,
    onCardMove,
    className = ''
}: KanbanBoardProps) {
    const [draggedCard, setDraggedCard] = useState<{ cardId: string; fromColumn: string } | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDragStart = (cardId: string, columnId: string) => {
        setDraggedCard({ cardId, fromColumn: columnId });
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDrop = (columnId: string) => {
        if (draggedCard && draggedCard.fromColumn !== columnId) {
            onCardMove?.(draggedCard.cardId, draggedCard.fromColumn, columnId);
        }
        setDraggedCard(null);
        setDragOverColumn(null);
    };

    return (
        <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
            {columns.map((column, i) => (
                <motion.div
                    key={column.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDrop={() => handleDrop(column.id)}
                    className={`flex-shrink-0 w-72 rounded-lg bg-[var(--glass-bg)] border transition-colors ${dragOverColumn === column.id
                            ? 'border-[var(--color-synapse-teal)]'
                            : 'border-[var(--glass-border)]'
                        }`}
                >
                    {/* Column Header */}
                    <div className="p-3 border-b border-[var(--glass-border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: column.color }}
                            />
                            <span className="font-medium text-white text-sm">{column.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--glass-bg-light)] text-[var(--color-steel)]">
                                {column.cards.length}
                            </span>
                        </div>
                        <button className="p-1 rounded hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Cards */}
                    <div className="p-2 space-y-2 min-h-[200px]">
                        {column.cards.map((card, cardIndex) => {
                            const priority = card.priority ? priorityConfig[card.priority] : null;
                            const PriorityIcon = priority?.icon;

                            return (
                                <motion.div
                                    key={card.id}
                                    draggable
                                    onDragStart={() => handleDragStart(card.id, column.id)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: cardIndex * 0.05 }}
                                    className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] cursor-grab hover:border-[var(--glass-border-hover)] transition-colors active:cursor-grabbing"
                                >
                                    {/* Priority */}
                                    {priority && PriorityIcon && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <PriorityIcon className="w-3 h-3" style={{ color: priority.color }} />
                                            <span className="text-xs capitalize" style={{ color: priority.color }}>
                                                {card.priority}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h4 className="text-sm font-medium text-white mb-1">{card.title}</h4>

                                    {/* Description */}
                                    {card.description && (
                                        <p className="text-xs text-[var(--color-steel)] mb-2">{card.description}</p>
                                    )}

                                    {/* Tags */}
                                    {card.tags && card.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {card.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-1.5 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-silver)]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
                                        {card.assignee && (
                                            <div className="flex items-center gap-1 text-xs text-[var(--color-steel)]">
                                                <User className="w-3 h-3" />
                                                {card.assignee}
                                            </div>
                                        )}
                                        {card.dueDate && (
                                            <div className="flex items-center gap-1 text-xs text-[var(--color-steel)]">
                                                <Calendar className="w-3 h-3" />
                                                {card.dueDate}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default KanbanBoard;
