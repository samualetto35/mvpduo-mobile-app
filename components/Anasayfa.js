import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AnasayfaHeader from './AnasayfaHeader';
import HeroLevels from './HeroLevels';

export default function Anasayfa() {
  return (
    <View style={styles.container}>
      <AnasayfaHeader />
      <View style={styles.content}>
        <View style={styles.blueBox}>
          <Text style={styles.levelText}>Level 24, Bölüm 6</Text>
          <Text style={styles.titleText}>Hot Cross Buns</Text>
        </View>
        <HeroLevels />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100, // More space for fixed header
    paddingHorizontal: 16, // Reduced side padding
  },
  blueBox: {
    backgroundColor: '#000080', // Same blue as selected navbar
    borderRadius: 16, // More rounded corners
    padding: 16, // Reduced padding
    width: '100%',
    marginTop: 20,
    shadowColor: '#000080', // Same blue color as box
    shadowOffset: {
      width: 0,
      height: 8, // Increased shadow offset
    },
    shadowOpacity: 0.3, // Increased shadow opacity
    shadowRadius: 12, // Increased shadow radius
    elevation: 12, // Increased elevation for Android
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D3D3D3', // Light grey
    textAlign: 'left',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
}); 