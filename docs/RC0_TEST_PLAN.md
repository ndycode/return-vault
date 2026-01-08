# RC0 Test Plan - Warranty Locker v1.0

**Version:** 1.0.0 RC0  
**Created:** 2026-01-08  
**Target Platforms:** iOS 15+, Android 10+ (API 29+)

---

## Test Categories

| Category | Test Count |
|----------|------------|
| A) Install & First Run | 5 |
| B) Fast Add Flow | 6 |
| C) Attachments (Receipt Photos) | 5 |
| D) Deadlines Logic (Return + Warranty) | 6 |
| E) Notifications | 5 |
| F) Export Proof Packet | 3 |
| G) Backup Export/Import | 5 |
| H) Performance & Stability | 5 |
| **TOTAL** | **40** |

---

## A) Install & First Run

### A-01: Fresh Install Launch
**Priority:** P0 - Blocker  
**Steps:**
1. Uninstall app if present
2. Install from TestFlight (iOS) or Internal Testing (Android)
3. Launch app for the first time

**Expected Result:**
- App launches without crash
- Splash screen displays with correct branding
- Navigation to Home screen within 3 seconds
- Empty state card displayed: "No purchases yet"

---

### A-02: Database Initialization
**Priority:** P0 - Blocker  
**Steps:**
1. Fresh install and launch
2. Open Settings screen
3. Check for console logs (DEV build only)

**Expected Result:**
- Console shows: `[DB] Opening database...`
- Console shows: `[DB] Running migrations...`
- Console shows: `[DB] Database ready`
- No SQL errors in console

---

### A-03: Tab Navigation Works
**Priority:** P0 - Blocker  
**Steps:**
1. Launch app
2. Tap each bottom tab: Purchases, Action Today, Add, Settings
3. Return to first tab

**Expected Result:**
- Each tab displays correct screen
- Smooth transitions, no flickering
- No crashes or freezes
- Tab highlight updates correctly

---

### A-04: Orientation Lock (Portrait)
**Priority:** P1 - High  
**Steps:**
1. Launch app
2. Rotate device to landscape
3. Navigate through all screens

**Expected Result:**
- App stays in portrait orientation
- No layout breaking on rotation attempts

---

### A-05: Resume from Background
**Priority:** P0 - Blocker  
**Steps:**
1. Launch app and navigate to any screen
2. Press home button, wait 30 seconds
3. Reopen app

**Expected Result:**
- App resumes to same screen
- No crash or data loss
- Database connection re-established

---

## B) Fast Add Flow

### B-01: Add Minimal Purchase
**Priority:** P0 - Blocker  
**Steps:**
1. Navigate to Add screen
2. Enter item name only: "Test Item"
3. Tap "Save Purchase"

**Expected Result:**
- Purchase saves successfully
- Navigates to Home screen
- New item visible in list
- createdAt timestamp set

---

### B-02: Add Full Purchase Details
**Priority:** P0 - Blocker  
**Steps:**
1. Navigate to Add screen
2. Enter: Name, Store, Return window (30 days), Warranty (12 mo)
3. Tap "Save Purchase"

**Expected Result:**
- All fields saved correctly
- Return deadline calculated: purchaseDate + 30 days
- Warranty expiry calculated: purchaseDate + 12 months
- Item appears in Home list

---

### B-03: Return Window Chip Selection
**Priority:** P1 - High  
**Steps:**
1. Navigate to Add screen
2. Tap each return window chip: 14, 30, 60, 90 days
3. Verify visual selection

**Expected Result:**
- Only one chip selected at a time
- Selected chip shows visual distinction
- Value updates in form state

---

### B-04: Warranty Period Chip Selection
**Priority:** P1 - High  
**Steps:**
1. Navigate to Add screen
2. Tap each warranty chip: None, 3mo, 6mo, 12mo, 24mo
3. Verify visual selection

**Expected Result:**
- Only one chip selected at a time
- "None" clears warranty setting
- Selected chip shows visual distinction

---

### B-05: Store Name Persistence
**Priority:** P2 - Medium  
**Steps:**
1. Add purchase with store "Best Buy"
2. Add second purchase
3. Check if store appears in suggestions (if autocomplete implemented)

**Expected Result:**
- Previous stores available for selection
- Store list query returns distinct values

---

### B-06: Cancel/Back from Add Flow
**Priority:** P1 - High  
**Steps:**
1. Navigate to Add screen
2. Fill in partial data
3. Press back button/gesture

**Expected Result:**
- Navigation returns to previous screen
- No partial data saved to database
- No crash on back navigation

---

## C) Attachments (Receipt Photos)

### C-01: Camera Permission Request
**Priority:** P0 - Blocker  
**Steps:**
1. Fresh install (or reset permissions)
2. Navigate to Add screen
3. Tap receipt photo area
4. Select "Take Photo"

**Expected Result:**
- Permission dialog appears with correct text
- "Allow" grants camera access
- "Deny" shows graceful error/message
- No crash regardless of choice

