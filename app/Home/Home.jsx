import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import des icônes

export default function Home() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to VitaMap</Text>
        <Text>Map is not available on web platform.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to VitaMap</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Disease Location"
          description="Description of the disease"
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
