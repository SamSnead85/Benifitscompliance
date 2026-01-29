'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Clock,
    RefreshCw
} from 'lucide-react';

interface ComplianceScoreProps {
    score?: number;
    previousScore?: number;
    lastUpdated?: string;
    breakdown?: {
        coverage: number;
        affordability: number;
        reporting: number;
        dataQuality: number;
    };
    className?: string;
}

export function ComplianceScoreWidget({
    score = 94.2,
    previousScore = 92.8,
    lastUpdated = 'just now',
    breakdown = {
        coverage: 96,
        affordability: 92,
        reporting: 98,
        dataQuality: 91
    },
    className = ''
}: ComplianceScoreProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const trend = score >= previousScore ? 'up' : 'down';
    const trendDiff = Math.abs(score - previousScore).toFixed(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const getScoreColor = (s: number) => {
        if (s >= 95) return 'var(--color-success)';
        if (s >= 85) return 'var(--color-synapse-teal)';
        if (s >= 70) return 'var(--color-warning)';
        return 'var(--color-critical)';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 95) return 'Excellent';
        if (s >= 85) return 'Good';
        if (s >= 70) return 'Fair';
        return 'At Risk';
    };

    const scoreColor = getScoreColor(score);
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Compliance Score</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-steel)]">
                    <RefreshCw className="w-3 h-3" />
                    {lastUpdated}
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Score Gauge */}
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                        <circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke="var(--glass-border)"
                            strokeWidth="12"
                        />
                        <motion.circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-4xl font-bold text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {animatedScore.toFixed(1)}
                        </motion.span>
                        <span className="text-sm" style={{ color: scoreColor }}>
                            {getScoreLabel(score)}
                        </span>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-3">
                    {/* Trend */}
                    <div className="flex items-center gap-2 mb-4">
                        {trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-[var(--color-critical)]" />
                        )}
                        <span className={`text-sm ${trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
                            {trend === 'up' ? '+' : '-'}{trendDiff}% from last period
                        </span>
                    </div>

                    {/* Category Bars */}
                    {[
                        { label: 'Coverage Compliance', value: breakdown.coverage, icon: CheckCircle2 },
                        { label: 'Affordability', value: breakdown.affordability, icon: Clock },
                        { label: 'Reporting Status', value: breakdown.reporting, icon: Shield },
                        { label: 'Data Quality', value: breakdown.dataQuality, icon: AlertTriangle },
                    ].map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-[var(--color-steel)]">{item.label}</span>
                                <span className="font-mono text-[var(--color-silver)]">{item.value}%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: getScoreColor(item.value) }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ComplianceScoreWidget;
