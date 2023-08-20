import * as React from 'react';
import {Text, View, Image} from "react-native"
import NetInfo from '@react-native-community/netinfo';
import MainContainer from './navigation/MainContainer';

function App() {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
    <View style={{flex:1, flexDirection:"column", justifyContent:"center", alignItems:"center", backgroundColor:"purple"}}>
      <Image source={require("./assets/image/nointernet.png")}/>
    <Text style={{fontWeight:"bold", fontSize:20, paddingTop:100, color:"white"}}>Oops... Pas de connexion internet</Text>
    </View>
    )
  }

  return <MainContainer />;
}

export default App;
