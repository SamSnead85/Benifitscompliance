'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Sparkles,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Zap,
    Target,
    Clock,
    ChevronRight,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    X
} from 'lucide-react';

interface AIInsight {
    id: string;
    type: 'recommendation' | 'warning' | 'opportunity' | 'prediction';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    action?: { label: string; href?: string };
    metrics?: { label: string; value: string }[];
    createdAt: string;
}

interface AIInsightsEngineProps {
    insights?: AIInsight[];
    className?: string;
}

const defaultInsights: AIInsight[] = [
    {
        id: 'ai-001',
        type: 'warning',
        title: 'Potential 4980H(b) Penalty Risk Detected',
        description: 'Based on current affordability data, 23 employees may trigger penalties in Q2 2026. Premium contributions exceed 9.12% threshold.',
        impact: 'high',
        confidence: 94,
        action: { label: 'Review Affected Employees', href: '/compliance/affordability' },
        metrics: [
            { label: 'Employees at Risk', value: '23' },
            { label: 'Potential Penalty', value: '$68,400' },
            { label: 'Avg Premium Rate', value: '9.8%' }
        ],
        createdAt: '2h ago'
    },
    {
        id: 'ai-002',
        type: 'opportunity',
        title: 'Safe Harbor Optimization Available',
        description: 'Switching 156 employees from W-2 to Rate of Pay safe harbor could reduce audit risk by 34% while maintaining compliance.',
        impact: 'medium',
        confidence: 87,
        action: { label: 'Apply Optimization' },
        metrics: [
            { label: 'Employees', value: '156' },
            { label: 'Risk Reduction', value: '34%' },
            { label: 'Time Savings', value: '12 hrs/mo' }
        ],
        createdAt: '5h ago'
    },
    {
        id: 'ai-003',
        type: 'prediction',
        title: 'FTE Count Projected to Exceed ALE Threshold',
        description: 'Based on hiring trends, your organization will exceed 50 FTE by March 2026. ACA employer mandate will apply starting Q2 2026.',
        impact: 'high',
        confidence: 91,
        action: { label: 'Plan for ALE Status' },
        metrics: [
            { label: 'Current FTE', value: '47' },
            { label: 'Projected FTE (Mar)', value: '54' },
            { label: 'Threshold', value: '50' }
        ],
        createdAt: '1d ago'
    },
    {
        id: 'ai-004',
        type: 'recommendation',
        title: 'Automate New Hire Eligibility Tracking',
        description: 'Enable automated measurement period assignment for new hires to reduce manual work and ensure consistent compliance.',
        impact: 'low',
        confidence: 95,
        action: { label: 'Configure Automation' },
        createdAt: '2d ago'
    }
];

const typeConfig = {
    recommendation: { icon: Lightbulb, color: 'var(--color-synapse-cyan)', label: 'Recommendation' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', label: 'Warning' },
    opportunity: { icon: Target, color: 'var(--color-synapse-gold)', label: 'Opportunity' },
    prediction: { icon: TrendingUp, color: 'var(--color-synapse-teal)', label: 'Prediction' }
};

const impactConfig = {
    high: { color: 'var(--color-critical)', label: 'High Impact' },
    medium: { color: 'var(--color-warning)', label: 'Medium Impact' },
    low: { color: 'var(--color-steel)', label: 'Low Impact' }
};

export function AIInsightsEngine({
    insights = defaultInsights,
    className = ''
}: AIInsightsEngineProps) {
    const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
    const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const visibleInsights = insights.filter(i => !dismissedInsights.includes(i.id));
    const highImpactCount = visibleInsights.filter(i => i.impact === 'high').length;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsRefreshing(false);
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            AI Insights Engine
                            <Sparkles className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                        </h3>
                        <p className="text-xs text-[var(--color-steel)]">
                            Powered by compliance intelligence • Last updated 15m ago
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {highImpactCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)] flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {highImpactCount} high impact
                        </span>
                    )}
                    <button
                        onClick={handleRefresh}
                        className="btn-secondary"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {visibleInsights.map((insight, i) => {
                        const type = typeConfig[insight.type];
                        const impact = impactConfig[insight.impact];
                        const TypeIcon = type.icon;
                        const isExpanded = expandedInsight === insight.id;

                        return (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl border border-[var(--glass-border)] overflow-hidden"
                            >
                                <div
                                    onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                                    className="p-4 bg-[var(--glass-bg-light)] flex items-start gap-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${type.color}20` }}
                                    >
                                        <TypeIcon className="w-5 h-5" style={{ color: type.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{insight.title}</span>
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)] line-clamp-2 mb-2">
                                            {insight.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span
                                                className="px-2 py-0.5 rounded"
                                                style={{ backgroundColor: `${type.color}20`, color: type.color }}
                                            >
                                                {type.label}
                                            </span>
                                            <span
                                                className="px-2 py-0.5 rounded"
                                                style={{ backgroundColor: `${impact.color}20`, color: impact.color }}
                                            >
                                                {impact.label}
                                            </span>
                                            <span className="text-[var(--color-steel)] flex items-center gap-1">
                                                <Brain className="w-3 h-3" />
                                                {insight.confidence}% confidence
                                            </span>
                                            <span className="text-[var(--color-steel)]">{insight.createdAt}</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDismissedInsights([...dismissedInsights, insight.id]);
                                            }}
                                            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                                            <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-[var(--glass-border)]"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Metrics */}
                                                {insight.metrics && (
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {insight.metrics.map((metric) => (
                                                            <div
                                                                key={metric.label}
                                                                className="p-3 rounded-lg bg-[var(--glass-bg)]"
                                                            >
                                                                <p className="text-xs text-[var(--color-steel)] mb-1">{metric.label}</p>
                                                                <p className="text-lg font-bold text-white font-mono">{metric.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-sm text-[var(--color-steel)]">
                                                        <span>Was this helpful?</span>
                                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)]">
                                                            <ThumbsUp className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)]">
                                                            <ThumbsDown className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {insight.action && (
                                                        <button className="btn-primary text-sm">
                                                            {insight.action.label}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {visibleInsights.length === 0 && (
                    <div className="p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-[var(--color-success)]" />
                        <p className="text-white font-medium">All caught up!</p>
                        <p className="text-sm text-[var(--color-steel)]">No new insights at this time.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default AIInsightsEngine;
