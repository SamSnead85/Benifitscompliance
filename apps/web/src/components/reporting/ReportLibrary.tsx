'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Eye,
    Share2,
    Star,
    StarOff,
    Clock,
    Search,
    Filter,
    Grid,
    List,
    MoreHorizontal,
    Folder,
    ChevronRight
} from 'lucide-react';

interface Report {
    id: string;
    name: string;
    type: 'compliance' | 'forms' | 'analytics' | 'audit' | 'custom';
    format: 'pdf' | 'excel' | 'csv' | 'json';
    size: string;
    createdAt: string;
    createdBy: string;
    starred: boolean;
    folder?: string;
    downloads: number;
    shared: boolean;
}

interface ReportLibraryProps {
    reports?: Report[];
    className?: string;
}

const defaultReports: Report[] = [
    { id: 'doc-001', name: '2025 Annual Compliance Summary', type: 'compliance', format: 'pdf', size: '2.4 MB', createdAt: 'Jan 15, 2026', createdBy: 'System', starred: true, downloads: 45, shared: true },
    { id: 'doc-002', name: 'Q4 2025 FTE Analysis', type: 'analytics', format: 'excel', size: '1.8 MB', createdAt: 'Jan 10, 2026', createdBy: 'Sarah M.', starred: true, folder: 'Quarterly Reports', downloads: 23, shared: false },
    { id: 'doc-003', name: 'December 2025 Audit Trail', type: 'audit', format: 'csv', size: '845 KB', createdAt: 'Jan 5, 2026', createdBy: 'System', starred: false, folder: 'Audit', downloads: 12, shared: true },
    { id: 'doc-004', name: '1095-C Batch - Tax Year 2025', type: 'forms', format: 'pdf', size: '156 MB', createdAt: 'Jan 20, 2026', createdBy: 'Mike R.', starred: false, downloads: 8, shared: false },
    { id: 'doc-005', name: 'Affordability Safe Harbor Analysis', type: 'analytics', format: 'pdf', size: '1.2 MB', createdAt: 'Jan 18, 2026', createdBy: 'Sarah M.', starred: true, folder: 'Analysis', downloads: 31, shared: true },
    { id: 'doc-006', name: 'New Hire Compliance Report - Jan 2026', type: 'compliance', format: 'pdf', size: '456 KB', createdAt: 'Jan 25, 2026', createdBy: 'System', starred: false, downloads: 5, shared: false },
];

const typeConfig = {
    compliance: { color: 'var(--color-synapse-teal)', label: 'Compliance' },
    forms: { color: 'var(--color-synapse-cyan)', label: 'Forms' },
    analytics: { color: 'var(--color-synapse-gold)', label: 'Analytics' },
    audit: { color: 'var(--color-steel)', label: 'Audit' },
    custom: { color: 'var(--color-silver)', label: 'Custom' }
};

const formatIcons: Record<string, string> = {
    pdf: '📄',
    excel: '📊',
    csv: '📋',
    json: '{ }'
};

export function ReportLibrary({
    reports = defaultReports,
    className = ''
}: ReportLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [filterType, setFilterType] = useState<string>('all');
    const [showStarredOnly, setShowStarredOnly] = useState(false);

    const filteredReports = reports.filter(r => {
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterType !== 'all' && r.type !== filterType) return false;
        if (showStarredOnly && !r.starred) return false;
        return true;
    });

    const folders = [...new Set(reports.filter(r => r.folder).map(r => r.folder))];
    const starredCount = reports.filter(r => r.starred).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Report Library</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        {reports.length} reports
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--glass-bg-light)] text-white' : 'text-[var(--color-steel)]'}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--glass-bg-light)] text-white' : 'text-[var(--color-steel)]'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                    />
                </div>
                <button
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${showStarredOnly
                            ? 'bg-[var(--color-synapse-gold)] text-black'
                            : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                        }`}
                >
                    <Star className="w-4 h-4" />
                    Starred ({starredCount})
                </button>
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                {['all', ...Object.keys(typeConfig)].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterType === type
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Reports */}
            {viewMode === 'list' ? (
                <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center gap-4 p-3 bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)] text-xs text-[var(--color-steel)]">
                        <div className="w-8"></div>
                        <div className="flex-1">Name</div>
                        <div className="w-24">Type</div>
                        <div className="w-20">Format</div>
                        <div className="w-24">Size</div>
                        <div className="w-32">Created</div>
                        <div className="w-20"></div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-[var(--glass-border)]">
                        {filteredReports.map((report, i) => {
                            const type = typeConfig[report.type];

                            return (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="flex items-center gap-4 p-3 hover:bg-[var(--glass-bg-light)] transition-colors"
                                >
                                    <button className="w-8 text-center">
                                        {report.starred ? (
                                            <Star className="w-4 h-4 text-[var(--color-synapse-gold)] fill-current" />
                                        ) : (
                                            <StarOff className="w-4 h-4 text-[var(--color-steel)] hover:text-[var(--color-synapse-gold)]" />
                                        )}
                                    </button>
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-lg">{formatIcons[report.format]}</span>
                                        <div>
                                            <span className="text-sm text-white">{report.name}</span>
                                            {report.folder && (
                                                <span className="text-xs text-[var(--color-steel)] flex items-center gap-1 mt-0.5">
                                                    <Folder className="w-3 h-3" />
                                                    {report.folder}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-24">
                                        <span
                                            className="px-2 py-0.5 rounded text-xs"
                                            style={{ backgroundColor: `${type.color}20`, color: type.color }}
                                        >
                                            {type.label}
                                        </span>
                                    </div>
                                    <div className="w-20 text-sm text-[var(--color-steel)] uppercase">
                                        {report.format}
                                    </div>
                                    <div className="w-24 text-sm text-[var(--color-steel)]">
                                        {report.size}
                                    </div>
                                    <div className="w-32 text-sm text-[var(--color-steel)]">
                                        {report.createdAt}
                                    </div>
                                    <div className="w-20 flex items-center gap-1">
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {filteredReports.map((report, i) => {
                        const type = typeConfig[report.type];

                        return (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-3xl">{formatIcons[report.format]}</span>
                                    <button>
                                        {report.starred ? (
                                            <Star className="w-4 h-4 text-[var(--color-synapse-gold)] fill-current" />
                                        ) : (
                                            <StarOff className="w-4 h-4 text-[var(--color-steel)]" />
                                        )}
                                    </button>
                                </div>
                                <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">{report.name}</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs"
                                        style={{ backgroundColor: `${type.color}20`, color: type.color }}
                                    >
                                        {type.label}
                                    </span>
                                    <span className="text-xs text-[var(--color-steel)]">{report.size}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-[var(--color-steel)]">
                                    <span>{report.createdAt}</span>
                                    <span>{report.downloads} downloads</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {filteredReports.length === 0 && (
                <div className="p-8 text-center text-[var(--color-steel)]">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No reports found</p>
                </div>
            )}
        </motion.div>
    );
}

export default ReportLibrary;
