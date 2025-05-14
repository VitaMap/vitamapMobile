import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, ImageBackground } from 'react-native';
import { DarkModeContext } from '../DarkModeContext';

export default function Parametres() {
  const [notifications, setNotifications] = useState(true);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const backgroundColor = darkMode ? '#111' : 'rgba(255,255,255,0.7)';
  const textColor = darkMode ? '#fff' : '#222';

  const MainContent = (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Paramètres</Text>
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: textColor }]}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#0ceb7b' }}
          thumbColor={notifications ? '#0ceb7b' : '#f4f3f4'}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: textColor }]}>Mode sombre</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#222' }}
          thumbColor={darkMode ? '#222' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  return darkMode ? (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      {MainContent}
    </View>
  ) : (
    <ImageBackground
      source={require('../../assets/3262023.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {MainContent}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    // backgroundColor dynamique dans le composant
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
    // color dynamique dans le composant
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 18,
    // color dynamique dans le composant
  },
});