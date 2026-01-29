'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
    Search,
    Command,
    Users,
    Building2,
    FileText,
    Calendar,
    Settings,
    ArrowRight,
    Clock,
    Star,
    X,
    Keyboard,
} from 'lucide-react';

interface SearchResult {
    id: string;
    type: 'employee' | 'organization' | 'document' | 'setting' | 'action';
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: () => void;
}

interface SmartSearchProps {
    isOpen: boolean;
    onClose: () => void;
    recentSearches?: string[];
    className?: string;
}

/**
 * Smart Search (Command-K)
 * Semantic search with fuzzy matching and recent history
 */
export function SmartSearch({
    isOpen,
    onClose,
    recentSearches = [],
    className = '',
}: SmartSearchProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Mock search results
    useEffect(() => {
        if (!query) {
            // Show recent/suggested when no query
            setResults([
                { id: '1', type: 'action', title: 'Generate Compliance Report', subtitle: 'Create PDF report', icon: <FileText className="w-4 h-4" /> },
                { id: '2', type: 'action', title: 'View Penalty Exposure', subtitle: 'Dashboard overview', icon: <Building2 className="w-4 h-4" /> },
                { id: '3', type: 'action', title: 'Employee Search', subtitle: 'Find by name or ID', icon: <Users className="w-4 h-4" /> },
                { id: '4', type: 'setting', title: 'Settings', subtitle: 'Configure platform', icon: <Settings className="w-4 h-4" /> },
            ]);
            return;
        }

        // Simulate search with results
        const lowerQuery = query.toLowerCase();
        const mockResults: SearchResult[] = [];

        if (lowerQuery.includes('john') || lowerQuery.includes('emp')) {
            mockResults.push(
                { id: 'e1', type: 'employee', title: 'John Smith', subtitle: 'ID: EMP-001 • FT Eligible', icon: <Users className="w-4 h-4" /> },
                { id: 'e2', type: 'employee', title: 'John Martinez', subtitle: 'ID: EMP-042 • Variable Hour', icon: <Users className="w-4 h-4" /> },
            );
        }

        if (lowerQuery.includes('report') || lowerQuery.includes('pdf')) {
            mockResults.push(
                { id: 'd1', type: 'document', title: '2025 1094-C Transmittal', subtitle: 'Filed Jan 2026', icon: <FileText className="w-4 h-4" /> },
                { id: 'd2', type: 'document', title: 'Q4 Compliance Report', subtitle: 'Generated Dec 2025', icon: <FileText className="w-4 h-4" /> },
            );
        }

        if (lowerQuery.includes('org') || lowerQuery.includes('acme')) {
            mockResults.push(
                { id: 'o1', type: 'organization', title: 'Acme Corporation', subtitle: 'EIN: 12-3456789 • 450 employees', icon: <Building2 className="w-4 h-4" /> },
                { id: 'o2', type: 'organization', title: 'Acme West Division', subtitle: 'EIN: 12-3456790 • 125 employees', icon: <Building2 className="w-4 h-4" /> },
            );
        }

        if (lowerQuery.includes('setting') || lowerQuery.includes('config')) {
            mockResults.push(
                { id: 's1', type: 'setting', title: 'Measurement Period Settings', subtitle: 'Configure look-back periods', icon: <Settings className="w-4 h-4" /> },
                { id: 's2', type: 'setting', title: 'Notification Preferences', subtitle: 'Alert configurations', icon: <Settings className="w-4 h-4" /> },
            );
        }

        // Default actions if no specific results
        if (mockResults.length === 0) {
            mockResults.push(
                { id: 'a1', type: 'action', title: `Search for "${query}"`, subtitle: 'View all results', icon: <Search className="w-4 h-4" /> },
            );
        }

        setResults(mockResults);
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            results[selectedIndex].action?.();
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'employee': return 'text-cyan-400';
            case 'organization': return 'text-indigo-400';
            case 'document': return 'text-emerald-400';
            case 'setting': return 'text-amber-400';
            default: return 'text-[#94A3B8]';
        }
    };

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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`
              fixed z-50 left-1/2 top-[20vh] -translate-x-1/2
              w-full max-w-[600px]
              bg-[#0A0A0F] border border-[rgba(255,255,255,0.08)] rounded-xl
              shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(6,182,212,0.1)]
              overflow-hidden
              ${className}
            `}
                    >
                        {/* Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                            <Search className="w-5 h-5 text-[#64748B]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search employees, organizations, documents..."
                                className="flex-1 bg-transparent text-white text-sm placeholder-[#64748B] focus:outline-none"
                            />
                            <div className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[rgba(255,255,255,0.06)] rounded">
                                    ESC
                                </kbd>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {results.length > 0 ? (
                                <div className="p-2">
                                    {recentSearches.length > 0 && !query && (
                                        <div className="px-3 py-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                                                Recent Searches
                                            </p>
                                        </div>
                                    )}

                                    {!query && (
                                        <div className="px-3 pt-2 pb-1">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                                                Quick Actions
                                            </p>
                                        </div>
                                    )}

                                    {results.map((result, index) => (
                                        <motion.button
                                            key={result.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            onClick={() => {
                                                result.action?.();
                                                onClose();
                                            }}
                                            className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                        transition-colors
                        ${selectedIndex === index
                                                    ? 'bg-cyan-500/10 text-white'
                                                    : 'hover:bg-[rgba(255,255,255,0.04)] text-[#94A3B8]'
                                                }
                      `}
                                        >
                                            <span className={getTypeColor(result.type)}>
                                                {result.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {result.title}
                                                </p>
                                                {result.subtitle && (
                                                    <p className="text-xs text-[#64748B] truncate">
                                                        {result.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Search className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                                    <p className="text-sm text-white">No results found</p>
                                    <p className="text-xs text-[#64748B]">Try a different search term</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-[rgba(255,255,255,0.06)] rounded">↑↓</kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-[rgba(255,255,255,0.06)] rounded">↵</kbd>
                                        Select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Command className="w-3 h-3" />K to open
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default SmartSearch;
