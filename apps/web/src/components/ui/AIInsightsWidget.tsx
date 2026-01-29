'use client';

import { motion } from 'framer-motion';
import {
    Brain,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Lightbulb,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface AIInsight {
    id: string;
    type: 'trend' | 'alert' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    impact?: string;
    confidence: number;
    actionLabel?: string;
    actionHref?: string;
}

interface AIInsightsWidgetProps {
    insights: AIInsight[];
    className?: string;
}

const typeConfig = {
    trend: { icon: TrendingUp, color: 'var(--color-synapse-teal)', bgColor: 'rgba(6,182,212,0.15)' },
    alert: { icon: AlertTriangle, color: 'var(--color-warning)', bgColor: 'rgba(245,158,11,0.15)' },
    recommendation: { icon: Lightbulb, color: 'var(--color-synapse-cyan)', bgColor: 'rgba(34,211,238,0.15)' },
    achievement: { icon: CheckCircle2, color: 'var(--color-success)', bgColor: 'rgba(16,185,129,0.15)' },
};

// Default insights for demo
const defaultInsights: AIInsight[] = [
    {
        id: '1',
        type: 'trend',
        title: 'FTE Growth Detected',
        description: 'Your full-time workforce has grown 8% this quarter. Consider reviewing ACA measurement periods.',
        impact: '+312 FTEs since Oct 2025',
        confidence: 94,
        actionLabel: 'Review FTE Analysis',
        actionHref: '/compliance'
    },
    {
        id: '2',
        type: 'alert',
        title: 'Affordability Threshold Alert',
        description: '23 employees are approaching the 9.12% affordability limit for 2026.',
        impact: 'Potential $4,800 penalty exposure',
        confidence: 89,
        actionLabel: 'View Exceptions',
        actionHref: '/compliance'
    },
    {
        id: '3',
        type: 'recommendation',
        title: 'Optimize Measurement Period',
        description: 'Based on seasonal hiring patterns, switching to a monthly measurement method could reduce compliance risk.',
        confidence: 82,
        actionLabel: 'Learn More',
    },
    {
        id: '4',
        type: 'achievement',
        title: '99.2% Data Quality',
        description: 'All client records are validated and ready for form generation.',
        confidence: 99,
    },
];

export function AIInsightsWidget({ insights = defaultInsights, className = '' }: AIInsightsWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            AI Insights
                            <Sparkles className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                        </h2>
                        <p className="text-xs text-[var(--color-steel)]">Powered by Synapse Intelligence</p>
                    </div>
                </div>
                <span className="text-xs text-[var(--color-steel)]">Updated just now</span>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                {insights.map((insight, index) => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: config.bgColor }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">{insight.title}</span>
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {insight.confidence}% confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--color-silver)] mb-2">{insight.description}</p>
                                    {insight.impact && (
                                        <p className="text-xs font-medium" style={{ color: config.color }}>
                                            {insight.impact}
                                        </p>
                                    )}
                                    {insight.actionLabel && (
                                        <button className="mt-2 text-xs text-[var(--color-synapse-teal)] hover:text-[var(--color-synapse-cyan)] flex items-center gap-1 transition-colors">
                                            {insight.actionLabel}
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default AIInsightsWidget;
