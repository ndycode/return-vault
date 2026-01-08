# WARRANTY LOCKER - PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-08  
**Commit:** 1a74230  
**Branch:** master

---

## OVERVIEW

Expo React Native app (SDK 54) for tracking purchase warranties and return windows. Local-first SQLite database, Zustand state, design token system, Pro/freemium model.

---

## STRUCTURE

```
warranty-locker/
├── App.tsx              # Root component (SafeAreaProvider + NavigationContainer)
├── index.ts             # Entry point (registerRootComponent)
├── src/
│   ├── components/      # UI components (primitives/ layer + composed)
│   ├── db/              # SQLite + migrations + repositories
│   ├── design/          # Design tokens (colors, spacing, typography, radius, shadows)
│   ├── hooks/           # Custom hooks (usePurchases, useAddItem, etc.)
│   ├── navigation/      # React Navigation v7 (tabs + stacks)
│   ├── screens/         # Screen components
│   ├── services/        # External APIs (notifications, attachments, IAP, export)
│   ├── store/           # Zustand stores (settings, pro)
│   ├── types/           # TypeScript definitions
│   └── utils/           # Utilities (dateUtils, uuid, debug)
├── docs/                # Release protocols, test plans, build commands
└── __tests__/           # Jest tests (minimal coverage)
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new screen | `src/screens/` + register in `src/navigation/` | Export via index.ts |
| Add component | `src/components/` (composed) or `primitives/` (atomic) | Use design tokens |
| Database changes | `src/db/migrations/` + update repository | Bump migration version |
| Add custom hook | `src/hooks/` | Prefix with `use` |
| External API integration | `src/services/` | Service pattern |
| Design tokens | `src/design/` | NEVER use ad-hoc values |
| Type definitions | `src/types/` | Barrel export |
| Build/deploy | `docs/BUILD_COMMANDS.md` | EAS Build profiles |
| Bug triage | `docs/FIX_PROTOCOL.md` | P0-P4 severity system |

---

## CONVENTIONS

### Code Organization
- **Barrel exports**: Every directory has `index.ts` re-exporting all modules
- **Relative imports only**: Use `../` patterns, NO path aliases (`@/`, `~/`)
- **JSDoc header**: Every file starts with `/** File description */`

### TypeScript
- **Strict mode**: `"strict": true` in tsconfig
- **Explicit nulls**: All nullable types use `| null`
- **Named exports**: Avoid default exports except screens/components
- **Type suffixes**: `CreatePurchaseInput`, `UpdatePurchaseInput`

### Design System (MANDATORY)
- **Use tokens**: Import from `../design` - NEVER use hardcoded colors/spacing
- **4px base unit**: xs=4, sm=8, md=12, lg=16, xl=24, xxl=32, xxxl=48
- **Platform fonts**: System (iOS) / Roboto (Android) via typography tokens
- **Semantic colors**: primary50-900, gray50-900, success/warning/error variants

### Components
- **Primitives**: Low-level (`Button`, `Card`, `Text`, `Input`) in `primitives/`
- **Composed**: Feature components (`ItemCard`, `SearchBar`) at root level
- **Props interface**: `export interface ComponentProps extends ...`
- **StyleSheet**: Inline `const styles = StyleSheet.create({...})` at bottom

### Database
- **Date format**: ISO strings `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:mm:ss.sssZ` for timestamps
- **Soft deletes**: `status: 'active' | 'archived'` - NEVER hard delete user data
- **Parameterized queries**: SQL injection prevention mandatory
- **Repository pattern**: See `src/db/repositories/`

---

## ANTI-PATTERNS (THIS PROJECT)

| Pattern | Why Forbidden |
|---------|---------------|
| `as any`, `@ts-ignore`, `@ts-expect-error` | Strict TypeScript - fix the types |
| Hardcoded colors/spacing | Use design tokens exclusively |
| `console.log` in production | Use `debug()` from utils (stripped in prod) |
| Direct SQL in components | Use repository pattern |
| String concatenation in SQL | SQL injection risk - use parameterized queries |
| Refactoring during RC0 | See FIX_PROTOCOL.md - scope creep forbidden |
| New features during RC0 | P0/P1 fixes only until release |

---

## RC0 PHASE RULES

Currently in Release Candidate phase (v1.0.0). Strict constraints:

**DO FIX:**
- P0 (Blocker): App unusable, data loss, security
- P1 (Critical): Core feature broken

**DO NOT FIX:**
- P2-P4 issues (document for v1.1)
- Refactoring requests
- New features
- Performance optimizations (unless P0/P1)

**Scope creep warning signs - STOP if thinking:**
- "While I'm in here, let me also..."
- "This would be a good time to refactor..."

---

## COMMANDS

```bash
# Development
npm start                              # Expo dev server
npm run ios                            # iOS Simulator
npm run android                        # Android Emulator

# Type check
npx tsc --noEmit                       # Must pass before builds

# EAS Builds
eas build --profile development --platform all    # Dev builds
eas build --profile preview --platform all        # QA builds
eas build --profile production --platform all     # Store builds

# OTA Updates (JS-only changes)
eas update --branch production --message "Hotfix: description"
```

---

## CRITICAL IMPLEMENTATION NOTES

### IAP (In-App Purchase)
- Only works in dev/production builds - NOT Expo Go
- MUST finish transactions to acknowledge with store
- Handle user cancellation silently (no error UI)
- Restore button required (App Store requirement)

### Notifications
- Don't schedule for past dates (silently skip)
- Default lead times: Return (1, 3, 7 days), Warranty (7, 14, 30 days)
- Scheduled at 9:00 AM

### Database
- Singleton via `getDatabase()` - auto-initializes on first call
- Migrations run automatically in order
- Foreign keys enabled (`PRAGMA foreign_keys = ON`)

---

## TESTING

- **Framework**: Jest 30.2.0
- **Location**: `__tests__/` directory
- **Coverage**: ~1% (critical gap - see RC0_TEST_PLAN.md for manual tests)
- **Required before release**: All P0 tests pass (100%), P1 tests 90%

---

## KNOWN GAPS (v1.1 Backlog)

- No ESLint/Prettier configuration
- Minimal test coverage (1 test file)
- No CI/CD pipeline
- No environment variable management
- No git remote configured (local-only)

---

## SUBDIRECTORY AGENTS

- [`src/components/AGENTS.md`](src/components/AGENTS.md) - Component architecture
- [`src/db/AGENTS.md`](src/db/AGENTS.md) - Database patterns
