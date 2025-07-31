import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Rozetler() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rozetler</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 