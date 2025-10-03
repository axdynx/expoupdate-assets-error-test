import { Asset } from 'expo-asset';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const ImportDocuments = {
  "sample1": require('@/assets/html/sample1.html'),
  "sample2": require('@/assets/html/sample2.html')
}

export const loadHtmlAsset = async (
  selectedDocument: string,
  setIsLoading: (loading: boolean) => void,
  setHtmlContent: (content: string) => void,
  setErrorText: (error: string) => void,
  setUpdateInfo: (info: string) => void
) => {
  setErrorText('');
  try {
    setIsLoading(true);
    console.log('🚀 Loading HTML file with Asset.fromModule()...');
    // Update information
    const updateStatus = __DEV__ ? false : (await Updates.checkForUpdateAsync()).isAvailable;
    const currentUpdate = Updates.updateId || 'Development';
    const channel = Updates.channel || 'Development';
    const debugInfo = `\n📱 Expo Updates Information:\n- Update ID: ${currentUpdate}\n- Channel: ${channel}\n- Update available: ${updateStatus ? 'Yes' : 'No'}\n- Running from bundle: ${Updates.isEmbeddedLaunch ? 'Yes' : 'No'}\n`;
    setUpdateInfo(debugInfo);
    console.log(debugInfo);
    // Using expo-asset fromModule() function to load selected HTML file
    const selectedFile = Object.entries(ImportDocuments).find(d => d[0] == selectedDocument);
    if (!selectedFile) {
      throw new Error('Selected document not found.');
    }
    const asset = await Asset.loadAsync(selectedFile[1]);
    if (!asset || asset.length === 0) {
      throw new Error('Asset.loadAsync() returned no assets.');
    }
    // asset is an array when using loadAsync
    const [firstAsset] = asset;
    if (!firstAsset.localUri && !firstAsset.uri) {
      throw new Error('Asset has no valid URI.');
    }
    // Ensure asset is downloaded
    await firstAsset.downloadAsync();
    // Log asset details
    console.log('✅ Asset loaded:', {
      uri: firstAsset.uri,
      localUri: firstAsset.localUri,
      downloaded: firstAsset.downloaded,
      hash: firstAsset.hash,
      name: firstAsset.name
    });
    // Read file content
    const response = await fetch(firstAsset.localUri || firstAsset.uri);
    const content = await response.text();
    setHtmlContent(content);
    setErrorText('');
    console.log('📄 HTML content loaded, length:', content.length);
    Alert.alert(
      'Asset Test Successful!', 
      `HTML file loaded successfully!\nSize: ${content.length} characters\nURI: ${firstAsset.uri}\n\nUpdate ID: ${currentUpdate}`
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

export const getHtmlDocuments = () => {
  return Object.entries(ImportDocuments).map(([name, uri]) => name);
}

export { ImportDocuments };

