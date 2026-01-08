# Release Gate Checklist - Warranty Locker v1.0.0 RC0

**Release Candidate:** RC0  
**Target Date:** TBD  
**Status:** DRAFT

---

## BLOCKER Criteria

**A release is BLOCKED if ANY of these fail:**

| # | Check | Owner | Status | Date | Notes |
|---|-------|-------|--------|------|-------|
| 1 | iOS build completes without errors | Dev | ⬜ | | |
| 2 | Android build completes without errors | Dev | ⬜ | | |
| 3 | App launches on fresh install (both platforms) | QA | ⬜ | | |
| 4 | Database initialization succeeds | QA | ⬜ | | |
| 5 | All P0 test cases pass | QA | ⬜ | | |
| 6 | No crash in first 5 minutes of use | QA | ⬜ | | |
| 7 | Core flow works: Add → View → Edit → Delete | QA | ⬜ | | |
| 8 | App Store metadata complete | Product | ⬜ | | |
| 9 | Privacy Policy URL accessible | Legal | ⬜ | | |
| 10 | Support URL accessible | Product | ⬜ | | |

---

## App Store Metadata Checklist

### iOS App Store Connect

| Item | Status | Value/Notes |
|------|--------|-------------|
| **App Name** | ⬜ | Warranty Locker |
| **Subtitle** | ⬜ | Track Returns & Warranties |
| **Description** | ⬜ | (min 10 chars, max 4000) |
| **Keywords** | ⬜ | warranty,returns,receipts,tracker |
| **Support URL** | ⬜ | https://your-domain.com/support |
| **Marketing URL** | ⬜ | https://your-domain.com |
| **Privacy Policy URL** | ⬜ | https://your-domain.com/privacy |
| **Category** | ⬜ | Utilities or Productivity |
| **Secondary Category** | ⬜ | Finance (optional) |
| **Age Rating** | ⬜ | 4+ |
| **Copyright** | ⬜ | © 2026 Your Company |
| **Contact Email** | ⬜ | support@your-domain.com |
| **App Icon (1024x1024)** | ⬜ | |
| **Screenshots - iPhone 6.7"** | ⬜ | (3-10 required) |
| **Screenshots - iPhone 6.5"** | ⬜ | (3-10 required) |
| **Screenshots - iPhone 5.5"** | ⬜ | (3-10 required) |
| **Screenshots - iPad** | ⬜ | (if supporting iPad) |
| **App Preview Video** | ⬜ | (optional) |

### iOS Permission Strings (Info.plist)

| Permission | Key | Status | String |
|------------|-----|--------|--------|
| Camera | NSCameraUsageDescription | ⬜ | "Warranty Locker needs camera access to capture receipt photos for your purchases." |
| Photo Library | NSPhotoLibraryUsageDescription | ⬜ | "Warranty Locker needs photo library access to save and attach receipt images." |
| Photo Library Add | NSPhotoLibraryAddUsageDescription | ⬜ | "Warranty Locker needs permission to save receipt photos to your library." |
| Notifications | NSUserNotificationsUsageDescription | ⬜ | "Warranty Locker sends reminders before return windows close and warranties expire." |

### Google Play Store

| Item | Status | Value/Notes |
|------|--------|-------------|
| **App Name** | ⬜ | Warranty Locker |
| **Short Description** | ⬜ | (max 80 chars) |
| **Full Description** | ⬜ | (max 4000 chars) |
| **App Icon (512x512)** | ⬜ | |
| **Feature Graphic (1024x500)** | ⬜ | |
| **Screenshots - Phone** | ⬜ | (2-8 required) |
| **Screenshots - Tablet 7"** | ⬜ | (if supporting) |
| **Screenshots - Tablet 10"** | ⬜ | (if supporting) |
| **Category** | ⬜ | Tools or Productivity |
| **Content Rating** | ⬜ | Everyone |
| **Privacy Policy URL** | ⬜ | https://your-domain.com/privacy |
| **Contact Email** | ⬜ | support@your-domain.com |
| **Target SDK** | ⬜ | 34+ (required for 2024+) |

### Android Permissions

| Permission | Status | Justification |
|------------|--------|---------------|
| CAMERA | ⬜ | Receipt photo capture |
| READ_EXTERNAL_STORAGE | ⬜ | Attach existing photos (Android < 13) |
| READ_MEDIA_IMAGES | ⬜ | Attach existing photos (Android 13+) |
| POST_NOTIFICATIONS | ⬜ | Reminder notifications (Android 13+) |
| SCHEDULE_EXACT_ALARM | ⬜ | Precise reminder timing |
| RECEIVE_BOOT_COMPLETED | ⬜ | Reschedule alarms after reboot |

