# v1.06-E Navigation QA Checklist

**Date**: 2026-01-08  
**Version**: 1.06-E  
**Purpose**: Verify navigation predictability before release

---

## Pre-Test Setup

- [ ] Fresh app install (clear all data)
- [ ] Test on both iOS and Android
- [ ] Have test purchases with various deadlines

---

## 1. Screen Role Verification

### HUB Screens (Home, Action Today)

| Test | Expected | iOS | Android |
|------|----------|-----|---------|
| Open app cold | Lands on Home tab | [ ] | [ ] |
| Tap Home tab | Shows purchases list | [ ] | [ ] |
| Tap Action tab | Shows urgent items only | [ ] | [ ] |
| Press hardware back from Home | N/A (no back) | - | [ ] Exits app |
| Press hardware back from Action | N/A (no back) | - | [ ] Exits app |
| Swipe from left edge on Home | Nothing happens | [ ] | - |

### TASK Screens (Add, Upgrade)

| Test | Expected | iOS | Android |
|------|----------|-----|---------|
| Tap Add tab | Opens add form | [ ] | [ ] |
| Fill partial form, switch tabs | Form data preserved | [ ] | [ ] |
| Save valid purchase | Navigates to Home tab | [ ] | [ ] |
| Form after save | Cleared/reset | [ ] | [ ] |
| Settings → Upgrade | Opens upgrade screen | [ ] | [ ] |
| Upgrade → Back | Returns to Settings | [ ] | [ ] |

### DETAIL Screens (Item Detail)

| Test | Expected | iOS | Android |
|------|----------|-----|---------|
| Home → tap item | Opens Item Detail | [ ] | [ ] |
| Item Detail → Back | Returns to Home | [ ] | [ ] |
| Action → tap item | Opens Item Detail | [ ] | [ ] |
| Item Detail → Back | Returns to Action | [ ] | [ ] |
| Archive item → Back | Returns to previous HUB | [ ] | [ ] |
| Delete item (confirm) | Returns to previous HUB | [ ] | [ ] |

### SYSTEM Screens (Settings)

| Test | Expected | iOS | Android |
|------|----------|-----|---------|
| Tap Settings tab | Opens settings | [ ] | [ ] |
| Settings → Upgrade | Pushes Upgrade screen | [ ] | [ ] |
| Upgrade → Back | Returns to Settings | [ ] | [ ] |
| Settings → Back | N/A (tab root) | - | [ ] Exits app |

---

## 2. Back Behavior Verification

| Screen | Back Action | Expected Result | iOS | Android |
|--------|-------------|-----------------|-----|---------|
| Home | N/A | Tab root, no back | [ ] | [ ] |
| Action | N/A | Tab root, no back | [ ] | [ ] |
| Add | Switch tabs | Form preserved | [ ] | [ ] |
| Settings | N/A | Tab root, no back | [ ] | [ ] |
| Item Detail | Swipe/button | Returns to HUB | [ ] | [ ] |
| Upgrade | Swipe/button | Returns to Settings | [ ] | [ ] |

### Critical: No Destructive Back

| Test | Expected | Pass |
|------|----------|------|
| Add partial form → switch tab → switch back | Form data intact | [ ] |
| Item Detail → view details → back | No data changed | [ ] |
| Upgrade (no purchase) → back | No charge, returns clean | [ ] |

---

## 3. Action Placement Verification

| Screen | Primary CTA | Secondary | Destructive | Correct? |
|--------|-------------|-----------|-------------|----------|
| Add | "Save Purchase" (bottom) | None | None | [ ] |
| Item Detail | "Share Proof" | "Archive" | "Delete" (last) | [ ] |
| Upgrade | "Upgrade to Pro" | "Restore Purchases" | None | [ ] |
| Settings | None (list) | Collapsible sections | None | [ ] |

### Destructive Actions

| Test | Expected | Pass |
|------|----------|------|
| Tap Delete on Item Detail | Confirmation dialog appears | [ ] |
| Tap Archive on Item Detail | Confirmation dialog appears | [ ] |
| Cancel confirmation | Nothing happens | [ ] |
| Confirm deletion | Item deleted, returns to HUB | [ ] |

---

## 4. Modal vs Push Verification

| Action | Presentation | Expected |
|--------|--------------|----------|
| Home → Item | Push (slide from right) | [ ] |
| Settings → Upgrade | Push (slide from right) | [ ] |
| Delete confirmation | Modal (overlay) | [ ] |
| Archive confirmation | Modal (overlay) | [ ] |
| Pro upgrade prompt | Modal (overlay) | [ ] |
| Limit reached warning | Modal (overlay) | [ ] |

---

## 5. Entry Point Safety

| Entry Point | Test | Expected | Pass |
|-------------|------|----------|------|
| Cold launch | Kill app, reopen | Lands on Home | [ ] |
| Background resume | Minimize, restore | Last screen shown | [ ] |
| Force quit mid-add | Kill app, reopen | Home (form lost) | [ ] |

---

## 6. Edge Cases

| Test | Expected | Pass |
|------|----------|------|
| Rapid tab switching | No crashes, no stuck states | [ ] |
| Deep navigation then tab switch | Stack preserved per tab | [ ] |
| Rotate device on each screen | Layout adjusts, no nav issues | [ ] |
| Low memory warning | App recovers cleanly | [ ] |

---

## Results Summary

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Screen Roles | 15 | | |
| Back Behavior | 10 | | |
| Action Placement | 8 | | |
| Modal vs Push | 6 | | |
| Entry Points | 3 | | |
| Edge Cases | 4 | | |
| **TOTAL** | **46** | | |

---

## Sign-Off

- [ ] All critical tests pass
- [ ] No navigation surprises observed
- [ ] Back behavior consistent across platforms
- [ ] Ready for release

**Tested By**: _______________  
**Date**: _______________
