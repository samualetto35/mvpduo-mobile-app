import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function HeroLevels({ navigation }) {
  const { userProfile, refreshUserProfile } = useAuth();

  // Refresh profile when component mounts to ensure latest data
  useEffect(() => {
    refreshUserProfile();
  }, []);

  const handleStartLesson = () => {
    if (navigation) {
      navigation.navigate('QuestionScreen');
    }
  };

  // Calculate current progress
  const currentKidem = userProfile?.current_kidem || 1;
  const currentLevel = userProfile?.current_level || 1;
  const currentBolum = userProfile?.current_bolum || 1;

  // Determine which circles should be unlocked
  const isFirstCircleUnlocked = currentBolum >= 1;
  const isSecondCircleUnlocked = currentBolum >= 2;
  const isThirdCircleUnlocked = currentBolum >= 3;
  const isFourthCircleUnlocked = currentBolum >= 4;
  const isFifthCircleUnlocked = currentBolum >= 5;
  const isSquareUnlocked = currentBolum >= 6;

  // Determine which circle is the current active one (for clicking)
  const getCurrentActiveCircle = () => {
    if (currentBolum <= 5) {
      return currentBolum; // 1-5 for circles
    } else {
      return 6; // 6 for square
    }
  };

  const currentActiveCircle = getCurrentActiveCircle();

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* First Circle - Top (Center) */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 1 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 1}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowCircle} />
              <View style={isFirstCircleUnlocked ? styles.activeCircle : styles.inactiveCircle}>
                <View style={styles.starContainer}>
                  <Ionicons name="star" size={20} color="#fff" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Second Circle - 5px left from center */}
        <View style={[styles.circleContainer, { left: -50 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 2 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 2}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowCircle} />
              <View style={isSecondCircleUnlocked ? styles.activeCircle : styles.inactiveCircle}>
                <Ionicons 
                  name="lock-closed" 
                  size={18} 
                  color={isSecondCircleUnlocked ? "#fff" : "#B0B0B0"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Third Circle - 10px left from center */}
        <View style={[styles.circleContainer, { left: -85 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 3 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 3}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowCircle} />
              <View style={isThirdCircleUnlocked ? styles.activeCircle : styles.inactiveCircle}>
                <Ionicons 
                  name="lock-closed" 
                  size={18} 
                  color={isThirdCircleUnlocked ? "#fff" : "#B0B0B0"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Fourth Circle - 5px left from center */}
        <View style={[styles.circleContainer, { left: -50 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 4 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 4}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowCircle} />
              <View style={isFourthCircleUnlocked ? styles.activeCircle : styles.inactiveCircle}>
                <Ionicons 
                  name="book" 
                  size={18} 
                  color={isFourthCircleUnlocked ? "#fff" : "#B0B0B0"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Fifth Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 5 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 5}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowCircle} />
              <View style={isFifthCircleUnlocked ? styles.activeCircle : styles.inactiveCircle}>
                <Ionicons 
                  name="trophy" 
                  size={18} 
                  color={isFifthCircleUnlocked ? "#fff" : "#B0B0B0"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sixth Circle - Square with rounded corners */}
        <View style={[styles.squareContainer, { left: 0 }]}>
          <TouchableOpacity 
            onPress={currentActiveCircle === 6 ? handleStartLesson : null}
            disabled={currentActiveCircle !== 6}
          >
            <View style={styles.circleWrapper}>
              <View style={styles.shadowSquare} />
              <View style={isSquareUnlocked ? styles.activeSquare : styles.squareBox}>
                <Ionicons 
                  name="trophy" 
                  size={26} 
                  color={isSquareUnlocked ? "#fff" : "#B0B0B0"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Linear line with text */}
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.levelText}>Level {currentLevel} Bölüm {currentBolum}</Text>
          <View style={styles.line} />
        </View>

        {/* Second set of circles - going to the right */}
        {/* First Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowCircle} />
            <View style={styles.inactiveCircle}>
              <Ionicons name="star" size={18} color="#B0B0B0" />
            </View>
          </View>
        </View>

        {/* Second Circle - 5px right from center */}
        <View style={[styles.circleContainer, { left: 50 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowCircle} />
            <View style={styles.inactiveCircle}>
              <Ionicons name="lock-closed" size={18} color="#B0B0B0" />
            </View>
          </View>
        </View>

        {/* Third Circle - 10px right from center */}
        <View style={[styles.circleContainer, { left: 85 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowCircle} />
            <View style={styles.inactiveCircle}>
              <Ionicons name="book" size={18} color="#B0B0B0" />
            </View>
          </View>
        </View>

        {/* Fourth Circle - 5px right from center */}
        <View style={[styles.circleContainer, { left: 50 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowCircle} />
            <View style={styles.inactiveCircle}>
              <Ionicons name="trophy" size={18} color="#B0B0B0" />
            </View>
          </View>
        </View>

        {/* Fifth Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowCircle} />
            <View style={styles.inactiveCircle}>
              <Ionicons name="star" size={18} color="#B0B0B0" />
            </View>
          </View>
        </View>

        {/* Sixth Circle - Square with rounded corners */}
        <View style={[styles.squareContainer, { left: 0 }]}>
          <View style={styles.circleWrapper}>
            <View style={styles.shadowSquare} />
            <View style={styles.squareBox}>
              <Ionicons name="trophy" size={26} color="#B0B0B0" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Added white background
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#FFFFFF', // Added white background
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    width: '100%',
    paddingHorizontal: 50, // Add horizontal padding to ensure circles are visible
    backgroundColor: '#FFFFFF', // Added white background
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 25, // Changed from 20 to 25
    position: 'relative',
  },
  squareContainer: {
    alignItems: 'center',
    marginBottom: 30, // Keep squares at 30
    position: 'relative',
  },
  circleWrapper: {
    position: 'relative',
  },
  shadowCircle: {
    position: 'absolute',
    width: 70,
    height: 65, // Changed from 62 to make it more circular
    borderRadius: 35,
    backgroundColor: '#CCCCCC', // Made darker from #E0E0E0
    top: 6,
    left: 0,
    zIndex: 0, // Changed from -1 to 0 to make visible
    borderWidth: 1, // Same border as main circle
    borderColor: '#E0E0E0', // Same border color
  },
  shadowSquare: {
    position: 'absolute',
    width: 90, // Increased from 80
    height: 80, // Increased from 70 to maintain elliptical ratio
    borderRadius: 22, // Increased from 20 to match new size
    backgroundColor: '#CCCCCC', // Made darker from #E0E0E0
    top: 6,
    left: 0,
    zIndex: 0, // Changed from -1 to 0 to make visible
    borderWidth: 1, // Same border as main square
    borderColor: '#E0E0E0', // Same border color
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
    fontSize: 14, // Increased from 12
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeCircle: {
    width: 70,
    height: 65, // Changed from 62 to make it more circular
    borderRadius: 35,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Added grey stroke
    borderColor: '#E0E0E0', // Grey stroke color
  },
  progressRing: {
    position: 'absolute',
    width: 80, // Increased from 70
    height: 80, // Increased from 70
    borderRadius: 40, // Increased from 35 to match new size
    borderWidth: 3,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 80, // Increased from 70
    height: 80, // Increased from 70
    borderRadius: 40, // Increased from 35 to match new size
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
    width: 70,
    height: 65, // Changed from 62 to make it more circular
    borderRadius: 35,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Added grey stroke
    borderColor: '#E0E0E0', // Grey stroke color
  },
  squareBox: {
    width: 90, // Increased from 80
    height: 80, // Increased from 70 to maintain elliptical ratio
    borderRadius: 22, // Increased from 20 to match new size
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Added grey stroke
    borderColor: '#E0E0E0', // Grey stroke color
  },
  activeSquare: {
    width: 90, // Increased from 80
    height: 80, // Increased from 70 to maintain elliptical ratio
    borderRadius: 22, // Increased from 20 to match new size
    backgroundColor: '#32CD32', // Green like active circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Added grey stroke
    borderColor: '#E0E0E0', // Grey stroke color
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30, // Add more top padding to the line container
    marginBottom: 50, // Add more bottom padding after the line
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
    lineHeight: 14, // Match the line height to align with lines
  },
}); 