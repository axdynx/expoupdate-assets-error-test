# Expo Asset + Updates Bug Test App 🧪

This is a test application designed to reproduce and demonstrate bugs between `expo-asset` and `expo-updates` when loading static assets after OTA updates.

## Problem Statement

When using `Asset.fromModule()` to load static files (like HTML files) in an Expo application with OTA updates enabled, there may be issues where assets fail to load correctly after an update is applied.

## Test Setup

This project includes:
- A simple React Native app with Expo Router
- An HTML test file (`assets/html/sample2.html`)
- A test interface to load and display the HTML content
- Debugging information about Expo Updates status

## Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm run start
   ```

   Or use the test helper:

   ```bash
   npm run test-asset-bug start
   ```

3. Build for a specific platform (optional):

   ```bash
   npm run test-build android   # Android only
   npm run test-build ios       # iOS only
   npm run test-build           # All platforms
   ```

4. Publish OTA update for a specific platform (optional):

   ```bash
   npm run test-update android  # Android only
   npm run test-update ios      # iOS only
   npm run test-update          # All platforms
   ```

5. Open the app and navigate to the "Home" tab

6. Click the "🚀 Test Asset.fromModule()" button to test asset loading

## Testing the Bug

### Development Testing
1. Run the app in development mode
2. Test the asset loading functionality
3. Verify that HTML content loads correctly

### Production Testing
1. Build the app for production:
   ```bash
   npm run test-build
   ```

2. Publish an initial update:
   ```bash
   npm run test-update
   ```

3. Install the app on a device/emulator

4. Make changes to the HTML file or app code

5. Publish another update and test asset loading again

## Test Scripts

- `npm run test-asset-bug` - Show available commands
- `npm run test-asset-bug info` - Display project information
- `npm run test-asset-bug start` - Start development server
- `npm run test-build [android|ios]` - Build for production testing (optionally only android or ios)
- `npm run test-update [android|ios]` - Publish OTA update (optionally only android or ios)

## What to Look For

### Successful Case ✅
- HTML file loads without errors
- Asset URI is accessible
- Content is displayed correctly
- No fetch errors in console

### Bug Case ❌
- Asset loading fails after OTA update


## Debug Information

The test interface displays:
- Current Expo Updates information
- Asset loading status
- File content preview
- Error messages with debugging details

## Files Structure

```
assets/
  html/
    sample2.html          # Test HTML file
app/
  (tabs)/
    index.tsx            # Main test interface
scripts/
  test-asset-bug.js      # Test automation script
EXPO_ASSET_BUG_TEST.md   # Detailed test documentation
```

## Dependencies

- `expo-asset`: Asset loading functionality
- `expo-updates`: OTA update system
- `expo-router`: Navigation system

## Learn More

For detailed test procedures and troubleshooting, see [EXPO_ASSET_BUG_TEST.md](./EXPO_ASSET_BUG_TEST.md).

## Reporting Issues

When reporting issues, please include:
- Expo SDK version
- Platform (iOS/Android/Web)
- Device/emulator information
- Console logs from the test
- Steps taken before the issue occurred

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
