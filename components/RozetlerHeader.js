import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function RozetlerHeader() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <Text style={styles.welcomeText}>Hoşgeldin</Text>
            <Text style={styles.subtitleText}>Her gün ders çalış ve daha fazla rozet kazan</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    minHeight: 100,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 