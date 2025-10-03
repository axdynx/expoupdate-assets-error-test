import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const loadHtmlAsset = async () => {
    setErrorText('');
    try {
      setIsLoading(true);
      console.log('🚀 Loading HTML file with Asset.fromModule()...');
      // Update information
      const updateStatus = await Updates.checkForUpdateAsync();
      const currentUpdate = Updates.updateId || 'Development';
      const channel = Updates.channel || 'Development';
      const debugInfo = `\n📱 Expo Updates Information:\n- Update ID: ${currentUpdate}\n- Channel: ${channel}\n- Update available: ${updateStatus.isAvailable ? 'Yes' : 'No'}\n- Running from bundle: ${Updates.isEmbeddedLaunch ? 'Yes' : 'No'}\n`;
      setUpdateInfo(debugInfo);
      console.log(debugInfo);
      // Using expo-asset fromModule() function to load HTML file
      const asset = Asset.fromModule(require('@/assets/html/sample2.html'));
      await asset.downloadAsync();
      console.log('✅ Asset loaded:', {
        uri: asset.uri,
        localUri: asset.localUri,
        downloaded: asset.downloaded,
        hash: asset.hash,
        name: asset.name
      });
      // Read file content
      const response = await fetch(asset.localUri || asset.uri);
      const content = await response.text();
      setHtmlContent(content);
      setErrorText('');
      console.log('📄 HTML content loaded, length:', content.length);
      Alert.alert(
        'Asset Test Successful!', 
        `HTML file loaded successfully!\nSize: ${content.length} characters\nURI: ${asset.uri}\n\nUpdate ID: ${currentUpdate}`
      );
    } catch (error) {
      console.error('❌ Error loading HTML file:', error);
      setHtmlContent('');
      setErrorText(typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error));
      Alert.alert(
        'Asset Test Error', 
        `Loading failed: ${typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error)}\n\nThis may indicate a bug with expo-asset and expo-updates!\n\nUpdate ID: ${Updates.updateId || 'Development'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🧪 Test Expo Asset + Updates</ThemedText>
        <ThemedText>
          This test loads an HTML file with expo-asset to detect bugs with expo-updates.
        </ThemedText>
        
        <Pressable
          style={[styles.testButton, isLoading && styles.buttonDisabled]}
          onPress={loadHtmlAsset}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? '⏳ Loading...' : '🚀 Test Asset.fromModule()'}
          </ThemedText>
        </Pressable>
        
        {updateInfo && (
          <ThemedView style={styles.debugInfo}>
            <ThemedText style={styles.debugText}>
              {updateInfo}
            </ThemedText>
          </ThemedView>
        )}
        
        {htmlContent && (
          <ThemedView style={styles.htmlPreview}>
            <ThemedText type="defaultSemiBold">HTML content loaded:</ThemedText>
            <ThemedText style={styles.htmlContent} numberOfLines={10}>
              {htmlContent.substring(0, 500)}...
            </ThemedText>
          </ThemedView>
        )}
        {errorText && (
          <ThemedView style={styles.htmlPreview}>
            <ThemedText type="defaultSemiBold">Error:</ThemedText>
            <ThemedText style={styles.htmlContent} numberOfLines={10}>
              {errorText}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#888',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  htmlPreview: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  htmlContent: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#333',
    marginTop: 8,
  },
  debugInfo: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#b3d9e6',
  },
  debugText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    color: '#2c5282',
  },
});
