import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, Animated, Modal, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DarkModeContext } from '../DarkModeContext';
import { ImageBackground } from 'react-native';

// Hotspots pour chaque ville (avec le champ name)
const cityHotspots = {
  "Paris": [
    { latitude: 48.8584, longitude: 2.2945, name: "Tour Eiffel" },
    { latitude: 48.8738, longitude: 2.2950, name: "Arc de Triomphe" },
    { latitude: 48.8606, longitude: 2.3376, name: "Louvre" },
    { latitude: 48.8529, longitude: 2.3500, name: "Notre-Dame" },
    { latitude: 48.8867, longitude: 2.3431, name: "Sacré-Cœur" },
    { latitude: 48.8635, longitude: 2.3270, name: "Opéra Garnier" },
    { latitude: 48.8656, longitude: 2.3212, name: "Place de la Concorde" },
    { latitude: 48.8575, longitude: 2.2982, name: "Champ de Mars" },
  ],
  "Rio de Janeiro": [
    { latitude: -22.9519, longitude: -43.2105, name: "Christ Rédempteur" },
    { latitude: -22.9711, longitude: -43.1822, name: "Copacabana" },
    { latitude: -22.9083, longitude: -43.1964, name: "Pain de Sucre" },
    { latitude: -22.9132, longitude: -43.1729, name: "Centre-ville" },
    { latitude: -22.9836, longitude: -43.2048, name: "Ipanema" },
    { latitude: -22.9068, longitude: -43.1729, name: "Lapa" },
    { latitude: -22.9517, longitude: -43.1847, name: "Jardim Botânico" },
  ],
  "New York": [
    { latitude: 40.7580, longitude: -73.9855, name: "Times Square" },
    { latitude: 40.7061, longitude: -74.0087, name: "Wall Street" },
    { latitude: 40.7308, longitude: -73.9973, name: "Washington Sq" },
    { latitude: 40.7484, longitude: -73.9857, name: "Empire State Building" },
    { latitude: 40.7851, longitude: -73.9683, name: "Central Park" },
    { latitude: 40.7527, longitude: -73.9772, name: "Grand Central" },
    { latitude: 40.6892, longitude: -74.0445, name: "Statue of Liberty" },
    { latitude: 40.7587, longitude: -73.9787, name: "Rockefeller Center" },
  ],
  "Tokyo": [
    { latitude: 35.6895, longitude: 139.6917, name: "Shinjuku" },
    { latitude: 35.6586, longitude: 139.7454, name: "Tour de Tokyo" },
    { latitude: 35.7100, longitude: 139.8107, name: "Asakusa" },
    { latitude: 35.6733, longitude: 139.7104, name: "Harajuku" },
    { latitude: 35.6993, longitude: 139.7745, name: "Ueno Park" },
    { latitude: 35.6581, longitude: 139.7017, name: "Shibuya" },
    { latitude: 35.6896, longitude: 139.7006, name: "Ikebukuro" },
  ],
  "Dakar": [
    { latitude: 14.6928, longitude: -17.4467, name: "Place de l'Indépendance" },
    { latitude: 14.7167, longitude: -17.4677, name: "Centre-ville" },
    { latitude: 14.7397, longitude: -17.4900, name: "Phare des Mamelles" },
    { latitude: 14.7162, longitude: -17.5027, name: "Île de Gorée" },
    { latitude: 14.7519, longitude: -17.4622, name: "Monument de la Renaissance" },
    { latitude: 14.6937, longitude: -17.4516, name: "Marché Sandaga" },
  ],
  "Sydney": [
    { latitude: -33.8568, longitude: 151.2153, name: "Opéra" },
    { latitude: -33.8731, longitude: 151.2110, name: "Darling Harbour" },
    { latitude: -33.8908, longitude: 151.2743, name: "Bondi Beach" },
    { latitude: -33.8523, longitude: 151.2108, name: "Harbour Bridge" },
    { latitude: -33.8688, longitude: 151.2093, name: "Centre-ville" },
    { latitude: -33.8830, longitude: 151.2167, name: "Hyde Park" },
    { latitude: -33.8737, longitude: 151.2069, name: "Chinatown" },
  ],
  "Le Cap": [
    { latitude: -33.9249, longitude: 18.4241, name: "Centre-ville" },
    { latitude: -33.9628, longitude: 18.4098, name: "Table Mountain" },
    { latitude: -33.9036, longitude: 18.4208, name: "V&A Waterfront" },
    { latitude: -33.9180, longitude: 18.4232, name: "Bo-Kaap" },
    { latitude: -33.9366, longitude: 18.4577, name: "Plage de Clifton" },
    { latitude: -33.9279, longitude: 18.4174, name: "Company’s Garden" },
    { latitude: -33.9068, longitude: 18.4206, name: "Green Point Park" },
  ]
};

