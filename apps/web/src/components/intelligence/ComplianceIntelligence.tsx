'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Target,
    Sparkles,
    ChevronRight,
    Calendar,
    DollarSign,
    Users,
    Shield,
    Zap,
} from 'lucide-react';

interface RiskIndicator {
    id: string;
    category: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    recommendation: string;
    affectedCount?: number;
    deadline?: string;
}

interface ComplianceIntelligenceProps {
    overallScore: number;
    riskIndicators: RiskIndicator[];
    predictions?: {
        nextMonth: number;
        trend: 'improving' | 'stable' | 'declining';
    };
    className?: string;
}

/**
 * Compliance Intelligence Hub
 * AI-Powered Risk Analysis and Predictions
 */
export function ComplianceIntelligence({
    overallScore,
    riskIndicators,
    predictions,
    className = '',
}: ComplianceIntelligenceProps) {
    const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'text-emerald-400';
        if (score >= 85) return 'text-cyan-400';
        if (score >= 70) return 'text-amber-400';
        return 'text-red-400';
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-400';
            case 'high': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
            case 'medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
            default: return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            Compliance Intelligence
                        </h2>
                        <p className="text-sm text-[#64748B]">AI-Powered Risk Analysis</p>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="text-right">
                    <div className="flex items-baseline gap-2">
                        <span
                            className={`text-4xl font-bold font-mono ${getScoreColor(overallScore)}`}
                        >
                            {overallScore}
                        </span>
                        <span className="text-sm text-[#64748B]">/ 100</span>
                    </div>
                    <p className="text-xs text-[#64748B]">Compliance Score</p>
                </div>
            </div>

            {/* Prediction Banner */}
            {predictions && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
            flex items-center justify-between p-4 rounded-lg mb-6
            ${predictions.trend === 'improving'
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : predictions.trend === 'declining'
                                ? 'bg-red-500/10 border border-red-500/20'
                                : 'bg-cyan-500/10 border border-cyan-500/20'
                        }
          `}
                >
                    <div className="flex items-center gap-3">
                        {predictions.trend === 'improving' ? (
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        ) : predictions.trend === 'declining' ? (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                        ) : (
                            <Target className="w-5 h-5 text-cyan-400" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-white">
                                {predictions.trend === 'improving'
                                    ? 'Score Improving'
                                    : predictions.trend === 'declining'
                                        ? 'Score Declining'
                                        : 'Score Stable'
                                }
                            </p>
                            <p className="text-xs text-[#94A3B8]">
                                Predicted: {predictions.nextMonth}% next month
                            </p>
                        </div>
                    </div>
                    <span className={`
            text-xl font-bold font-mono
            ${predictions.trend === 'improving' ? 'text-emerald-400' :
                            predictions.trend === 'declining' ? 'text-red-400' : 'text-cyan-400'}
          `}>
                        {predictions.nextMonth}%
                    </span>
                </motion.div>
            )}

            {/* Risk Indicators */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    Risk Indicators ({riskIndicators.length})
                </h3>

                {riskIndicators.map((risk, index) => (
                    <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                        className={`
              p-4 rounded-lg border cursor-pointer
              transition-all duration-200
              ${getRiskColor(risk.riskLevel)}
              ${selectedRisk === risk.id ? 'ring-1 ring-white/20' : ''}
            `}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`
                    px-2 py-0.5 text-[10px] font-bold uppercase rounded
                    ${risk.riskLevel === 'critical' ? 'bg-red-500/30' :
                                            risk.riskLevel === 'high' ? 'bg-orange-500/30' :
                                                risk.riskLevel === 'medium' ? 'bg-amber-500/30' : 'bg-emerald-500/30'}
                  `}>
                                        {risk.riskLevel}
                                    </span>
                                    <span className="text-xs text-[#94A3B8]">{risk.category}</span>
                                </div>
                                <p className="text-sm font-medium text-white">{risk.description}</p>

                                {/* Expanded Details */}
                                {selectedRisk === risk.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 pt-3 border-t border-white/10"
                                    >
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-[#64748B] mb-1">Impact</p>
                                                <p className="text-white">{risk.impact}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#64748B] mb-1">Recommendation</p>
                                                <p className="text-white">{risk.recommendation}</p>
                                            </div>
                                        </div>
                                        {risk.affectedCount && (
                                            <div className="flex items-center gap-2 mt-3 text-xs text-[#94A3B8]">
                                                <Users className="w-3.5 h-3.5" />
                                                {risk.affectedCount} employees affected
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                            <ChevronRight className={`w-4 h-4 text-[#64748B] transition-transform ${selectedRisk === risk.id ? 'rotate-90' : ''}`} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/**
 * Penalty Exposure Forecast
 * AI-Powered 4980H Penalty Prediction
 */
interface PenaltyExposureForecastProps {
    currentExposure: number;
    projectedExposure: number;
    mitigatedAmount: number;
    riskFactors: Array<{
        name: string;
        amount: number;
        probability: number;
    }>;
    className?: string;
}

export function PenaltyExposureForecast({
    currentExposure,
    projectedExposure,
    mitigatedAmount,
    riskFactors,
    className = '',
}: PenaltyExposureForecastProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        Penalty Exposure Forecast
                    </h2>
                    <p className="text-sm text-[#64748B]">4980H Risk Analysis</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Current Exposure</p>
                    <p className="text-2xl font-bold font-mono text-red-400">
                        {formatCurrency(currentExposure)}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Projected (EOY)</p>
                    <p className="text-2xl font-bold font-mono text-amber-400">
                        {formatCurrency(projectedExposure)}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Mitigated</p>
                    <p className="text-2xl font-bold font-mono text-emerald-400">
                        {formatCurrency(mitigatedAmount)}
                    </p>
                </div>
            </div>

            {/* Risk Factors */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    Contributing Risk Factors
                </h3>
                <div className="space-y-2">
                    {riskFactors.map((factor, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <span className="text-sm text-white">{factor.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono text-red-400">
                                    {formatCurrency(factor.amount)}
                                </span>
                                <span className="text-xs text-[#64748B]">
                                    {factor.probability}% probability
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Eligibility Forecast Widget
 * Predictive FT Status Modeling
 */
interface EligibilityForecastProps {
    currentEligible: number;
    projectedEligible: number;
    atRiskCount: number;
    upcomingTransitions: Array<{
        employeeName: string;
        currentStatus: string;
        projectedStatus: string;
        transitionDate: string;
        confidence: number;
    }>;
    className?: string;
}

export function EligibilityForecast({
    currentEligible,
    projectedEligible,
    atRiskCount,
    upcomingTransitions,
    className = '',
}: EligibilityForecastProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        Eligibility Forecast
                    </h2>
                    <p className="text-sm text-[#64748B]">Predictive FT Status Analysis</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-[rgba(255,255,255,0.02)]">
                    <p className="text-3xl font-bold font-mono text-cyan-400">{currentEligible}</p>
                    <p className="text-xs text-[#64748B] mt-1">Currently Eligible</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[rgba(255,255,255,0.02)]">
                    <p className="text-3xl font-bold font-mono text-emerald-400">{projectedEligible}</p>
                    <p className="text-xs text-[#64748B] mt-1">Projected (30 days)</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[rgba(255,255,255,0.02)]">
                    <p className="text-3xl font-bold font-mono text-amber-400">{atRiskCount}</p>
                    <p className="text-xs text-[#64748B] mt-1">At Risk</p>
                </div>
            </div>

            {/* Upcoming Transitions */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    Predicted Transitions
                </h3>
                <div className="space-y-2">
                    {upcomingTransitions.slice(0, 4).map((transition, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{transition.employeeName}</p>
                                <p className="text-xs text-[#64748B]">
                                    {transition.currentStatus} → {transition.projectedStatus}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                                    <Calendar className="w-3 h-3" />
                                    {transition.transitionDate}
                                </div>
                                <p className="text-xs text-cyan-400 mt-0.5">
                                    {transition.confidence}% confidence
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ComplianceIntelligence;
