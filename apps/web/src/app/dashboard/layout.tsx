'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    LayoutDashboard,
    Building2,
    Workflow,
    FileCheck,
    Users,
    Settings,
    HelpCircle,
    ChevronDown,
    Search,
    Bell,
    Command,
    LogOut,
    User,
    DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';

// Navigation structure - The "4-Pillar" rule
const navigation = [
    {
        group: 'Core',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Clients', href: '/clients', icon: Building2 },
        ]
    },
    {
        group: 'Intelligence',
        items: [
            { name: 'Data Refinery', href: '/refinery', icon: Workflow },
            { name: 'Compliance', href: '/compliance', icon: FileCheck },
            { name: 'Self-Insured', href: '/self-insured', icon: DollarSign },
            { name: 'Reports', href: '/reports', icon: FileCheck },
        ]
    },
    {
        group: 'Management',
        items: [
            { name: 'Onboard', href: '/onboard', icon: Users },
            { name: 'Settings', href: '/settings', icon: Settings },
        ]
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Brand */}
                <div className="sidebar-brand">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Brain className="w-6 h-6 text-[var(--color-void)]" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-white">Synapse</div>
                            <div className="text-xs text-[var(--color-steel)]">Compliance Platform</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navigation.map((section) => (
                        <div key={section.group} className="mb-6">
                            <div className="sidebar-group-title">{section.group}</div>
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            'sidebar-link',
                                            isActive && 'sidebar-link--active'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Help & Support */}
                <div className="p-4 border-t border-[var(--glass-border)]">
                    <Link
                        href="/help"
                        className="sidebar-link"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span>Help & Support</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-[260px]">
                {/* Top Header */}
                <header className="sticky top-0 z-50 h-16 px-6 flex items-center justify-between border-b border-[var(--glass-border)] glass-strong">
                    {/* Search / Command */}
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-[var(--color-steel)] hover:border-[var(--glass-border-hover)] transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search...</span>
                        <div className="flex items-center gap-1 ml-8 text-xs">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </button>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors">
                            <Bell className="w-5 h-5 text-[var(--color-silver)]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-synapse-teal)] rounded-full" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                                    <User className="w-4 h-4 text-[var(--color-void)]" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-white">Demo User</div>
                                    <div className="text-xs text-[var(--color-steel)]">Broker Admin</div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full right-0 mt-2 w-48 p-2 rounded-lg glass-strong border border-[var(--glass-border)]"
                                    >
                                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)] hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-coral)] hover:bg-[var(--glass-bg-light)] transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Command Palette Overlay */}
            <AnimatePresence>
                {isCommandOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="command-palette-overlay"
                        onClick={() => setIsCommandOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="command-palette"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="text"
                                placeholder="Search pages, clients, or commands..."
                                className="command-palette-input"
                                autoFocus
                            />
                            <div className="command-palette-results">
                                <div className="command-palette-group-title">Pages</div>
                                {[
                                    { name: 'Dashboard', icon: LayoutDashboard },
                                    { name: 'Clients', icon: Building2 },
                                    { name: 'Data Refinery', icon: Workflow },
                                    { name: 'Compliance Center', icon: FileCheck },
                                ].map((item) => (
                                    <button key={item.name} className="command-palette-item w-full">
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