export default function Home({ navigation, route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 20.0,
    longitude: 0.0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });

  const { darkMode } = useContext(DarkModeContext);

  const animation = useRef({
    home: new Animated.Value(0),
    stat: new Animated.Value(0),
    notifications: new Animated.Value(0),
    profil: new Animated.Value(0),
  }).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/api/maladies-par-ville');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabPress = (tab) => {
    Object.keys(animation).forEach((key) => {
      animation[key].stopAnimation();
      animation[key].setValue(0);
    });

    setActiveTab(tab);

    if (animation[tab]) {
      Animated.timing(animation[tab], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (tab === 'profil') {
      // Quand tu ouvres le profil
      navigation.navigate('Profil', { userId: route.params?.userId });
    } else if (tab === 'stat') {
      navigation.navigate('Stat');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const MainContent = (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : 'rgba(255,255,255,0.2)' }]}>
      <Image
        source={require('../../assets/realvitalogo.png')}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu-outline" size={25} color="#fff" />
      </TouchableOpacity>
      <Ionicons
        name="arrow-back-outline"
        size={25}
        color="#fff"
        style={styles.backIcon}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
      />

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          {darkMode ? (
            <View style={[styles.dropdownMenu, { backgroundColor: '#222' }]}>
              <TouchableOpacity
                style={styles.dropdownItem}
              onPress={() => {
  setMenuVisible(false);
  navigation.navigate('Profil', { userId: route.params?.userId });
}}
              >
                <Ionicons name="person-outline" size={22} color="#fff" />
                <Text style={styles.dropdownText}>Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Parametres');
                }}
              >
                <Ionicons name="settings-outline" size={22} color="#fff" />
                <Text style={styles.dropdownText}>Paramètres</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ImageBackground
              source={require('../../assets/3262023.jpg')}
              style={styles.dropdownMenu}
              imageStyle={{ borderRadius: 10 }}
            >
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                 navigation.navigate('Profil', { userId: route.params?.userId });
  }}
              >
                <Ionicons name="person-outline" size={22} color="#fff" />
                <Text style={styles.dropdownText}>Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Parametres');
                }}
              >
                <Ionicons name="settings-outline" size={22} color="#fff" />
                <Text style={styles.dropdownText}>Paramètres</Text>
              </TouchableOpacity>
            </ImageBackground>
          )}
        </TouchableOpacity>
      </Modal>

      {/* Affichage du nom du hotspot sélectionné */}
      {selectedHotspot && (
        <View style={styles.hotspotContainer}>
          <Text style={styles.hotspotText}>{selectedHotspot.name}</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        onPress={() => setSelectedHotspot(null)}
      >
        {data.map((ville, index) => {
          const totalCas = ville.maladies.reduce((sum, maladie) => sum + (maladie.nombre_cas || 0), 0);

          let pinColor, fillColor;
          if (totalCas <= 10) {
            pinColor = "green";
            fillColor = "rgba(0,255,0,0.2)";
          } else if (totalCas <= 30) {
            pinColor = "yellow";
            fillColor = "rgba(255,255,0,0.2)";
          } else if (totalCas <= 75) {
            pinColor = "orange";
            fillColor = "rgba(255,165,0,0.2)";
          } else {
            pinColor = "red";
            fillColor = "rgba(255,0,0,0.2)";
          }

          const nbCercles = Math.max(2, Math.floor(totalCas / 15));
          const hotspots = cityHotspots[ville.ville] || [];

          return (
            <React.Fragment key={`marker-${index}`}>
              {Array.from({ length: nbCercles }).map((_, i) => {
                const spot = hotspots[i % hotspots.length];
                return (
                  <React.Fragment key={`circle-${index}-${i}`}>
                    <Circle
                      center={spot}
                      radius={200}
                      fillColor={fillColor}
                      strokeColor={pinColor}
                      strokeWidth={2}
                    />
                    <Marker
                      coordinate={spot}
                      opacity={0}
                      onPress={() => {
                        // N'affiche que si zoomé de près
                        if (mapRegion.latitudeDelta < 0.5) {
                          setSelectedHotspot(spot);
                        }
                      }}
                    />
                  </React.Fragment>
                );
              })}
              <Marker
                coordinate={{
                  latitude: parseFloat(ville.position.split(',')[0]),
                  longitude: parseFloat(ville.position.split(',')[1]),
                }}
                title={`${ville.ville}, ${ville.pays}`}
                description={`Maladies: ${ville.maladies.map((m) => `${m.nom} (${m.nombre_cas} cas)`).join(', ')}`}
                pinColor={pinColor}
              />
            </React.Fragment>
          );
        })}
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
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
          <Text style={styles.legendLabel}>0-10 cas (faible)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
          <Text style={styles.legendLabel}>11-30 cas (modéré)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
          <Text style={styles.legendLabel}>31-75 cas (élevé)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
          <Text style={styles.legendLabel}>{'> 75 cas (critique)'}</Text>
        </View>
      </View>
    </View>
  );

  return darkMode ? (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      {MainContent}
    </View>
  ) :
    (
      <ImageBackground
        source={require('../../assets/3262023.jpg')}
        style={styles.backgroundImage}
      >
        {MainContent}
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
    right: 20,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    marginTop: 70,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
    minWidth: 120,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  backIcon: {
    color: '#fff',
    position: 'absolute',
    top: 52,
    left: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  hotspotContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 30,
  },
  hotspotText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legendContainer: {
    position: 'absolute',
    top: 535, // réduit la distance du haut
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 6,
    zIndex: 100,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, // réduit l'espacement vertical
  },
  legendColor: {
    width: 12,   // réduit la taille du carré couleur
    height: 12,
    borderRadius: 3,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  legendLabel: {
    color: '#fff',
    fontSize: 11, // réduit la taille du texte
  },
});