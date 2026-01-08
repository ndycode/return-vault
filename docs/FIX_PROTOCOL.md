# Fix Protocol - Warranty Locker RC0

**Version:** 1.0.0 RC0  
**Created:** 2026-01-08

---

## Severity Definitions

| Severity | Name | SLA | Description | Examples |
|----------|------|-----|-------------|----------|
| **P0** | Blocker | Fix immediately | App is unusable, data loss, security issue | Crash on launch, database corruption, auth bypass |
| **P1** | Critical | Fix within 24h | Core feature broken, major user impact | Cannot add purchases, photos don't save, notifications fail |
| **P2** | High | Fix before release | Feature partially broken, workaround exists | Search case-sensitive, minor UI glitch |
| **P3** | Medium | Fix in next version | Minor issue, low impact | Typo in UI, minor alignment issue |
| **P4** | Low | Backlog | Polish, nice-to-have | Feature request, optimization idea |

---

## RC0 Rules

### DO Fix (Blockers Only)

- P0 issues (must fix to release)
- P1 issues affecting core flows
- Build/deployment failures
- App Store rejection issues

### DO NOT Fix

- P2-P4 issues (document for v1.1)
- Refactoring requests
- New feature requests
- Performance optimizations (unless P0/P1)
- Code style changes
- Documentation improvements

### Scope Creep Warning Signs

If you catch yourself saying:

- "While I'm in here, let me also..."
- "This would be a good time to refactor..."
- "Let me add this small feature..."
- "I'll just clean up this code..."

**STOP.** Log it for v1.1 and move on.

---

## Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** P0 / P1 / P2 / P3 / P4

**Environment:**
- Device: [iPhone 15 Pro / Pixel 8 / etc.]
- OS Version: [iOS 17.2 / Android 14]
- App Version: 1.0.0 RC0
- Build Number: [from Settings screen]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Frequency:**
- [ ] Always (100%)
- [ ] Often (>50%)
- [ ] Sometimes (10-50%)
- [ ] Rarely (<10%)
- [ ] Only once

**Screenshots/Video:**
[Attach if applicable]

**Logs:**
[Paste relevant console logs - DEV builds only]

**Workaround:**
[If any workaround exists, describe it]

**Additional Context:**
[Any other relevant information]
```

---

## Hotfix PR Template

```markdown
## Hotfix: [Issue Title]

**Fixes:** #[issue-number]

**Severity:** P0 / P1

### Problem
[Brief description of the bug]

### Root Cause
[What caused the bug]

### Solution
[How this PR fixes it]

### Changes
- [ ] File 1: [description]
- [ ] File 2: [description]

### Testing Done
- [ ] Verified fix on iOS
- [ ] Verified fix on Android
- [ ] No regression in related features
- [ ] TypeScript compiles without errors

### Risk Assessment
- **Scope:** [Minimal / Small / Medium / Large]
- **Areas affected:** [List specific areas]
- **Regression risk:** [Low / Medium / High]

### Rollback Plan
[How to revert if needed]

### Checklist
- [ ] Only fixes the stated issue (no scope creep)
- [ ] No new features added
- [ ] No refactoring included
- [ ] Tested on physical device
- [ ] Ready for expedited review
```

---

## Hotfix Workflow

### 1. Triage (5 min)

```
1. Confirm severity (P0 or P1 only for RC0 hotfix)
2. Reproduce the issue
3. Document in bug tracker
4. Assign owner
```

### 2. Investigation (30 min max)

```
1. Identify root cause
2. Determine minimal fix
3. Assess risk/impact
4. Get quick approval from lead
```

### 3. Fix (time varies)

```
1. Create branch: hotfix/issue-description
2. Make minimal change
3. Test locally on both platforms
4. Verify no regressions
```

### 4. Review (15 min)

```
1. Create PR using hotfix template
2. Request expedited review
3. Reviewer focuses on:
   - Does it fix the issue?
   - Is it minimal?
   - Any obvious regressions?
4. No nitpicking during hotfix review
```

### 5. Deploy (30 min)

```
1. Merge to main
2. Tag release: v1.0.0-rc0.1
3. Build with EAS
4. Deploy to TestFlight/Internal Testing
5. Verify fix in new build
```

---

## Communication Protocol

### For P0 (Blocker)

1. Immediately notify: Dev Lead, QA Lead, Product
2. Create war room (Slack channel or call)
3. Status updates every 30 minutes until resolved
4. Post-mortem required within 24 hours

### For P1 (Critical)

1. Notify Dev Lead within 1 hour
2. Update bug tracker with ETA
3. Status update when fix is in review
4. Status update when deployed

### For P2+ (RC0 phase)

1. Document in bug tracker
2. Tag as "v1.1" or "post-release"
3. No immediate action required

---

## Regression Prevention

### Before Any Fix

- [ ] Write failing test (if feasible)
- [ ] List related features that could break
- [ ] Plan manual test for each

### After Fix

- [ ] Run full test suite
- [ ] Manually test the fixed scenario
- [ ] Manually test 2-3 related scenarios
- [ ] Check console for unexpected errors

---

## Escalation Matrix

| Situation | Escalate To | When |
|-----------|-------------|------|
| Can't reproduce | QA Lead | After 30 min |
| Fix breaks other things | Dev Lead | Immediately |
| Fix requires >2 hours | Product + Dev Lead | Before starting |
| Disagreement on severity | Product | Immediately |
| Security issue | Security + Exec | Immediately |
| Need to delay release | Product + All Leads | When determined |

---

## Post-Release Hotfix (v1.0.1)

### OTA Update (JavaScript only)

If fix is JavaScript-only (no native code changes):

```bash
# Publish OTA update
eas update --branch production --message "Hotfix: [description]"
```

### Full App Update (Native changes)

If fix requires native code:

```bash
# Bump patch version in app.json
# version: "1.0.1"

# Build and submit
eas build --profile production --platform all
eas submit --platform all --latest
```

### Version Numbering

| Scenario | Version | Build |
|----------|---------|-------|
| RC0 initial | 1.0.0 | 1 |
| RC0 hotfix 1 | 1.0.0 | 2 |
| RC0 hotfix 2 | 1.0.0 | 3 |
| Production release | 1.0.0 | 10+ |
| Post-release hotfix | 1.0.1 | 1 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-08 | | Initial version |
