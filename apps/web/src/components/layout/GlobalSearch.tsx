'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    FileText,
    Users,
    Settings,
    BarChart3,
    Calendar,
    Command,
    ArrowRight
} from 'lucide-react';

interface GlobalSearchProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    type: 'employee' | 'form' | 'report' | 'setting' | 'page';
    title: string;
    description: string;
    icon: React.ElementType;
    path: string;
}

const mockResults: SearchResult[] = [
    { id: 'emp-1', type: 'employee', title: 'Michael Chen', description: 'Engineering • EMP-001', icon: Users, path: '/employees/EMP-001' },
    { id: 'emp-2', type: 'employee', title: 'Sarah Johnson', description: 'Sales • EMP-045', icon: Users, path: '/employees/EMP-045' },
    { id: 'form-1', type: 'form', title: '1095-C Form - Michael Chen', description: 'Tax Year 2025 • Approved', icon: FileText, path: '/forms/1095c/EMP-001' },
    { id: 'report-1', type: 'report', title: 'FTE Analysis Report', description: 'Generated Jan 15, 2026', icon: BarChart3, path: '/reports/fte-analysis' },
    { id: 'page-1', type: 'page', title: 'Compliance Dashboard', description: 'View compliance metrics', icon: BarChart3, path: '/compliance' },
    { id: 'setting-1', type: 'setting', title: 'Notification Settings', description: 'Email and push preferences', icon: Settings, path: '/settings/notifications' },
];

const recentSearches = ['FTE calculation', '1095-C forms', 'penalty report', 'safe harbor codes'];

const quickActions = [
    { label: 'Generate Forms', icon: FileText, path: '/forms/generate' },
    { label: 'Run Compliance Check', icon: Settings, path: '/compliance/check' },
    { label: 'View Reports', icon: BarChart3, path: '/reports' },
    { label: 'Import Data', icon: Users, path: '/import' },
];

export function GlobalSearch({ className = '', isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.length > 0) {
            // Filter mock results
            setResults(mockResults.filter(r =>
                r.title.toLowerCase().includes(value.toLowerCase()) ||
                r.description.toLowerCase().includes(value.toLowerCase())
            ));
        } else {
            setResults([]);
        }
    };

    const typeColors: Record<string, string> = {
        employee: 'var(--color-synapse-cyan)',
        form: 'var(--color-synapse-gold)',
        report: 'var(--color-synapse-teal)',
        setting: 'var(--color-steel)',
        page: 'var(--color-success)',
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 ${className}`}
                    >
                        <div className="glass-card overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)]">
                                <Search className="w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    type="text"
                                    placeholder="Search employees, forms, reports..."
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoFocus
                                    className="flex-1 bg-transparent text-white placeholder:text-[var(--color-steel)] outline-none text-lg"
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 rounded bg-[var(--glass-bg)] text-xs text-[var(--color-steel)]">
                                        <Command className="w-3 h-3 inline" /> K
                                    </kbd>
                                    <button onClick={onClose} className="p-1 rounded hover:bg-[var(--glass-bg)]">
                                        <X className="w-5 h-5 text-[var(--color-steel)]" />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {query.length === 0 ? (
                                    <>
                                        {/* Recent Searches */}
                                        <div className="p-4">
                                            <p className="text-xs font-medium text-[var(--color-steel)] mb-2">Recent Searches</p>
                                            <div className="flex flex-wrap gap-2">
                                                {recentSearches.map((search) => (
                                                    <button
                                                        key={search}
                                                        onClick={() => handleSearch(search)}
                                                        className="px-3 py-1 rounded-full bg-[var(--glass-bg)] text-sm text-[var(--color-steel)] hover:text-white transition-colors"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="p-4 pt-0">
                                            <p className="text-xs font-medium text-[var(--color-steel)] mb-2">Quick Actions</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {quickActions.map((action) => {
                                                    const Icon = action.icon;
                                                    return (
                                                        <button
                                                            key={action.label}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--glass-bg-light)] hover:bg-[var(--glass-bg)] border border-[var(--glass-border)] transition-colors text-left"
                                                        >
                                                            <Icon className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                                            <span className="text-sm text-white">{action.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                ) : results.length > 0 ? (
                                    <div className="p-2">
                                        {results.map((result, i) => {
                                            const Icon = result.icon;
                                            return (
                                                <motion.button
                                                    key={result.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: `${typeColors[result.type]}20` }}
                                                    >
                                                        <Icon className="w-5 h-5" style={{ color: typeColors[result.type] }} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-medium text-white">{result.title}</p>
                                                        <p className="text-xs text-[var(--color-steel)]">{result.description}</p>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)] capitalize">
                                                        {result.type}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-[var(--color-steel)]" />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Search className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                                        <p className="text-[var(--color-steel)]">No results found for &quot;{query}&quot;</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--color-steel)]">
                                <div className="flex items-center gap-3">
                                    <span><kbd className="px-1 py-0.5 rounded bg-[var(--glass-bg)]">↵</kbd> Select</span>
                                    <span><kbd className="px-1 py-0.5 rounded bg-[var(--glass-bg)]">↑↓</kbd> Navigate</span>
                                </div>
                                <span><kbd className="px-1 py-0.5 rounded bg-[var(--glass-bg)]">Esc</kbd> Close</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default GlobalSearch;
