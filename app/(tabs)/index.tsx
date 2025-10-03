import { Image } from 'expo-image';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { getHtmlDocuments, loadHtmlAsset } from '@/app/Functions';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<string>('sample1'); // Nom du document sélectionné
  async function onFetchUpdateAsync() {
    if (__DEV__) {
      Alert.alert('Expo Update', 'You are running in development mode, no updates are available.');
      return;
    }
    setIsUpdating(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert('Expo Update', 'No update available.');
      }
    } catch (error) {
      Alert.alert('Expo Update Error', `Error fetching latest Expo update: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  }
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const handleLoadHtmlAsset = () => {
    loadHtmlAsset(selectedDocument, setIsLoading, setHtmlContent, setErrorText, setUpdateInfo);
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
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🧪 Expo Asset & OTA Update Test</ThemedText>
        <ThemedText>
          Use the buttons below to test asset loading and OTA updates.
        </ThemedText>
        
        <View style={styles.selectorContainer}>
          <ThemedText style={styles.selectorLabel}>Select document:</ThemedText>
          <View style={styles.selectorButtons}>
            {getHtmlDocuments().map((name) => (
              <Pressable
                key={name}
                style={[
                  styles.selectorButton,
                  selectedDocument === name && styles.selectorButtonActive
                ]}
                onPress={() => setSelectedDocument(name)}
              >
                <ThemedText style={[
                  styles.selectorButtonText,
                  selectedDocument === name && styles.selectorButtonTextActive
                ]}>
                  {name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={{ marginVertical: 8 }}>
          <Pressable
            style={[styles.testButton, isLoading && styles.buttonDisabled]}
            onPress={handleLoadHtmlAsset}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? '⏳ Loading asset...' : '🚀 Load HTML Asset'}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.testButton, isUpdating && styles.buttonDisabled]}
            onPress={onFetchUpdateAsync}
            disabled={isUpdating}
          >
            <ThemedText style={styles.buttonText}>
              {isUpdating ? '⏳ Updating...' : '🔄 Fetch OTA Update'}
            </ThemedText>
          </Pressable>
        </View>
        
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
            <ThemedText style={styles.htmlContent}>
              {htmlContent}
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
  selectorContainer: {
    marginVertical: 12,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectorButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectorButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectorButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
