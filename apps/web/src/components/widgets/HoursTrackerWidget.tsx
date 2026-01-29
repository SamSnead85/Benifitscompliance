'use client';

import { motion } from 'framer-motion';
import {
    Clock,
    TrendingUp,
    TrendingDown,
    Calendar,
    AlertTriangle
} from 'lucide-react';

interface HoursTrackerWidgetProps {
    className?: string;
}

interface MonthData {
    month: string;
    hours: number;
    target: number;
    status: 'above' | 'below' | 'at-risk';
}

const monthlyData: MonthData[] = [
    { month: 'Jul', hours: 168, target: 130, status: 'above' },
    { month: 'Aug', hours: 172, target: 130, status: 'above' },
    { month: 'Sep', hours: 160, target: 130, status: 'above' },
    { month: 'Oct', hours: 145, target: 130, status: 'above' },
    { month: 'Nov', hours: 128, target: 130, status: 'at-risk' },
    { month: 'Dec', hours: 152, target: 130, status: 'above' },
];

const totalHours = monthlyData.reduce((sum, m) => sum + m.hours, 0);
const averageHours = Math.round(totalHours / monthlyData.length);
const maxHours = Math.max(...monthlyData.map(m => m.hours));

export function HoursTrackerWidget({ className = '' }: HoursTrackerWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                        <Clock className="w-4 h-4 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Hours Tracking</h3>
                        <p className="text-xs text-[var(--color-steel)]">6-month measurement period</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 border-b border-[var(--glass-border)]">
                <div className="p-3 border-r border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--color-steel)] mb-1">Total Hours</p>
                    <p className="text-lg font-bold text-white">{totalHours.toLocaleString()}</p>
                </div>
                <div className="p-3 border-r border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--color-steel)] mb-1">Monthly Avg</p>
                    <p className="text-lg font-bold text-white">{averageHours}</p>
                </div>
                <div className="p-3">
                    <p className="text-xs text-[var(--color-steel)] mb-1">FTE Status</p>
                    <p className="text-lg font-bold text-[var(--color-success)]">Full-Time</p>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4">
                <div className="flex items-end gap-2 h-32">
                    {monthlyData.map((data, i) => {
                        const heightPercent = (data.hours / maxHours) * 100;
                        const targetPercent = (data.target / maxHours) * 100;

                        return (
                            <div key={data.month} className="flex-1 flex flex-col items-center">
                                <div className="relative w-full h-24 flex items-end">
                                    {/* Target line */}
                                    <div
                                        className="absolute w-full border-t border-dashed border-[var(--color-warning)]"
                                        style={{ bottom: `${targetPercent}%` }}
                                    />
                                    {/* Bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heightPercent}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className={`w-full rounded-t ${data.status === 'above'
                                                ? 'bg-[var(--color-synapse-teal)]'
                                                : data.status === 'at-risk'
                                                    ? 'bg-[var(--color-warning)]'
                                                    : 'bg-[var(--color-critical)]'
                                            }`}
                                    />
                                </div>
                                <p className="text-xs text-[var(--color-steel)] mt-2">{data.month}</p>
                                <p className="text-xs text-white font-medium">{data.hours}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[var(--color-synapse-teal)]" />
                        <span className="text-xs text-[var(--color-steel)]">Above Target</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0 border-t border-dashed border-[var(--color-warning)]" />
                        <span className="text-xs text-[var(--color-steel)]">130hr FTE Threshold</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default HoursTrackerWidget;
