'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    AlertTriangle,
    Calculator,
    TrendingUp,
    Clock,
    Users,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface PenaltyProjection {
    type: '4980H(a)' | '4980H(b)';
    employees: number;
    monthlyAmount: number;
    annualAmount: number;
    risk: 'high' | 'medium' | 'low';
    description: string;
}

interface PredictivePenaltyCalculatorProps {
    totalEmployees?: number;
    atRiskEmployees?: number;
    projections?: PenaltyProjection[];
    className?: string;
}

const defaultProjections: PenaltyProjection[] = [
    {
        type: '4980H(a)',
        employees: 0,
        monthlyAmount: 0,
        annualAmount: 0,
        risk: 'low',
        description: 'No minimum essential coverage violations detected'
    },
    {
        type: '4980H(b)',
        employees: 23,
        monthlyAmount: 4875,
        annualAmount: 58500,
        risk: 'medium',
        description: 'Employees receiving subsidized Marketplace coverage'
    }
];

export function PredictivePenaltyCalculator({
    totalEmployees = 12847,
    atRiskEmployees = 23,
    projections = defaultProjections,
    className = ''
}: PredictivePenaltyCalculatorProps) {
    const [expanded, setExpanded] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2026);

    const totalAnnualRisk = projections.reduce((sum, p) => sum + p.annualAmount, 0);
    const penaltyA2026 = 2970; // 4980H(a) per employee 2026
    const penaltyB2026 = 4460; // 4980H(b) per employee 2026

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high': return 'var(--color-critical)';
            case 'medium': return 'var(--color-warning)';
            default: return 'var(--color-success)';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[var(--color-warning)]" />
                    <h3 className="font-semibold text-white">Penalty Risk Calculator</h3>
                </div>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-1.5 text-sm text-white"
                >
                    <option value={2026}>Tax Year 2026</option>
                    <option value={2025}>Tax Year 2025</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Total FTEs</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{totalEmployees.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-warning)] mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">At Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{atRiskEmployees}</p>
                </div>
                <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)]">
                    <div className="flex items-center gap-2 text-[var(--color-warning)] mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Projected Annual</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-warning)] font-mono">
                        ${totalAnnualRisk.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Penalty Breakdown */}
            <div className="space-y-3">
                {projections.map((proj, i) => (
                    <motion.div
                        key={proj.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded text-xs font-mono font-medium" style={{
                                    backgroundColor: `${getRiskColor(proj.risk)}20`,
                                    color: getRiskColor(proj.risk)
                                }}>
                                    {proj.type}
                                </span>
                                <span className="text-sm text-white">{proj.description}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white font-mono">
                                    ${proj.annualAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-[var(--color-steel)]">
                                    {proj.employees} employees × ${proj.type === '4980H(a)' ? penaltyA2026 : penaltyB2026}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Expand Details */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-[var(--color-steel)] hover:text-white transition-colors"
            >
                {expanded ? 'Hide Details' : 'Show Calculation Details'}
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-[var(--glass-border)] text-sm text-[var(--color-steel)]"
                >
                    <p className="mb-2"><strong className="text-white">IRS Penalty Rates ({selectedYear}):</strong></p>
                    <ul className="space-y-1 list-disc list-inside">
                        <li>4980H(a) - No offer of coverage: ${penaltyA2026}/employee/year</li>
                        <li>4980H(b) - Inadequate/unaffordable coverage: ${penaltyB2026}/employee/year</li>
                    </ul>
                    <p className="mt-3 text-xs">
                        * Projections based on current workforce data. Actual penalties may vary.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default PredictivePenaltyCalculator;
