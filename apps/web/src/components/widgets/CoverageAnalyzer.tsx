'use client';

import { motion } from 'framer-motion';
import {
    Heart,
    Users,
    DollarSign,
    UserX,
    TrendingUp,
    Info
} from 'lucide-react';

interface CoverageAnalyzerProps {
    className?: string;
}

interface CoverageBreakdown {
    category: string;
    count: number;
    percentage: number;
    color: string;
    icon: React.ElementType;
}

const coverageData: CoverageBreakdown[] = [
    { category: 'Self Only', count: 1245, percentage: 32, color: 'var(--color-synapse-teal)', icon: Users },
    { category: 'Self + Spouse', count: 892, percentage: 23, color: 'var(--color-synapse-cyan)', icon: Users },
    { category: 'Self + Children', count: 678, percentage: 17, color: 'var(--color-synapse-gold)', icon: Users },
    { category: 'Family', count: 823, percentage: 21, color: 'var(--color-synapse-violet)', icon: Users },
    { category: 'Waived', count: 254, percentage: 7, color: 'var(--color-steel)', icon: UserX },
];

const totalEnrolled = coverageData.reduce((sum, c) => c.category !== 'Waived' ? sum + c.count : sum, 0);
const totalCost = 125000;

export function CoverageAnalyzer({ className = '' }: CoverageAnalyzerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Heart className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Coverage Analysis</h3>
                            <p className="text-xs text-[var(--color-steel)]">Health plan enrollment breakdown</p>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors">
                        <Info className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                            <span className="text-xs text-[var(--color-steel)]">Total Enrolled</span>
                        </div>
                        <p className="text-xl font-bold text-white">{totalEnrolled.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                            <span className="text-xs text-[var(--color-steel)]">Monthly Cost</span>
                        </div>
                        <p className="text-xl font-bold text-white">${totalCost.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Coverage Breakdown */}
            <div className="p-5">
                {/* Visual Bar */}
                <div className="h-4 rounded-full overflow-hidden flex mb-4">
                    {coverageData.map((item, i) => (
                        <motion.div
                            key={item.category}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            style={{ backgroundColor: item.color }}
                            className="h-full"
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="space-y-2">
                    {coverageData.map((item, i) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-white">{item.category}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-[var(--color-steel)]">
                                    {item.count.toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-white w-12 text-right">
                                    {item.percentage}%
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default CoverageAnalyzer;
