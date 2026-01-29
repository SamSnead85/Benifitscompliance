'use client';

import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import {
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Info,
    Calendar,
    Search,
    ChevronDown,
    X,
} from 'lucide-react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    success?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Premium Input Field
 * Healthcare-grade form input with validation states
 */
export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
    function PremiumInput(
        {
            label,
            hint,
            error,
            success,
            leftIcon,
            rightIcon,
            type = 'text',
            className = '',
            disabled,
            ...props
        },
        ref
    ) {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);

        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        return (
            <div className={`space-y-1.5 ${className}`}>
                {label && (
                    <label className="block text-xs font-medium text-[#94A3B8]">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
              w-full px-4 py-2.5 text-sm text-white
              bg-[rgba(255,255,255,0.03)] 
              border rounded-lg
              placeholder-[#64748B]
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || isPassword || error || success ? 'pr-10' : ''}
              ${error
                                ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                : success
                                    ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                    : 'border-[rgba(255,255,255,0.08)] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              focus:outline-none
            `}
                        {...props}
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {error && <AlertCircle className="w-4 h-4 text-red-400" />}
                        {success && <Check className="w-4 h-4 text-emerald-400" />}
                        {isPassword && !error && !success && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#64748B] hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                        {rightIcon && !isPassword && !error && !success && rightIcon}
                    </div>
                </div>

                {(hint || error) && (
                    <p className={`text-xs ${error ? 'text-red-400' : 'text-[#64748B]'}`}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);

/**
 * Premium Select
 * Elegant dropdown with search capability
 */
interface SelectOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface PremiumSelectProps {
    label?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    searchable?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function PremiumSelect({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    searchable = false,
    error,
    disabled,
    className = '',
}: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedOption = options.find(o => o.value === value);

    const filteredOptions = searchable && searchQuery
        ? options.filter(o =>
            o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    return (
        <div className={`relative space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-xs font-medium text-[#94A3B8]">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-between px-4 py-2.5 text-sm
          bg-[rgba(255,255,255,0.03)] 
          border rounded-lg
          transition-all duration-200
          ${error
                        ? 'border-red-500/50'
                        : isOpen
                            ? 'border-cyan-500/50 ring-2 ring-cyan-500/20'
                            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <span className={selectedOption ? 'text-white' : 'text-[#64748B]'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-50 w-full mt-1 py-1 bg-[#15151F] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl max-h-60 overflow-hidden"
                    >
                        {searchable && (
                            <div className="px-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-md text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/50"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-[#64748B] text-center">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange?.(option.value);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                      ${option.value === value ? 'bg-cyan-500/10 text-cyan-400' : 'text-white hover:bg-[rgba(255,255,255,0.04)]'}
                    `}
                                    >
                                        {option.icon}
                                        <div className="flex-1">
                                            <p className="font-medium">{option.label}</p>
                                            {option.description && (
                                                <p className="text-xs text-[#64748B]">{option.description}</p>
                                            )}
                                        </div>
                                        {option.value === value && <Check className="w-4 h-4" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

/**
 * Date Range Picker
 * Professional date selection for compliance periods
 */
interface DateRangePickerProps {
    label?: string;
    startDate?: string;
    endDate?: string;
    onStartChange?: (date: string) => void;
    onEndChange?: (date: string) => void;
    error?: string;
    className?: string;
}

export function DateRangePicker({
    label,
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    error,
    className = '',
}: DateRangePickerProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-xs font-medium text-[#94A3B8]">
                    {label}
                </label>
            )}

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartChange?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                </div>

                <span className="text-xs text-[#64748B]">to</span>

                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndChange?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

export default PremiumInput;
