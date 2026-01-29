'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Sparkles, Send, Mic, History, BookmarkPlus, TrendingUp, TrendingDown,
    DollarSign, Users, PieChart as PieChartIcon, BarChart3, ArrowRight,
    Lightbulb, ChevronRight, Copy, Download, Share2, X, Check, Loader2,
    Clock, MessageSquare, Zap, Star, AlertCircle
} from 'lucide-react';

// ============================================================================
// DEMO DATA
// ============================================================================

const suggestedQueries = [
    { text: 'What are the top 5 cost drivers this quarter?', category: 'Cost Analysis' },
    { text: 'Show me PMPM trend vs budget for last 12 months', category: 'Trends' },
    { text: 'Which providers have the highest cost per episode?', category: 'Providers' },
    { text: 'How much are we spending on GLP-1 medications?', category: 'Pharmacy' },
    { text: 'What is our current stop-loss utilization?', category: 'Stop-Loss' },
    { text: 'Identify members at risk of exceeding stop-loss', category: 'Risk' }
];

const queryHistory = [
    { id: 1, query: 'Show claims breakdown by category', timestamp: '2 hours ago', starred: true },
    { id: 2, query: 'PMPM trend for Q4', timestamp: '5 hours ago', starred: false },
    { id: 3, query: 'Top specialty drug costs', timestamp: 'Yesterday', starred: true },
    { id: 4, query: 'Member count by plan type', timestamp: '2 days ago', starred: false }
];

// Demo response data
const demoChartData = [
    { category: 'Inpatient', cost: 2847234, percent: 34.5 },
    { category: 'Outpatient', cost: 1523456, percent: 18.5 },
    { category: 'Pharmacy', cost: 1234567, percent: 15.0 },
    { category: 'Professional', cost: 987654, percent: 12.0 },
    { category: 'ER/Urgent', cost: 654321, percent: 7.9 },
    { category: 'Other', cost: 998765, percent: 12.1 }
];

const COLORS = ['#F59E0B', '#8B5CF6', '#06B6D4', '#10B981', '#EF4444', '#64748B'];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface QueryResultProps {
    query: string;
    isLoading: boolean;
}

function QueryResult({ query, isLoading }: QueryResultProps) {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]"
            >
                <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" />
                    <span className="text-sm text-[var(--text-secondary)]">Analyzing your query...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            {/* Query Echo */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-primary)]">
                <MessageSquare className="w-5 h-5 text-[var(--accent-primary)] mt-0.5" />
                <div>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Your Question</span>
                    <p className="text-sm text-[var(--text-primary)] mt-1">{query}</p>
                </div>
            </div>

            {/* AI Response */}
            <div className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">AI Analysis</span>
                </div>

                {/* Summary Text */}
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Based on your claims data for the current plan year, here is the breakdown of costs by category.
                    <strong className="text-[var(--text-primary)]"> Inpatient</strong> continues to be the largest cost driver at 34.5% of total spend,
                    followed by <strong className="text-[var(--text-primary)]">Outpatient</strong> services at 18.5%.
                </p>

                {/* Chart */}
                <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demoChartData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                            <YAxis dataKey="category" type="category" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={75} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--surface-secondary)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                formatter={(value) => value !== undefined ? [formatCurrency(Number(value)), 'Cost'] : ['', '']}
                            />
                            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                                {demoChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-[var(--surface-secondary)]">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">Highest Category</div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Inpatient</div>
                        <div className="text-lg font-semibold font-mono text-[var(--accent-primary)]">$2.8M</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--surface-secondary)]">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">YoY Change</div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-rose-400" />
                            <span className="text-lg font-semibold font-mono text-rose-400">+8.3%</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--surface-secondary)]">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">Total Analyzed</div>
                        <div className="text-lg font-semibold font-mono text-[var(--text-primary)]">$8.2M</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-primary)]">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        Save Query
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                    </button>
                </div>
            </div>

            {/* Follow-up Suggestions */}
            <div className="p-4 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-primary)]">
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Related Questions</div>
                <div className="flex flex-wrap gap-2">
                    {['Show trend over time', 'Compare to prior year', 'Break down by provider', 'Show high-cost members'].map((suggestion) => (
                        <button
                            key={suggestion}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--surface-primary)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-colors"
                        >
                            {suggestion}
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AIQueryPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSubmittedQuery(query);
        setIsLoading(true);
        setHasResult(false);

        // Simulate AI processing
        setTimeout(() => {
            setIsLoading(false);
            setHasResult(true);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Sparkles className="w-7 h-7 text-[var(--accent-primary)]" />
                        AI Analytics Assistant
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Ask questions about your benefits data in natural language
                    </p>
                </div>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${showHistory
                            ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                            : 'bg-[var(--surface-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <History className="w-4 h-4" />
                    Query History
                </button>
            </div>

            {/* Main Query Interface */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Query Input & Results */}
                <div className={showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}>
                    {/* Query Input */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask anything about your benefits data..."
                                className="w-full pl-12 pr-32 py-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]/50 transition-colors"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!query.trim() || isLoading}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Ask
                                </button>
                            </div>
                        </div>
                    </motion.form>

                    {/* Results or Suggestions */}
                    {hasResult || isLoading ? (
                        <QueryResult query={submittedQuery} isLoading={isLoading} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Suggested Queries */}
                            <div className="p-6 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">Suggested Questions</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {suggestedQueries.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion.text)}
                                            className="flex items-start gap-3 p-4 rounded-lg bg-[var(--surface-secondary)] border border-transparent hover:border-[var(--accent-primary)]/30 text-left transition-colors group"
                                        >
                                            <div className="p-1.5 rounded-lg bg-[var(--accent-primary)]/10">
                                                <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                                    {suggestion.text}
                                                </div>
                                                <div className="text-xs text-[var(--text-tertiary)] mt-1">
                                                    {suggestion.category}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Capabilities */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { icon: BarChart3, title: 'Data Analysis', desc: 'Analyze claims, costs, and utilization patterns' },
                                    { icon: TrendingUp, title: 'Trend Insights', desc: 'Track changes over time and forecast future trends' },
                                    { icon: Users, title: 'Population Health', desc: 'Understand member demographics and health risks' }
                                ].map((capability) => (
                                    <div key={capability.title} className="p-4 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                                        <capability.icon className="w-5 h-5 text-[var(--accent-primary)] mb-3" />
                                        <div className="text-sm font-medium text-[var(--text-primary)] mb-1">{capability.title}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{capability.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* History Sidebar */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] h-fit"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Recent Queries</span>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="p-1 rounded hover:bg-[var(--surface-secondary)] transition-colors"
                                >
                                    <X className="w-4 h-4 text-[var(--text-tertiary)]" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {queryHistory.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSuggestionClick(item.query)}
                                        className="w-full flex items-start gap-2 p-3 rounded-lg hover:bg-[var(--surface-secondary)] text-left transition-colors group"
                                    >
                                        <Clock className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                                                {item.query}
                                            </div>
                                            <div className="text-xs text-[var(--text-tertiary)]">{item.timestamp}</div>
                                        </div>
                                        {item.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
