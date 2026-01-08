# COMPONENTS - Architecture Guide

---

## OVERVIEW

Two-layer component architecture: atomic primitives + composed feature components.

---

## STRUCTURE

```
components/
├── primitives/          # Atomic building blocks (DO NOT import composed here)
│   ├── Button.tsx       # Variants: primary, secondary, ghost
│   ├── Card.tsx         # Container with shadow/elevation
│   ├── Input.tsx        # Text input with label/error states
│   ├── Text.tsx         # Typography wrapper (h1, h2, body, caption)
│   ├── ScreenContainer.tsx  # SafeArea + padding wrapper
│   └── index.ts         # Barrel export
├── ItemCard.tsx         # Purchase list item (composed)
├── SearchBar.tsx        # Search input (composed)
├── FilterChips.tsx      # Status filter chips (composed)
├── EmptyState.tsx       # Empty list placeholder (composed)
└── index.ts             # Barrel export (primitives + composed)
```

---

## LAYER RULES

| Layer | Import From | Never Import |
|-------|-------------|--------------|
| **Primitives** | `../../design` only | Other components |
| **Composed** | `./primitives`, `../design`, `../types` | Other composed components |

---

## COMPONENT TEMPLATE

```tsx
/**
 * ComponentName
 * Brief description
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../design';  // primitives
// OR: import { colors, spacing } from '../design';  // composed

export interface ComponentNameProps {
    // Props with JSDoc comments
}

export function ComponentName({ ...props }: ComponentNameProps) {
    return (
        <View style={styles.container}>
            {/* content */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Use design tokens ONLY
    },
});
```

---

## PRIMITIVES CONVENTIONS

- **Button**: `variant` (primary/secondary/ghost), `size` (sm/md/lg), `loading`, `fullWidth`
- **Text**: `variant` (h1/h2/h3/body/caption/button), `color` (token key)
- **Input**: `label`, `error`, `placeholder` - wraps TextInput with styling
- **Card**: `elevated` prop for shadow, handles Platform.select for iOS/Android

---

## ANTI-PATTERNS

| Forbidden | Why |
|-----------|-----|
| Hardcoded colors | Use `colors.primary600` from design tokens |
| Inline styles | Use StyleSheet.create |
| Primitives importing composed | Breaks dependency hierarchy |
| Default exports | Use named exports for tree-shaking |
