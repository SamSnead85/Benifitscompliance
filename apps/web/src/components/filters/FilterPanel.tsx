'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    X,
    ChevronDown,
    Calendar,
    Users,
    Shield,
    Check
} from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterGroup {
    id: string;
    label: string;
    icon?: React.ElementType;
    options: FilterOption[];
    type: 'checkbox' | 'radio' | 'range';
}

interface FilterPanelProps {
    filters: FilterGroup[];
    activeFilters: Record<string, string[]>;
    onChange: (filterId: string, values: string[]) => void;
    onClear?: () => void;
    className?: string;
}

export function FilterPanel({
    filters,
    activeFilters,
    onChange,
    onClear,
    className = ''
}: FilterPanelProps) {
    const [expandedGroups, setExpandedGroups] = useState<string[]>(filters.map(f => f.id));

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const toggleOption = (groupId: string, value: string, type: 'checkbox' | 'radio' | 'range') => {
        const current = activeFilters[groupId] || [];

        if (type === 'radio') {
            onChange(groupId, [value]);
        } else {
            if (current.includes(value)) {
                onChange(groupId, current.filter(v => v !== value));
            } else {
                onChange(groupId, [...current, value]);
            }
        }
    };

    const totalActiveFilters = Object.values(activeFilters).flat().length;

    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                    <span className="font-medium text-white">Filters</span>
                    {totalActiveFilters > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-synapse-teal)] text-black">
                            {totalActiveFilters}
                        </span>
                    )}
                </div>
                {totalActiveFilters > 0 && onClear && (
                    <button
                        onClick={onClear}
                        className="text-xs text-[var(--color-steel)] hover:text-white flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Groups */}
            <div className="divide-y divide-[var(--glass-border)]">
                {filters.map((group) => {
                    const Icon = group.icon;
                    const isExpanded = expandedGroups.includes(group.id);
                    const activeCount = (activeFilters[group.id] || []).length;

                    return (
                        <div key={group.id}>
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-[var(--glass-bg-light)] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {Icon && <Icon className="w-4 h-4 text-[var(--color-steel)]" />}
                                    <span className="text-sm font-medium text-white">{group.label}</span>
                                    {activeCount > 0 && (
                                        <span className="px-1.5 py-0.5 text-xs rounded bg-[var(--glass-bg)] text-[var(--color-synapse-teal)]">
                                            {activeCount}
                                        </span>
                                    )}
                                </div>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 space-y-2">
                                            {group.options.map((option) => {
                                                const isActive = (activeFilters[group.id] || []).includes(option.value);

                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => toggleOption(group.id, option.value, group.type)}
                                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                                                    >
                                                        <div className={`w-4 h-4 rounded ${group.type === 'radio' ? 'rounded-full' : ''
                                                            } border ${isActive
                                                                ? 'bg-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)]'
                                                                : 'border-[var(--glass-border)]'
                                                            } flex items-center justify-center`}>
                                                            {isActive && (
                                                                <Check className="w-3 h-3 text-black" />
                                                            )}
                                                        </div>
                                                        <span className={`text-sm flex-1 text-left ${isActive ? 'text-white' : 'text-[var(--color-steel)]'
                                                            }`}>
                                                            {option.label}
                                                        </span>
                                                        {option.count !== undefined && (
                                                            <span className="text-xs text-[var(--color-steel)]">
                                                                {option.count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


// Active filter chips
interface FilterChipsProps {
    activeFilters: Record<string, string[]>;
    filterLabels: Record<string, Record<string, string>>;
    onRemove: (filterId: string, value: string) => void;
    onClearAll?: () => void;
    className?: string;
}

export function FilterChips({
    activeFilters,
    filterLabels,
    onRemove,
    onClearAll,
    className = ''
}: FilterChipsProps) {
    const allFilters = Object.entries(activeFilters).flatMap(([groupId, values]) =>
        values.map(value => ({
            groupId,
            value,
            label: filterLabels[groupId]?.[value] || value
        }))
    );

    if (allFilters.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {allFilters.map((filter) => (
                <motion.span
                    key={`${filter.groupId}-${filter.value}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(20,184,166,0.1)] border border-[var(--color-synapse-teal)] text-sm text-[var(--color-synapse-teal)]"
                >
                    {filter.label}
                    <button
                        onClick={() => onRemove(filter.groupId, filter.value)}
                        className="hover:text-white"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </motion.span>
            ))}
            {allFilters.length > 1 && onClearAll && (
                <button
                    onClick={onClearAll}
                    className="text-sm text-[var(--color-steel)] hover:text-white"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}

export default FilterPanel;
