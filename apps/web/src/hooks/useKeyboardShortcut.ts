'use client';

import { useEffect, useCallback } from 'react';

type KeyCombo = string; // e.g., 'ctrl+k', 'meta+shift+p'

interface ShortcutConfig {
    key: KeyCombo;
    callback: () => void;
    preventDefault?: boolean;
    enableInInputs?: boolean;
}

function parseKeyCombo(combo: string): { key: string; modifiers: Set<string> } {
    const parts = combo.toLowerCase().split('+');
    const key = parts.pop() || '';
    const modifiers = new Set(parts);
    return { key, modifiers };
}

function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
    const { key, modifiers } = parseKeyCombo(combo);

    const eventModifiers = new Set<string>();
    if (event.ctrlKey) eventModifiers.add('ctrl');
    if (event.metaKey) eventModifiers.add('meta');
    if (event.altKey) eventModifiers.add('alt');
    if (event.shiftKey) eventModifiers.add('shift');

    // Check if modifiers match
    if (modifiers.size !== eventModifiers.size) return false;
    for (const mod of modifiers) {
        if (!eventModifiers.has(mod)) return false;
    }

    // Check key
    return event.key.toLowerCase() === key;
}

export function useKeyboardShortcut(
    key: KeyCombo,
    callback: () => void,
    options: { preventDefault?: boolean; enableInInputs?: boolean } = {}
) {
    const { preventDefault = true, enableInInputs = false } = options;

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            // Skip if in input and not enabled
            if (!enableInInputs) {
                const target = event.target as HTMLElement;
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
                    return;
                }
            }

            if (matchesKeyCombo(event, key)) {
                if (preventDefault) event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback, preventDefault, enableInInputs]);
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const { enableInInputs = false } = shortcut;

                if (!enableInInputs) {
                    const target = event.target as HTMLElement;
                    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
                        continue;
                    }
                }

                if (matchesKeyCombo(event, shortcut.key)) {
                    if (shortcut.preventDefault !== false) event.preventDefault();
                    shortcut.callback();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [shortcuts]);
}

export default useKeyboardShortcut;