---

### C-02: Capture Photo from Camera
**Priority:** P0 - Blocker  
**Steps:**
1. Navigate to Add screen
2. Tap receipt photo area
3. Grant camera permission
4. Take photo and confirm

**Expected Result:**
- Camera opens in-app
- Photo preview shows after capture
- Photo saved to app documents directory
- Photo linked to purchase after save

---

### C-03: Pick Photo from Gallery
**Priority:** P0 - Blocker  
**Steps:**
1. Navigate to Add screen
2. Tap receipt photo area
3. Select "Choose from Library"
4. Pick existing photo

**Expected Result:**
- Media library opens
- Selected photo displays in preview
- Photo copied to app documents
- Original photo unchanged

---

### C-04: Multiple Attachments per Purchase
**Priority:** P1 - High  
**Steps:**
1. Create purchase with one photo
2. Edit purchase, add second photo
3. View purchase details

**Expected Result:**
- Both photos linked to purchase
- Photos display in attachment list
- Can distinguish receipt vs other types

---

### C-05: Delete Attachment
**Priority:** P1 - High  
**Steps:**
1. Open purchase with attachment
2. Delete attachment
3. Confirm deletion

**Expected Result:**
- Attachment removed from database
- File deleted from documents directory
- Purchase still exists without attachment

---

## D) Deadlines Logic (Return + Warranty)

### D-01: Return Deadline Calculation
**Priority:** P0 - Blocker  
**Steps:**
1. Add purchase with date: 2026-01-01
2. Set return window: 30 days
3. Save and view details

**Expected Result:**
- Return deadline displays: 2026-01-31
- Deadline stored in ISO format
- Calculation handles month boundaries

---

### D-02: Warranty Expiry Calculation
**Priority:** P0 - Blocker  
**Steps:**
1. Add purchase with date: 2026-01-15
2. Set warranty: 12 months
3. Save and view details

**Expected Result:**
- Warranty expiry displays: 2027-01-15
- Handles year boundary correctly
- Stored in ISO format

---

### D-03: Leap Year Handling
**Priority:** P1 - High  
**Steps:**
1. Add purchase with date: 2028-02-29 (leap year)
2. Set warranty: 12 months
3. Save and view details

**Expected Result:**
- Expiry calculated correctly
- No crash on edge date
- Result: 2029-02-28 (or 03-01)

---

### D-04: Action Today - Return Due Soon
**Priority:** P0 - Blocker  
**Steps:**
1. Add purchase with return deadline = today + 3 days
2. Navigate to Action Today screen

**Expected Result:**
- Item appears in "Return Due Soon" section
- Shows correct deadline date
- Items sorted by deadline (earliest first)

---

### D-05: Action Today - Overdue Items
**Priority:** P0 - Blocker  
**Steps:**
1. Add purchase with return deadline = yesterday
2. Navigate to Action Today screen

**Expected Result:**
- Item appears in "Overdue" section
- Visual distinction for overdue state
- Can still archive/manage item

---

### D-06: Warranty Expiring Soon Filter
**Priority:** P1 - High  
**Steps:**
1. Add purchase with warranty expiry = today + 15 days
2. Navigate to Action Today screen

**Expected Result:**
- Item appears in "Warranty Expiring Soon" section
- Threshold is 30 days
- Sorted by expiry date

---

## E) Notifications

### E-01: Notification Permission Request
**Priority:** P0 - Blocker  
**Steps:**
1. Fresh install
2. Add first purchase with return deadline
3. Observe permission prompt

**Expected Result:**
- System notification permission requested
- App handles both Allow and Deny gracefully
- Permission state saved

---

### E-02: Return Reminder Scheduling
**Priority:** P0 - Blocker  
**Steps:**
1. Enable notifications
2. Add purchase with return deadline in future
3. Check scheduled notifications

**Expected Result:**
- Notification scheduled for 3 days before deadline (default)
- Notification ID stored in purchase record
- Correct title and body text

---

### E-03: Warranty Reminder Scheduling
**Priority:** P0 - Blocker  
**Steps:**
1. Enable notifications
2. Add purchase with warranty expiry in future
3. Check scheduled notifications

**Expected Result:**
- Notification scheduled for 7 days before expiry (default)
- Notification ID stored in purchase record
- Distinct from return reminders

---

### E-04: Cancel Notification on Delete
**Priority:** P1 - High  
**Steps:**
1. Create purchase with scheduled notifications
2. Delete the purchase
3. Verify notifications cancelled

**Expected Result:**
- Scheduled notifications removed
- No orphan notifications fire
- No console errors

---

### E-05: Quiet Hours Respected
**Priority:** P2 - Medium  
**Steps:**
1. Set quiet hours: 10 PM - 8 AM
2. Schedule notification for 11 PM
3. Observe notification delivery

**Expected Result:**
- Notification delayed to next non-quiet period
- Settings properly saved
- No notifications during quiet hours

