# Expo Asset + Expo Updates Bug Test Documentation

## 🎯 Objective

Demonstrate and reproduce a critical bug in the interaction between `expo-asset` and `expo-updates` where HTML assets become inaccessible after OTA updates under specific conditions.

## 🐛 Bug Summary

**Issue**: HTML assets loaded via `Asset.fromModule()` become inaccessible after OTA updates when the asset content has been modified, and can also occur with larger HTML files even without modifications.

**Impact**: Production applications using OTA updates may experience asset loading failures, breaking functionality that depends on HTML file assets.

**Reproducibility**: 100% reproducible following the outlined steps.

## 📋 Detailed Reproduction Steps

### Phase 1: Initial Setup and Baseline Testing

1. **Environment Preparation**
   ```bash
   npm install
   eas login
   ```

2. **Create Production Build**
   ```bash
   # For Android
   npm run test-build android
   
   # For iOS
   npm run test-build ios
   ```

3. **Install and Baseline Test**
   - Install the built app on device/simulator
   - Open the application
   - Select "PROCES_VERBAL_INTERVENTION" from document selector
   - Click "🔄 Load HTML File"
   - **Expected Result**: ✅ File loads successfully, content displays properly
   - **Verify**: Debug info shows valid asset object with URI/localURI

### Phase 2: Bug Reproduction - Content Modification

4. **Modify HTML Asset**
   - Edit `assets/html/PROCES_VERBAL_INTERVENTION.html`
   - Add new content, for example:
     ```html
     <p>MODIFIED CONTENT - This change will trigger the bug</p>
     <div>Additional content to test asset loading after update</div>
     ```
   - Save the file

5. **Publish OTA Update**
   ```bash
   npm run test-update
   ```
   - Wait for update to be published successfully
   - Note the update ID from console output

6. **Test Asset Loading After Update**
   - Force close the app completely
   - Reopen the app
   - Wait for OTA update to be applied (check update info in app)
   - Try to load "PROCES_VERBAL_INTERVENTION" document
   - Click "🔄 Load HTML File"
   - **Expected Result**: ❌ **BUG OCCURS** - Asset loading fails
   - **Symptoms**:
     - Error messages about invalid URI/localURI
     - Asset object shows incorrect or missing paths
     - Fetch requests fail
     - Console shows asset loading errors

### Phase 3: Bug Resolution - Content Restoration

7. **Restore Original Content**
   - Revert `assets/html/PROCES_VERBAL_INTERVENTION.html` to its original state:
     ```html
     <!DOCTYPE html>
     <html>
     <head>
         <title>Sample 1 HTML File</title>
     </head>
     <body>
         <h1>Sample 1 Document</h1>
         <p>This is a simple HTML file for testing expo-asset with expo-updates.</p>
         <p>Content: Sample 1</p>
         <div>
             <h2>Test Section</h2>
             <p>This document contains basic HTML elements.</p>
             <strong>Bold text example</strong>
             <em>Italic text example</em>
         </div>
         <p>Last updated: October 2025</p>
     </body>
     </html>
     ```

8. **Publish Recovery Update**
   ```bash
   npm run test-update
   ```

9. **Verify Bug Resolution**
   - Force close and reopen app
   - Wait for update to apply
   - Test loading "PROCES_VERBAL_INTERVENTION" document
   - **Expected Result**: ✅ Asset loading works again

### Phase 4: Alternative Bug Trigger - Large File Testing

10. **Test with Larger HTML Files**
    - Replace `PROCES_VERBAL_INTERVENTION.html` with a larger HTML file (>50KB)
    - Publish update: `npm run test-update`
    - Test asset loading
    - **Observation**: Bug may occur even without content modifications

## 🔍 Debugging Information

### Key Debug Points

1. **Asset Object Analysis**
   - Check `asset.uri` vs `asset.localUri`
   - Verify `asset.downloaded` status
   - Examine `asset.hash` for consistency
   - Monitor `asset.name` and path resolution

2. **Update Information Tracking**
   - Update ID before and after OTA updates
   - Channel information
   - `Updates.isEmbeddedLaunch` status
   - Bundle vs update execution context

