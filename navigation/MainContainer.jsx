import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
Ionicons.loadFont()
// Screens
import HomeScreen from './screens/HomeScreen';
import RadioScreen from './screens/RadioScreen';
import TvScreen from './screens/TvScreen'
import Bluepix from "./screens/Bluepix"
//Screen names
const homeName = "Actualité";
const RadioName = "Radio";
const TvName = "Télé"
const bluePix="BluePix"

const Tab = createBottomTabNavigator();

function MainContainer() {
  const [orientation, setOrientation] = React.useState(Orientation.getInitialOrientation());

  React.useEffect(() => {
    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
  };

  return (
    <NavigationContainer>
      {orientation === 'PORTRAIT' || orientation === 'PORTRAIT-UPSIDEDOWN' ? (
          <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let rn = route.name;

                if (rn === homeName) {
                    iconName = focused ? 'globe' : 'globe-outline';
                } else if (rn === RadioName) {
                    iconName = focused ? 'radio' : 'radio-outline';

                } else if (rn === TvName) {
                  iconName = focused ? 'tv' : 'tv-outline';
                }
                else if (rn === bluePix) {
                  iconName = focused ? 'cube' : 'cube-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'purple',
              tabBarInactiveTintColor: 'grey',
              tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
              tabBarStyle: [{ display: "flex" }, null]
            })}
          >
            <Tab.Screen name={homeName} component={HomeScreen} />
            <Tab.Screen name={RadioName} component={RadioScreen} />
            <Tab.Screen name={TvName} component={TvScreen}/>
            <Tab.Screen name={bluePix} component={Bluepix}/>
          </Tab.Navigator>
        ) : (
<Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let rn = route.name;

                if (rn === homeName) {
                    iconName = focused ? 'globe' : 'globe-outline';
                } else if (rn === RadioName) {
                    iconName = focused ? 'radio' : 'radio-outline';

                } else if (rn === TvName) {
                  iconName = focused ? 'tv' : 'tv-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarStyle: [{height: 0}, null]
            })}
          >
            <Tab.Screen name={TvName} component={TvScreen}/>
          </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

export default MainContainer;
