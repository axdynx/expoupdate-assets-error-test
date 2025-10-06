import { Asset } from 'expo-asset';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const ImportDocuments = {
  "sample1": require('@/assets/html/PROCES_VERBAL_INTERVENTION.html'),
  "sample2": require('@/assets/html/sample2.html')
}

export const loadHtmlAsset = async (
  selectedDocument: string,
  setIsLoading: (loading: boolean) => void,
  setHtmlContent: (content: string) => void,
  setErrorText: (error: string) => void,
  setUpdateInfo: (info: string) => void,
  setAssetDebugInfo: (info: string) => void
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
    const ImportedAsset = await Asset.fromModule(selectedFile[1]);

    console.log('🚀 Imported asset:', ImportedAsset);
    setAssetDebugInfo(JSON.stringify(ImportedAsset, null, 2));

    const asset = await ImportedAsset.downloadAsync();
    
    // Debug: Display asset object as JSON
    setAssetDebugInfo(JSON.stringify(asset, null, 2));
    console.log('🔍 Asset debug info:', JSON.stringify(asset, null, 2));
    
    if (!asset) {
      throw new Error('Asset.loadAsync() returned no assets.');
    }
    // asset is an array when using loadAsync
    if (!asset.localUri && !asset.uri) {
      throw new Error('Asset has no valid URI.');
    }
    // Ensure asset is downloaded
    await asset.downloadAsync();
    // Log asset details
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

export const getHtmlDocuments = () => {
  return Object.entries(ImportDocuments).map(([name, uri]) => name);
}

export { ImportDocuments };

