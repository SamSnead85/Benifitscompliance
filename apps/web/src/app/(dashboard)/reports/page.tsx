'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Filter,
    Search,
    FileSpreadsheet,
    FileCheck,
    BarChart3,
    PieChart,
    TrendingUp,
    Building2,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const reportTypes = [
    {
        id: '1095c-batch',
        name: '1095-C Batch Report',
        description: 'Generate IRS Form 1095-C for all employees',
        icon: FileCheck,
        category: 'irs',
        estimatedTime: '5-10 min',
        lastRun: '2 days ago'
    },
    {
        id: '1094c-summary',
        name: '1094-C Transmittal',
        description: 'Employer-level ACA transmittal form',
        icon: FileText,
        category: 'irs',
        estimatedTime: '1-2 min',
        lastRun: '2 days ago'
    },
    {
        id: 'compliance-audit',
        name: 'Compliance Audit Report',
        description: 'Full compliance status breakdown by employee',
        icon: BarChart3,
        category: 'compliance',
        estimatedTime: '2-3 min',
        lastRun: '1 week ago'
    },
    {
        id: 'fte-analysis',
        name: 'FTE Classification Report',
        description: 'Full-time equivalent status analysis',
        icon: PieChart,
        category: 'compliance',
        estimatedTime: '1-2 min',
        lastRun: 'Never'
    },
    {
        id: 'risk-summary',
        name: 'Risk Assessment Summary',
        description: 'Penalty exposure and mitigation recommendations',
        icon: AlertCircle,
        category: 'risk',
        estimatedTime: '1-2 min',
        lastRun: '3 days ago'
    },
    {
        id: 'trend-analysis',
        name: 'Workforce Trend Analysis',
        description: 'Historical FTE and compliance trends',
        icon: TrendingUp,
        category: 'analytics',
        estimatedTime: '3-5 min',
        lastRun: 'Never'
    },
];

const recentReports = [
    {
        id: 'RPT-001',
        name: '1095-C Batch - Apex Manufacturing',
        type: '1095-C',
        status: 'completed',
        generatedAt: 'Jan 26, 2026 at 2:34 PM',
        fileSize: '2.4 MB',
        records: 2340
    },
    {
        id: 'RPT-002',
        name: 'Compliance Audit - Horizon Healthcare',
        type: 'Audit',
        status: 'completed',
        generatedAt: 'Jan 25, 2026 at 10:15 AM',
        fileSize: '1.1 MB',
        records: 1820
    },
    {
        id: 'RPT-003',
        name: 'Risk Summary - All Clients',
        type: 'Risk',
        status: 'processing',
        generatedAt: 'In Progress',
        fileSize: '--',
        records: 12847
    },
    {
        id: 'RPT-004',
        name: '1094-C Transmittal - Summit Logistics',
        type: '1094-C',
        status: 'completed',
        generatedAt: 'Jan 24, 2026 at 4:22 PM',
        fileSize: '156 KB',
        records: 1
    },
];

function StatusBadge({ status }: { status: string }) {
    const config = {
        completed: { label: 'Completed', className: 'badge--success' },
        processing: { label: 'Processing', className: 'badge--info' },
        failed: { label: 'Failed', className: 'badge--critical' },
        queued: { label: 'Queued', className: 'badge--warning' },
    }[status] || { label: status, className: 'badge--info' };

    return <span className={`badge ${config.className}`}>{config.label}</span>;
}

function CategoryBadge({ category }: { category: string }) {
    const labels = {
        irs: 'IRS Forms',
        compliance: 'Compliance',
        risk: 'Risk',
        analytics: 'Analytics',
    }[category] || category;

    return (
        <span className="text-xs px-2 py-1 rounded bg-[var(--glass-bg-light)] text-[var(--color-steel)]">
            {labels}
        </span>
    );
}

export default function ReportsPage() {
    const [selectedClient, setSelectedClient] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reports</h1>
                    <p className="text-[var(--color-steel)] mt-1">Generate compliance reports and IRS forms</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input pl-9 w-64"
                        />
                    </div>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="form-input"
                    >
                        <option value="all">All Clients</option>
                        <option value="apex">Apex Manufacturing</option>
                        <option value="horizon">Horizon Healthcare</option>
                        <option value="summit">Summit Logistics</option>
                    </select>
                </div>
            </div>

            {/* Quick Generate Cards */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    Generate Report
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportTypes.map((report) => (
                        <motion.button
                            key={report.id}
                            variants={fadeInUp}
                            className="glass-card p-5 text-left hover:border-[var(--color-synapse-teal)] group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                    <report.icon className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                </div>
                                <CategoryBadge category={report.category} />
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-[var(--color-synapse-teal)] transition-colors">
                                {report.name}
                            </h3>
                            <p className="text-sm text-[var(--color-steel)] mt-1 mb-4">
                                {report.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-[var(--color-steel)]">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {report.estimatedTime}
                                </span>
                                <span>Last: {report.lastRun}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        Recent Reports
                    </h2>
                    <button className="btn-secondary text-sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Report Name</th>
                            <th>Type</th>
                            <th>Records</th>
                            <th>Status</th>
                            <th>Generated</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentReports.map((report) => (
                            <tr key={report.id} className="group">
                                <td className="font-medium">{report.name}</td>
                                <td className="text-[var(--color-steel)]">{report.type}</td>
                                <td className="font-mono">{report.records.toLocaleString()}</td>
                                <td><StatusBadge status={report.status} /></td>
                                <td className="text-[var(--color-steel)]">{report.generatedAt}</td>
                                <td className="text-[var(--color-steel)]">{report.fileSize}</td>
                                <td>
                                    {report.status === 'completed' ? (
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-synapse-teal)] hover:text-white">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    ) : report.status === 'processing' ? (
                                        <RefreshCw className="w-4 h-4 text-[var(--color-synapse-cyan)] animate-spin" />
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Export Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4"
            >
                <button className="glass-card p-4 flex items-center gap-3 hover:border-[var(--color-synapse-teal)] group">
                    <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <div className="text-left">
                        <span className="text-sm font-medium text-white">Export as PDF</span>
                        <p className="text-xs text-[var(--color-steel)]">Print-ready format</p>
                    </div>
                </button>
                <button className="glass-card p-4 flex items-center gap-3 hover:border-[var(--color-synapse-teal)] group">
                    <FileSpreadsheet className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <div className="text-left">
                        <span className="text-sm font-medium text-white">Export as Excel</span>
                        <p className="text-xs text-[var(--color-steel)]">Spreadsheet format</p>
                    </div>
                </button>
                <button className="glass-card p-4 flex items-center gap-3 hover:border-[var(--color-synapse-teal)] group">
                    <Download className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <div className="text-left">
                        <span className="text-sm font-medium text-white">Export as CSV</span>
                        <p className="text-xs text-[var(--color-steel)]">Raw data format</p>
                    </div>
                </button>
            </motion.div>

            {/* Scheduled Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        Scheduled Reports
                    </h2>
                    <button className="btn-primary text-sm">
                        Schedule New
                    </button>
                </div>
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-[var(--color-steel)] mx-auto mb-3" />
                    <p className="text-[var(--color-steel)]">No scheduled reports yet</p>
                    <p className="text-sm text-[var(--color-steel)] mt-1">
                        Set up automated report generation on a recurring schedule
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
