import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';

export default function Register({ navigation }) {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nom, prenom, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Inscription réussie :', data.message);
                navigation.navigate('Login');
            } else {
                console.log('Erreur :', data.message);
                alert(data.message);
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
                    placeholder="Nom"
                    value={nom}
                    onChangeText={setNom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={prenom}
                    onChangeText={setPrenom}
                />
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
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>
                    <Text style= {styles.dcompte}
                    onPress={handleLogin}>Déjà un compte ?</Text>
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

    dcompte: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
});