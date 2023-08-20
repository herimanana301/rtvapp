import * as React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RadioScreenTest({ navigation }) {
  const playerRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [streamTitle, setStreamTitle] = React.useState('');
  const [imageRadio, setImageRadio] = React.useState('')
  const [auditeur, setAuditeur] = React.useState('')


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const fetchStreamTitle = async () => {
    try {
      const response = await fetch('http://102.16.44.51:8000/status-json.xsl');
      const data = await response.json();
      setStreamTitle(data.icestats.source[1].title);
      setAuditeur(data.icestats.source[0].listeners)
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchStreamTitle();
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStreamTitle();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop : 100}}>
          {imageRadio.length<1?
            <Image source={require("../../assets/image/radio.png")} style={{ width: 220, height: 220, borderRadius: 10}} />
          :
          <Image source={{uri: imageRadio}} style={{ width: 170, height: 170, borderRadius: 10 }} />
          }
          <Text>__________</Text>
          {streamTitle? (
            <Text style={{color:"purple", paddingTop: 30, fontWeight:"bold" }}> <Ionicons name="people-circle-outline" size={30} color={"purple"}/> {auditeur} Auditeurs</Text>
          ): null}
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop : 120}}>
          {streamTitle ? (
            <View style={{flexDirection: 'row',flexWrap: 'wrap', padding: 5, backgroundColor: "purple", borderRadius: 70}}>            
              <Text style={{color:"white",flexWrap: 'wrap', paddingRight:10, paddingBottom:10, fontWeight: "bold"}}><Ionicons name="musical-notes-outline" size={30} color={"white"}/>{streamTitle}</Text>
            </View>
        ) : <View style={{flexDirection: 'row',flexWrap: 'wrap', padding: 5, backgroundColor: "purple", borderRadius: 70}}>            
        <Text style={{color:"white",flexWrap: 'wrap', paddingRight:10, paddingBottom:10, fontWeight: "bold"}}><Ionicons name="hourglass-outline" size={30} color={"white"}/>Chargement...</Text>
      </View>}
        </View>
      <View style={styles.playerContainer}>       
        <Video
          source={{ uri: 'http://102.16.44.51:8000/radiosoafia' }}
          ref={playerRef}
          audioOnly={true}
          paused={!isPlaying}
          controls={false}
          resizeMode="cover"
          style={styles.player}
          onError={(error) => console.log(error)}
          ignoreSilentSwitch={"ignore"}
          playWhenInactive={true}
          playInBackground={true}
        />
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying ? <Ionicons name="pause-outline" size={30} color={"white"}/>  : <Ionicons name="play-outline" size={30} color={"white"} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 70
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'purple',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 100,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
