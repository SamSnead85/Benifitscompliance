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
import { ThemeToggle } from '@/components/ThemeToggle';

// Navigation structure
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
            { name: 'Workflow Builder', href: '/workflow-builder', icon: Workflow },
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
        <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
            {/* Sidebar - Always Dark for premium contrast */}
            <aside className="sidebar">
                {/* Brand */}
                <div className="sidebar-brand">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-white">Synapse</div>
                            <div className="text-xs text-[#64748B]">Compliance Platform</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navigation.map((section) => (
                        <div key={section.group} className="mb-6">
                            <div className="sidebar-group-title">
                                {section.group}
                            </div>
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
                <div className="p-4 border-t border-[#1E293B]">
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
                {/* Top Header - Theme Adaptive */}
                <header className="glass-strong sticky top-0 z-50 h-16 px-6 flex items-center justify-between">
                    {/* Search / Command */}
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors"
                        style={{
                            background: 'var(--input-bg)',
                            borderColor: 'var(--card-border)',
                            color: 'var(--text-muted)'
                        }}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search...</span>
                        <div className="flex items-center gap-1 ml-8 text-xs" style={{ color: 'var(--text-dim)' }}>
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </button>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <button
                            className="relative p-2 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                                style={{ background: isProfileOpen ? 'var(--hover-overlay)' : 'transparent' }}
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Demo User</div>
                                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Broker Admin</div>
                                </div>
                                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="glass-card absolute top-full right-0 mt-2 w-48 p-2"
                                    >
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                                            style={{ color: 'var(--color-danger)' }}
                                        >
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
                                <div className="command-palette-group-title">
                                    Pages
                                </div>
                                {[
                                    { name: 'Dashboard', icon: LayoutDashboard },
                                    { name: 'Clients', icon: Building2 },
                                    { name: 'Data Refinery', icon: Workflow },
                                    { name: 'Workflow Builder', icon: Workflow },
                                    { name: 'Compliance Center', icon: FileCheck },
                                ].map((item) => (
                                    <button key={item.name} className="command-palette-item">
                                        <item.icon className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
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
