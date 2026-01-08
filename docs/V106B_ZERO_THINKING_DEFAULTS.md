# v1.06-B: ZERO-THINKING DEFAULTS IMPLEMENTATION SPEC

**Version:** 1.06-B  
**Status:** IMPLEMENTED  
**Date:** 2026-01-08

---

## OVERVIEW

This phase eliminates decision-making, reduces form friction, and makes correct behavior the default. Users can now complete common flows WITHOUT THINKING.

**Core Principle:** If the user pauses to decide, the UX failed.

---

## PHASE A — HIGH-FREQUENCY FLOW ANALYSIS

### Flow 1: Standing in Store Trying to Return Something

| Current Decisions | v1.06-B Defaulted Behavior |
|-------------------|---------------------------|
| Find item in list | Action Today shows urgent items first |
| Check return deadline | Deadline prominently displayed in urgent banner |
| Find proof | Photo is primary visual element |
| Share with customer service | One-tap Share Proof button |

### Flow 2: Talking to Customer Support Needing Proof

| Current Decisions | v1.06-B Defaulted Behavior |
|-------------------|---------------------------|
| Find item | Search + urgency sorting |
| Locate photo | Photo always visible at top of detail |
| Export proof | One-tap action, Pro paywall is clear |

### Flow 3: Quickly Logging a Purchase Right After Buying

| Current Decisions | v1.06-B Defaulted Behavior |
|-------------------|---------------------------|
| Photo first | Photo capture is first field |
| Enter name | Required, prominent |
| Set purchase date | **Defaults to today** |
| Set return window | **Defaults to 30 days** |
| Set warranty | **Defaults to 12 months** |
| Enter store | **Hidden by default**, auto-applies store policies |
| Enter price/serial/notes | **Hidden under "More details"** |

---

## PHASE B — ADD/EDIT FLOW RESTRUCTURING

### New Field Order (Primary → Collapsed)

**PRIMARY FIELDS (Always Visible):**
1. Photo capture (required)
2. Item name (required)
3. Purchase date (defaults to today)
4. Return window (defaults to 30 days)

**COLLAPSED FIELDS (Under "Add more details"):**
5. Store (optional, triggers smart defaults)
6. Warranty (defaults to 12 months)
7. Price (optional)
8. Serial number (optional)
9. Notes (optional)

### Smart Store Defaults

When user types a known store name, return/warranty auto-update:

| Store | Return Days | Warranty |
|-------|-------------|----------|
| Costco | 90 | 24 mo |
| REI | 90 | 12 mo |
| Nordstrom | 90 | 12 mo |
| Amazon | 30 | 12 mo |
| Target | 30 | 12 mo |
| Walmart | 30 | 12 mo |
| Best Buy | 15 | 12 mo |
| Apple | 14 | 12 mo |

**File:** `src/utils/defaults.ts`

---

## PHASE C — CONFIRMATION → UNDO MAPPING

### Actions That NO LONGER Need Confirmation

| Action | Old Behavior | New Behavior |
|--------|--------------|--------------|
| Archive item | Alert: "Are you sure?" → [Cancel][Archive] | Immediate action + 5s undo toast |
| Remove photo (in form) | Alert: "Are you sure?" → [Cancel][Remove] | Immediate removal (can re-add) |

### Actions That STILL Need Confirmation

| Action | Reason | Behavior |
|--------|--------|----------|
| Delete item | Irreversible, destroys data | Alert with destructive style |
| Import backup | Data merge, needs awareness | Alert with import confirmation |

### Undo Timing Rules

- **Undo window:** 5 seconds
- **Visual:** Toast at bottom with countdown
- **Auto-dismiss:** After 5 seconds, action commits permanently
- **User dismiss:** Tapping "UNDO" reverses action immediately

**Files:**
- `src/components/UndoToast.tsx` - Toast component
- `src/store/undoStore.ts` - Undo state management
- `App.tsx` - Global toast integration

---

## PHASE D — SILENT AUTOSAVE & STATE CONFIDENCE

### Autosave Behavior

| Trigger | Action |
|---------|--------|
| 3 seconds after last change | Save draft to AsyncStorage |
| Navigation blur (leaving screen) | Immediate draft save |
| Form submission success | Clear draft |
| App backgrounded | Draft persisted |

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| App killed mid-entry | Draft restored on next open |
| Back navigation | Draft saved, can resume |
| Tab switch | Draft saved |
| Save error | Draft remains, error shown |

