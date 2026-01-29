'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    UserPlus,
    UserMinus,
    Clock,
    Calendar,
    ArrowRight
} from 'lucide-react';

interface TrendDataPoint {
    month: string;
    fullTime: number;
    partTime: number;
    variable: number;
}

interface WorkforceTrendAnalyzerProps {
    data?: TrendDataPoint[];
    projectedGrowth?: number;
    newHiresThisMonth?: number;
    terminationsThisMonth?: number;
    className?: string;
}

const defaultData: TrendDataPoint[] = [
    { month: 'Jul', fullTime: 11200, partTime: 2100, variable: 890 },
    { month: 'Aug', fullTime: 11350, partTime: 2050, variable: 920 },
    { month: 'Sep', fullTime: 11480, partTime: 2000, variable: 880 },
    { month: 'Oct', fullTime: 11620, partTime: 2080, variable: 910 },
    { month: 'Nov', fullTime: 11780, partTime: 2150, variable: 870 },
    { month: 'Dec', fullTime: 11950, partTime: 2200, variable: 850 },
    { month: 'Jan', fullTime: 12100, partTime: 2180, variable: 890 },
];

export function WorkforceTrendAnalyzer({
    data = defaultData,
    projectedGrowth = 8.2,
    newHiresThisMonth = 142,
    terminationsThisMonth = 45,
    className = ''
}: WorkforceTrendAnalyzerProps) {
    const latestData = data[data.length - 1];
    const previousData = data[data.length - 2];
    const totalCurrent = latestData.fullTime + latestData.partTime + latestData.variable;
    const totalPrevious = previousData.fullTime + previousData.partTime + previousData.variable;
    const monthlyChange = ((totalCurrent - totalPrevious) / totalPrevious * 100).toFixed(1);

    // Calculate chart dimensions
    const maxValue = Math.max(...data.map(d => d.fullTime + d.partTime + d.variable));
    const chartHeight = 120;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                    <h3 className="font-semibold text-white">Workforce Trends</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-sm ${projectedGrowth >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
                        {projectedGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {projectedGrowth >= 0 ? '+' : ''}{projectedGrowth}% projected
                    </span>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white font-mono">{totalCurrent.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-steel)]">Total Workforce</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--color-synapse-teal)] font-mono">{latestData.fullTime.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-steel)]">Full-Time</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <UserPlus className="w-4 h-4 text-[var(--color-success)]" />
                        <p className="text-2xl font-bold text-[var(--color-success)] font-mono">{newHiresThisMonth}</p>
                    </div>
                    <p className="text-xs text-[var(--color-steel)]">New Hires</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <UserMinus className="w-4 h-4 text-[var(--color-steel)]" />
                        <p className="text-2xl font-bold text-[var(--color-silver)] font-mono">{terminationsThisMonth}</p>
                    </div>
                    <p className="text-xs text-[var(--color-steel)]">Terminations</p>
                </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="flex items-end gap-2" style={{ height: chartHeight }}>
                {data.map((point, i) => {
                    const total = point.fullTime + point.partTime + point.variable;
                    const fullTimeHeight = (point.fullTime / maxValue) * chartHeight;
                    const partTimeHeight = (point.partTime / maxValue) * chartHeight;
                    const variableHeight = (point.variable / maxValue) * chartHeight;

                    return (
                        <div key={point.month} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col-reverse">
                                <motion.div
                                    className="w-full rounded-t bg-[var(--color-synapse-teal)]"
                                    initial={{ height: 0 }}
                                    animate={{ height: fullTimeHeight }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                />
                                <motion.div
                                    className="w-full bg-[var(--color-synapse-cyan)]"
                                    initial={{ height: 0 }}
                                    animate={{ height: partTimeHeight }}
                                    transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                                />
                                <motion.div
                                    className="w-full rounded-t bg-[var(--color-warning)]"
                                    initial={{ height: 0 }}
                                    animate={{ height: variableHeight }}
                                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-2 mt-2">
                {data.map(point => (
                    <div key={point.month} className="flex-1 text-center text-xs text-[var(--color-steel)]">
                        {point.month}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-[var(--color-synapse-teal)]" />
                    <span className="text-[var(--color-silver)]">Full-Time</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-[var(--color-synapse-cyan)]" />
                    <span className="text-[var(--color-silver)]">Part-Time</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-[var(--color-warning)]" />
                    <span className="text-[var(--color-silver)]">Variable</span>
                </div>
            </div>
        </motion.div>
    );
}

export default WorkforceTrendAnalyzer;
