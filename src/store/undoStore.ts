/**
 * Undo Store
 * Manages global undo state for reversible actions
 * 
 * v1.06-B: Confirmation → Undo Strategy
 * - Centralized undo state management
 * - Used by UndoToast component
 * - Integrates with archive operations
 */

import { create } from 'zustand';
import { generateUUID } from '../utils/uuid';

export interface UndoAction {
    id: string;
    message: string;
    onUndo: () => Promise<void> | void;
}

interface UndoState {
    /** Current pending undo action (null if none) */
    pendingAction: UndoAction | null;
    
    /** Show undo toast with action */
    showUndo: (message: string, onUndo: () => Promise<void> | void) => void;
    
    /** Clear pending action (auto or manual) */
    clearUndo: () => void;
    
    /** Execute undo and clear */
    executeUndo: () => Promise<void>;
}

export const useUndoStore = create<UndoState>((set, get) => ({
    pendingAction: null,
    
    showUndo: (message, onUndo) => {
        set({
            pendingAction: {
                id: generateUUID(),
                message,
                onUndo,
            },
        });
    },
    
    clearUndo: () => {
        set({ pendingAction: null });
    },
    
    executeUndo: async () => {
        const { pendingAction } = get();
        if (pendingAction) {
            await pendingAction.onUndo();
            set({ pendingAction: null });
        }
    },
}));

/**
 * Hook for archive with undo support
 * Returns a function that archives and shows undo toast
 */
export function useArchiveWithUndo() {
    const showUndo = useUndoStore((s) => s.showUndo);
    
    return {
        archiveWithUndo: (
            itemName: string,
            archiveFn: () => Promise<void>,
            restoreFn: () => Promise<void>
        ) => {
            // Execute archive immediately
            archiveFn().then(() => {
                // Show undo toast
                showUndo(`"${itemName}" archived`, restoreFn);
            });
        },
    };
}
