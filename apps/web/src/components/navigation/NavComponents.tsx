'use client';

import { motion } from 'framer-motion';
import {
    ChevronRight,
    Home,
    Users,
    FileText,
    Shield,
    Settings,
    BarChart3
} from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ElementType;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav className={`flex items-center gap-1 ${className}`}>
            {items.map((item, i) => {
                const Icon = item.icon;
                const isLast = i === items.length - 1;

                return (
                    <div key={item.label} className="flex items-center gap-1">
                        {item.href && !isLast ? (
                            <a
                                href={item.href}
                                className="flex items-center gap-1.5 text-sm text-[var(--color-steel)] hover:text-white transition-colors"
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {item.label}
                            </a>
                        ) : (
                            <span className={`flex items-center gap-1.5 text-sm ${isLast ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                {Icon && <Icon className="w-4 h-4" />}
                                {item.label}
                            </span>
                        )}
                        {!isLast && (
                            <ChevronRight className="w-4 h-4 text-[var(--color-steel)] mx-1" />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}


interface TabItem {
    id: string;
    label: string;
    icon?: React.ElementType;
    count?: number;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'pills' | 'underline' | 'boxes';
    className?: string;
}

export function TabNavigation({
    tabs,
    activeTab,
    onChange,
    variant = 'pills',
    className = ''
}: TabNavigationProps) {
    if (variant === 'underline') {
        return (
            <div className={`flex border-b border-[var(--glass-border)] ${className}`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTab;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--glass-bg)]">
                                    {tab.count}
                                </span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-synapse-teal)]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    if (variant === 'boxes') {
        return (
            <div className={`flex gap-2 ${className}`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTab;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${isActive
                                    ? 'bg-[rgba(20,184,166,0.1)] border-[var(--color-synapse-teal)] text-white'
                                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--color-steel)] hover:text-white hover:border-[var(--glass-border-hover)]'
                                }`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-[var(--color-synapse-teal)] text-black' : 'bg-[var(--glass-bg-light)]'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Default: pills
    return (
        <div className={`flex gap-1 p-1 rounded-lg bg-[var(--glass-bg)] ${className}`}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activePill"
                                className="absolute inset-0 bg-[var(--color-synapse-teal)] rounded-md"
                            />
                        )}
                        <span className="relative flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-black/20' : 'bg-[var(--glass-bg-light)]'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export { Breadcrumbs as default };
