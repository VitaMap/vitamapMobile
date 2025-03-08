import React,{useEffect} from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import des icônes
import* as Location from 'expo-location'; // Import de la librairie de géolocalisation

export default function Home() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
      }
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bien venue sur  VitaMap</Text>
        <Text>Map is not available on web platform.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bien venu sur Vimap</Text>
      {/* Coordonnées de la map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 0, // Latitude centrale de la carte du monde
          longitude: 0, // Longitude centrale de la carte du monde
          latitudeDelta: 180, // Zoom pour afficher toute la carte du monde
          longitudeDelta: 360, // Zoom pour afficher toute la carte du monde
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
            coordinate={{ latitude: 48.8566, longitude: 2.3522 }} // Exemple de marqueur à Paris
            title="Paris"
            description="Capitale de la France"
        />
      </MapView>

      {/* Menu en bas avec icônes */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="home-outline" size={20} color="#007bff" />
          <Text style={styles.menuText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="search-outline" size={20} color="#007bff" />
          <Text style={styles.menuText}>Recherche</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="notifications-outline" size={20} color="#007bff" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="person-outline" size={20} color="#007bff" />
          <Text style={styles.menuText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 75,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  menuText: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
  },
});
