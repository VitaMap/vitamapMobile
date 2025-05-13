import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Stat() {
  const [maladies, setMaladies] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [positions, setPositions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('http://10.0.2.2:3000/api/maladies-par-ville');
        const villes = await res.json();

        // On va chercher l'API complète pour avoir toutes les infos maladies/positions
        const resApi = await fetch('https://raw.githubusercontent.com/VitaMap/VitaMapAPI/refs/heads/main/VitaMapAPI.json');
        const api = await resApi.json();

        setMaladies(api.maladies);
        setLieux(api.lieu_maladie);
        setPositions(api.positions);
      } catch (e) {
        console.error('Erreur Stat:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Pour chaque maladie, on cherche les lieux où elle est présente
  const getDetails = (maladieId) => {
    return lieux
      .filter(lieu => lieu.maladie_id === maladieId)
      .map(lieu => {
        const pos = positions.find(p => p.id === lieu.position_id);
        return {
          ville: pos ? pos.ville : 'Inconnue',
          pays: pos ? pos.pays : 'Inconnu',
          position: pos ? pos.position : '',
          nombre_cas: lieu.nombre_cas,
          date_maj: lieu.date_maj,
        };
      });
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/3262023.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/3262023.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Maladies</Text>
        {maladies.map((maladie) => (
          <View key={maladie.id} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(maladie.id)}>
              <Text style={styles.maladieName}>{maladie.nom}</Text>
            </TouchableOpacity>
            {expanded[maladie.id] && (
              <View style={styles.details}>
                <Text style={styles.detailText}><Text style={styles.label}>Symptômes :</Text> {maladie.symptomes}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Description :</Text> {maladie.description}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Niveau de contagion :</Text> {maladie.niveau_contagion}/10</Text>
                <Text style={[styles.label, {marginTop: 10}]}>Présence par ville :</Text>
                {getDetails(maladie.id).length === 0 ? (
                  <Text style={styles.detailText}>Aucun cas détecté</Text>
                ) : (
                  getDetails(maladie.id).map((lieu, idx) => (
                    <View key={idx} style={styles.lieuRow}>
                      <Text style={styles.detailText}>
                        {lieu.ville} ({lieu.pays}) : <Text style={{fontWeight:'bold'}}>{lieu.nombre_cas} cas</Text>
                      </Text>
                      <Text style={styles.detailText}>Dernière mise à jour : {new Date(lieu.date_maj).toLocaleString()}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))}
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#151516',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  maladieName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 1,
  },
  details: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 10,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  detailText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  lieuRow: {
    marginBottom: 8,
    marginLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#00bfff',
    paddingLeft: 8,
  },
});

