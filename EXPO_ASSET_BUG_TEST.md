# Expo Asset + Expo Updates Bug Test

## Problem Description
This test demonstrates a potential bug between `expo-asset` and `expo-updates` when using the `Asset.fromModule()` function to load asset files after an OTA update.

## Test Files
- **HTML test file**: `assets/html/sample2.html`
- **Test code**: `app/(tabs)/index.tsx`

## How to Reproduce the Bug

### Step 1: Local Testing
1. Start the application in development mode
2. Click the "🚀 Test Asset.fromModule()" button
3. Verify that the HTML file loads correctly
4. Observe the logs in the console

### Step 2: Testing with Expo Updates
1. Create a production build with EAS:
   ```bash
   npm run test-build android   # Android only
   npm run test-build ios       # iOS only
   npm run test-build           # All platforms
   ```
2. Install the app on your device/emulator and test that the asset loading feature works as expected (click the "🚀 Test Asset.fromModule()" button and verify the HTML loads correctly).
3. Publish an OTA update:
   ```bash
   npm run test-update android  # Android only
   npm run test-update ios      # iOS only
   npm run test-update          # All platforms
   ```
4. Apply the update on your device/emulator and test the asset loading feature again. You should observe that it no longer works as expected.

### Expected Behavior
- The HTML file should load correctly before and after OTA updates
- `Asset.fromModule()` should return the correct URI of the file
- File content should be accessible via fetch

### Observed Behavior (if bug exists)
- HTML file loading may fail after an OTA update

## Test Code

```typescript
const asset = Asset.fromModule(require('@/assets/html/sample2.html'));
await asset.downloadAsync();
const response = await fetch(asset.localUri || asset.uri);
const content = await response.text();
```

## Logs to Monitor
- ✅ Asset URI
- ✅ Download status
- ❌ Fetch errors
- ❌ Permission errors

## Tested Versions
- Expo SDK: ~54.0.12
- expo-asset: ^12.0.9
- expo-updates: ^29.0.12

## Potential Solutions
1. Use another method to load static assets
2. Check permissions after OTA updates
3. Force asset re-download after an update