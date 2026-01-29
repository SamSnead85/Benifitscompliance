'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Building,
    Users,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';

interface Prediction {
    id: string;
    category: string;
    title: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: string;
    trend: 'up' | 'down' | 'stable';
    impact: string;
}

interface PredictiveAnalyticsProps {
    predictions?: Prediction[];
    className?: string;
}

const defaultPredictions: Prediction[] = [
    {
        id: '1',
        category: 'Workforce',
        title: 'FTE Count Forecast',
        currentValue: 156,
        predictedValue: 142,
        confidence: 87,
        timeframe: 'Next 6 months',
        trend: 'down',
        impact: 'Approaching ALE threshold'
    },
    {
        id: '2',
        category: 'Costs',
        title: 'Healthcare Spend',
        currentValue: 125000,
        predictedValue: 138000,
        confidence: 92,
        timeframe: 'Q2 2026',
        trend: 'up',
        impact: '10.4% increase expected'
    },
    {
        id: '3',
        category: 'Compliance',
        title: 'Penalty Risk Score',
        currentValue: 23,
        predictedValue: 18,
        confidence: 78,
        timeframe: 'After corrections',
        trend: 'down',
        impact: 'Risk reduction achievable'
    },
    {
        id: '4',
        category: 'Coverage',
        title: 'Enrollment Rate',
        currentValue: 94,
        predictedValue: 96,
        confidence: 85,
        timeframe: 'Open enrollment',
        trend: 'up',
        impact: 'Positive trajectory'
    },
];

const categoryIcons = {
    Workforce: Users,
    Costs: DollarSign,
    Compliance: AlertTriangle,
    Coverage: CheckCircle2,
};

export function PredictiveAnalyticsWidget({ predictions = defaultPredictions, className = '' }: PredictiveAnalyticsProps) {
    const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

    const formatValue = (value: number, category: string) => {
        if (category === 'Costs') return `$${value.toLocaleString()}`;
        if (category === 'Compliance' || category === 'Coverage') return `${value}%`;
        return value.toLocaleString();
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-violet)] flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Predictive Analytics</h3>
                        <p className="text-xs text-[var(--color-steel)]">AI-powered forecasts</p>
                    </div>
                </div>
            </div>

            {/* Predictions */}
            <div className="divide-y divide-[var(--glass-border)]">
                {predictions.map((pred, i) => {
                    const Icon = categoryIcons[pred.category as keyof typeof categoryIcons] || Building;
                    const isSelected = selectedPrediction === pred.id;
                    const change = pred.predictedValue - pred.currentValue;
                    const changePercent = ((change / pred.currentValue) * 100).toFixed(1);

                    return (
                        <motion.div
                            key={pred.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedPrediction(isSelected ? null : pred.id)}
                            className="p-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-[var(--color-synapse-teal)]" />
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-[var(--color-steel)]">{pred.category}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                            {pred.confidence}% confidence
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-white">{pred.title}</h4>
                                </div>

                                {/* Values */}
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-sm text-[var(--color-steel)]">
                                            {formatValue(pred.currentValue, pred.category)}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                                        <span className="text-lg font-bold text-white">
                                            {formatValue(pred.predictedValue, pred.category)}
                                        </span>
                                    </div>
                                    <span className={`text-xs ${pred.trend === 'up' ? 'text-[var(--color-success)]' :
                                            pred.trend === 'down' ? 'text-[var(--color-critical)]' :
                                                'text-[var(--color-steel)]'
                                        }`}>
                                        {pred.trend === 'up' ? '↑' : pred.trend === 'down' ? '↓' : '→'}
                                        {' '}{Math.abs(Number(changePercent))}%
                                    </span>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {isSelected && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-4 pt-4 border-t border-[var(--glass-border)]"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Timeframe</p>
                                            <p className="text-sm text-white">{pred.timeframe}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Model Confidence</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 rounded-full bg-[var(--glass-bg)]">
                                                    <div
                                                        className="h-full rounded-full bg-[var(--color-synapse-teal)]"
                                                        style={{ width: `${pred.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-white">{pred.confidence}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-steel)] mb-1">Impact</p>
                                            <p className="text-sm text-white">{pred.impact}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default PredictiveAnalyticsWidget;
