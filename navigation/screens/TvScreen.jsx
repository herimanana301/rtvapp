import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import Orientation, { OrientationLocker, PORTRAIT, LANDSCAPE } from 'react-native-orientation-locker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { parseString } from "react-native-xml2js"

export default function TvScreen({ navigation }) {
  const playerRef = React.useRef(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTitle, setCurrentTitle] = React.useState("Chargement...");
  const [nextTitles, setNextTitles] = React.useState([])
  const [titleNext, setTitleNext] = React.useState([])
  const [userStart, setUserStart] = React.useState(true)

//Début partie orientation écran
  const handleOrientationChange = (orientation) => {
    console.log(orientation)
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setIsFullScreen(true);
      Orientation.lockToLandscape();
    } else {
      setIsFullScreen(false);
      Orientation.lockToPortrait();
    }
  };

  React.useEffect(() => {
    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const handleFullscreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  };
// Fin orientation écran

//Début détection play & pause
  const playPause = () => {
    if (isPlaying === false) {
      setIsPlaying(true)
      setUserStart(false)
    } else {
      setIsPlaying(false)
      setIsFullScreen(false)
    }
  }
  React.useEffect(() => {
    if (isPlaying) {
      playerRef.current.start();
    } else {
      if (playerRef.current === null) { } else {
        playerRef.current.pause()
      }
    }
  }, [isPlaying])
// fin détection play & pause

//début redimensionnement de l'image qui remplace le live si elle n'est pas chargé
const screenWidth = Dimensions.get('window').width;
const aspectRatio = 16 / 9;
const height = screenWidth / aspectRatio;
//fin redimensionnement de l'image qui remplace le live si elle n'est pas chargé

//début accès donné de la télé par API
const fetchXmlData = async () => {
  try {
    const response = await fetch('http://102.16.44.51:8088/api');
    const xmlString = await response.text();
    parseString(xmlString, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        const titleFilter = result.vmix.inputs[0].input[2].$.title.split("\\").pop()
        const titleFilterMore = titleFilter.split('.').shift()
        //console.log(result.vmix.inputs[0].input[2].list[0].item);
        setCurrentTitle(titleFilterMore)
        setNextTitles(result.vmix.inputs[0].input[2].list[0].item)
      }
    });
  } catch (error) {
    console.log(error);
  }
};
  React.useEffect(() => {
    fetchXmlData();
  }, []);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchXmlData();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);
  //fin accès donné de la télé par API
  //début filtrage des programmes
    React.useEffect(()=>{
      if(nextTitles.length>0){
        const index = nextTitles.findIndex(item => item["$"] && item["$"]["selected"])
        const result = nextTitles.slice(index+1)
        const regex = /\\([^\\]+)\.mp4$/
        const filtrage = result.map((moreFilter)=>{
          const match = moreFilter.match(regex);
          return match ? match[1] : null
        })
        setTitleNext(filtrage)
      }
    },[nextTitles])
//Fin filtrage des programmes

  const movieTexts = titleNext.map((title, index) => (
    <Text key={index} style={{ fontSize: 20, color: "white", padding: 10 }}><Ionicons name="caret-forward-outline" size={20} color={'white'} />
      {title}
    </Text>
  ));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {userStart === false ?
      <TouchableWithoutFeedback onPress={playPause}>   
      <NodePlayerView
        style={isFullScreen ? styles.fullscreen : styles.videoPlayer}
        ref={playerRef}
        inputUrl={"rtmp://102.16.44.51:1935/live/rtvsofia"}
        scaleMode={"ScaleAspectFit"}
        bufferTime={300}
        maxBufferTime={1000}
        autoplay={false}
        onFullscreen={handleFullscreen}
      /> 
      </TouchableWithoutFeedback>
      : <Image source={require("../../assets/image/tv.png")} style={{ width: screenWidth, height: height }} />}

      <View style={{ flexDirection: "row", alignItems: 'flex-start', paddingTop: 5, backgroundColor: "purple", position: "relative" }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'purple',
            width: 50,
            height: 50,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={playPause}>
          {isPlaying === false ? (
            <Ionicons name="play-outline" size={30} color={'white'} />
          ) : (
            <Ionicons name="pause-outline" size={30} color={'white'} />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1, paddingBottom: 15, paddingTop: 5 }}>
          <Text style={{ fontSize: 15, color: "white", fontWeight: "bold", alignItems: "center" }}> <Text style={{ backgroundColor: "#210062" }}>Titre :</Text> {currentTitle}</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'purple',
            width: 50,
            height: 50,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
          onPress={handleFullscreen}>
            {isPlaying === false ? (
            null
          ) : (
            <Ionicons name="expand-outline" size={30} color={'white'} />
          )}
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: "#E11299" }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", padding: 10 }}>À venir</Text>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: "#301934" }}>
        {movieTexts}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  videoPlayer: {
    height: 200,
    backgroundColor: "black"
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});