---

## F) Export Proof Packet

### F-01: Generate Proof Packet - Single Item
**Priority:** P0 - Blocker  
**Steps:**
1. Create purchase with photo attachment
2. Open item details
3. Tap "Export Proof Packet"

**Expected Result:**
- PDF or shareable format generated
- Contains: Item name, store, dates, photo
- Share sheet opens
- File can be saved/shared

---

### F-02: Proof Packet Without Attachment
**Priority:** P1 - High  
**Steps:**
1. Create purchase without photos
2. Export proof packet

**Expected Result:**
- Export still works
- Shows placeholder or "No receipt attached"
- All text data included

---

### F-03: Share Proof Packet
**Priority:** P1 - High  
**Steps:**
1. Generate proof packet
2. Share via email/message
3. Open on another device

**Expected Result:**
- File format compatible (PDF)
- All data readable
- Images embedded correctly

---

## G) Backup Export/Import

### G-01: Full Backup Export
**Priority:** P0 - Blocker  
**Steps:**
1. Create 5+ purchases with attachments
2. Go to Settings > Export Backup
3. Save backup file

**Expected Result:**
- Backup file created (JSON or ZIP)
- Contains all purchases
- Contains all attachments (base64 or included)
- File can be saved to Files app

---

### G-02: Import Backup - Empty State
**Priority:** P0 - Blocker  
**Steps:**
1. Fresh install or empty database
2. Go to Settings > Import Backup
3. Select valid backup file

**Expected Result:**
- All purchases restored
- All attachments restored
- Proper timestamps maintained
- Navigate to Home shows data

---

### G-03: Import Backup - Merge Behavior
**Priority:** P1 - High  
**Steps:**
1. Have existing purchases in app
2. Import backup with different purchases
3. Check merged result

**Expected Result:**
- Existing data preserved
- New items added
- Duplicates handled (by ID)
- No data loss

---

### G-04: Invalid Backup File
**Priority:** P1 - High  
**Steps:**
1. Go to Settings > Import Backup
2. Select invalid file (text, wrong format)

**Expected Result:**
- Error message displayed
- No crash
- Existing data unaffected
- User can try again

---

### G-05: Large Backup (50+ items)
**Priority:** P2 - Medium  
**Steps:**
1. Create backup with 50+ purchases
2. Import on different device
3. Measure time and performance

**Expected Result:**
- Import completes within 30 seconds
- Progress indicator shown
- No timeout or crash
- All data intact

---

## H) Performance & Stability

### H-01: Memory Under Load
**Priority:** P0 - Blocker  
**Steps:**
1. Add 100+ purchases
2. Scroll through Home list rapidly
3. Switch tabs repeatedly
4. Monitor memory (Instruments/Profiler)

**Expected Result:**
- Memory usage stable (< 200MB)
- No memory leaks
- Smooth scrolling (60 FPS)
- No OOM crashes

---

### H-02: Database Query Performance
**Priority:** P1 - High  
**Steps:**
1. Have 500+ purchases in database
2. Open Home screen
3. Search for item
4. Measure response time

**Expected Result:**
- Initial load < 500ms
- Search results < 300ms
- Indexed queries used
- No UI blocking

---

### H-03: Cold Start Time
**Priority:** P0 - Blocker  
**Steps:**
1. Force close app
2. Launch app with stopwatch
3. Measure time to interactive

**Expected Result:**
- iOS: < 2 seconds to interactive
- Android: < 3 seconds to interactive
- Splash screen displays immediately
- No white flash

---

### H-04: Offline Functionality
**Priority:** P0 - Blocker  
**Steps:**
1. Enable airplane mode
2. Add new purchase
3. View existing purchases
4. Navigate all screens

**Expected Result:**
- All local features work
- Data persists correctly
- No network error crashes
- Graceful handling if cloud features exist

---

### H-05: Low Storage Handling
**Priority:** P1 - High  
**Steps:**
1. Fill device storage near capacity
2. Try to add purchase with photo
3. Try to create backup

**Expected Result:**
- Clear error message about storage
- No crash or data corruption
- Existing data preserved
- Suggest clearing space

---

## Test Execution Log

| Test ID | Date | Tester | Device | OS Ver | Status | Notes |
|---------|------|--------|--------|--------|--------|-------|
| A-01 | | | | | | |
| A-02 | | | | | | |
| ... | | | | | | |

---

## Device Matrix

### Required Test Devices

**iOS:**
- iPhone SE (2nd/3rd gen) - smallest screen
- iPhone 14/15 Pro - standard
- iPad (if tablet support claimed)

**Android:**
- Pixel 6/7 - reference device
- Samsung Galaxy (recent) - market leader
- Budget device (2GB RAM) - performance edge case

### OS Versions to Test

**iOS:** 15, 16, 17  
**Android:** 10, 12, 14

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Dev Lead | | | |
| Product | | | |
