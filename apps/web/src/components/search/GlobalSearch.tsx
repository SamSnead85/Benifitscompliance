'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Save,
    Star,
    Clock,
    Users,
    FileText,
    Building2,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Bookmark,
    History
} from 'lucide-react';

interface GlobalSearchProps {
    className?: string;
}

interface SearchResult {
    id: string;
    type: 'employee' | 'form' | 'document' | 'organization';
    title: string;
    subtitle: string;
    matchedField: string;
    matchedValue: string;
    status?: string;
    lastModified: string;
}

interface SavedSearch {
    id: string;
    name: string;
    query: string;
    filters: FilterCondition[];
    usedCount: number;
}

interface FilterCondition {
    field: string;
    operator: string;
    value: string;
}

const mockResults: SearchResult[] = [
    { id: 'sr1', type: 'employee', title: 'John Smith', subtitle: 'Employee ID: E001 • Engineering', matchedField: 'name', matchedValue: 'John Smith', status: 'Active', lastModified: '2 hours ago' },
    { id: 'sr2', type: 'employee', title: 'Johnson Williams', subtitle: 'Employee ID: E089 • Marketing', matchedField: 'name', matchedValue: 'Johnson Williams', status: 'Active', lastModified: '1 day ago' },
    { id: 'sr3', type: 'form', title: 'Form 1095-C - John Smith', subtitle: 'Tax Year 2025 • Transmitted', matchedField: 'employee', matchedValue: 'John Smith', status: 'Transmitted', lastModified: '3 days ago' },
    { id: 'sr4', type: 'document', title: 'john_smith_coverage_doc.pdf', subtitle: 'Coverage Document • 2.4 MB', matchedField: 'filename', matchedValue: 'john_smith', lastModified: '1 week ago' },
    { id: 'sr5', type: 'organization', title: 'Johnson & Associates LLC', subtitle: 'EIN: 45-6789012 • 234 employees', matchedField: 'name', matchedValue: 'Johnson', status: 'Active', lastModified: '2 weeks ago' },
];

const mockSavedSearches: SavedSearch[] = [
    { id: 'ss1', name: 'FT Employees Missing Coverage', query: '', filters: [{ field: 'status', operator: 'equals', value: 'full-time' }, { field: 'coverage', operator: 'equals', value: 'none' }], usedCount: 45 },
    { id: 'ss2', name: 'Pending 1095-C Forms', query: '', filters: [{ field: 'form_type', operator: 'equals', value: '1095-C' }, { field: 'status', operator: 'equals', value: 'pending' }], usedCount: 23 },
    { id: 'ss3', name: 'Recent Terminations', query: '', filters: [{ field: 'employment_status', operator: 'equals', value: 'terminated' }, { field: 'date', operator: 'within', value: '30days' }], usedCount: 12 },
];

const recentSearches = [
    'employee coverage gaps',
    '1095-C transmission errors',
    'part-time employees',
    'affordability failures',
];

