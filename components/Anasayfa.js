import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import AnasayfaHeader from './AnasayfaHeader';
import HeroLevels from './HeroLevels';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Anasayfa({ navigation }) {
  const { userProfile, user } = useAuth();
  const [examPreferences, setExamPreferences] = useState('');

  useEffect(() => {
    loadExamPreferences();
  }, []);

  const loadExamPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_exam_preferences')
        .select('tyt_enabled, ayt_say_enabled, ayt_ea_enabled, ayt_soz_enabled')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading exam preferences:', error);
        return;
      }

      if (data) {
        const preferences = [];
        if (data.tyt_enabled) preferences.push('TYT');
        if (data.ayt_say_enabled) preferences.push('AYT SAY');
        if (data.ayt_ea_enabled) preferences.push('AYT EA');
        if (data.ayt_soz_enabled) preferences.push('AYT SOZ');
        
        setExamPreferences(preferences.join(' + '));
      }
    } catch (error) {
      console.error('Error loading exam preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AnasayfaHeader />
      
      {/* Blue Box - Fixed Position */}
      <View style={styles.blueBox}>
        <View style={styles.blueBoxContent}>
          <Text style={styles.levelText}>
            Level {userProfile?.current_level || 1}, Bölüm {userProfile?.current_bolum || 1}
          </Text>
          <Text style={styles.bunnyText}>
            {examPreferences || 'Loading...'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HeroLevels navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed from #f5f5f5 to white
  },
  blueBox: {
    position: 'absolute',
    top: 125, // Lowered from 100 to 120
    left: 15, // Decreased from 30 to 20 (larger side padding)
    right: 15, // Decreased from 30 to 20 (larger side padding)
    backgroundColor: '#000080',
    borderRadius: 14,
    paddingHorizontal: 20, // Increased from 16 to 20
    paddingVertical: 16,
    zIndex: 10,
    shadowColor: '#000080', // Blue shadow color
    shadowOffset: {
      width: 0,
      height: 5, // Increased shadow offset
    },
    shadowOpacity: 0.3, // Increased shadow opacity
    shadowRadius: 4, // Increased shadow radius
    elevation: 6, // Increased elevation for Android
  },
  blueBoxContent: {
    alignItems: 'flex-start',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B0',
    marginBottom: 4,
  },
  bunnyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingTop: 210, // Increased to make space for lowered blue box
  },
}); 