import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ExamPreferencesScreen({ onPreferencesComplete }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    tyt_enabled: false,
    ayt_say_enabled: false,
    ayt_ea_enabled: false,
    ayt_soz_enabled: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingPreferences();
  }, []);

  const loadExistingPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_exam_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          tyt_enabled: data.tyt_enabled || false,
          ayt_say_enabled: data.ayt_say_enabled || false,
          ayt_ea_enabled: data.ayt_ea_enabled || false,
          ayt_soz_enabled: data.ayt_soz_enabled || false,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async () => {
    // Check if at least one preference is selected
    const hasAnyPreference = Object.values(preferences).some(value => value);
    
    if (!hasAnyPreference) {
      Alert.alert('Error', 'Please select at least one exam type');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_exam_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert('Success', 'Exam preferences saved successfully!');
      onPreferencesComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const examTypes = [
    {
      key: 'tyt_enabled',
      title: 'TYT',
      subtitle: 'Temel Yeterlilik Testi',
      description: 'Basic proficiency test for university entrance',
      icon: 'school',
      color: '#4CAF50'
    },
    {
      key: 'ayt_say_enabled',
      title: 'AYT (SAY)',
      subtitle: 'Alan Yeterlilik Testi - Sayısal',
      description: 'Advanced proficiency test for numerical fields',
      icon: 'calculator',
      color: '#2196F3'
    },
    {
      key: 'ayt_ea_enabled',
      title: 'AYT (EA)',
      subtitle: 'Alan Yeterlilik Testi - Eşit Ağırlık',
      description: 'Advanced proficiency test for equal weight fields',
      icon: 'balance-scale',
      color: '#FF9800'
    },
    {
      key: 'ayt_soz_enabled',
      title: 'AYT (SÖZ)',
      subtitle: 'Alan Yeterlilik Testi - Sözel',
      description: 'Advanced proficiency test for verbal fields',
      icon: 'book',
      color: '#9C27B0'
    }
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000080" />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="settings" size={60} color="#000080" />
          <Text style={styles.title}>Exam Preferences</Text>
          <Text style={styles.subtitle}>
            Select the exam types you want to study for. You can choose multiple types.
          </Text>
        </View>

        <View style={styles.preferencesContainer}>
          {examTypes.map((examType) => (
            <TouchableOpacity
              key={examType.key}
              style={[
                styles.examTypeCard,
                preferences[examType.key] && styles.examTypeCardSelected
              ]}
              onPress={() => togglePreference(examType.key)}
            >
              <View style={styles.examTypeHeader}>
                <View style={[styles.iconContainer, { backgroundColor: examType.color }]}>
                  <Ionicons name={examType.icon} size={24} color="#fff" />
                </View>
                <View style={styles.examTypeInfo}>
                  <Text style={styles.examTypeTitle}>{examType.title}</Text>
                  <Text style={styles.examTypeSubtitle}>{examType.subtitle}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  preferences[examType.key] && styles.checkboxSelected
                ]}>
                  {preferences[examType.key] && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <Text style={styles.examTypeDescription}>
                {examType.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            Your preferences will filter the questions shown to you. You can change these settings later in your profile.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSavePreferences}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000080',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  preferencesContainer: {
    marginBottom: 30,
  },
  examTypeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  examTypeCardSelected: {
    borderColor: '#000080',
    backgroundColor: '#f8f9ff',
  },
  examTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  examTypeInfo: {
    flex: 1,
  },
  examTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  examTypeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000080',
    borderColor: '#000080',
  },
  examTypeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#000080',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 