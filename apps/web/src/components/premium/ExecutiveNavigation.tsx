'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface NavigationItemProps {
    label: string;
    icon?: ReactNode;
    href?: string;
    isActive?: boolean;
    badge?: string | number;
    badgeVariant?: 'default' | 'success' | 'warning' | 'critical';
    onClick?: () => void;
    children?: ReactNode;
}

/**
 * Premium Navigation Item
 * Precision-styled with animated underline states
 */
export function NavigationItem({
    label,
    icon,
    href,
    isActive = false,
    badge,
    badgeVariant = 'default',
    onClick,
    children,
}: NavigationItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = !!children;

    const badgeColors = {
        default: 'bg-[rgba(6,182,212,0.15)] text-cyan-400',
        success: 'bg-[rgba(16,185,129,0.15)] text-emerald-400',
        warning: 'bg-[rgba(245,158,11,0.15)] text-amber-400',
        critical: 'bg-[rgba(239,68,68,0.15)] text-red-400',
    };

    const content = (
        <motion.div
            onClick={() => {
                if (hasChildren) setIsExpanded(!isExpanded);
                onClick?.();
            }}
            whileHover={{ x: 2 }}
            className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-sm font-medium cursor-pointer
        transition-all duration-200
        ${isActive
                    ? 'bg-[rgba(6,182,212,0.1)] text-cyan-400'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                }
      `}
        >
            {/* Active indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full"
                />
            )}

            {icon && (
                <span className={`w-5 h-5 flex items-center justify-center ${isActive ? 'text-cyan-400' : ''}`}>
                    {icon}
                </span>
            )}

            <span className="flex-1">{label}</span>

            {badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${badgeColors[badgeVariant]}`}>
                    {badge}
                </span>
            )}

            {hasChildren && (
                <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="w-4 h-4 text-[#64748B]"
                >
                    <ChevronRight className="w-4 h-4" />
                </motion.span>
            )}
        </motion.div>
    );

    return (
        <div>
            {href && !hasChildren ? (
                <Link href={href}>{content}</Link>
            ) : (
                content
            )}

            {/* Nested children */}
            <AnimatePresence>
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Navigation Group - Section with title
 */
interface NavigationGroupProps {
    title: string;
    children: ReactNode;
    collapsible?: boolean;
    defaultExpanded?: boolean;
}

export function NavigationGroup({
    title,
    children,
    collapsible = false,
    defaultExpanded = true,
}: NavigationGroupProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-6">
            <button
                onClick={() => collapsible && setIsExpanded(!isExpanded)}
                className={`
          flex items-center gap-2 w-full px-3 mb-2
          text-[10px] font-bold uppercase tracking-widest text-[#64748B]
          ${collapsible ? 'cursor-pointer hover:text-[#94A3B8]' : 'cursor-default'}
        `}
            >
                {collapsible && (
                    <motion.span animate={{ rotate: isExpanded ? 0 : -90 }}>
                        <ChevronDown className="w-3 h-3" />
                    </motion.span>
                )}
                {title}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-0.5 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Executive Navigation - 4-Pillar Sidebar
 */
interface ExecutiveNavigationProps {
    logo?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function ExecutiveNavigation({
    logo,
    children,
    footer,
    className = '',
}: ExecutiveNavigationProps) {
    return (
        <nav
            className={`
        fixed left-0 top-0 bottom-0 w-[260px]
        bg-[#050508]
        border-r border-[rgba(255,255,255,0.06)]
        flex flex-col
        z-40
        ${className}
      `}
        >
            {/* Logo Area */}
            {logo && (
                <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
                    {logo}
                </div>
            )}

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
                    {footer}
                </div>
            )}
        </nav>
    );
}

export default ExecutiveNavigation;
