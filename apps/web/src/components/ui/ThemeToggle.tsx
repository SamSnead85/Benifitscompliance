'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isOpen, setIsOpen] = useState(false);

    const themes: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor },
    ];

    const currentTheme = themes.find(t => t.value === theme);
    const CurrentIcon = currentTheme?.icon || Moon;

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-steel)] hover:text-white hover:border-[var(--glass-border-hover)] transition-colors"
            >
                <CurrentIcon className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 p-1 glass-card border border-[var(--glass-border)] z-50 min-w-[120px]"
                        >
                            {themes.map((t) => {
                                const Icon = t.icon;
                                const isActive = theme === t.value;

                                return (
                                    <button
                                        key={t.value}
                                        onClick={() => {
                                            setTheme(t.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)]'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ThemeToggle;
