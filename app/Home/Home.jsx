import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Image, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('home'); // État pour suivre l'onglet actif
  const [animation] = useState({
    home: new Animated.Value(0),
    notifications: new Animated.Value(0),
    profil: new Animated.Value(0),
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    // Lancer l'animation pour le tab actif
    Animated.timing(animation[tab], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Réinitialiser les autres animations
    Object.keys(animation).forEach((key) => {
      if (key !== tab) {
        Animated.timing(animation[key], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });

    if (tab === 'profil') {
      navigation.navigate('Profil');
    }
  };

  const getBarColor = (tab) => {
    return animation[tab].interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', '#000'], // Blanc au repos, bleu actif
    });
  };

  return (

    <ImageBackground
    source={require('../../assets/3262023.jpg')}
    style={styles.backgroundImage}>
    
    <View style={styles.container}>
    
      <Image source={require('../../assets/realvitalogo.png')} 
                          style={styles.logo}
                      />
   
      <Ionicons name="menu-outline" size={25} color="#fff" style={{ position: 'absolute', top: 52, right: 20 }} />
      <Ionicons name="arrow-back-outline" size={25} color="#fff" style={{ position: 'absolute', top: 52, left: 20 }} />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.603354,
          longitude: 1.888334,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{ latitude: 48.8566, longitude: 2.3522 }}
          title="Paris"
          description="Capitale de la France"
        />
      </MapView>


      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleTabPress('home')}
        >
          <Ionicons name="home-outline" size={20} color={activeTab === 'home' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} />
        {/*  <Animated.View
            style={[
              styles.whiteBar,
              { backgroundColor: getBarColor('home') },
            ]}
          />*/} 
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleTabPress('notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color={activeTab === 'notifications' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} />
         {/* <Animated.View
            style={[
              styles.whiteBar,
              { backgroundColor: getBarColor('notifications') },
            ]}
          />*/} 
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleTabPress('profil')}
        >
          <Ionicons name="person-outline" size={20} color={activeTab === 'profil' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} />
          {/* <Animated.View
            style={[
              styles.whiteBar,
              { backgroundColor: getBarColor('profil') },
            ]}
          />*/} 
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  backgroundImage: {
    flex:1,
    resizeMode: 'cover',
  },

  container: {
    flex: 1,
  
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
    padding: 10,
    paddingTop: 30,
   
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  
    width: '100%',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBar: {
    marginTop: 5,
    width: '100%',
    height: 3,
    borderRadius: 2,
  },

  logo: {
    width: 50,
    height: 70,
    
  },
});