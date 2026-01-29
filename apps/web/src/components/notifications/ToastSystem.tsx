'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const toastConfig = {
    success: { icon: CheckCircle2, color: 'var(--color-success)', bg: 'rgba(34,197,94,0.1)' },
    error: { icon: AlertCircle, color: 'var(--color-critical)', bg: 'rgba(239,68,68,0.1)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
    info: { icon: Info, color: 'var(--color-synapse-cyan)', bg: 'rgba(20,184,166,0.1)' },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const config = toastConfig[toast.type];
    const Icon = config.icon;
    const duration = toast.duration ?? 5000;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => onRemove(toast.id), duration);
            return () => clearTimeout(timer);
        }
    }, [toast.id, duration, onRemove]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="flex items-start gap-3 p-4 min-w-[320px] max-w-md rounded-xl border border-[var(--glass-border)] shadow-xl"
            style={{ backgroundColor: config.bg }}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
            >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-[var(--color-steel)] mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors shrink-0"
            >
                <X className="w-4 h-4 text-[var(--color-steel)]" />
            </button>

            {/* Progress bar */}
            {duration > 0 && (
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: 0 }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
                    style={{ backgroundColor: config.color }}
                />
            )}
        </motion.div>
    );
}

export default ToastProvider;
