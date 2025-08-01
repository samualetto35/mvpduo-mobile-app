import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function HeroLevels({ navigation }) {
  const { userProfile, refreshUserProfile, user } = useAuth();
  const [bolumData, setBolumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [spinValue] = useState(new Animated.Value(0));

  // Refresh profile when component mounts to ensure latest data
  useEffect(() => {
    refreshUserProfile();
    loadUserPreferences();
  }, []);

  // Start spinning animation
  useEffect(() => {
    if (loading) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_exam_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserPreferences(data || {
        tyt_enabled: false,
        ayt_say_enabled: false,
        ayt_ea_enabled: false,
        ayt_soz_enabled: false,
      });

      // Load bölüm data after preferences are loaded
      loadBolumData(data);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      // Load with default preferences
      loadBolumData({
        tyt_enabled: false,
        ayt_say_enabled: false,
        ayt_ea_enabled: false,
        ayt_soz_enabled: false,
      });
    }
  };

  const loadBolumData = async (preferences) => {
    try {
      setLoading(true);
      const currentKidem = userProfile?.current_kidem || 1;
      
      // Build exam type filters based on user preferences
      const examTypes = [];
      const divisions = [];
      
      if (preferences?.tyt_enabled) {
        examTypes.push('TYT');
      }
      if (preferences?.ayt_say_enabled) {
        examTypes.push('AYT');
        divisions.push('SAY');
      }
      if (preferences?.ayt_ea_enabled) {
        examTypes.push('AYT');
        divisions.push('EA');
      }
      if (preferences?.ayt_soz_enabled) {
        examTypes.push('AYT');
        divisions.push('SOZ');
      }

      if (examTypes.length === 0) {
        // If no preferences set, show all TYT bölüms
        examTypes.push('TYT');
      }

      // Get bölüm data from bolum_questions table
      const { data, error } = await supabase
        .from('bolum_questions')
        .select('name, kidem, level, bolum, exam_type, division, q1_id, q2_id, q3_id, q4_id, q5_id')
        .eq('kidem', currentKidem)
        .in('exam_type', examTypes)
        .order('level', { ascending: true })
        .order('bolum', { ascending: true });

      if (error) {
        console.error('Error loading bölüm data:', error);
        return;
      }

      // Filter based on user preferences
      const filteredBolums = data.filter(bolum => {
        // For TYT, include if user has TYT enabled
        if (bolum.exam_type === 'TYT') {
          return preferences?.tyt_enabled;
        }
        
        // For AYT, check division
        if (bolum.exam_type === 'AYT') {
          if (bolum.division === 'SAY') {
            return preferences?.ayt_say_enabled;
          }
          if (bolum.division === 'EA') {
            return preferences?.ayt_ea_enabled;
          }
          if (bolum.division === 'SOZ') {
            return preferences?.ayt_soz_enabled;
          }
        }
        
        return false;
      });

      // Create all possible bölüms in correct order (Lvl1 B1-B12, Lvl2 B1-B12, etc.)
      const allPossibleBolums = [];
      
      // Generate all levels (1-100) and bölüms (1-12) for selected exam types
      for (let level = 1; level <= 100; level++) {
        for (let bolum = 1; bolum <= 12; bolum++) {
          const examTypesForThisBolum = [];
          
          // Add TYT if enabled
          if (preferences?.tyt_enabled) {
            examTypesForThisBolum.push('TYT');
          }
          
          // Add AYT divisions if enabled
          if (preferences?.ayt_say_enabled) {
            examTypesForThisBolum.push('AYT SAY');
          }
          
          if (preferences?.ayt_ea_enabled) {
            examTypesForThisBolum.push('AYT EA');
          }
          
          if (preferences?.ayt_soz_enabled) {
            examTypesForThisBolum.push('AYT SOZ');
          }
          
          // Create display text with all exam types for this bölüm
          let displayText = `Lvl${level} B${bolum}`;
          
          allPossibleBolums.push({
            level,
            bolum,
            examTypes: examTypesForThisBolum,
            displayText
          });
        }
      }

      // Sort by level first, then by bölüm
      allPossibleBolums.sort((a, b) => {
        if (a.level !== b.level) {
          return a.level - b.level;
        }
        return a.bolum - b.bolum;
      });

      setBolumData(allPossibleBolums);
      console.log(`Loaded ${allPossibleBolums.length} bölüms for user preferences`);
    } catch (error) {
      console.error('Error loading bölüm data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (level, bolumNumber) => {
    if (navigation) {
      navigation.navigate('QuestionScreen', { level, bolum: bolumNumber });
    }
  };

  // Calculate current progress
  const currentKidem = userProfile?.current_kidem || 1;
  const currentLevel = userProfile?.current_level || 1;
  const currentBolum = userProfile?.current_bolum || 1;

  // Get positioning for each circle based on index
  const getCirclePosition = (index, totalBolums) => {
    const positions = [
      { left: 0, top: 0 },      // 1st: center
      { left: -50, top: 25 },   // 2nd: left, 2nd row (reduced from 40)
      { left: -85, top: 50 },   // 3rd: more left, 3rd row (reduced from 80)
      { left: -50, top: 75 },   // 4th: left, 4th row (reduced from 120)
      { left: 0, top: 100 },    // 5th: center, 5th row (reduced from 160)
      { left: 50, top: 125 },   // 6th: right, 6th row (reduced from 200)
      { left: 85, top: 150 },   // 7th: more right, 7th row (reduced from 240)
      { left: 50, top: 175 },   // 8th: right, 8th row (reduced from 280)
      { left: 0, top: 200 },    // 9th: center, 9th row (reduced from 320)
      { left: -50, top: 225 },  // 10th: left, 10th row (reduced from 360)
      { left: -85, top: 250 },  // 11th: more left, 11th row (reduced from 400)
      { left: 0, top: 275 },    // 12th: center, 12th row (reduced from 440)
    ];

    return positions[index] || { left: 0, top: index * 25 }; // Reduced from 40 to 25
  };

  // Get icon for each bölüm
  const getBolumIcon = (bolumNumber) => {
    const icons = [
      'star', 'lock-closed', 'book', 'trophy', 'star',
      'lock-closed', 'book', 'trophy', 'star', 'lock-closed',
      'book', 'trophy'
    ];
    return icons[(bolumNumber - 1) % icons.length];
  };

  // Render a single circle
  const renderCircle = (bolumData, index) => {
    const { level, bolum, displayText } = bolumData;
    const isUnlocked = (currentLevel > level) || (currentLevel === level && currentBolum >= bolum);
    const isActive = currentLevel === level && currentBolum === bolum;
    const position = getCirclePosition(index, bolumData.length);
    const iconName = getBolumIcon(bolum);

    return (
      <View key={`bolum-${level}-${bolum}`} style={[styles.circleContainer, position]}>
        <TouchableOpacity 
          onPress={isActive ? () => handleStartLesson(level, bolum) : null}
          disabled={!isActive}
        >
          <View style={styles.circleWrapper}>
            <View style={[styles.shadowCircle, isActive && styles.activeShadowCircle]} />
            <Animated.View style={[
              isUnlocked ? styles.activeCircle : styles.inactiveCircle,
              isActive && styles.currentCircle,
              { transform: [{ rotate: spin }] } // Apply rotation to the circle
            ]}>
              <Ionicons 
                name={iconName} 
                size={isActive ? 24 : 20} // Larger icon for current circle
                color={isUnlocked ? "#fff" : "#B0B0B0"} 
              />
            </Animated.View>
          </View>
        </TouchableOpacity>
        {/* Title under the circle */}
        <Text style={[styles.circleTitle, isActive && styles.currentCircleTitle]}>{displayText}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { transform: [{ scale: spinValue }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ scale: spinValue }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ scale: spinValue }] }]} />
        </View>
        <Text style={styles.loadingText}>Yükleniyor</Text>
      </View>
    );
  }

  if (bolumData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>No Bölüms Available</Text>
        <Text style={styles.emptyText}>
          No bölüms match your exam preferences or have questions yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Render all bölüm circles dynamically */}
        {bolumData.map((bolumData, index) => {
          return renderCircle(bolumData, index);
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingBottom: 100, // Add bottom padding to ensure all circles are visible
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    width: '100%',
    paddingHorizontal: 50,
    backgroundColor: '#FFFFFF',
    minHeight: '100%', // Ensure container takes full height
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 12, // Reduced from 25 to 15
    position: 'relative',
  },
  squareContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  circleWrapper: {
    position: 'relative',
  },
  shadowCircle: {
    position: 'absolute',
    width: 80, // Increased from 70
    height: 75, // Increased from 65
    borderRadius: 40, // Increased from 35
    backgroundColor: '#CCCCCC',
    top: 6,
    left: 0,
    zIndex: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shadowSquare: {
    position: 'absolute',
    width: 90,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#CCCCCC',
    top: 6,
    left: 0,
    zIndex: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  speechBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechBubbleText: {
    color: '#32CD32',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeCircle: {
    width: 80, // Increased from 70
    height: 75, // Increased from 65
    borderRadius: 40, // Increased from 35
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  progressRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFD700',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveCircle: {
    width: 80, // Increased from 70
    height: 75, // Increased from 65
    borderRadius: 40, // Increased from 35
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  squareBox: {
    width: 90,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeSquare: {
    width: 90,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    marginBottom: 50,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 15,
    textAlign: 'center',
    lineHeight: 14,
  },
  levelSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingBottom: 5, // Reduced from 10 to 5 to move it even lower
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  circleTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  currentCircle: {
    width: 90, // Increased from 80
    height: 85, // Increased from 75
    borderRadius: 45, // Increased from 40
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currentCircleTitle: {
    fontSize: 14, // Slightly larger font for current circle
    fontWeight: 'bold',
    color: '#000080', // Changed from white to navy blue for better visibility
  },
  activeShadowCircle: {
    width: 90, // Match current circle size
    height: 85, // Match current circle size
    borderRadius: 45, // Match current circle size
    backgroundColor: '#CCCCCC', // Keep original shadow color
    borderColor: '#E0E0E0',
  },
  loadingCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#000080',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000080',
    marginHorizontal: 5,
  },
}); 