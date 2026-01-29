'use client';

import { ReactNode } from 'react';

interface HeadingProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: ReactNode;
    className?: string;
}

/**
 * Premium Headings
 * Institutional typography with Space Grotesk display font
 */
export function DisplayHeading({ as: Tag = 'h1', children, className = '' }: HeadingProps) {
    const sizeStyles = {
        h1: 'text-5xl md:text-6xl font-bold tracking-tight',
        h2: 'text-4xl md:text-5xl font-bold tracking-tight',
        h3: 'text-3xl md:text-4xl font-semibold tracking-tight',
        h4: 'text-2xl md:text-3xl font-semibold',
        h5: 'text-xl md:text-2xl font-semibold',
        h6: 'text-lg md:text-xl font-semibold',
    };

    return (
        <Tag
            className={`text-white ${sizeStyles[Tag]} ${className}`}
            style={{ fontFamily: 'var(--font-display)' }}
        >
            {children}
        </Tag>
    );
}

export function SectionHeading({ as: Tag = 'h2', children, className = '' }: HeadingProps) {
    const sizeStyles = {
        h1: 'text-3xl font-bold',
        h2: 'text-2xl font-semibold',
        h3: 'text-xl font-semibold',
        h4: 'text-lg font-semibold',
        h5: 'text-base font-semibold',
        h6: 'text-sm font-semibold',
    };

    return (
        <Tag
            className={`text-white ${sizeStyles[Tag]} ${className}`}
            style={{ fontFamily: 'var(--font-display)' }}
        >
            {children}
        </Tag>
    );
}

/**
 * Label Typography
 * Micro-text for captions, labels, and metadata
 */
interface LabelProps {
    children: ReactNode;
    variant?: 'default' | 'muted' | 'accent';
    size?: 'xs' | 'sm' | 'md';
    uppercase?: boolean;
    className?: string;
}

export function Label({
    children,
    variant = 'default',
    size = 'sm',
    uppercase = false,
    className = ''
}: LabelProps) {
    const variantStyles = {
        default: 'text-[#94A3B8]',
        muted: 'text-[#64748B]',
        accent: 'text-cyan-400',
    };

    const sizeStyles = {
        xs: 'text-[10px]',
        sm: 'text-xs',
        md: 'text-sm',
    };

    return (
        <span className={`
      font-medium
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${uppercase ? 'uppercase tracking-wider' : ''}
      ${className}
    `}>
            {children}
        </span>
    );
}

/**
 * Body Text
 * Premium body typography
 */
interface TextProps {
    children: ReactNode;
    variant?: 'default' | 'muted' | 'error' | 'success' | 'warning';
    size?: 'sm' | 'base' | 'lg';
    weight?: 'normal' | 'medium' | 'semibold';
    className?: string;
}

export function Text({
    children,
    variant = 'default',
    size = 'base',
    weight = 'normal',
    className = ''
}: TextProps) {
    const variantStyles = {
        default: 'text-[#E2E8F0]',
        muted: 'text-[#94A3B8]',
        error: 'text-red-400',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
    };

    const sizeStyles = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
    };

    const weightStyles = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
    };

    return (
        <p className={`
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${weightStyles[weight]}
      ${className}
    `}>
            {children}
        </p>
    );
}

/**
 * Mono Text
 * Fixed-width typography for data, codes, and numbers
 */
interface MonoTextProps {
    children: ReactNode;
    variant?: 'default' | 'accent' | 'success' | 'danger';
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    weight?: 'normal' | 'medium' | 'bold';
    className?: string;
}

export function MonoText({
    children,
    variant = 'default',
    size = 'base',
    weight = 'normal',
    className = ''
}: MonoTextProps) {
    const variantStyles = {
        default: 'text-white',
        accent: 'text-cyan-400',
        success: 'text-emerald-400',
        danger: 'text-red-400',
    };

    const sizeStyles = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
    };

    const weightStyles = {
        normal: 'font-normal',
        medium: 'font-medium',
        bold: 'font-bold',
    };

    return (
        <span className={`
      font-mono
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${weightStyles[weight]}
      ${className}
    `}>
            {children}
        </span>
    );
}

/**
 * Gradient Text
 * Premium gradient typography for hero elements
 */
interface GradientTextProps {
    children: ReactNode;
    gradient?: 'cyan' | 'purple' | 'emerald' | 'gold';
    className?: string;
}

export function GradientText({
    children,
    gradient = 'cyan',
    className = ''
}: GradientTextProps) {
    const gradientStyles = {
        cyan: 'from-cyan-400 via-teal-400 to-emerald-400',
        purple: 'from-purple-400 via-violet-400 to-indigo-400',
        emerald: 'from-emerald-400 via-green-400 to-teal-400',
        gold: 'from-amber-400 via-yellow-400 to-orange-400',
    };

    return (
        <span className={`
      bg-gradient-to-r ${gradientStyles[gradient]}
      bg-clip-text text-transparent
      ${className}
    `}>
            {children}
        </span>
    );
}

/**
 * Stat Number
 * Large format numbers for metrics
 */
interface StatNumberProps {
    value: string | number;
    prefix?: string;
    suffix?: string;
    size?: 'md' | 'lg' | 'xl' | '2xl';
    variant?: 'default' | 'success' | 'danger' | 'warning';
    className?: string;
}

export function StatNumber({
    value,
    prefix,
    suffix,
    size = 'xl',
    variant = 'default',
    className = ''
}: StatNumberProps) {
    const sizeStyles = {
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
        '2xl': 'text-5xl',
    };

    const variantStyles = {
        default: 'text-white',
        success: 'text-emerald-400',
        danger: 'text-red-400',
        warning: 'text-amber-400',
    };

    return (
        <span className={`
      font-mono font-bold
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `}>
            {prefix && <span className="text-[#64748B] text-[0.6em]">{prefix}</span>}
            {value}
            {suffix && <span className="text-[#64748B] text-[0.6em] ml-1">{suffix}</span>}
        </span>
    );
}

/**
 * Truncated Text
 * Text with ellipsis and optional tooltip
 */
interface TruncatedTextProps {
    children: string;
    maxLength?: number;
    className?: string;
}

export function TruncatedText({
    children,
    maxLength = 50,
    className = ''
}: TruncatedTextProps) {
    const isTruncated = children.length > maxLength;
    const displayText = isTruncated ? `${children.substring(0, maxLength)}...` : children;

    return (
        <span
            className={`${className}`}
            title={isTruncated ? children : undefined}
        >
            {displayText}
        </span>
    );
}

export default DisplayHeading;
