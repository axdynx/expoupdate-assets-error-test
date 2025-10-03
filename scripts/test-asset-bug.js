#!/usr/bin/env node

/**
 * Automated test script to reproduce Expo Asset + Updates bug
 * 
 * This script facilitates testing by automating certain steps
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Expo Asset + Updates Bug Test Script');
console.log('=======================================\n');

// Check that we are in the correct directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Make sure you are in the project directory.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📦 Project: ${packageJson.name}`);
console.log(`🏷️  Version: ${packageJson.version}\n`);

// Check important dependencies
const requiredDeps = ['expo-asset', 'expo-updates'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.error(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required dependencies are present:');
requiredDeps.forEach(dep => {
  console.log(`   - ${dep}: ${packageJson.dependencies[dep]}`);
});
console.log('');

// Check that the HTML test file exists
const htmlTestFile = path.join(process.cwd(), 'assets', 'html', 'sample2.html');
if (!fs.existsSync(htmlTestFile)) {
  console.error('❌ Error: HTML test file missing: assets/html/sample2.html');
  process.exit(1);
}

console.log('✅ HTML test file found');
console.log('');

// Script options
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'start':
    console.log('🚀 Starting development server...');
    try {
      execSync('expo start', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Error starting server:', error.message);
    }
    break;

  case 'build':
          case 'build': {
            // Usage: node scripts/test-asset-bug.js build [android|ios]
            const platform = args[1] === 'android' || args[1] === 'ios' ? args[1] : 'all';
            console.log(`🏗️  Building project for ${platform === 'all' ? 'all platforms' : platform}...`);
            try {
              execSync(`eas build --platform ${platform} --profile preview`, { stdio: 'inherit' });
            } catch (error) {
              console.error('❌ Error during build:', error.message);
              console.log('💡 Make sure you have configured EAS CLI: npm install -g @expo/eas-cli && eas login');
            }
            break;
          }

          case 'update': {
            // Usage: node scripts/test-asset-bug.js update [android|ios]
            const platform = args[1] === 'android' || args[1] === 'ios' ? args[1] : undefined;
            console.log(`📱 Publishing OTA update${platform ? ' for ' + platform : ''}...`);
            try {
              let cmd = 'eas update --branch main --message "Test update for asset bug"';
              if (platform) {
                cmd += ` --platform ${platform}`;
              }
              execSync(cmd, { stdio: 'inherit' });
            } catch (error) {
              console.error('❌ Error during update:', error.message);
            }
            break;
          }

  case 'info':
    console.log('ℹ️  Project information:');
    console.log('------------------------');
    console.log(`Name: ${packageJson.name}`);
    console.log(`Version: ${packageJson.version}`);
    console.log(`Expo SDK: ${packageJson.dependencies.expo}`);
    console.log(`Expo Asset: ${packageJson.dependencies['expo-asset']}`);
    console.log(`Expo Updates: ${packageJson.dependencies['expo-updates']}`);
    console.log('');
    console.log('📁 Test files:');
    console.log('   ✅ app/(tabs)/index.tsx - Test code');
    console.log('   ✅ assets/html/sample2.html - HTML test file');
    console.log('   ✅ EXPO_ASSET_BUG_TEST.md - Test documentation');
    break;

  default:
    console.log('📋 Available commands:');
    console.log('----------------------');
    console.log('node scripts/test-asset-bug.js start   - Start development server');
  console.log('node scripts/test-asset-bug.js build [android|ios]   - Build for production testing (optionally only android or ios)');
  console.log('node scripts/test-asset-bug.js update [android|ios]  - Publish OTA update (optionally only android or ios)');
    console.log('node scripts/test-asset-bug.js info    - Show project information');
    console.log('');
    console.log('📖 Test instructions:');
    console.log('1. Start with "start" to test in development');
    console.log('2. Use "build" to create a production build');
    console.log('3. Use "update" to test OTA updates');
    console.log('');
    console.log('📚 See EXPO_ASSET_BUG_TEST.md for more details');
    break;
}