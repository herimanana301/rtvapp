import * as React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';

export default function BluePix({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
         <Image source={require('../../assets/image/loading.gif')}/>
          <Text style={{ marginTop: 10 }}>Chargement...</Text>
        </View>
      )}
      <WebView
        source={{ uri: 'https://bluepix.fr' }}
        style={{ flex: 1 }}
        onLoadEnd={handleLoadEnd}
      />
    </View>
  );
}