**File:** `src/hooks/useFormDraft.ts`

### State Confidence Indicators

| State | Visual Feedback |
|-------|-----------------|
| Saving | Button loading spinner |
| Saved | Navigate to Home (success = navigation) |
| Error | Alert with recovery message |
| Draft exists | No indicator (silent restore) |

---

## PHASE E — DEFAULT CHOICES CONTRACT

### Location: `src/utils/defaults.ts`

### When Defaults Are Applied

1. **Form initialization:**
   - `purchaseDate` = today
   - `returnWindowDays` = 30
   - `warrantyMonths` = 12

2. **Store selection:**
   - If known store → apply store-specific return/warranty
   - Show "(Store policy)" hint

### When Users Can Override

- Any time via chip selection (return/warranty)
- Any time via date picker (purchase date)
- Store defaults show hint but don't lock

### When System Must Ask

- **Item name:** Always required, no default possible
- **Receipt photo:** Always required, no default possible

### Behavior Rules Constant

```typescript
const BEHAVIOR_RULES = {
    requiredFields: ['name', 'photoUri'],
    collapsedFields: ['store', 'price', 'serialNumber', 'notes'],
    primaryFields: ['photoUri', 'name', 'purchaseDate', 'returnWindowDays', 'warrantyMonths'],
    confirmationRequired: ['delete', 'importBackup'],
    undoInstead: ['archive', 'removePhotoInForm'],
    undoWindowMs: 5000,
};
```

---

## FILES MODIFIED

| File | Change |
|------|--------|
| `src/utils/defaults.ts` | NEW: Store defaults, behavior rules contract |
| `src/utils/index.ts` | Export defaults |
| `src/hooks/useAddItem.ts` | Smart store defaults, field visibility |
| `src/hooks/useFormDraft.ts` | NEW: Autosave hook |
| `src/hooks/index.ts` | Export useFormDraft |
| `src/screens/AddItemScreen.tsx` | Progressive disclosure, smart defaults |
| `src/screens/ItemDetailScreen.tsx` | Archive with undo |
| `src/components/PhotoCapture.tsx` | Remove confirmation for photo removal |
| `src/components/UndoToast.tsx` | NEW: Global undo toast |
| `src/components/index.ts` | Export UndoToast |
| `src/store/undoStore.ts` | NEW: Undo state management |
| `src/db/repositories/purchaseRepository.ts` | restorePurchase function |
| `App.tsx` | Global UndoToast integration |

---

## UX QA CHECKLIST (Cognitive Load Only)

### Add Item Flow

- [ ] Form opens with photo capture as first field
- [ ] Purchase date defaults to today
- [ ] Return window defaults to 30 days (selected chip visible)
- [ ] Warranty defaults to 12 months
- [ ] Store/Price/Serial/Notes hidden under "More details"
- [ ] Typing "Costco" in store auto-updates to 90 day return
- [ ] "(Store policy)" hint appears when defaults applied
- [ ] Save button always visible without scrolling
- [ ] No confirmation dialogs during add flow

### Archive Flow

- [ ] Tapping Archive immediately archives (no confirmation)
- [ ] Undo toast appears at bottom
- [ ] Toast shows item name and countdown
- [ ] Tapping UNDO restores item
- [ ] Toast auto-dismisses after 5 seconds

### Photo Removal

- [ ] Long-press on photo removes it immediately
- [ ] No "Are you sure?" confirmation
- [ ] Can tap to add new photo immediately

### Delete Flow

- [ ] Delete still shows confirmation (irreversible)
- [ ] Confirmation message is clear about permanence

### Navigation

- [ ] Leaving Add screen saves draft
- [ ] Returning restores draft
- [ ] Successful save navigates to Home

---

## ANTI-PATTERNS ELIMINATED

| Old Pattern | Replaced With |
|-------------|---------------|
| "Are you sure?" for archive | Immediate action + undo |
| "Are you sure?" for photo removal | Immediate removal |
| All fields visible at once | Progressive disclosure |
| User picks return/warranty blindly | Smart store defaults |
| Data loss on navigation | Silent autosave |
| "Save" anxiety | Navigation = success |

---

**v1.06-B zero-thinking defaults implemented.**
