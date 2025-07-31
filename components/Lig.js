import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Lig() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Lig</Text>
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
    justifyContent: 'center',
    paddingTop: 60, // Space for future header
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 