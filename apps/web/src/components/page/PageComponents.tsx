'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Plus } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    onBack?: () => void;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    breadcrumb,
    onBack,
    actions,
    className = ''
}: PageHeaderProps) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-[var(--color-steel)]" />
                    </button>
                )}
                <div>
                    {breadcrumb && (
                        <p className="text-xs text-[var(--color-steel)] mb-1">{breadcrumb}</p>
                    )}
                    <h1 className="text-2xl font-semibold text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-[var(--color-steel)] mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}


interface SidebarProps {
    items: SidebarItem[];
    activeId?: string;
    onSelect?: (id: string) => void;
    className?: string;
}

interface SidebarItem {
    id: string;
    label: string;
    icon?: React.ElementType;
    count?: number;
    badge?: 'new' | 'beta';
}

export function Sidebar({ items, activeId, onSelect, className = '' }: SidebarProps) {
    return (
        <nav className={`space-y-1 ${className}`}>
            {items.map((item, i) => {
                const Icon = item.icon;
                const isActive = item.id === activeId;

                return (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => onSelect?.(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${isActive
                                ? 'bg-[rgba(20,184,166,0.1)] border border-[var(--color-synapse-teal)]'
                                : 'hover:bg-[var(--glass-bg)] border border-transparent'
                            }`}
                    >
                        {Icon && (
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'
                                }`} />
                        )}
                        <span className={`flex-1 text-sm ${isActive ? 'text-white font-medium' : 'text-[var(--color-steel)]'
                            }`}>
                            {item.label}
                        </span>
                        {item.count !== undefined && (
                            <span className="text-xs text-[var(--color-steel)]">{item.count}</span>
                        )}
                        {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded text-xs ${item.badge === 'new'
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                }`}>
                                {item.badge === 'new' ? 'NEW' : 'BETA'}
                            </span>
                        )}
                    </motion.button>
                );
            })}
        </nav>
    );
}


interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function SectionHeader({ title, description, action, className = '' }: SectionHeaderProps) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {description && (
                    <p className="text-sm text-[var(--color-steel)] mt-0.5">{description}</p>
                )}
            </div>
            {action && (
                <button onClick={action.onClick} className="btn-secondary text-sm">
                    <Plus className="w-4 h-4" />
                    {action.label}
                </button>
            )}
        </div>
    );
}


interface DividerProps {
    label?: string;
    className?: string;
}

export function Divider({ label, className = '' }: DividerProps) {
    if (label) {
        return (
            <div className={`flex items-center gap-4 ${className}`}>
                <div className="flex-1 h-px bg-[var(--glass-border)]" />
                <span className="text-xs text-[var(--color-steel)]">{label}</span>
                <div className="flex-1 h-px bg-[var(--glass-border)]" />
            </div>
        );
    }
    return <div className={`h-px bg-[var(--glass-border)] ${className}`} />;
}

export default PageHeader;
