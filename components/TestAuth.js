import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/supabase';

export default function TestAuth() {
  const { user, userProfile, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signUp(email, password, 'testuser');
      if (result.success) {
        Alert.alert('Success', 'User created successfully!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        Alert.alert('Success', 'Signed in successfully!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testQuestions = async () => {
    try {
      const questionsData = await DatabaseService.getQuestions(1, 1, 1);
      setQuestions(questionsData);
      Alert.alert('Success', `Found ${questionsData.length} questions`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Integration Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Authentication Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </Text>
        {userProfile && (
          <Text style={styles.statusText}>
            User: {userProfile.email} (Level {userProfile.current_level})
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.signUpButton]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.signInButton]} 
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity 
            style={[styles.button, styles.signOutButton]} 
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>

      {isAuthenticated && (
        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={testQuestions}
        >
          <Text style={styles.buttonText}>Test Questions</Text>
        </TouchableOpacity>
      )}

      {questions.length > 0 && (
        <View style={styles.questionsContainer}>
          <Text style={styles.questionsTitle}>Sample Questions:</Text>
          {questions.slice(0, 3).map((question, index) => (
            <Text key={index} style={styles.questionText}>
              {index + 1}. {question.question_text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
  },
  signInButton: {
    backgroundColor: '#2196F3',
  },
  signOutButton: {
    backgroundColor: '#f44336',
  },
  testButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  questionText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    lineHeight: 20,
  },
}); 