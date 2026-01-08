# DATABASE - Patterns & Conventions

---

## OVERVIEW

Local-first SQLite via expo-sqlite. Repository pattern with migration system.

---

## STRUCTURE

```
db/
├── database.ts          # Singleton connection + initialization
├── migrations/
│   ├── 001_initial.ts   # Schema v1 (purchases, attachments tables)
│   └── index.ts         # Migration runner
├── repositories/
│   ├── purchaseRepository.ts    # CRUD for purchases
│   ├── attachmentRepository.ts  # CRUD for attachments
│   └── index.ts
└── index.ts             # Barrel export
```

---

## DATABASE ACCESS

```typescript
// CORRECT: Use repository functions
import { createPurchase, getPurchaseById } from '../db/repositories';

// WRONG: Direct SQL in components
const db = await getDatabase();
db.runAsync('SELECT * FROM ...');  // NO!
```

---

## MIGRATION RULES

1. **Naming**: `NNN_description.ts` (e.g., `002_add_categories.ts`)
2. **Never modify existing migrations** - create new one
3. **Register in index.ts**: Add to migrations array
4. **Version stored**: `PRAGMA user_version = N`

```typescript
// Migration template
export const migration_002: Migration = {
    version: 2,
    up: async (db: SQLiteDatabase) => {
        await db.execAsync(`
            ALTER TABLE purchases ADD COLUMN category TEXT;
        `);
    },
};
```

---

## REPOSITORY PATTERN

| Function | Naming Convention |
|----------|-------------------|
| Create | `createPurchase(input: CreatePurchaseInput)` |
| Read one | `getPurchaseById(id: string)` |
| Read many | `getPurchases(options?)` |
| Update | `updatePurchase(id, input: UpdatePurchaseInput)` |
| Soft delete | `archivePurchase(id)` - sets status='archived' |
| Hard delete | `deletePurchase(id)` - USE SPARINGLY |

---

## DATE HANDLING

| Type | Format | Example |
|------|--------|---------|
| Date only | `YYYY-MM-DD` | `2026-01-08` |
| Timestamp | ISO 8601 | `2026-01-08T14:30:00.000Z` |
| Compute | Use `dateUtils` | `computeReturnDeadline()` |

---

## SQL SAFETY (MANDATORY)

```typescript
// CORRECT: Parameterized queries
await db.runAsync(
    'INSERT INTO purchases (id, name) VALUES (?, ?)',
    [id, name]
);

// WRONG: String concatenation (SQL INJECTION RISK)
await db.runAsync(`INSERT INTO purchases (id, name) VALUES ('${id}', '${name}')`);
```

---

## ANTI-PATTERNS

| Forbidden | Why |
|-----------|-----|
| String concatenation in SQL | SQL injection vulnerability |
| Hard deletes of user data | Use soft delete (status='archived') |
| Modifying old migrations | Creates version mismatch - add new migration |
| Direct SQL in screens/hooks | Use repository functions |
| Forgetting to run migrations | Database auto-migrates via `getDatabase()` |