3. **Error Pattern Recognition**
   ```javascript
   // Common error patterns:
   "Asset has no valid URI"
   "Asset.loadAsync() returned no assets"
   "fetch() network request failed"
   "localUri is null or undefined"
   ```

### Console Output Analysis

**Before Bug (Working State)**:
```
🚀 Loading HTML file with Asset.fromModule()...
🚀 Imported asset: [Object with valid URI/localURI]
✅ Asset loaded: { uri: "valid_path", localUri: "valid_local_path", downloaded: true }
📄 HTML content loaded, length: [positive_number]
```

**During Bug (Failing State)**:
```
🚀 Loading HTML file with Asset.fromModule()...
🚀 Imported asset: [Object with invalid/missing URI]
❌ Error loading HTML file: Asset has no valid URI
```

## 📊 Expected vs Actual Behavior

### Expected Behavior
- HTML assets should remain accessible after any OTA update
- Content modifications should not affect asset loading mechanisms
- `Asset.fromModule()` should consistently resolve asset paths
- File size should not impact asset accessibility

### Actual Behavior
- Modified HTML assets become inaccessible after OTA updates
- Asset URI/localURI resolution fails
- Larger files may trigger the issue independently
- Reverting content fixes the problem

## 🔧 Technical Analysis

### Suspected Root Cause
The bug likely stems from:
1. **Asset Caching Issues**: Modified assets may not update cache references properly
2. **URI Resolution Problems**: Asset path mapping becomes corrupted during updates
3. **Hash Mismatch**: Content changes may cause hash validation failures
4. **Bundle vs Update Context**: Asset loading behavior differs between embedded and updated contexts

### Code Flow Analysis
```typescript
// The failing flow:
Asset.fromModule(require('@/assets/html/PROCES_VERBAL_INTERVENTION.html'))
  → Returns asset object with invalid URI references
  → downloadAsync() fails or returns invalid asset
  → fetch(asset.localUri || asset.uri) fails
  → Content loading impossible
```

## 🚨 Impact Assessment

### Severity: **High**
- **Production Impact**: Can break critical app functionality
- **User Experience**: Features dependent on HTML assets become unusable
- **Recovery**: Requires specific workarounds (content restoration + update)

### Affected Scenarios
1. Documentation readers loading HTML help files
2. Legal/terms content display from HTML assets
3. Dynamic content systems using HTML templates
4. Offline HTML content caching systems

## 🎯 Testing Checklist

- [ ] Initial build deploys successfully
- [ ] Baseline asset loading works pre-update
- [ ] HTML content modification triggers the bug
- [ ] Error messages are captured and analyzed
- [ ] Debug information confirms asset object corruption
- [ ] Content restoration resolves the issue
- [ ] Large file testing reproduces alternative trigger
- [ ] Console logs document the complete failure flow

## 📝 Reporting Template

When reporting this bug to Expo team, include:

1. **Reproduction Steps**: Complete step-by-step process
2. **Environment Details**: SDK versions, platform information
3. **Asset Object Dumps**: Before/after JSON representations
4. **Console Logs**: Complete debug output from both states
5. **Update IDs**: Specific update identifiers for tracking
6. **File Samples**: Original and modified HTML content
7. **Timing Information**: When the bug occurs in the update cycle

## 🔄 Continuous Testing

For ongoing verification:
1. Automate the reproduction steps
2. Test with various HTML file sizes
3. Try different types of content modifications
4. Test across different devices and platforms
5. Document any variations in behavior

This test case provides a reliable foundation for investigating and resolving the expo-asset + expo-updates interaction bug.

## Logs to Monitor
- ✅ Asset URI
- ✅ Download status
- ❌ Fetch errors
- ❌ Permission errors

## Tested Versions
- Expo SDK: ~54.0.12
- expo-asset: ^11.1.7
- expo-updates: ^29.0.12

## Potential Solutions
1. Use another method to load static assets
2. Check permissions after OTA updates
3. Force asset re-download after an update