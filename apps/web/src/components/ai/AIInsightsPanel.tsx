'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Lightbulb,
    ArrowRight,
    RefreshCw,
    Sparkles
} from 'lucide-react';

interface Insight {
    id: string;
    type: 'risk' | 'opportunity' | 'trend' | 'anomaly';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    metric?: { label: string; value: string; change?: number };
    action?: { label: string; onClick: () => void };
}

interface AIInsightsPanelProps {
    insights?: Insight[];
    onRefresh?: () => void;
    onDismiss?: (id: string) => void;
    className?: string;
}

const defaultInsights: Insight[] = [
    {
        id: '1',
        type: 'risk',
        title: 'Potential Penalty Exposure Detected',
        description: '45 employees have inconsistent Line 14/16 code combinations that may trigger IRS penalties.',
        impact: 'high',
        metric: { label: 'Estimated Exposure', value: '$135,000', change: -12 },
        action: { label: 'Review Codes', onClick: () => { } }
    },
    {
        id: '2',
        type: 'opportunity',
        title: 'Safe Harbor Optimization Available',
        description: 'Switching to Federal Poverty Line safe harbor could reduce your compliance burden by 23%.',
        impact: 'medium',
        metric: { label: 'Potential Savings', value: '$28,500' },
        action: { label: 'Run Analysis', onClick: () => { } }
    },
    {
        id: '3',
        type: 'trend',
        title: 'FTE Count Trending Down',
        description: 'Full-time employee count has decreased 8% over the last 3 months. Monitor for ALE threshold.',
        impact: 'medium',
        metric: { label: 'Current FTEs', value: '52', change: -8 },
    },
    {
        id: '4',
        type: 'anomaly',
        title: 'Unusual Coverage Gap Pattern',
        description: 'Department "Engineering" shows 3x more coverage gaps than other departments.',
        impact: 'low',
        action: { label: 'Investigate', onClick: () => { } }
    },
];

const typeConfig = {
    risk: { icon: AlertTriangle, color: 'var(--color-critical)', label: 'Risk Alert' },
    opportunity: { icon: Lightbulb, color: 'var(--color-synapse-gold)', label: 'Opportunity' },
    trend: { icon: TrendingUp, color: 'var(--color-synapse-teal)', label: 'Trend' },
    anomaly: { icon: Brain, color: 'var(--color-synapse-violet)', label: 'Anomaly' },
};

const impactColors = {
    high: 'var(--color-critical)',
    medium: 'var(--color-warning)',
    low: 'var(--color-steel)',
};

export function AIInsightsPanel({
    insights = defaultInsights,
    onRefresh,
    onDismiss,
    className = ''
}: AIInsightsPanelProps) {
    const [visibleInsights, setVisibleInsights] = useState(insights);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsRefreshing(false);
        onRefresh?.();
    };

    const handleDismiss = (id: string) => {
        setVisibleInsights(prev => prev.filter(i => i.id !== id));
        onDismiss?.(id);
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-violet)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">AI Insights</h3>
                            <p className="text-xs text-[var(--color-steel)]">{visibleInsights.length} actionable insights</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 text-[var(--color-steel)] ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Insights */}
            <div className="divide-y divide-[var(--glass-border)]">
                <AnimatePresence>
                    {visibleInsights.map((insight, i) => {
                        const config = typeConfig[insight.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4"
                            >
                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${config.color}20` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="text-xs font-medium"
                                                style={{ color: config.color }}
                                            >
                                                {config.label}
                                            </span>
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: impactColors[insight.impact] }}
                                            />
                                        </div>
                                        <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                                        <p className="text-sm text-[var(--color-steel)] mb-3">{insight.description}</p>

                                        {/* Metric */}
                                        {insight.metric && (
                                            <div className="flex items-center gap-4 mb-3 p-2 rounded-lg bg-[var(--glass-bg)]">
                                                <div>
                                                    <p className="text-xs text-[var(--color-steel)]">{insight.metric.label}</p>
                                                    <p className="text-lg font-bold text-white">{insight.metric.value}</p>
                                                </div>
                                                {insight.metric.change !== undefined && (
                                                    <div className={`flex items-center gap-1 text-sm ${insight.metric.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                                                        }`}>
                                                        {insight.metric.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                        {Math.abs(insight.metric.change)}%
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {insight.action && (
                                                <button
                                                    onClick={insight.action.onClick}
                                                    className="btn-primary text-xs"
                                                >
                                                    {insight.action.label}
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDismiss(insight.id)}
                                                className="btn-secondary text-xs"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {visibleInsights.length === 0 && (
                    <div className="p-8 text-center">
                        <Sparkles className="w-8 h-8 text-[var(--color-steel)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-steel)]">No insights available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIInsightsPanel;
