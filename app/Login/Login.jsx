import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';

export default function Login({ navigation }) { // Ajouter navigation ici
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Connexion réussie :', data.token);
        // Rediriger vers Home après une connexion réussie
        navigation.navigate('Home');
      } else {
        console.log('Erreur :', data.message);
        alert('Identifiants invalides');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  };

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
        <Text style={styles.title}>VitaMap</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: '#151516' }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Se Connecter</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    width: '75%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  buttonContainer: {
    width: '75%',
    marginVertical: 8,
  },
  customButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
