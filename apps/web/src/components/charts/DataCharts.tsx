'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FTETrendChartProps {
    className?: string;
    data?: MonthlyData[];
    threshold?: number;
}

interface MonthlyData {
    month: string;
    fte: number;
    employees: number;
}

const defaultData: MonthlyData[] = [
    { month: 'Jan', fte: 398, employees: 4389 },
    { month: 'Feb', fte: 402, employees: 4412 },
    { month: 'Mar', fte: 405, employees: 4445 },
    { month: 'Apr', fte: 408, employees: 4467 },
    { month: 'May', fte: 410, employees: 4489 },
    { month: 'Jun', fte: 412, employees: 4521 },
    { month: 'Jul', fte: 415, employees: 4545 },
    { month: 'Aug', fte: 418, employees: 4567 },
    { month: 'Sep', fte: 420, employees: 4590 },
    { month: 'Oct', fte: 422, employees: 4612 },
    { month: 'Nov', fte: 425, employees: 4640 },
    { month: 'Dec', fte: 428, employees: 4665 },
];

export function FTETrendChart({ className = '', data = defaultData, threshold = 50 }: FTETrendChartProps) {
    const maxFTE = Math.max(...data.map(d => d.fte));
    const minFTE = Math.min(...data.map(d => d.fte));
    const currentFTE = data[data.length - 1].fte;
    const previousFTE = data[data.length - 2]?.fte || currentFTE;
    const change = currentFTE - previousFTE;
    const percentChange = ((change / previousFTE) * 100).toFixed(1);

    // Calculate SVG path for the line chart
    const chartHeight = 120;
    const chartWidth = 100; // percentage
    const padding = 10;
    const range = maxFTE - minFTE || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
        const y = chartHeight - ((d.fte - minFTE) / range) * (chartHeight - 2 * padding) - padding;
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-white">FTE Trend</h3>
                    <p className="text-xs text-[var(--color-steel)]">12-month rolling average</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white font-mono">{currentFTE}</p>
                    <div className={`text-xs flex items-center justify-end gap-1 ${change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                        }`}>
                        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change >= 0 ? '+' : ''}{change} ({percentChange}%)
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-32">
                <svg viewBox={`0 0 100 ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
                    {/* Gradient */}
                    <defs>
                        <linearGradient id="fteGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-synapse-teal)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--color-synapse-teal)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Threshold line */}
                    {threshold && (
                        <line
                            x1="0"
                            y1={chartHeight - ((threshold - minFTE) / range) * (chartHeight - 2 * padding) - padding}
                            x2="100"
                            y2={chartHeight - ((threshold - minFTE) / range) * (chartHeight - 2 * padding) - padding}
                            stroke="var(--color-warning)"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                            opacity="0.5"
                        />
                    )}

                    {/* Area */}
                    <motion.path
                        d={areaPath}
                        fill="url(#fteGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="var(--color-synapse-teal)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />

                    {/* Points */}
                    {points.map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="1.5"
                            fill="var(--color-synapse-teal)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                        />
                    ))}
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-[var(--color-steel)]">
                {data.filter((_, i) => i % 2 === 0).map((d) => (
                    <span key={d.month}>{d.month}</span>
                ))}
            </div>

            {/* ACA Threshold Notice */}
            {currentFTE >= threshold && (
                <div className="mt-4 p-3 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]">
                    <p className="text-xs text-[var(--color-success)]">
                        ✓ Above 50 FTE threshold – ACA reporting required
                    </p>
                </div>
            )}
        </motion.div>
    );
}


interface CoverageBreakdownChartProps {
    className?: string;
}

export function CoverageBreakdownChart({ className = '' }: CoverageBreakdownChartProps) {
    const data = [
        { label: 'Enrolled', value: 4100, color: 'var(--color-success)', percent: 90.7 },
        { label: 'Waived', value: 320, color: 'var(--color-warning)', percent: 7.1 },
        { label: 'Ineligible', value: 101, color: 'var(--color-steel)', percent: 2.2 },
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Calculate pie chart
    let cumulativePercent = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <h3 className="font-semibold text-white mb-4">Coverage Breakdown</h3>

            <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {data.map((segment, i) => {
                            const startAngle = cumulativePercent * 3.6;
                            cumulativePercent += segment.percent;
                            const endAngle = cumulativePercent * 3.6;

                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;

                            const x1 = 50 + 40 * Math.cos(startRad);
                            const y1 = 50 + 40 * Math.sin(startRad);
                            const x2 = 50 + 40 * Math.cos(endRad);
                            const y2 = 50 + 40 * Math.sin(endRad);

                            const largeArc = segment.percent > 50 ? 1 : 0;

                            return (
                                <motion.path
                                    key={segment.label}
                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                    fill={segment.color}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                />
                            );
                        })}
                        <circle cx="50" cy="50" r="25" fill="var(--glass-bg)" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-bold text-white">{total.toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-steel)]">Total</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {data.map((segment) => (
                        <div key={segment.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm text-white">{segment.label}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-mono text-white">{segment.value.toLocaleString()}</span>
                                <span className="text-xs text-[var(--color-steel)] ml-2">({segment.percent}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}


interface ComplianceHeatmapProps {
    className?: string;
}

export function ComplianceHeatmap({ className = '' }: ComplianceHeatmapProps) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const departments = ['Engineering', 'Sales', 'Operations', 'HR', 'Finance'];

    // Generate random compliance scores for demo
    const generateScore = () => 85 + Math.random() * 15;

    const getColor = (score: number) => {
        if (score >= 98) return 'var(--color-success)';
        if (score >= 95) return 'var(--color-synapse-teal)';
        if (score >= 90) return 'var(--color-warning)';
        return 'var(--color-critical)';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <h3 className="font-semibold text-white mb-4">Compliance Heatmap by Department</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-xs text-[var(--color-steel)] pb-2"></th>
                            {months.map((m) => (
                                <th key={m} className="text-center text-xs text-[var(--color-steel)] pb-2 px-1">{m}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept, deptIndex) => (
                            <tr key={dept}>
                                <td className="text-sm text-white pr-3 py-1">{dept}</td>
                                {months.map((month, monthIndex) => {
                                    const score = generateScore();
                                    return (
                                        <td key={month} className="p-0.5">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: (deptIndex * 12 + monthIndex) * 0.01 }}
                                                className="w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                                style={{ backgroundColor: `${getColor(score)}40` }}
                                                title={`${dept} - ${month}: ${score.toFixed(1)}%`}
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-sm"
                                                    style={{ backgroundColor: getColor(score) }}
                                                />
                                            </motion.div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mt-4 text-xs text-[var(--color-steel)]">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[var(--color-success)]" /> 98%+
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[var(--color-synapse-teal)]" /> 95-98%
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[var(--color-warning)]" /> 90-95%
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[var(--color-critical)]" /> &lt;90%
                </span>
            </div>
        </motion.div>
    );
}

export { FTETrendChart as default };
