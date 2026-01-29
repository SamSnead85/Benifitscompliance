'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Brain,
    Target,
    AlertTriangle,
    CheckCircle2,
    Clock,
    DollarSign,
    Users,
    Calendar,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface Prediction {
    id: string;
    category: 'fte' | 'penalty' | 'compliance' | 'budget';
    title: string;
    currentValue: string | number;
    predictedValue: string | number;
    change: number;
    confidence: number;
    timeframe: string;
    factors: string[];
    trend: 'up' | 'down' | 'stable';
}

interface PredictiveAnalyticsProps {
    predictions?: Prediction[];
    className?: string;
}

const defaultPredictions: Prediction[] = [
    {
        id: 'pred-001',
        category: 'fte',
        title: 'Full-Time Equivalent Count',
        currentValue: 4521,
        predictedValue: 4892,
        change: 8.2,
        confidence: 89,
        timeframe: 'Q2 2026',
        factors: ['Hiring plan expansion', 'Seasonal contractors', 'Department growth'],
        trend: 'up'
    },
    {
        id: 'pred-002',
        category: 'penalty',
        title: 'Potential ACA Penalty Exposure',
        currentValue: '$0',
        predictedValue: '$45,200',
        change: 100,
        confidence: 76,
        timeframe: 'Tax Year 2026',
        factors: ['15 employees exceeding affordability threshold', 'Coverage gap in new hire onboarding'],
        trend: 'up'
    },
    {
        id: 'pred-003',
        category: 'compliance',
        title: 'Overall Compliance Score',
        currentValue: '96.8%',
        predictedValue: '98.2%',
        change: 1.4,
        confidence: 92,
        timeframe: 'Q2 2026',
        factors: ['New automation rules', 'Improved data quality', 'Safe harbor optimization'],
        trend: 'up'
    },
    {
        id: 'pred-004',
        category: 'budget',
        title: 'Benefits Administration Cost',
        currentValue: '$124,500',
        predictedValue: '$98,200',
        change: -21.1,
        confidence: 85,
        timeframe: 'Annual',
        factors: ['Process automation', 'Reduced manual reviews', 'Faster reconciliation'],
        trend: 'down'
    }
];

const categoryConfig = {
    fte: { icon: Users, color: 'var(--color-synapse-teal)' },
    penalty: { icon: AlertTriangle, color: 'var(--color-critical)' },
    compliance: { icon: CheckCircle2, color: 'var(--color-success)' },
    budget: { icon: DollarSign, color: 'var(--color-synapse-gold)' }
};

export function PredictiveAnalytics({
    predictions = defaultPredictions,
    className = ''
}: PredictiveAnalyticsProps) {
    const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                        <Target className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Predictive Analytics</h3>
                        <p className="text-xs text-[var(--color-steel)]">
                            ML-powered forecasts based on your data patterns
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-[var(--glass-bg)] text-[var(--color-steel)] flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        Updated 1h ago
                    </span>
                </div>
            </div>

            {/* Predictions Grid */}
            <div className="grid grid-cols-2 gap-4">
                {predictions.map((prediction, i) => {
                    const category = categoryConfig[prediction.category];
                    const CategoryIcon = category.icon;
                    const isExpanded = expandedPrediction === prediction.id;
                    const isPositive = prediction.category === 'penalty'
                        ? prediction.change < 0
                        : prediction.change > 0;

                    return (
                        <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-xl border border-[var(--glass-border)] overflow-hidden"
                        >
                            <div
                                onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                                className="p-4 bg-[var(--glass-bg-light)] cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${category.color}20` }}
                                    >
                                        <CategoryIcon className="w-5 h-5" style={{ color: category.color }} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Brain className="w-3 h-3 text-[var(--color-steel)]" />
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {prediction.confidence}%
                                        </span>
                                    </div>
                                </div>

                                <h4 className="font-medium text-white text-sm mb-3">{prediction.title}</h4>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Current</p>
                                        <p className="text-lg font-bold text-white font-mono">
                                            {prediction.currentValue}
                                        </p>
                                    </div>
                                    <div className="text-center px-2">
                                        <div className="flex items-center gap-1 text-[var(--color-steel)]">
                                            {prediction.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : prediction.trend === 'down' ? (
                                                <TrendingDown className="w-4 h-4" />
                                            ) : null}
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)]">{prediction.timeframe}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Predicted</p>
                                        <p
                                            className="text-lg font-bold font-mono"
                                            style={{ color: category.color }}
                                        >
                                            {prediction.predictedValue}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isPositive
                                            ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                            : 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                        }`}>
                                        {prediction.change > 0 ? '+' : ''}{prediction.change}%
                                    </span>
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                        <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Expanded Factors */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="border-t border-[var(--glass-border)] p-4"
                                >
                                    <p className="text-xs text-[var(--color-steel)] mb-2">Key Factors</p>
                                    <ul className="space-y-1">
                                        {prediction.factors.map((factor, idx) => (
                                            <li
                                                key={idx}
                                                className="text-sm text-[var(--color-silver)] flex items-center gap-2"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                                                {factor}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Confidence Legend */}
            <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center justify-between text-xs text-[var(--color-steel)]">
                    <span className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Confidence levels based on 24 months of historical data
                    </span>
                    <span>Next model refresh: Tomorrow 6:00 AM</span>
                </div>
            </div>
        </motion.div>
    );
}

export default PredictiveAnalytics;
