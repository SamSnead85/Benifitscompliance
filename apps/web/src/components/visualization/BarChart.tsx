'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarData {
    label: string;
    value: number;
    color?: string;
    secondaryValue?: number;
}

interface BarChartProps {
    data: BarData[];
    orientation?: 'vertical' | 'horizontal';
    showValues?: boolean;
    showGrid?: boolean;
    height?: number;
    barWidth?: number;
    className?: string;
}

const defaultColors = [
    'var(--color-synapse-teal)',
    'var(--color-synapse-cyan)',
    'var(--color-synapse-gold)',
    'var(--color-synapse-violet)',
];

export function BarChart({
    data,
    orientation = 'vertical',
    showValues = true,
    showGrid = true,
    height = 200,
    className = ''
}: BarChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const maxValue = Math.max(...data.map(d => d.value));
    const gridLines = [0, 25, 50, 75, 100].map(p => (p / 100) * maxValue);

    if (orientation === 'horizontal') {
        return (
            <div className={`space-y-3 ${className}`}>
                {data.map((item, i) => {
                    const percentage = (item.value / maxValue) * 100;
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm ${isHovered ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                    {item.label}
                                </span>
                                {showValues && (
                                    <span className="text-sm font-medium text-white">
                                        {item.value.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="h-6 rounded-lg bg-[var(--glass-bg)] overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="h-full rounded-lg"
                                    style={{
                                        backgroundColor: item.color || defaultColors[i % defaultColors.length],
                                        opacity: isHovered ? 1 : 0.85
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={className} style={{ height }}>
            {/* Grid lines */}
            {showGrid && (
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {gridLines.reverse().map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--color-steel)] w-8 text-right">
                                {Math.round(val)}
                            </span>
                            <div className="flex-1 h-px bg-[var(--glass-border)]" />
                        </div>
                    ))}
                </div>
            )}

            {/* Bars */}
            <div className="relative h-full flex items-end justify-around gap-2 ml-10">
                {data.map((item, i) => {
                    const percentage = (item.value / maxValue) * 100;
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center flex-1"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${percentage}%` }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="w-full max-w-12 rounded-t-lg cursor-pointer"
                                style={{
                                    backgroundColor: item.color || defaultColors[i % defaultColors.length],
                                    opacity: isHovered ? 1 : 0.85
                                }}
                            >
                                {isHovered && showValues && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--glass-bg)] text-xs text-white whitespace-nowrap"
                                    >
                                        {item.value.toLocaleString()}
                                    </motion.div>
                                )}
                            </motion.div>
                            <span className="text-xs text-[var(--color-steel)] mt-2 truncate max-w-full">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


interface StackedBarData {
    label: string;
    segments: { label: string; value: number; color?: string }[];
}

interface StackedBarChartProps {
    data: StackedBarData[];
    height?: number;
    showLegend?: boolean;
    className?: string;
}

export function StackedBarChart({ data, height = 300, showLegend = true, className = '' }: StackedBarChartProps) {
    const [hoveredSegment, setHoveredSegment] = useState<{ bar: number; segment: number } | null>(null);

    const maxTotal = Math.max(...data.map(d => d.segments.reduce((sum, s) => sum + s.value, 0)));

    const allSegmentLabels = [...new Set(data.flatMap(d => d.segments.map(s => s.label)))];

    return (
        <div className={className}>
            <div className="flex items-end gap-4" style={{ height }}>
                {data.map((bar, barIndex) => {
                    const total = bar.segments.reduce((sum, s) => sum + s.value, 0);
                    const barHeight = (total / maxTotal) * 100;

                    return (
                        <div key={barIndex} className="flex flex-col items-center flex-1">
                            <div
                                className="w-full max-w-16 rounded-t-lg overflow-hidden"
                                style={{ height: `${barHeight}%` }}
                            >
                                {bar.segments.map((seg, segIndex) => {
                                    const segPercent = (seg.value / total) * 100;
                                    const isHovered = hoveredSegment?.bar === barIndex && hoveredSegment?.segment === segIndex;

                                    return (
                                        <motion.div
                                            key={segIndex}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${segPercent}%` }}
                                            transition={{ delay: barIndex * 0.1 + segIndex * 0.05 }}
                                            onMouseEnter={() => setHoveredSegment({ bar: barIndex, segment: segIndex })}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            className="w-full relative cursor-pointer"
                                            style={{
                                                backgroundColor: seg.color || defaultColors[segIndex % defaultColors.length],
                                                opacity: isHovered ? 1 : 0.85
                                            }}
                                        >
                                            {isHovered && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-white whitespace-nowrap z-10">
                                                    {seg.label}: {seg.value.toLocaleString()}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <span className="text-xs text-[var(--color-steel)] mt-2">{bar.label}</span>
                        </div>
                    );
                })}
            </div>

            {showLegend && (
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
                    {allSegmentLabels.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: defaultColors[i % defaultColors.length] }}
                            />
                            <span className="text-xs text-[var(--color-steel)]">{label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BarChart;
