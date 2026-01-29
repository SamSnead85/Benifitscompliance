'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Shield,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Calculator,
    DollarSign,
    Users,
    Calendar,
    ChevronRight,
    TrendingUp,
    Info,
} from 'lucide-react';

interface SafeHarborResult {
    method: 'w2' | 'rateOfPay' | 'federalPovertyLine';
    label: string;
    isAffordable: boolean;
    employeeContribution: number;
    threshold: number;
    percentOfIncome: number;
}

interface SafeHarborAnalyzerProps {
    employeeName: string;
    planYear: string;
    w2Wages: number;
    hourlyRate?: number;
    monthlyHours?: number;
    lowestCostPlan: {
        name: string;
        employeeContribution: number;
    };
    className?: string;
}

/**
 * Safe Harbor Analyzer
 * ACA Affordability Testing with Multiple Methods
 */
export function SafeHarborAnalyzer({
    employeeName,
    planYear,
    w2Wages,
    hourlyRate,
    monthlyHours = 130,
    lowestCostPlan,
    className = '',
}: SafeHarborAnalyzerProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>('w2');

    // 2026 ACA affordability threshold (9.5% modified annually)
    const affordabilityThreshold = 0.0925; // 9.25% for 2026
    const federalPovertyLine = 15060; // 2026 mainland single person

    const calculateResults = (): SafeHarborResult[] => {
        const monthlyContribution = lowestCostPlan.employeeContribution;
        const annualContribution = monthlyContribution * 12;

        const results: SafeHarborResult[] = [];

        // W-2 Safe Harbor
        const w2Percentage = annualContribution / w2Wages;
        results.push({
            method: 'w2',
            label: 'W-2 Safe Harbor',
            isAffordable: w2Percentage <= affordabilityThreshold,
            employeeContribution: monthlyContribution,
            threshold: w2Wages * affordabilityThreshold / 12,
            percentOfIncome: w2Percentage * 100,
        });

        // Rate of Pay Safe Harbor
        if (hourlyRate) {
            const monthlyIncome = hourlyRate * monthlyHours;
            const ropPercentage = monthlyContribution / monthlyIncome;
            results.push({
                method: 'rateOfPay',
                label: 'Rate of Pay Safe Harbor',
                isAffordable: ropPercentage <= affordabilityThreshold,
                employeeContribution: monthlyContribution,
                threshold: monthlyIncome * affordabilityThreshold,
                percentOfIncome: ropPercentage * 100,
            });
        }

        // Federal Poverty Line Safe Harbor
        const fplMonthly = federalPovertyLine / 12;
        const fplPercentage = monthlyContribution / fplMonthly;
        results.push({
            method: 'federalPovertyLine',
            label: 'Federal Poverty Line Safe Harbor',
            isAffordable: fplPercentage <= affordabilityThreshold,
            employeeContribution: monthlyContribution,
            threshold: fplMonthly * affordabilityThreshold,
            percentOfIncome: fplPercentage * 100,
        });

        return results;
    };

    const results = calculateResults();
    const anyAffordable = results.some(r => r.isAffordable);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Safe Harbor Analyzer
                            </h2>
                            <p className="text-sm text-[#64748B]">ACA Affordability Testing • {planYear}</p>
                        </div>
                    </div>

                    {/* Overall Status */}
                    <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg
            ${anyAffordable
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }
          `}>
                        {anyAffordable ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                            {anyAffordable ? 'Affordable' : 'Not Affordable'}
                        </span>
                    </div>
                </div>

                {/* Employee Context */}
                <div className="mt-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-[#64748B]">Employee</p>
                            <p className="text-white font-medium">{employeeName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#64748B]">W-2 Wages</p>
                            <p className="text-white font-medium">${w2Wages.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#64748B]">Lowest Plan</p>
                            <p className="text-white font-medium">{lowestCostPlan.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#64748B]">Monthly Contribution</p>
                            <p className="text-white font-medium">${lowestCostPlan.employeeContribution}/mo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    Safe Harbor Methods
                </h3>

                <div className="space-y-3">
                    {results.map((result, index) => (
                        <motion.div
                            key={result.method}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedMethod(result.method)}
                            className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${selectedMethod === result.method
                                    ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)]'
                                    : 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${result.isAffordable
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-red-500/10 text-red-400'
                                        }
                  `}>
                                        {result.isAffordable ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <XCircle className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{result.label}</p>
                                        <p className="text-xs text-[#64748B]">
                                            {result.percentOfIncome.toFixed(2)}% of income
                                            {result.isAffordable ? ' (under threshold)' : ' (over threshold)'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-mono text-white">
                                        ${result.employeeContribution.toFixed(0)}/mo
                                    </p>
                                    <p className="text-xs text-[#64748B]">
                                        Max: ${result.threshold.toFixed(0)}/mo
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedMethod === result.method && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]"
                                >
                                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                        <Info className="w-3.5 h-3.5" />
                                        <span>
                                            {result.method === 'w2' && 'Based on prior year W-2 Box 1 wages'}
                                            {result.method === 'rateOfPay' && 'Based on hourly rate × 130 hours'}
                                            {result.method === 'federalPovertyLine' && 'Based on mainland single FPL'}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Threshold Info */}
                <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-sm">
                        <Calculator className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-medium">
                            {planYear} Affordability Threshold: {(affordabilityThreshold * 100).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Coverage Gap Detector
 * Real-time monitoring for offer compliance
 */
interface CoverageGap {
    id: string;
    employeeId: string;
    employeeName: string;
    gapType: 'no_offer' | 'unaffordable' | 'inadequate_coverage' | 'waiting_period';
    month: string;
    potentialPenalty: number;
    recommendation: string;
}

interface CoverageGapDetectorProps {
    gaps: CoverageGap[];
    totalExposure: number;
    className?: string;
}

export function CoverageGapDetector({
    gaps,
    totalExposure,
    className = '',
}: CoverageGapDetectorProps) {
    const [filterType, setFilterType] = useState<string>('all');

    const gapTypes = [
        { id: 'all', label: 'All Gaps' },
        { id: 'no_offer', label: 'No Offer' },
        { id: 'unaffordable', label: 'Unaffordable' },
        { id: 'inadequate_coverage', label: 'Inadequate' },
        { id: 'waiting_period', label: 'Waiting Period' },
    ];

    const getGapIcon = (type: string) => {
        switch (type) {
            case 'no_offer': return <XCircle className="w-4 h-4" />;
            case 'unaffordable': return <DollarSign className="w-4 h-4" />;
            case 'inadequate_coverage': return <Shield className="w-4 h-4" />;
            case 'waiting_period': return <Calendar className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const getGapColor = (type: string) => {
        switch (type) {
            case 'no_offer': return 'bg-red-500/10 text-red-400 border-red-500/30';
            case 'unaffordable': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'inadequate_coverage': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
            case 'waiting_period': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
        }
    };

    const filteredGaps = gaps.filter(
        gap => filterType === 'all' || gap.gapType === filterType
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Coverage Gap Detector
                            </h2>
                            <p className="text-sm text-[#64748B]">Real-time offer compliance monitoring</p>
                        </div>
                    </div>

                    {/* Exposure */}
                    <div className="text-right">
                        <p className="text-2xl font-bold font-mono text-red-400">
                            ${totalExposure.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#64748B]">Total Penalty Exposure</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {gapTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setFilterType(type.id)}
                            className={`
                px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap
                transition-all duration-200
                ${filterType === type.id
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                }
              `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gaps List */}
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filteredGaps.length === 0 ? (
                    <div className="p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                        <p className="text-white font-medium">No Coverage Gaps Detected</p>
                        <p className="text-sm text-[#64748B]">All employees have compliant coverage offers</p>
                    </div>
                ) : (
                    filteredGaps.map((gap, index) => (
                        <motion.div
                            key={gap.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${getGapColor(gap.gapType)}`}>
                                    {getGapIcon(gap.gapType)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-white">{gap.employeeName}</p>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getGapColor(gap.gapType)}`}>
                                            {gap.gapType.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#64748B]">{gap.month}</p>
                                    <p className="text-sm text-[#94A3B8] mt-1">{gap.recommendation}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-mono text-red-400">
                                        ${gap.potentialPenalty.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-[#64748B]">potential penalty</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}

export default SafeHarborAnalyzer;
