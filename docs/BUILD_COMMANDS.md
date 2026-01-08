# Build Commands - Warranty Locker

**Version:** 1.0.0  
**Last Updated:** 2026-01-08

---

## Prerequisites

### Required Tools

```bash
# Node.js (18+ recommended)
node --version

# npm (comes with Node.js)
npm --version

# Expo CLI (global install optional, npx works)
npx expo --version

# EAS CLI (required for builds)
npm install -g eas-cli
eas --version

# Login to Expo account
eas login
```

### Environment Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd warranty-locker
npm install

# Verify Expo config
npx expo config --type public
```

---

## Local Development

### Start Development Server

```bash
# Start Expo dev server (all platforms)
npm run start
# OR
npx expo start

# iOS Simulator (macOS only)
npm run ios
# OR
npx expo start --ios

# Android Emulator
npm run android
# OR
npx expo start --android

# Web (for quick testing)
npm run web
# OR
npx expo start --web
```

### Development Options

```bash
# Clear cache and start fresh
npx expo start --clear

# Start with tunnel (for physical devices on different network)
npx expo start --tunnel

# Start in offline mode
npx expo start --offline

# Specific port
npx expo start --port 8082
```

### Local Device Testing

```bash
# Run on connected iOS device
npx expo run:ios --device

# Run on connected Android device
npx expo run:android --device
```

---

## EAS Build Commands

### Project Setup (First Time Only)

```bash
# Initialize EAS in project
eas build:configure

# This creates eas.json with build profiles
```

### eas.json Configuration

Create or update `eas.json` in project root:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "__DEV__": "true"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "__DEV__": "false"
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "__DEV__": "false"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## iOS Builds

### Development Build (Simulator)

```bash
# Build for iOS Simulator (dev client)
eas build --profile development --platform ios

# Build for specific simulator
eas build --profile development --platform ios --local
```

### Preview Build (TestFlight Internal)

```bash
# Build for internal testing (AdHoc distribution)
eas build --profile preview --platform ios

# With specific build number
eas build --profile preview --platform ios --build-number 42
```

### Production Build (App Store)

```bash
# Build for App Store submission
eas build --profile production --platform ios

# Auto-submit to App Store after build
eas build --profile production --platform ios --auto-submit
```

### iOS-Specific Options

```bash
# Clear credentials and reconfigure
eas credentials --platform ios

# Use existing provisioning profile
eas build --profile production --platform ios --skip-credentials-check

# Local build (requires macOS + Xcode)
eas build --profile production --platform ios --local
```

---

## Android Builds

### Development Build (APK)

```bash
# Build development APK
eas build --profile development --platform android

# Install on connected device after build
eas build --profile development --platform android && \
  adb install path/to/build.apk
```

### Preview Build (APK for Testing)

```bash
# Build preview APK for QA team
eas build --profile preview --platform android

# With specific version code
eas build --profile preview --platform android --build-number 42
```

### Production Build (AAB for Play Store)

```bash
# Build Android App Bundle for Play Store
eas build --profile production --platform android

# Auto-submit to Google Play
eas build --profile production --platform android --auto-submit
```

### Android-Specific Options

```bash
# Configure keystore
eas credentials --platform android

# Local build (requires Android Studio + SDK)
eas build --profile production --platform android --local

# Generate APK instead of AAB for production
# (modify eas.json: "buildType": "apk")
```

---

## Both Platforms

### Build Both Simultaneously

```bash
# Development builds
eas build --profile development --platform all

# Preview builds
eas build --profile preview --platform all

# Production builds
eas build --profile production --platform all
```

---

## Build Status & Downloads

### Check Build Status

```bash
# List recent builds
eas build:list

# View specific build
eas build:view <build-id>

# View build logs
eas build:view <build-id> --logs
```

### Download Build Artifacts

```bash
# Download latest build
eas build:download --latest

# Download specific platform
eas build:download --platform ios --latest
eas build:download --platform android --latest

# Download specific build
eas build:download --build-id <build-id>
```

---

## Submission Commands

### Submit to App Store

```bash
# Submit latest iOS build
eas submit --platform ios --latest

# Submit specific build
eas submit --platform ios --id <build-id>
```

### Submit to Google Play

```bash
# Submit latest Android build
eas submit --platform android --latest

# Submit to specific track
eas submit --platform android --latest --track internal
eas submit --platform android --latest --track alpha
eas submit --platform android --latest --track beta
eas submit --platform android --latest --track production
```

---

## OTA Updates (EAS Update)

### Configure Updates

```bash
# Initialize EAS Update
eas update:configure

# Create update branch
eas branch:create production
eas branch:create preview
```

### Publish Updates

```bash
# Publish to preview channel
eas update --branch preview --message "Bug fix for..."

# Publish to production channel
eas update --branch production --message "Hotfix v1.0.1"

# Publish with auto-message from git
eas update --branch production --auto
```

---

## Useful Combinations

### Full RC0 Build Pipeline

```bash
# 1. Clean install
rm -rf node_modules
npm install

# 2. Type check
npx tsc --noEmit

# 3. Build both platforms for preview
eas build --profile preview --platform all

# 4. After QA approval, production builds
eas build --profile production --platform all

# 5. Submit to stores
eas submit --platform all --latest
```

### Quick Development Iteration

```bash
# Start dev server with clear cache
npx expo start --clear --tunnel
```

---

## Troubleshooting

### Common Issues

```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules && npm install

# Reset iOS build folder (local builds)
rm -rf ios/build

# Reset Android build folder (local builds)
rm -rf android/build android/app/build

# Fix EAS authentication
eas logout && eas login
```

### Build Logs

```bash
# View full build logs
eas build:view <build-id> --logs

# Stream logs during build
eas build --profile <profile> --platform <platform> --no-wait
eas build:view <build-id> --logs --wait
```

---

## Environment Variables

Set in `eas.json` under `env` or use EAS Secrets:

```bash
# Set build secret
eas secret:create --name API_KEY --value "xxx" --scope project

# List secrets
eas secret:list

# Delete secret
eas secret:delete --name API_KEY
```

---

## Version Management

### Update Version Numbers

In `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

### Auto-increment Build Numbers

```bash
# Auto-increment during build
eas build --profile production --platform ios --auto-increment
eas build --profile production --platform android --auto-increment
```
