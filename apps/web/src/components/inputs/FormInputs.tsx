'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Calendar,
    ChevronDown,
    Check,
    AlertCircle,
    HelpCircle
} from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ElementType;
    rightIcon?: React.ElementType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = '',
    type = 'text',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-white mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {LeftIcon && (
                    <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                )}
                <input
                    ref={ref}
                    type={isPassword && showPassword ? 'text' : type}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border text-white placeholder:text-[var(--color-steel)] outline-none transition-colors ${error
                            ? 'border-[var(--color-critical)] focus:border-[var(--color-critical)]'
                            : 'border-[var(--glass-border)] focus:border-[var(--color-synapse-teal)]'
                        } ${LeftIcon ? 'pl-10' : ''} ${RightIcon || isPassword ? 'pr-10' : ''}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-steel)] hover:text-white"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
                {RightIcon && !isPassword && (
                    <RightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-[var(--color-critical)] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
            {hint && !error && (
                <p className="mt-1 text-xs text-[var(--color-steel)]">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';


interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function Select({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    error,
    className = ''
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-white mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border text-left transition-colors ${error
                            ? 'border-[var(--color-critical)]'
                            : isOpen
                                ? 'border-[var(--color-synapse-teal)]'
                                : 'border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                        }`}
                >
                    <span className={selectedOption ? 'text-white' : 'text-[var(--color-steel)]'}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-1 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl"
                        >
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[var(--glass-bg-light)] transition-colors ${option.value === value ? 'text-[var(--color-synapse-teal)]' : 'text-white'
                                        }`}
                                >
                                    {option.label}
                                    {option.value === value && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <p className="mt-1 text-xs text-[var(--color-critical)] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    );
}


interface ToggleProps {
    label?: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export function Toggle({
    label,
    description,
    checked,
    onChange,
    disabled = false,
    className = ''
}: ToggleProps) {
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-synapse-teal)]' : 'bg-[var(--glass-bg)]'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <motion.div
                    animate={{ x: checked ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
            </button>
            {(label || description) && (
                <div>
                    {label && <p className="text-sm font-medium text-white">{label}</p>}
                    {description && <p className="text-xs text-[var(--color-steel)]">{description}</p>}
                </div>
            )}
        </div>
    );
}

export default Input;
