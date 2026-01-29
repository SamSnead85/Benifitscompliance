'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    HelpCircle,
    ChevronDown,
    FileText,
    RefreshCw
} from 'lucide-react';

interface AuditRule {
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'passed' | 'warning' | 'failed' | 'skipped';
    affectedCount: number;
    lastRun?: string;
}

interface ComplianceAuditProps {
    rules?: AuditRule[];
    onRunAudit?: () => void;
    onRuleClick?: (rule: AuditRule) => void;
    className?: string;
}

const defaultRules: AuditRule[] = [
    {
        id: '1',
        name: 'Missing SSN Validation',
        description: 'Employees must have valid SSN format',
        category: 'Data Quality',
        status: 'passed',
        affectedCount: 0,
        lastRun: '2026-01-28T10:30:00'
    },
    {
        id: '2',
        name: 'Coverage Gap Detection',
        description: 'No coverage gaps between consecutive months',
        category: 'Coverage',
        status: 'warning',
        affectedCount: 12,
        lastRun: '2026-01-28T10:30:00'
    },
    {
        id: '3',
        name: 'Safe Harbor Code Consistency',
        description: 'Line 16 codes must match offer of coverage',
        category: 'Codes',
        status: 'failed',
        affectedCount: 45,
        lastRun: '2026-01-28T10:30:00'
    },
    {
        id: '4',
        name: 'FTE Measurement Period',
        description: 'Hours tracked for all measurement periods',
        category: 'Hours',
        status: 'passed',
        affectedCount: 0,
        lastRun: '2026-01-28T10:30:00'
    },
    {
        id: '5',
        name: 'Dependent SSN Completeness',
        description: 'All dependents have SSN or DOB recorded',
        category: 'Data Quality',
        status: 'warning',
        affectedCount: 8,
        lastRun: '2026-01-28T10:30:00'
    },
];

const statusConfig = {
    passed: { color: 'var(--color-success)', icon: CheckCircle2, label: 'Passed' },
    warning: { color: 'var(--color-warning)', icon: AlertTriangle, label: 'Warning' },
    failed: { color: 'var(--color-critical)', icon: XCircle, label: 'Failed' },
    skipped: { color: 'var(--color-steel)', icon: HelpCircle, label: 'Skipped' },
};

export function ComplianceAudit({
    rules = defaultRules,
    onRunAudit,
    onRuleClick,
    className = ''
}: ComplianceAuditProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const categories = [...new Set(rules.map(r => r.category))];

    const getCategoryStats = (category: string) => {
        const categoryRules = rules.filter(r => r.category === category);
        return {
            total: categoryRules.length,
            passed: categoryRules.filter(r => r.status === 'passed').length,
            warnings: categoryRules.filter(r => r.status === 'warning').length,
            failed: categoryRules.filter(r => r.status === 'failed').length,
        };
    };

    const overallStats = {
        total: rules.length,
        passed: rules.filter(r => r.status === 'passed').length,
        warnings: rules.filter(r => r.status === 'warning').length,
        failed: rules.filter(r => r.status === 'failed').length,
    };

    const handleRunAudit = async () => {
        setIsRunning(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsRunning(false);
        onRunAudit?.();
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Compliance Audit</h3>
                            <p className="text-xs text-[var(--color-steel)]">{rules.length} validation rules</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRunAudit}
                        disabled={isRunning}
                        className="btn-primary text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                        {isRunning ? 'Running...' : 'Run Audit'}
                    </button>
                </div>

                {/* Overall stats */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <p className="text-lg font-bold text-white">{overallStats.total}</p>
                        <p className="text-xs text-[var(--color-steel)]">Total Rules</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(34,197,94,0.1)]">
                        <p className="text-lg font-bold text-[var(--color-success)]">{overallStats.passed}</p>
                        <p className="text-xs text-[var(--color-steel)]">Passed</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)]">
                        <p className="text-lg font-bold text-[var(--color-warning)]">{overallStats.warnings}</p>
                        <p className="text-xs text-[var(--color-steel)]">Warnings</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)]">
                        <p className="text-lg font-bold text-[var(--color-critical)]">{overallStats.failed}</p>
                        <p className="text-xs text-[var(--color-steel)]">Failed</p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="divide-y divide-[var(--glass-border)]">
                {categories.map((category) => {
                    const stats = getCategoryStats(category);
                    const categoryRules = rules.filter(r => r.category === category);
                    const isExpanded = expandedCategory === category;

                    return (
                        <div key={category}>
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                                className="w-full p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-[var(--color-steel)]" />
                                    <span className="font-medium text-white">{category}</span>
                                    <span className="text-xs text-[var(--color-steel)]">
                                        {stats.total} rules
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {stats.failed > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-[var(--color-critical)]">
                                            <XCircle className="w-3 h-3" /> {stats.failed}
                                        </span>
                                    )}
                                    {stats.warnings > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-[var(--color-warning)]">
                                            <AlertTriangle className="w-3 h-3" /> {stats.warnings}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-[var(--color-steel)] transition-transform ${isExpanded ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </button>

                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="bg-[var(--glass-bg)]"
                                >
                                    {categoryRules.map((rule) => {
                                        const config = statusConfig[rule.status];
                                        const StatusIcon = config.icon;

                                        return (
                                            <div
                                                key={rule.id}
                                                onClick={() => onRuleClick?.(rule)}
                                                className="px-4 py-3 flex items-center gap-3 border-t border-[var(--glass-border)] cursor-pointer hover:bg-[var(--glass-bg-light)] transition-colors"
                                            >
                                                <StatusIcon
                                                    className="w-5 h-5"
                                                    style={{ color: config.color }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white">{rule.name}</p>
                                                    <p className="text-xs text-[var(--color-steel)] truncate">
                                                        {rule.description}
                                                    </p>
                                                </div>
                                                {rule.affectedCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                                        {rule.affectedCount} affected
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ComplianceAudit;