---

## Technical Verification

### Build Verification

| Check | iOS | Android | Notes |
|-------|-----|---------|-------|
| Clean build succeeds | ⬜ | ⬜ | `eas build --profile production` |
| No TypeScript errors | ⬜ | ⬜ | `npx tsc --noEmit` |
| No critical ESLint errors | ⬜ | ⬜ | `npx eslint .` |
| Bundle size acceptable | ⬜ | ⬜ | iOS < 100MB, Android < 50MB |
| Version numbers correct | ⬜ | ⬜ | 1.0.0 / build 1 |

### Database

| Check | Status | Notes |
|-------|--------|-------|
| Schema version matches code | ⬜ | PRAGMA user_version = 1 |
| Migrations run on fresh install | ⬜ | |
| Indexes created | ⬜ | Check EXPLAIN QUERY PLAN |
| Foreign keys enabled | ⬜ | PRAGMA foreign_keys = ON |

### Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Cold start (iOS) | < 2s | | ⬜ |
| Cold start (Android) | < 3s | | ⬜ |
| Memory usage | < 150MB | | ⬜ |
| List scroll FPS | 60 FPS | | ⬜ |
| Database query (100 items) | < 100ms | | ⬜ |

---

## Security Checklist

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded API keys | ⬜ | Grep for 'apikey', 'secret', 'password' |
| No console.log with sensitive data | ⬜ | Review all console statements |
| SQLite using parameterized queries | ⬜ | No string concatenation in SQL |
| File paths sanitized | ⬜ | No user input in file paths |
| Expo config has no secrets | ⬜ | Check app.json / app.config.js |
| Debug/dev code stripped in prod | ⬜ | __DEV__ checks working |

---

## Accessibility

| Check | Status | Notes |
|-------|--------|-------|
| VoiceOver works (iOS) | ⬜ | All buttons labeled |
| TalkBack works (Android) | ⬜ | All buttons labeled |
| Touch targets ≥ 44pt | ⬜ | All interactive elements |
| Color contrast passes | ⬜ | 4.5:1 ratio minimum |
| Text scales with system settings | ⬜ | Dynamic Type support |

---

## Legal & Compliance

| Item | Status | URL/Location | Notes |
|------|--------|--------------|-------|
| Privacy Policy | ⬜ | | Must describe data collection |
| Terms of Service | ⬜ | | Optional but recommended |
| GDPR compliance | ⬜ | | If serving EU users |
| CCPA compliance | ⬜ | | If serving California users |
| Data deletion mechanism | ⬜ | | In-app or documented process |
| Third-party licenses | ⬜ | | License file in settings |

---

## Test Coverage

| Category | Pass | Fail | Blocked | Skip | Total |
|----------|------|------|---------|------|-------|
| A) Install & First Run | | | | | 5 |
| B) Fast Add Flow | | | | | 6 |
| C) Attachments | | | | | 5 |
| D) Deadlines Logic | | | | | 6 |
| E) Notifications | | | | | 5 |
| F) Export Proof Packet | | | | | 3 |
| G) Backup Export/Import | | | | | 5 |
| H) Performance | | | | | 5 |
| **TOTAL** | | | | | **40** |

### Pass Criteria

- **P0 tests:** 100% pass required
- **P1 tests:** 90% pass required
- **P2 tests:** 80% pass required, or issues documented with workaround

---

## Known Issues (Ship-with)

Document issues that are known but acceptable for release:

| Issue | Severity | Impact | Workaround | Ticket |
|-------|----------|--------|------------|--------|
| _Example: Search is case-sensitive_ | _P3 Low_ | _Minor UX_ | _Type exact case_ | _#123_ |

---

## Final Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Engineering Lead | | | ⬜ |
| QA Lead | | | ⬜ |
| Product Manager | | | ⬜ |
| Legal (if required) | | | ⬜ |

---

## Release Actions

### Pre-Release

- [ ] Tag release in git: `git tag -a v1.0.0 -m "Release 1.0.0"`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Create GitHub release with changelog
- [ ] Archive build artifacts

### Store Submission

- [ ] Submit iOS to App Store Connect
- [ ] Submit Android to Google Play Console
- [ ] Set release schedule (immediate or timed)

### Post-Release Monitoring

- [ ] Set up crash reporting dashboard
- [ ] Monitor App Store reviews
- [ ] Monitor Play Store reviews
- [ ] Check analytics for abnormal patterns
- [ ] 24-hour hotfix readiness
