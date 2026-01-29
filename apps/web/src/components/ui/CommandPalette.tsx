'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Command,
    ArrowRight,
    FileText,
    Users,
    Settings,
    BarChart3,
    Shield,
    Building2,
    Clock,
    Hash
} from 'lucide-react';

interface CommandItem {
    id: string;
    title: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    shortcut?: string;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands?: CommandItem[];
    placeholder?: string;
}

const defaultCommands: CommandItem[] = [
    { id: '1', title: 'Go to Dashboard', description: 'View dashboard overview', icon: BarChart3, category: 'Navigation', shortcut: 'G D', action: () => { } },
    { id: '2', title: 'Go to Clients', description: 'View client list', icon: Building2, category: 'Navigation', shortcut: 'G C', action: () => { } },
    { id: '3', title: 'Go to Compliance', description: 'View compliance center', icon: Shield, category: 'Navigation', shortcut: 'G M', action: () => { } },
    { id: '4', title: 'New Client', description: 'Start client onboarding', icon: Building2, category: 'Actions', shortcut: 'N C', action: () => { } },
    { id: '5', title: 'Generate Reports', description: 'Create compliance reports', icon: FileText, category: 'Actions', shortcut: 'N R', action: () => { } },
    { id: '6', title: 'Search Employees', description: 'Find employee records', icon: Users, category: 'Search', action: () => { } },
    { id: '7', title: 'Recent Forms', description: 'View recently generated forms', icon: Clock, category: 'Search', action: () => { } },
    { id: '8', title: 'Open Settings', description: 'Configure application settings', icon: Settings, category: 'Actions', shortcut: ',', action: () => { } },
];

export function CommandPalette({
    isOpen,
    onClose,
    commands = defaultCommands,
    placeholder = 'Search commands...'
}: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    let flatIndex = 0;

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
                        <div className="glass-card overflow-hidden border border-[var(--glass-border)]">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)]">
                                <Search className="w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={placeholder}
                                    className="flex-1 bg-transparent text-white placeholder:text-[var(--color-steel)] focus:outline-none"
                                />
                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--glass-bg)] text-xs text-[var(--color-steel)]">
                                    <Command className="w-3 h-3" />
                                    K
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto">
                                {Object.entries(groupedCommands).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="px-4 py-2 text-xs text-[var(--color-steel)] uppercase tracking-wider bg-[var(--glass-bg-light)]">
                                            {category}
                                        </div>
                                        {items.map((cmd) => {
                                            const currentIndex = flatIndex++;
                                            const isSelected = currentIndex === selectedIndex;
                                            const Icon = cmd.icon;

                                            return (
                                                <div
                                                    key={cmd.id}
                                                    onClick={() => {
                                                        cmd.action();
                                                        onClose();
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected
                                                            ? 'bg-[var(--glass-bg-light)]'
                                                            : 'hover:bg-[var(--glass-bg)]'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                                            : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                                        }`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-white">{cmd.title}</p>
                                                        {cmd.description && (
                                                            <p className="text-xs text-[var(--color-steel)]">{cmd.description}</p>
                                                        )}
                                                    </div>
                                                    {cmd.shortcut && (
                                                        <div className="flex items-center gap-1">
                                                            {cmd.shortcut.split(' ').map((key, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-1.5 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)] font-mono"
                                                                >
                                                                    {key}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isSelected && (
                                                        <ArrowRight className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {filteredCommands.length === 0 && (
                                    <div className="p-8 text-center text-[var(--color-steel)]">
                                        <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No commands found</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--color-steel)]">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <span className="px-1 rounded bg-[var(--glass-bg)]">↑↓</span>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="px-1 rounded bg-[var(--glass-bg)]">↵</span>
                                        Select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="px-1 rounded bg-[var(--glass-bg)]">esc</span>
                                        Close
                                    </span>
                                </div>
                                <span>{filteredCommands.length} commands</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
