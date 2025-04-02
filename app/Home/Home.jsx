import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
      }

      try {
        const response = await axios.get('http://10.0.2.2:3000/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenu sur VitaMap</Text>
          <Text>Map is not available on web platform.</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue sur Vitamap</Text>
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