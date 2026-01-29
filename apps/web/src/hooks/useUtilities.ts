'use client';

import { useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useAsync<T, Args extends unknown[]>(
    asyncFunction: (...args: Args) => Promise<T>
): {
    execute: (...args: Args) => Promise<T | null>;
    data: T | null;
    loading: boolean;
    error: Error | null;
    reset: () => void;
} {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const mountedRef = useRef(true);

    const execute = useCallback(
        async (...args: Args): Promise<T | null> => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            try {
                const result = await asyncFunction(...args);
                if (mountedRef.current) {
                    setState({ data: result, loading: false, error: null });
                }
                return result;
            } catch (err) {
                if (mountedRef.current) {
                    const error = err instanceof Error ? err : new Error(String(err));
                    setState({ data: null, loading: false, error });
                }
                return null;
            }
        },
        [asyncFunction]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return { execute, ...state, reset };
}


// Debounced value hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useState(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    });

    return debouncedValue;
}


// Toggle hook
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => setValue(prev => !prev), []);
    const set = useCallback((newValue: boolean) => setValue(newValue), []);

    return [value, toggle, set];
}


// Local storage hook
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}


// Click outside hook
export function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    handler: () => void
) {
    useState(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    });
}

export default useAsync;
