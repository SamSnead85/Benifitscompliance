'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    AlertTriangle,
    DollarSign,
    Users,
    TrendingUp,
    Info,
    Download,
    RefreshCw
} from 'lucide-react';

interface PenaltyCalculatorProps {
    className?: string;
}

interface PenaltyResult {
    penaltyA: number;
    penaltyB: number;
    total: number;
    affectedEmployeesA: number;
    affectedEmployeesB: number;
}

export function PenaltyCalculator({ className = '' }: PenaltyCalculatorProps) {
    const [totalFTE, setTotalFTE] = useState(4521);
    const [noOfferEmployees, setNoOfferEmployees] = useState(0);
    const [unaffordableEmployees, setUnaffordableEmployees] = useState(12);
    const [subsidyRecipients, setSubsidyRecipients] = useState(8);
    const [taxYear, setTaxYear] = useState(2025);
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<PenaltyResult | null>(null);

    // 2025 penalty amounts (indexed)
    const penaltyAPerEmployee = 2970; // $2,970 per FTE for 4980H(a)
    const penaltyBPerEmployee = 4460; // $4,460 per employee for 4980H(b)

    const calculatePenalty = async () => {
        setIsCalculating(true);
        await new Promise(r => setTimeout(r, 1000));

        // 4980H(a) - No offer penalty
        // Applies if ANY full-time employee receives subsidy and coverage NOT offered to 95%
        const fteMinus30 = Math.max(0, totalFTE - 30);
        const penaltyA = noOfferEmployees > (totalFTE * 0.05) && subsidyRecipients > 0
            ? fteMinus30 * penaltyAPerEmployee
            : 0;

        // 4980H(b) - Unaffordable penalty
        // Applies per employee receiving subsidy due to unaffordable coverage
        const penaltyB = unaffordableEmployees * penaltyBPerEmployee;

        // The penalty is the LESSER of (a) or (b) when both apply
        const actualPenalty = penaltyA > 0 ? Math.min(penaltyA, penaltyB) : penaltyB;

        setResult({
            penaltyA,
            penaltyB,
            total: actualPenalty,
            affectedEmployeesA: noOfferEmployees,
            affectedEmployeesB: unaffordableEmployees
        });
        setIsCalculating(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-critical)] to-[var(--color-warning)] flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">ACA Penalty Calculator</h2>
                            <p className="text-sm text-[var(--color-steel)]">Estimate potential 4980H penalty exposure</p>
                        </div>
                    </div>
                    <select
                        value={taxYear}
                        onChange={(e) => setTaxYear(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value={2025}>Tax Year 2025</option>
                        <option value={2024}>Tax Year 2024</option>
                        <option value={2023}>Tax Year 2023</option>
                    </select>
                </div>
            </div>

            <div className="p-6">
                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm text-[var(--color-steel)] mb-2">
                            Total Full-Time Employees (FTEs)
                        </label>
                        <input
                            type="number"
                            value={totalFTE}
                            onChange={(e) => setTotalFTE(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-lg font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--color-steel)] mb-2">
                            Employees NOT Offered Coverage
                        </label>
                        <input
                            type="number"
                            value={noOfferEmployees}
                            onChange={(e) => setNoOfferEmployees(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-lg font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--color-steel)] mb-2">
                            Employees with Unaffordable Coverage
                        </label>
                        <input
                            type="number"
                            value={unaffordableEmployees}
                            onChange={(e) => setUnaffordableEmployees(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-lg font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--color-steel)] mb-2">
                            Employees Receiving Marketplace Subsidy
                        </label>
                        <input
                            type="number"
                            value={subsidyRecipients}
                            onChange={(e) => setSubsidyRecipients(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-lg font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.3)] mb-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[var(--color-synapse-cyan)] shrink-0 mt-0.5" />
                        <div className="text-sm text-[var(--color-steel)]">
                            <p className="mb-2"><strong className="text-white">4980H(a) "No Offer" Penalty:</strong> ${penaltyAPerEmployee.toLocaleString()}/FTE (minus 30) if coverage not offered to 95% of FTEs and any employee receives marketplace subsidy.</p>
                            <p><strong className="text-white">4980H(b) "Unaffordable" Penalty:</strong> ${penaltyBPerEmployee.toLocaleString()} per employee receiving subsidy due to unaffordable or non-MV coverage.</p>
                        </div>
                    </div>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={calculatePenalty}
                    disabled={isCalculating}
                    className="btn-primary w-full mb-6"
                >
                    {isCalculating ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Calculating...
                        </>
                    ) : (
                        <>
                            <Calculator className="w-4 h-4" />
                            Calculate Penalty Exposure
                        </>
                    )}
                </button>

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`p-4 rounded-lg border ${result.penaltyA > 0
                                    ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)]'
                                    : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                }`}>
                                <p className="text-xs text-[var(--color-steel)] mb-1">4980H(a) Penalty</p>
                                <p className="text-xl font-bold font-mono text-white">${result.penaltyA.toLocaleString()}</p>
                                <p className="text-xs text-[var(--color-steel)]">{result.affectedEmployeesA} not offered</p>
                            </div>
                            <div className={`p-4 rounded-lg border ${result.penaltyB > 0
                                    ? 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]'
                                    : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                }`}>
                                <p className="text-xs text-[var(--color-steel)] mb-1">4980H(b) Penalty</p>
                                <p className="text-xl font-bold font-mono text-white">${result.penaltyB.toLocaleString()}</p>
                                <p className="text-xs text-[var(--color-steel)]">{result.affectedEmployeesB} unaffordable</p>
                            </div>
                            <div className={`p-4 rounded-lg border ${result.total > 0
                                    ? 'bg-[rgba(239,68,68,0.2)] border-[rgba(239,68,68,0.5)]'
                                    : 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]'
                                }`}>
                                <p className="text-xs text-[var(--color-steel)] mb-1">Estimated Penalty</p>
                                <p className={`text-xl font-bold font-mono ${result.total > 0 ? 'text-[var(--color-critical)]' : 'text-[var(--color-success)]'
                                    }`}>
                                    ${result.total.toLocaleString()}
                                </p>
                                <p className="text-xs text-[var(--color-steel)]">
                                    {result.total > 0 ? 'Action required' : 'No penalty'}
                                </p>
                            </div>
                        </div>

                        {result.total > 0 && (
                            <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-[var(--color-critical)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-white">Penalty Risk Detected</p>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">
                                            Review the Safe Harbor Wizard to optimize your compliance strategy and reduce penalty exposure.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="btn-secondary w-full">
                            <Download className="w-4 h-4" />
                            Export Penalty Analysis Report
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default PenaltyCalculator;
