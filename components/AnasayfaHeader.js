import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AnasayfaHeader() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.text}>Çaylak</Text>
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.text}>Streak 4 Gün</Text>
          <Text style={styles.emoji}>🔥</Text>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.text}>1,23 Ders/Gün</Text>
        </View>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  emoji: {
    fontSize: 14,
    marginLeft: 4,
  },
  dividerContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
}); 