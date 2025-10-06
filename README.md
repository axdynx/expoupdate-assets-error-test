# Expo Asset + Expo Updates Bug Reproduction Test

## 🐛 Bug Description

This test application demonstrates a critical bug in the interaction between `expo-asset` and `expo-updates` when loading HTML files through OTA (Over-The-Air) updates.

### The Bug Scenario:

1. **Initial Build**: Create a build with HTML assets - everything works correctly ✅
2. **Modify HTML File**: Update `PROCES_VERBAL_INTERVENTION.html` content and publish an OTA update
3. **Asset Loading Fails**: After the update, the HTML file becomes inaccessible through `Asset.fromModule()` ❌
4. **Restore Original**: Revert the HTML file to its original state and publish another update
5. **Asset Loading Works Again**: The file becomes accessible again ✅

### Additional Observations:

- The bug can also occur **WITHOUT modifying the file** when dealing with larger/heavier HTML files
- The issue appears to be related to asset caching and update mechanisms between expo-asset and expo-updates
- The problem is reproducible and affects production applications using OTA updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Expo CLI
- EAS CLI (`npm install -g @expo/eas-cli`)

### Installation
```bash
npm install
```

### Testing the Bug

#### 1. Create Initial Build
```bash
# Android
npm run test-build android

# iOS  
npm run test-build ios
```

#### 2. Test Asset Loading (Should Work)
- Open the app
- Select "PROCES_VERBAL_INTERVENTION" document
- Click "🔄 Load HTML File" - should work ✅

#### 3. Modify HTML File and Publish Update
- Edit `assets/html/PROCES_VERBAL_INTERVENTION.html`
- Add/modify content
- Publish OTA update:
```bash
npm run test-update
```

#### 4. Test Asset Loading After Update (Bug Reproduction)
- Force close and restart the app
- Try to load the same document - should fail ❌
- Check debug info to see asset loading errors

#### 5. Restore Original File and Update
- Revert `PROCES_VERBAL_INTERVENTION.html` to original state
- Publish another update:
```bash
npm run test-update
```

#### 6. Verify Fix
- Restart the app
- Test loading again - should work ✅

## 📱 App Features

### Main Interface
- **Document Selector**: Choose between available HTML documents
- **Load HTML File**: Test asset loading with detailed error reporting
- **Fetch OTA Update**: Manually trigger update checks
- **Debug Information**: Real-time display of:
  - Expo Updates information (Update ID, channel, etc.)
  - Asset object details (URI, hash, download status)
  - Error messages in JSON format
  - HTML content preview

### Debug Capabilities
- Complete asset object inspection
- Detailed error reporting with JSON.stringify
- Update status and metadata display
- Console logging for development analysis

## 🔧 Technical Details

### Key Components
- `app/(tabs)/index.tsx`: Main test interface
- `app/Functions.tsx`: Asset loading logic and error handling
- `assets/html/`: Test HTML files including the problematic `PROCES_VERBAL_INTERVENTION.html`

### Asset Loading Method
```typescript
const ImportedAsset = await Asset.fromModule(selectedFile[1]);
const asset = await ImportedAsset.downloadAsync();
const response = await fetch(asset.localUri || asset.uri);
const content = await response.text();
```

### Error Detection
The app captures and displays comprehensive error information:
- Asset loading failures
- URI/LocalURI accessibility issues
- Network fetch errors
- Update status anomalies

## 📋 Reproduction Steps

1. **Setup**: Install dependencies and configure EAS
2. **Initial Build**: Create a production build
3. **Baseline Test**: Verify all HTML assets load correctly
4. **Modify Asset**: Change content in `PROCES_VERBAL_INTERVENTION.html`
5. **Publish Update**: Deploy OTA update with modified asset
6. **Reproduce Bug**: Observe asset loading failure
7. **Restore Asset**: Revert to original HTML content
8. **Publish Fix**: Deploy another OTA update
9. **Verify Resolution**: Confirm asset loading works again

## 🎯 Expected vs Actual Behavior

### Expected Behavior
- HTML assets should remain accessible after OTA updates regardless of content changes
- `Asset.fromModule()` should consistently resolve asset URIs
- File content updates should not break asset loading mechanisms

### Actual Behavior
- Modified HTML assets become inaccessible after OTA updates
- Asset loading fails with URI/localURI errors
- Restoring original content fixes the issue
- Larger HTML files may trigger the bug even without modifications

## 📊 Environment

- **Expo SDK**: ~54.0.12
- **expo-asset**: ^11.1.7
- **expo-updates**: ^29.0.12
- **React Native**: Latest compatible version
- **EAS Build/Update**: Latest

## 🤝 Contributing

This is a bug reproduction test case. When testing:

1. Follow the exact reproduction steps
2. Document any variations in behavior
3. Include device/platform information
4. Capture console logs and error messages
5. Note timing between updates and testing

The goal is to provide a clear, reproducible case for the Expo team to investigate the interaction between expo-asset and expo-updates.
