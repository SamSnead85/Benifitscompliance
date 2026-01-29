'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Calendar,
    ChevronRight,
    Target,
    Percent,
    Zap
} from 'lucide-react';

interface ProjectionScenario {
    month: string;
    projected: number;
    pessimistic: number;
    optimistic: number;
}

interface FTEProjectionModelProps {
    currentFTE?: number;
    baselineGrowth?: number;
    scenarios?: ProjectionScenario[];
    className?: string;
}

const defaultScenarios: ProjectionScenario[] = [
    { month: 'Feb', projected: 12200, pessimistic: 12050, optimistic: 12350 },
    { month: 'Mar', projected: 12380, pessimistic: 12180, optimistic: 12580 },
    { month: 'Apr', projected: 12560, pessimistic: 12310, optimistic: 12810 },
    { month: 'May', projected: 12750, pessimistic: 12450, optimistic: 13050 },
    { month: 'Jun', projected: 12950, pessimistic: 12600, optimistic: 13300 },
    { month: 'Jul', projected: 13160, pessimistic: 12760, optimistic: 13560 },
];

export function FTEProjectionModel({
    currentFTE = 12100,
    baselineGrowth = 8.5,
    scenarios = defaultScenarios,
    className = ''
}: FTEProjectionModelProps) {
    const [selectedScenario, setSelectedScenario] = useState<'projected' | 'pessimistic' | 'optimistic'>('projected');

    const maxValue = Math.max(...scenarios.map(s => s.optimistic)) * 1.05;
    const minValue = Math.min(...scenarios.map(s => s.pessimistic)) * 0.95;
    const chartHeight = 150;

    const getY = (val: number) => {
        return chartHeight - ((val - minValue) / (maxValue - minValue)) * chartHeight;
    };

    // Generate path strings
    const generatePath = (key: 'projected' | 'pessimistic' | 'optimistic') => {
        return scenarios.map((s, i) => {
            const x = (i / (scenarios.length - 1)) * 100;
            const y = getY(s[key]);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const projectedEnd = scenarios[scenarios.length - 1].projected;
    const growthPercent = ((projectedEnd - currentFTE) / currentFTE * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">FTE Projection Model</h3>
                </div>
                <div className="flex items-center gap-1">
                    {(['projected', 'pessimistic', 'optimistic'] as const).map((scenario) => (
                        <button
                            key={scenario}
                            onClick={() => setSelectedScenario(scenario)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedScenario === scenario
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Current FTE</span>
                    </div>
                    <p className="text-xl font-bold text-white font-mono">{currentFTE.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">6-Mo Projection</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--color-synapse-teal)] font-mono">
                        {scenarios[scenarios.length - 1][selectedScenario].toLocaleString()}
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-[var(--color-steel)] mb-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-xs">Growth Rate</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--color-success)] font-mono">+{growthPercent}%</p>
                </div>
            </div>

            {/* Chart */}
            <div className="relative" style={{ height: chartHeight }}>
                <svg viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={ratio * chartHeight}
                            x2="100"
                            y2={ratio * chartHeight}
                            stroke="var(--glass-border)"
                            strokeWidth="0.2"
                        />
                    ))}

                    {/* Confidence band */}
                    <path
                        d={`${generatePath('optimistic')} L 100 ${getY(scenarios[scenarios.length - 1].pessimistic)} ${scenarios.slice().reverse().map((s, i) => {
                            const x = 100 - (i / (scenarios.length - 1)) * 100;
                            const y = getY(s.pessimistic);
                            return `L ${x} ${y}`;
                        }).join(' ')} Z`}
                        fill="var(--color-synapse-teal)"
                        opacity="0.1"
                    />

                    {/* Pessimistic line */}
                    <path
                        d={generatePath('pessimistic')}
                        fill="none"
                        stroke="var(--color-steel)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                    />

                    {/* Optimistic line */}
                    <path
                        d={generatePath('optimistic')}
                        fill="none"
                        stroke="var(--color-steel)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                    />

                    {/* Projected line */}
                    <path
                        d={generatePath('projected')}
                        fill="none"
                        stroke="var(--color-synapse-teal)"
                        strokeWidth="2"
                    />

                    {/* Data points for selected scenario */}
                    {scenarios.map((s, i) => (
                        <circle
                            key={i}
                            cx={(i / (scenarios.length - 1)) * 100}
                            cy={getY(s[selectedScenario])}
                            r="3"
                            fill="var(--color-synapse-teal)"
                            className={selectedScenario === 'projected' ? 'opacity-100' : 'opacity-50'}
                        />
                    ))}
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-[var(--color-steel)]">
                <span>Now</span>
                {scenarios.map((s, i) => (
                    <span key={i}>{s.month}</span>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-0.5 bg-[var(--color-synapse-teal)]" />
                    <span className="text-[var(--color-silver)]">Projected</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-0.5 border-t border-dashed border-[var(--color-steel)]" />
                    <span className="text-[var(--color-steel)]">Range</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-3 bg-[var(--color-synapse-teal)] opacity-10" />
                    <span className="text-[var(--color-steel)]">Confidence Band</span>
                </div>
            </div>
        </motion.div>
    );
}

export default FTEProjectionModel;
