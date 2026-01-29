'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface HeatmapCell {
    x: string;
    y: string;
    value: number;
}

interface HeatmapGridProps {
    data: HeatmapCell[];
    xLabels: string[];
    yLabels: string[];
    colorScale?: { min: string; max: string };
    onCellClick?: (cell: HeatmapCell) => void;
    className?: string;
}

export function HeatmapGrid({
    data,
    xLabels,
    yLabels,
    colorScale = { min: 'rgba(20,184,166,0.1)', max: 'rgba(20,184,166,1)' },
    onCellClick,
    className = ''
}: HeatmapGridProps) {
    const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

    const { min, max, valueMap } = useMemo(() => {
        const values = data.map(d => d.value);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const map = new Map<string, number>();
        data.forEach(d => map.set(`${d.x}-${d.y}`, d.value));
        return { min: minVal, max: maxVal, valueMap: map };
    }, [data]);

    const getOpacity = (value: number) => {
        if (max === min) return 0.5;
        return 0.1 + ((value - min) / (max - min)) * 0.9;
    };

    return (
        <div className={`${className}`}>
            <div className="flex">
                {/* Y Labels */}
                <div className="flex flex-col justify-around pr-2 py-1">
                    {yLabels.map((label) => (
                        <div key={label} className="h-8 flex items-center">
                            <span className="text-xs text-[var(--color-steel)] truncate w-16">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1">
                    <div
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${xLabels.length}, 1fr)` }}
                    >
                        {yLabels.map((y) =>
                            xLabels.map((x) => {
                                const value = valueMap.get(`${x}-${y}`) ?? 0;
                                const cell = { x, y, value };
                                const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

                                return (
                                    <motion.div
                                        key={`${x}-${y}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: isHovered ? 1.1 : 1 }}
                                        onClick={() => onCellClick?.(cell)}
                                        onMouseEnter={() => setHoveredCell(cell)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                        className="h-8 rounded cursor-pointer transition-all relative"
                                        style={{
                                            backgroundColor: colorScale.max,
                                            opacity: getOpacity(value),
                                        }}
                                    >
                                        {isHovered && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-white whitespace-nowrap z-10">
                                                {value.toLocaleString()}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* X Labels */}
                    <div
                        className="grid gap-1 mt-2"
                        style={{ gridTemplateColumns: `repeat(${xLabels.length}, 1fr)` }}
                    >
                        {xLabels.map((label) => (
                            <div key={label} className="text-center">
                                <span className="text-xs text-[var(--color-steel)]">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-xs text-[var(--color-steel)]">Low</span>
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[rgba(20,184,166,0.1)] to-[rgba(20,184,166,1)]" />
                <span className="text-xs text-[var(--color-steel)]">High</span>
            </div>
        </div>
    );
}


interface TreemapItem {
    id: string;
    label: string;
    value: number;
    color?: string;
}

interface TreemapChartProps {
    data: TreemapItem[];
    width?: number;
    height?: number;
    className?: string;
}

export function TreemapChart({ data, width = 400, height = 300, className = '' }: TreemapChartProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Simple squarified layout
    const layout = useMemo(() => {
        const items: { item: TreemapItem; x: number; y: number; w: number; h: number }[] = [];
        let x = 0;
        let y = 0;
        let remainingWidth = width;
        let remainingHeight = height;
        let isHorizontal = true;

        sortedData.forEach((item) => {
            const ratio = item.value / totalValue;

            if (isHorizontal) {
                const w = remainingWidth * ratio * 2;
                items.push({ item, x, y, w: Math.min(w, remainingWidth), h: remainingHeight / 2 });
                x += w;
                if (x >= width * 0.7) {
                    x = 0;
                    y += remainingHeight / 2;
                    remainingHeight = height - y;
                    isHorizontal = false;
                }
            } else {
                const h = remainingHeight * ratio * 2;
                items.push({ item, x, y, w: remainingWidth / 2, h: Math.min(h, remainingHeight) });
                y += h;
            }
        });

        return items;
    }, [sortedData, width, height, totalValue]);

    const defaultColors = [
        'var(--color-synapse-teal)',
        'var(--color-synapse-cyan)',
        'var(--color-synapse-gold)',
        'var(--color-synapse-violet)',
        '#6366f1',
        '#ec4899',
    ];

    return (
        <svg width={width} height={height} className={className}>
            {layout.map(({ item, x, y, w, h }, i) => {
                const isHovered = hoveredId === item.id;
                const color = item.color || defaultColors[i % defaultColors.length];

                return (
                    <motion.g
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.rect
                            x={x + 1}
                            y={y + 1}
                            width={Math.max(w - 2, 0)}
                            height={Math.max(h - 2, 0)}
                            rx={4}
                            fill={color}
                            animate={{
                                opacity: isHovered ? 1 : 0.7,
                                scale: isHovered ? 1.02 : 1
                            }}
                        />
                        {w > 60 && h > 40 && (
                            <>
                                <text
                                    x={x + w / 2}
                                    y={y + h / 2 - 6}
                                    textAnchor="middle"
                                    className="text-xs font-medium fill-white"
                                >
                                    {item.label}
                                </text>
                                <text
                                    x={x + w / 2}
                                    y={y + h / 2 + 10}
                                    textAnchor="middle"
                                    className="text-[10px] fill-white/70"
                                >
                                    {item.value.toLocaleString()}
                                </text>
                            </>
                        )}
                    </motion.g>
                );
            })}
        </svg>
    );
}

export default HeatmapGrid;
