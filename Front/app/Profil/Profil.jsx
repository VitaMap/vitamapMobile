import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DarkModeContext } from '../DarkModeContext';

export default function Profil({ navigation, route }) {
  const { darkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'id utilisateur passé par la navigation
  const userId = route.params?.userId;

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://10.0.2.2:3000/api/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [userId]);

  const handleLogout = () => {
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const backgroundColor = darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.2)';
  const cardBg = darkMode ? 'rgba(30,30,30,0.98)' : 'rgba(255,255,255,0.9)';
  const textColor = darkMode ? '#fff' : '#333';
  const infoBg = darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)';
  const infoText = darkMode ? '#fff' : '#fff';

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: darkMode ? '#111' : 'rgba(255,255,255,0.2)' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: darkMode ? '#111' : 'rgba(255,255,255,0.2)' }]}>
        <Text style={styles.errorText}>Impossible de charger les informations utilisateur.</Text>
      </View>
    );
  }

  const MainContent = (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: darkMode ? '#111' : 'rgba(255,255,255,0.2)' }]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color="#fff"
          style={styles.backIcon}
          onPress={() => navigation.navigate('Home', { userId: route.params?.userId })}
        />
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: cardBg }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, { color: textColor }]}>{user.nom} {user.prenom}</Text>
        <Text style={[styles.email, { color: textColor }]}>{user.email}</Text>
        <Text style={[styles.date, { color: textColor }]}>Inscrit le : {new Date(user.date_inscription).toLocaleDateString()}</Text>
      </View>

      <View style={[styles.infoSection, { backgroundColor: infoBg }]}>
        <Text style={[styles.infoTitle, { color: infoText }]}>Informations supplémentaires</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#fff" />
          <Text style={[styles.infoText, { color: infoText }]}>Paris, France</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={[styles.infoText, { color: infoText }]}>Membre depuis {new Date(user.date_inscription).getFullYear()}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: darkMode ? '#222' : '#151516' }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return darkMode ? (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      {MainContent}
    </View>
  ) : (
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