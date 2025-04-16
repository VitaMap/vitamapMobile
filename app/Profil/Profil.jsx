import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = 1; // Exemple : ID utilisateur statique

    axios
      .get(`http://10.0.2.2:3000/api/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    alert('Déconnexion réussie !');
    // Ajoutez ici la logique pour gérer la déconnexion
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Impossible de charger les informations utilisateur.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/3262023.jpg')} // Même image de fond que Register
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" style={styles.backIcon} />
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Remplacez par une URL d'image si disponible
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.nom} {user.prenom}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.date}>Inscrit le : {new Date(user.date_inscription).toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informations supplémentaires</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>Paris, France</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>+33 6 12 34 56 78</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>Membre depuis {new Date(user.date_inscription).getFullYear()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  infoSection: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151516',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
  },
});