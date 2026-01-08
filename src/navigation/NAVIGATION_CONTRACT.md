# NAVIGATION CONTRACT v1.06-E

**Locked**: 2026-01-08  
**Status**: ENFORCED  
**Principle**: Navigation behavior is an immutable contract.

---

## CORE PRINCIPLE

Users must always know:
1. **Where they are** — Screen role determines visual hierarchy
2. **How they got here** — Navigation path is always reversible
3. **What happens when they go back** — Back behavior is predictable per role

If any of these is unclear, navigation has failed.

---

## SCREEN ROLE CLASSIFICATION

Every screen has exactly ONE role. Role determines navigation behavior.

| Screen | Role | Description |
|--------|------|-------------|
| `HomeScreen` | HUB | Overview of all purchases. Decision screen. |
| `ActionTodayScreen` | HUB | Filtered urgent items. Separate focus context. |
| `AddItemScreen` | TASK | Create new purchase. Tab-based with draft persistence. |
| `ItemDetailScreen` | DETAIL | View/inspect single purchase. Read-first. |
| `SettingsScreen` | SYSTEM | App configuration. Infrequent access. |
| `UpgradeScreen` | TASK | Complete IAP transaction. Single purpose. |

### Role Definitions

| Role | Purpose | Navigation Pattern |
|------|---------|-------------------|
| **HUB** | Overview, decision making | Tab root. No back (exit app on Android). |
| **TASK** | Focused work, single purpose | Push/Modal. Back = discard unsaved. |
| **DETAIL** | Inspect, reference | Push. Back = return to HUB. |
| **SYSTEM** | Configuration | Push. Back = return to parent. |

### Anti-Pattern (FORBIDDEN)

A screen may NEVER be both HUB and TASK. Each screen has exactly one role.

---

## BACK BEHAVIOR CONTRACT

### By Role

| Role | Back Behavior | Platform Notes |
|------|---------------|----------------|
| **HUB** | Exit app (Android) / No-op (iOS) | Tab roots have no "back" |
| **TASK** | Discard changes + return | Form state lost unless explicitly saved |
| **DETAIL** | Return to launching HUB | Stack pop |
| **SYSTEM** | Return to parent screen | Standard navigation |

### Universal Rules

1. **Back NEVER performs destructive actions** — No data deletion on back
2. **Back is always reversible** — User can return to where they were
3. **Back behavior is consistent** — Same role = same behavior everywhere

### Platform Behavior

| Platform | Hardware Back | Swipe Gesture |
|----------|---------------|---------------|
| iOS | N/A | Enabled for stack screens |
| Android | Handled by React Navigation | N/A |

---

## MODAL vs PUSH RULES

### Decision Matrix

| Use | When |
|-----|------|
| **PUSH (Stack)** | Drilling into content, committed navigation |
| **MODAL** | Temporary, interruptible, dismissible overlay |
| **TAB** | Primary destinations, always accessible |

### Current Implementation

| Screen | Presentation | Reason |
|--------|--------------|--------|
| `ItemDetail` | Push (card) | Drilling into purchase details |
| `Upgrade` | Push (stack) | Child of Settings, committed navigation |
| `Add` | Tab | Frequent action, draft persistence |

### Modal Usage

Modals are used for:
- Confirmation dialogs (delete, archive)
- Pro upgrade prompts (inline)
- Purchase limit warnings
- Any UI that doesn't change navigation state

Modals are NOT used for:
- Full screens (use push instead)
- Content that needs back button
- Navigation that should be in history

---

## ACTION PLACEMENT RULES

### Placement Contract

| Action Type | Position | Treatment |
|-------------|----------|-----------|
| **Primary CTA** | Bottom, full-width | Prominent button |
| **Secondary** | Below primary, full-width | Ghost/secondary variant |
| **Destructive** | Last in list, separated | Ghost variant, requires confirmation |
| **Navigation** | Header (system) | Never mixed with data actions |

### Visual Isolation

- Primary and secondary actions grouped at screen bottom
- Destructive actions visually separated (last position)
- Inline actions only within their relevant content area

---

## ENTRY POINT SAFETY

### Landing Screens

| Entry Point | Landing | Fallback |
|-------------|---------|----------|
| Cold launch | HomeTab | N/A |
| Background resume | Last visible | HomeTab if invalid |
| Notification tap | ItemDetail (future) | HomeTab if item deleted |
| Deep link | Target screen | HomeTab if invalid |

### Recovery Rules

1. **Default landing is always HomeTab** — Safe HUB
2. **Invalid navigation targets fall back to HomeTab**
3. **Deleted item links show toast + redirect to HomeTab**
4. **Stack always has valid HUB at root**

### Orphan Prevention

No screen can be reached without a parent HUB in the stack:
- ItemDetail requires Home or ActionToday
- Upgrade requires Settings
- Tab roots are always accessible

---

## NAVIGATION VIOLATIONS LOG

### v1.06-E Fixes Required

| Issue | Location | Fix |
|-------|----------|-----|
| `goBack()` no-op on tab screen | `useAddItem.ts:260` | Navigate to HomeTab after save |

### v1.1 Backlog

| Issue | Priority | Notes |
|-------|----------|-------|
| No deep linking config | P2 | Required for notification tap |
| No fallback screen | P3 | Handle invalid deep links |

---

## QA CHECKLIST

### Navigation Predictability

- [ ] From any screen, user can explain how they got there
- [ ] Back button/gesture returns to expected previous screen
- [ ] Same action (tap item → detail) works identically everywhere
- [ ] No screen acts as both HUB and TASK

### Back Behavior

- [ ] HUB screens: Back exits app (Android) or does nothing (iOS)
- [ ] TASK screens: Back discards unsaved changes
- [ ] DETAIL screens: Back returns to launching HUB
- [ ] No back action deletes user data

### Action Placement

- [ ] Primary CTA always at screen bottom
- [ ] Destructive actions always last, require confirmation
- [ ] Navigation actions never mixed with data actions

### Entry Points

- [ ] Cold launch lands on HomeTab
- [ ] Background resume restores last screen
- [ ] App never lands on orphan screen

---

## CHANGELOG

- **v1.06-E** (2026-01-08): Initial navigation contract locked
