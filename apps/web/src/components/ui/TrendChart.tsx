'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface DataPoint {
    label: string;
    value: number;
    forecast?: number;
}

interface TrendChartProps {
    title: string;
    data: DataPoint[];
    valuePrefix?: string;
    valueSuffix?: string;
    showForecast?: boolean;
    color?: string;
    height?: number;
    className?: string;
}

// Default demo data
const defaultData: DataPoint[] = [
    { label: 'Jan', value: 12200, forecast: 12400 },
    { label: 'Feb', value: 12350, forecast: 12500 },
    { label: 'Mar', value: 12180, forecast: 12600 },
    { label: 'Apr', value: 12400, forecast: 12700 },
    { label: 'May', value: 12550, forecast: 12800 },
    { label: 'Jun', value: 12620, forecast: 12900 },
    { label: 'Jul', value: 12780, forecast: 13000 },
    { label: 'Aug', value: 12650, forecast: 13100 },
    { label: 'Sep', value: 12890, forecast: 13200 },
    { label: 'Oct', value: 12950, forecast: 13300 },
    { label: 'Nov', value: 13100, forecast: 13400 },
    { label: 'Dec', value: 13250, forecast: 13500 },
];

export function TrendChart({
    title,
    data = defaultData,
    valuePrefix = '',
    valueSuffix = '',
    showForecast = true,
    color = 'var(--color-synapse-teal)',
    height = 200,
    className = ''
}: TrendChartProps) {
    const { maxValue, minValue, points, forecastPoints, trend, trendPercentage } = useMemo(() => {
        const values = data.map(d => d.value);
        const forecasts = data.map(d => d.forecast).filter(Boolean) as number[];
        const allValues = [...values, ...forecasts];
        const max = Math.max(...allValues) * 1.1;
        const min = Math.min(...allValues) * 0.9;

        const chartWidth = 100;
        const chartHeight = height - 60; // Account for labels

        const getY = (val: number) => {
            return chartHeight - ((val - min) / (max - min)) * chartHeight;
        };

        const getX = (index: number) => {
            return (index / (data.length - 1)) * chartWidth;
        };

        const pts = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
        const fcPts = data
            .map((d, i) => d.forecast ? `${getX(i)},${getY(d.forecast)}` : null)
            .filter(Boolean)
            .join(' ');

        const firstVal = values[0];
        const lastVal = values[values.length - 1];
        const trendDir = lastVal >= firstVal ? 'up' : 'down';
        const trendPct = ((lastVal - firstVal) / firstVal) * 100;

        return {
            maxValue: max,
            minValue: min,
            points: pts,
            forecastPoints: fcPts,
            trend: trendDir,
            trendPercentage: trendPct.toFixed(1)
        };
    }, [data, height]);

    const latestValue = data[data.length - 1]?.value || 0;
    const latestForecast = data[data.length - 1]?.forecast;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-[var(--color-critical)]" />
                    )}
                    <span className={`text-sm font-medium ${trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                        }`}>
                        {trend === 'up' ? '+' : ''}{trendPercentage}%
                    </span>
                </div>
            </div>

            {/* Current Value */}
            <div className="mb-4">
                <div className="text-2xl font-bold text-white font-mono">
                    {valuePrefix}{latestValue.toLocaleString()}{valueSuffix}
                </div>
                {showForecast && latestForecast && (
                    <div className="text-xs text-[var(--color-steel)] mt-1">
                        Forecast: {valuePrefix}{latestForecast.toLocaleString()}{valueSuffix}
                    </div>
                )}
            </div>

            {/* Chart */}
            <div style={{ height }} className="relative">
                <svg
                    viewBox={`0 0 100 ${height - 40}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={ratio * (height - 60)}
                            x2="100"
                            y2={ratio * (height - 60)}
                            stroke="var(--glass-border)"
                            strokeWidth="0.3"
                        />
                    ))}

                    {/* Forecast line (dashed) */}
                    {showForecast && forecastPoints && (
                        <polyline
                            points={forecastPoints}
                            fill="none"
                            stroke="var(--color-steel)"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                            opacity="0.5"
                        />
                    )}

                    {/* Area fill */}
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`0,${height - 60} ${points} 100,${height - 60}`}
                        fill="url(#areaGradient)"
                    />

                    {/* Main line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = (height - 60) - ((d.value - minValue) / (maxValue - minValue)) * (height - 60);
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="2"
                                fill={color}
                                className="opacity-0 hover:opacity-100 transition-opacity"
                            />
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[var(--color-steel)]">
                    {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
                        <span key={i}>{d.label}</span>
                    ))}
                </div>
            </div>

            {/* Legend */}
            {showForecast && (
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-0.5 rounded" style={{ background: color }} />
                        <span className="text-[var(--color-silver)]">Actual</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-0.5 rounded border-t border-dashed border-[var(--color-steel)]" />
                        <span className="text-[var(--color-steel)]">Forecast</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default TrendChart;
