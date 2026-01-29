'use client';

import { motion } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Users,
    DollarSign,
    Calendar,
    ChevronRight,
    Lightbulb,
    Target,
    Clock,
    ArrowRight,
} from 'lucide-react';

interface Insight {
    id: string;
    type: 'opportunity' | 'risk' | 'trend' | 'action';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact?: string;
    recommendation?: string;
    deadline?: string;
    confidence: number;
}

interface PredictiveInsightsWidgetProps {
    insights: Insight[];
    className?: string;
    onInsightClick?: (insight: Insight) => void;
}

/**
 * Predictive Insights Widget
 * Proactive AI-generated recommendations and alerts
 */
export function PredictiveInsightsWidget({
    insights,
    className = '',
    onInsightClick,
}: PredictiveInsightsWidgetProps) {
    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'opportunity':
                return {
                    icon: <Lightbulb className="w-4 h-4" />,
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/30',
                    text: 'text-emerald-400',
                };
            case 'risk':
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-400',
                };
            case 'trend':
                return {
                    icon: <TrendingUp className="w-4 h-4" />,
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/30',
                    text: 'text-cyan-400',
                };
            case 'action':
                return {
                    icon: <Target className="w-4 h-4" />,
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    text: 'text-amber-400',
                };
            default:
                return {
                    icon: <Sparkles className="w-4 h-4" />,
                    bg: 'bg-indigo-500/10',
                    border: 'border-indigo-500/30',
                    text: 'text-indigo-400',
                };
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400';
            case 'medium':
                return 'bg-amber-500/20 text-amber-400';
            default:
                return 'bg-cyan-500/20 text-cyan-400';
        }
    };

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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                AI Insights
                            </h2>
                            <p className="text-sm text-[#64748B]">Predictive recommendations</p>
                        </div>
                    </div>

                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400">
                        {insights.length} insights
                    </span>
                </div>
            </div>

            {/* Insights List */}
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {insights.map((insight, index) => {
                    const config = getTypeConfig(insight.type);

                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onInsightClick?.(insight)}
                            className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
                        >
                            <div className="flex gap-3">
                                <div className={`p-2 rounded-lg ${config.bg}`}>
                                    <span className={config.text}>{config.icon}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${config.bg} ${config.text} border ${config.border}`}>
                                                {insight.type}
                                            </span>
                                            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${getPriorityBadge(insight.priority)}`}>
                                                {insight.priority}
                                            </span>
                                            <span className="text-[10px] text-[#64748B]">
                                                {insight.confidence}% confidence
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-medium text-white mb-1">{insight.title}</h3>
                                    <p className="text-xs text-[#94A3B8] line-clamp-2">{insight.description}</p>

                                    {(insight.impact || insight.deadline) && (
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                                            {insight.impact && (
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {insight.impact}
                                                </span>
                                            )}
                                            {insight.deadline && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {insight.deadline}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {insight.recommendation && (
                                        <div className="mt-2 p-2 rounded-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                                            <p className="text-xs text-cyan-400 flex items-center gap-1">
                                                <ArrowRight className="w-3 h-3" />
                                                {insight.recommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                <button className="w-full text-center text-xs text-purple-400 hover:underline flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Generate More Insights
                </button>
            </div>
        </motion.div>
    );
}

export default PredictiveInsightsWidget;
