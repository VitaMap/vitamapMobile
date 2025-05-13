import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, ImageBackground, Image, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  // Utilisation de useRef pour les animations
  const animation = useRef({
    home: new Animated.Value(0),
    stat: new Animated.Value(0), // Ajouté pour l'onglet stat
    notifications: new Animated.Value(0),
    profil: new Animated.Value(0),
  }).current;

  const diseaseColors = {
    "Grippe Aviaire": "rgba(255, 0, 0, 0.5)",
    "Dengue": "rgba(255, 165, 0, 0.5)",
    "COVID-19": "rgba(0, 0, 255, 0.5)",
    "Choléra": "rgba(0, 255, 0, 0.5)",
    "Paludisme": "rgba(128, 0, 128, 0.5)",
    "Ebola": "rgba(255, 69, 0, 0.5)",
    "Zika": "rgba(255, 255, 0, 0.5)",
  };

  const cityRadii = {
    "Paris": 5800,
    "Rio de Janeiro": 7000,
    "New York": 8000,
    "Tokyo": 6000,
    "Dakar": 4000,
    "Sydney": 7000,
    "Le Cap": 5000,
  };

  const handleTabPress = (tab) => {
    // Arrêter toutes les animations en cours
    Object.keys(animation).forEach((key) => {
      animation[key].stopAnimation();
      animation[key].setValue(0);
    });

    setActiveTab(tab);

    // Démarrer la nouvelle animation si elle existe
    if (animation[tab]) {
      Animated.timing(animation[tab], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true, // Changé à true pour de meilleures performances
      }).start();
    }

    // Gestion de la navigation
    if (tab === 'profil') {
      navigation.navigate('Profil');
    } else if (tab === 'stat') {
      navigation.navigate('Stat');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/api/maladies-par-ville');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/3262023.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/realvitalogo.png')}
          style={styles.logo}
        />
        <Ionicons name="menu-outline" size={25} color="#fff" style={styles.menuIcon} />
        <Ionicons name="arrow-back-outline" size={25} color="#fff" style={styles.backIcon} />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.0,
            longitude: 0.0,
            latitudeDelta: 100,
            longitudeDelta: 100,
          }}
        >
          {data.map((ville, index) => (
            <Circle
              key={`circle-${index}`}
              center={{
                latitude: parseFloat(ville.position.split(',')[0]),
                longitude: parseFloat(ville.position.split(',')[1]),
              }}
              radius={cityRadii[ville.ville] || 3000}
              fillColor={diseaseColors[ville.maladies[0]?.nom] || "rgba(0, 0, 0, 0.2)"}
              strokeColor="rgba(0, 0, 0, 0.5)"
            />
          ))}

          {data.map((ville, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{
                latitude: parseFloat(ville.position.split(',')[0]),
                longitude: parseFloat(ville.position.split(',')[1]),
              }}
              title={`${ville.ville}, ${ville.pays}`}
              description={`Maladies: ${ville.maladies.map((m) => m.nom).join(', ')}`}
            />
          ))}
        </MapView>

        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleTabPress('home')}
          >
            <Ionicons 
              name="home-outline" 
              size={20} 
              color={activeTab === 'home' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleTabPress('stat')}
          >
            <Ionicons 
              name="stats-chart-outline" 
              size={20} 
              color={activeTab === 'stat' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleTabPress('profil')}
          >
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={activeTab === 'profil' ? 'rgba(12, 235, 123, 0.6)' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
  logo: {
    width: 50,
    height: 70,
  },
  menuIcon: {
    position: 'absolute', 
    top: 52, 
    right: 20
  },
  backIcon: {
    position: 'absolute', 
    top: 52, 
    left: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});