'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PieSegment {
    id: string;
    label: string;
    value: number;
    color?: string;
}

interface PieChartProps {
    data: PieSegment[];
    size?: number;
    innerRadius?: number; // 0 for pie, >0 for donut
    showLabels?: boolean;
    showLegend?: boolean;
    onSegmentClick?: (segment: PieSegment) => void;
    className?: string;
}

const defaultColors = [
    'var(--color-synapse-teal)',
    'var(--color-synapse-cyan)',
    'var(--color-synapse-gold)',
    'var(--color-synapse-violet)',
    '#6366f1',
    '#ec4899',
    '#f97316',
    '#84cc16',
];

export function PieChart({
    data,
    size = 200,
    innerRadius = 0,
    showLabels = false,
    showLegend = true,
    onSegmentClick,
    className = ''
}: PieChartProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const { segments, total } = useMemo(() => {
        const totalVal = data.reduce((sum, d) => sum + d.value, 0);
        let currentAngle = -90; // Start from top

        const segs = data.map((item, i) => {
            const angle = (item.value / totalVal) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            return {
                ...item,
                startAngle,
                endAngle,
                percentage: (item.value / totalVal) * 100,
                color: item.color || defaultColors[i % defaultColors.length],
            };
        });

        return { segments: segs, total: totalVal };
    }, [data]);

    const radius = size / 2;
    const center = size / 2;

    const polarToCartesian = (angle: number, r: number) => ({
        x: center + r * Math.cos((angle * Math.PI) / 180),
        y: center + r * Math.sin((angle * Math.PI) / 180),
    });

    const describeArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
        const start = polarToCartesian(endAngle, outerR);
        const end = polarToCartesian(startAngle, outerR);
        const innerStart = polarToCartesian(endAngle, innerR);
        const innerEnd = polarToCartesian(startAngle, innerR);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        if (innerR === 0) {
            return `M ${center} ${center} L ${end.x} ${end.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${start.x} ${start.y} Z`;
        }

        return `M ${innerEnd.x} ${innerEnd.y} L ${end.x} ${end.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${start.x} ${start.y} L ${innerStart.x} ${innerStart.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`;
    };

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <div className="relative">
                <svg width={size} height={size}>
                    {segments.map((seg, i) => {
                        const isHovered = hoveredId === seg.id;
                        const path = describeArc(
                            seg.startAngle,
                            seg.endAngle - 0.5,
                            radius - 4,
                            innerRadius
                        );

                        return (
                            <motion.path
                                key={seg.id}
                                d={path}
                                fill={seg.color}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0.85,
                                    scale: isHovered ? 1.05 : 1,
                                }}
                                transition={{ delay: i * 0.05 }}
                                onMouseEnter={() => setHoveredId(seg.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => onSegmentClick?.(seg)}
                                style={{
                                    cursor: onSegmentClick ? 'pointer' : 'default',
                                    transformOrigin: `${center}px ${center}px`,
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Center label for donut */}
                {innerRadius > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{total.toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-steel)]">Total</p>
                        </div>
                    </div>
                )}

                {/* Hover tooltip */}
                <AnimatePresence>
                    {hoveredId && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 -top-12 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl whitespace-nowrap z-10"
                        >
                            {(() => {
                                const seg = segments.find(s => s.id === hoveredId);
                                return seg ? (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white">{seg.label}</p>
                                        <p className="text-xs text-[var(--color-steel)]">
                                            {seg.value.toLocaleString()} ({seg.percentage.toFixed(1)}%)
                                        </p>
                                    </div>
                                ) : null;
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="space-y-2">
                    {segments.map((seg) => (
                        <div
                            key={seg.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onMouseEnter={() => setHoveredId(seg.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                            <span className={`text-sm ${hoveredId === seg.id ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                {seg.label}
                            </span>
                            <span className="text-sm font-medium text-white">{seg.percentage.toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PieChart;
