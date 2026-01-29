'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowRight,
    Brain,
    Lightbulb,
    Target
} from 'lucide-react';

interface QuickInsightsProps {
    className?: string;
}

interface Insight {
    id: string;
    type: 'recommendation' | 'alert' | 'opportunity' | 'trend';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    actionLabel?: string;
}

const mockInsights: Insight[] = [
    {
        id: 'ins-1',
        type: 'recommendation',
        title: 'Optimize Safe Harbor for 23 Employees',
        description: 'Switching from W-2 to Rate of Pay safe harbor would reduce penalty risk by $34,500.',
        impact: 'high',
        confidence: 94,
        actionLabel: 'Review Employees'
    },
    {
        id: 'ins-2',
        type: 'alert',
        title: 'Coverage Gap Detected',
        description: '8 employees have missing coverage data for March. Forms may be incomplete.',
        impact: 'high',
        confidence: 100,
        actionLabel: 'Fix Now'
    },
    {
        id: 'ins-3',
        type: 'opportunity',
        title: 'FTE Threshold Approaching',
        description: 'You have 48 FTEs. Hiring 2+ more triggers ACA reporting. Plan accordingly.',
        impact: 'medium',
        confidence: 88,
        actionLabel: 'Learn More'
    },
    {
        id: 'ins-4',
        type: 'trend',
        title: 'Compliance Score Improving',
        description: 'Your score increased 12% this quarter. Keep up the good work!',
        impact: 'low',
        confidence: 100
    },
];

const typeConfig = {
    recommendation: { icon: Lightbulb, color: 'var(--color-synapse-teal)', label: 'Recommendation' },
    alert: { icon: AlertTriangle, color: 'var(--color-warning)', label: 'Alert' },
    opportunity: { icon: Target, color: 'var(--color-synapse-gold)', label: 'Opportunity' },
    trend: { icon: TrendingUp, color: 'var(--color-synapse-cyan)', label: 'Trend' },
};

export function QuickInsights({ className = '' }: QuickInsightsProps) {
    const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

    const visibleInsights = mockInsights.filter(i => !dismissedInsights.has(i.id));

    const dismissInsight = (id: string) => {
        setDismissedInsights(prev => new Set([...prev, id]));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">AI Quick Insights</h3>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-[rgba(20,184,166,0.2)] text-[var(--color-synapse-teal)]">
                    {visibleInsights.length} active
                </span>
            </div>

            {/* Insights List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {visibleInsights.map((insight, i) => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 hover:bg-[var(--glass-bg-light)] transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-xs px-1.5 py-0.5 rounded"
                                            style={{
                                                backgroundColor: `${config.color}20`,
                                                color: config.color
                                            }}
                                        >
                                            {config.label}
                                        </span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${insight.impact === 'high'
                                                ? 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                                : insight.impact === 'medium'
                                                    ? 'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]'
                                                    : 'bg-[rgba(156,163,175,0.2)] text-[var(--color-steel)]'
                                            }`}>
                                            {insight.impact} impact
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-white mb-1">{insight.title}</p>
                                    <p className="text-xs text-[var(--color-steel)]">{insight.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {insight.confidence}% confidence
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dismissInsight(insight.id)}
                                                className="text-xs text-[var(--color-steel)] hover:text-white"
                                            >
                                                Dismiss
                                            </button>
                                            {insight.actionLabel && (
                                                <button className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                                                    {insight.actionLabel}
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {visibleInsights.length === 0 && (
                <div className="p-8 text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--color-success)] opacity-50 mb-2" />
                    <p className="text-sm text-[var(--color-steel)]">All insights reviewed</p>
                </div>
            )}
        </motion.div>
    );
}

export default QuickInsights;
