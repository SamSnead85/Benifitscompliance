'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Command,
    Search,
    FileText,
    Users,
    Shield,
    Settings,
    BarChart3,
    ArrowRight,
    Clock,
    Star
} from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (item: CommandItem) => void;
}

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ElementType;
    category: string;
    shortcut?: string;
    action?: () => void;
}

const commands: CommandItem[] = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: BarChart3, category: 'Navigation' },
    { id: 'employees', label: 'View Employees', icon: Users, category: 'Navigation' },
    { id: 'compliance', label: 'Compliance Center', icon: Shield, category: 'Navigation' },
    { id: 'forms', label: 'Generate Forms', icon: FileText, category: 'Actions', shortcut: '⌘G' },
    { id: 'import', label: 'Import Data', icon: FileText, category: 'Actions', shortcut: '⌘I' },
    { id: 'settings', label: 'Open Settings', icon: Settings, category: 'Navigation', shortcut: '⌘,' },
    { id: 'reports', label: 'Generate Report', icon: BarChart3, category: 'Actions' },
];

const recentCommands: string[] = ['dashboard', 'employees', 'forms'];

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                onSelect?.(filteredCommands[selectedIndex]);
                onClose();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, onSelect, onClose]);

    let currentIndex = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
                    >
                        <div className="glass-card overflow-hidden shadow-2xl">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)]">
                                <Search className="w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent text-white placeholder:text-[var(--color-steel)] outline-none text-sm"
                                />
                                <kbd className="px-2 py-1 rounded bg-[var(--glass-bg)] text-xs text-[var(--color-steel)]">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto p-2">
                                {/* Recent */}
                                {query === '' && (
                                    <div className="mb-4">
                                        <p className="px-3 py-2 text-xs font-medium text-[var(--color-steel)]">Recent</p>
                                        {commands
                                            .filter(c => recentCommands.includes(c.id))
                                            .map((cmd) => {
                                                const Icon = cmd.icon;
                                                const isSelected = currentIndex === selectedIndex;
                                                currentIndex++;

                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={() => { onSelect?.(cmd); onClose(); }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isSelected ? 'bg-[rgba(20,184,166,0.1)]' : 'hover:bg-[var(--glass-bg)]'
                                                            }`}
                                                    >
                                                        <Clock className="w-4 h-4 text-[var(--color-steel)]" />
                                                        <span className="text-sm text-white">{cmd.label}</span>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                )}

                                {/* Grouped Commands */}
                                {Object.entries(groupedCommands).map(([category, items]) => (
                                    <div key={category} className="mb-2">
                                        <p className="px-3 py-2 text-xs font-medium text-[var(--color-steel)]">{category}</p>
                                        {items.map((cmd) => {
                                            const Icon = cmd.icon;
                                            const isSelected = currentIndex === selectedIndex;
                                            const itemIndex = currentIndex;
                                            currentIndex++;

                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => { onSelect?.(cmd); onClose(); }}
                                                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isSelected ? 'bg-[rgba(20,184,166,0.1)]' : 'hover:bg-[var(--glass-bg)]'
                                                        }`}
                                                >
                                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`} />
                                                    <span className="flex-1 text-left text-sm text-white">{cmd.label}</span>
                                                    {cmd.shortcut && (
                                                        <kbd className="px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-xs text-[var(--color-steel)]">
                                                            {cmd.shortcut}
                                                        </kbd>
                                                    )}
                                                    {isSelected && <ArrowRight className="w-4 h-4 text-[var(--color-synapse-teal)]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}

                                {filteredCommands.length === 0 && (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-[var(--color-steel)]">No commands found</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 rounded bg-[var(--glass-bg)]">↑</kbd>
                                        <kbd className="px-1 rounded bg-[var(--glass-bg)]">↓</kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 rounded bg-[var(--glass-bg)]">↵</kbd>
                                        Select
                                    </span>
                                </div>
                                <span className="text-xs text-[var(--color-steel)]">⌘K to toggle</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