const filterFields = [
    { id: 'employee_name', label: 'Employee Name', type: 'text' },
    { id: 'ssn', label: 'SSN', type: 'text' },
    { id: 'department', label: 'Department', type: 'select', options: ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations'] },
    { id: 'employment_status', label: 'Employment Status', type: 'select', options: ['Active', 'Terminated', 'Leave'] },
    { id: 'ft_status', label: 'FT Status', type: 'select', options: ['Full-Time', 'Part-Time', 'Variable'] },
    { id: 'coverage_offered', label: 'Coverage Offered', type: 'boolean' },
    { id: 'form_status', label: 'Form Status', type: 'select', options: ['Draft', 'Pending', 'Transmitted', 'Corrected'] },
    { id: 'hire_date', label: 'Hire Date', type: 'date' },
];

function getTypeIcon(type: string) {
    switch (type) {
        case 'employee': return { icon: Users, color: 'text-[var(--color-synapse-teal)]', bg: 'bg-[rgba(6,182,212,0.1)]' };
        case 'form': return { icon: FileText, color: 'text-purple-400', bg: 'bg-[rgba(139,92,246,0.1)]' };
        case 'document': return { icon: FileText, color: 'text-[var(--color-warning)]', bg: 'bg-[rgba(245,158,11,0.1)]' };
        case 'organization': return { icon: Building2, color: 'text-[var(--color-success)]', bg: 'bg-[rgba(16,185,129,0.1)]' };
        default: return { icon: FileText, color: 'text-[var(--color-steel)]', bg: 'bg-[rgba(255,255,255,0.05)]' };
    }
}

export function GlobalSearch({ className = '' }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterCondition[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'employees' | 'forms' | 'documents'>('all');

    const hasQuery = query.length > 0 || filters.length > 0;

    const addFilter = () => {
        setFilters([...filters, { field: 'employee_name', operator: 'contains', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
        setFilters(filters.map((f, i) => i === index ? { ...f, ...updates } : f));
    };

    const filteredResults = mockResults.filter(r => {
        if (activeTab === 'all') return true;
        if (activeTab === 'employees') return r.type === 'employee';
        if (activeTab === 'forms') return r.type === 'form';
        if (activeTab === 'documents') return r.type === 'document';
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Search className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Global Search</h2>
                        <p className="text-xs text-[var(--color-steel)]">Search across employees, forms, and documents</p>
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search employees, forms, documents..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        className="w-full pl-12 pr-24 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-xl text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)] text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[var(--color-synapse-teal)] text-black' : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'}`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-3">
                                {filters.map((filter, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <select
                                            value={filter.field}
                                            onChange={(e) => updateFilter(index, { field: e.target.value })}
                                            className="px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        >
                                            {filterFields.map(f => (
                                                <option key={f.id} value={f.id}>{f.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={filter.operator}
                                            onChange={(e) => updateFilter(index, { operator: e.target.value })}
                                            className="px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        >
                                            <option value="contains">Contains</option>
                                            <option value="equals">Equals</option>
                                            <option value="starts_with">Starts with</option>
                                            <option value="not_equals">Does not equal</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                                            placeholder="Value..."
                                            className="flex-1 px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        />
                                        <button
                                            onClick={() => removeFilter(index)}
                                            className="p-2 rounded-lg text-[var(--color-critical)] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={addFilter}
                                        className="text-sm text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Filter
                                    </button>
                                    {filters.length > 0 && (
                                        <button className="btn-secondary text-sm flex items-center gap-1">
                                            <Save className="w-4 h-4" />
                                            Save Search
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Access */}
            {!hasQuery && (
                <div className="p-5 border-b border-[var(--glass-border)]">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Saved Searches */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Bookmark className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                <span className="text-sm font-medium text-white">Saved Searches</span>
                            </div>
                            <div className="space-y-2">
                                {mockSavedSearches.map(search => (
                                    <button
                                        key={search.id}
                                        className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-[var(--color-synapse-teal)] transition-colors">{search.name}</p>
                                            <p className="text-xs text-[var(--color-steel)]">{search.filters.length} filters</p>
                                        </div>
                                        <span className="text-xs text-[var(--color-steel)]">{search.usedCount} uses</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Searches */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <History className="w-4 h-4 text-[var(--color-steel)]" />
                                <span className="text-sm font-medium text-white">Recent Searches</span>
                            </div>
                            <div className="space-y-2">
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuery(search)}
                                        className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors text-left flex items-center gap-3"
                                    >
                                        <Clock className="w-4 h-4 text-[var(--color-steel)]" />
                                        <span className="text-sm text-[var(--color-silver)]">{search}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {hasQuery && (
                <>
                    {/* Result Type Tabs */}
                    <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
                        {[
                            { id: 'all', label: 'All Results', count: mockResults.length },
                            { id: 'employees', label: 'Employees', count: mockResults.filter(r => r.type === 'employee').length },
                            { id: 'forms', label: 'Forms', count: mockResults.filter(r => r.type === 'form').length },
                            { id: 'documents', label: 'Documents', count: mockResults.filter(r => r.type === 'document').length },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>

                    {/* Result List */}
                    <div className="divide-y divide-[var(--glass-border)]">
                        {filteredResults.map((result, index) => {
                            const typeStyle = getTypeIcon(result.type);
                            const TypeIcon = typeStyle.icon;

                            return (
                                <motion.button
                                    key={result.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="w-full p-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left group"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyle.bg}`}>
                                        <TypeIcon className={`w-5 h-5 ${typeStyle.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white group-hover:text-[var(--color-synapse-teal)] transition-colors">
                                                {result.title}
                                            </span>
                                            {result.status && (
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${result.status === 'Active' || result.status === 'Transmitted'
                                                    ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                                    : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                                    }`}>
                                                    {result.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)]">{result.subtitle}</p>
                                        <p className="text-xs text-[var(--color-synapse-teal)] mt-1">
                                            Matched: <span className="font-medium">{result.matchedField}</span> = "{result.matchedValue}"
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-[var(--color-steel)]">{result.lastModified}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[var(--color-steel)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            );
                        })}
                    </div>
                </>
            )}
        </motion.div>
    );
}

export default GlobalSearch;
