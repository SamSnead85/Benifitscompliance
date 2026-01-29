'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Workflow,
    FileCheck,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    HelpCircle,
    PlusCircle,
    Activity
} from 'lucide-react';

const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Building2 },
    { name: 'Data Refinery', href: '/refinery', icon: Workflow },
    { name: 'Compliance', href: '/compliance', icon: FileCheck },
    { name: 'Self-Insured', href: '/self-insured', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: Activity },
];

const secondaryItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 72 : 256 }}
            transition={{ duration: 0.2 }}
            className="h-screen sticky top-0 flex flex-col bg-[var(--glass-bg)] border-r border-[var(--glass-border)]"
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-[var(--glass-border)]">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-black" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-bold text-xl text-white whitespace-nowrap overflow-hidden"
                            >
                                Synapse
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Quick Action */}
            <div className="p-4">
                <Link
                    href="/onboard"
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-[var(--color-synapse-teal)] text-black font-medium hover:bg-[var(--color-synapse-cyan)] transition-colors ${isCollapsed ? 'justify-center' : ''
                        }`}
                >
                    <PlusCircle className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="whitespace-nowrap"
                            >
                                Add Client
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.href)
                            ? 'bg-[rgba(6,182,212,0.15)] text-[var(--color-synapse-teal)]'
                            : 'text-[var(--color-silver)] hover:text-white hover:bg-[var(--glass-bg-light)]'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            {/* Secondary Navigation */}
            <div className="px-3 py-4 border-t border-[var(--glass-border)] space-y-1">
                {secondaryItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.href)
                            ? 'bg-[rgba(6,182,212,0.15)] text-[var(--color-synapse-teal)]'
                            : 'text-[var(--color-silver)] hover:text-white hover:bg-[var(--glass-bg-light)]'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </div>

            {/* User Section */}
            <div className="p-3 border-t border-[var(--glass-border)]">
                <div className={`flex items-center gap-3 px-3 py-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-black" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex-1 min-w-0 overflow-hidden"
                            >
                                <div className="text-sm font-medium text-white truncate">Alex Johnson</div>
                                <div className="text-xs text-[var(--color-steel)] truncate">Admin</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-steel)] hover:text-white hover:border-[var(--glass-border-hover)] transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3 h-3" />
                ) : (
                    <ChevronLeft className="w-3 h-3" />
                )}
            </button>
        </motion.aside>
    );
}

export default Sidebar;
