import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeroLevels() {
  return (
    <ScrollView 
      style={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Active Circle - Top (Center) */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>BAŞLA</Text>
          </View>
          <View style={styles.activeCircle}>
            <View style={styles.progressRing}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.starContainer}>
              <Ionicons name="star" size={24} color="#fff" />
            </View>
          </View>
        </View>

        {/* Second Circle - 5px left from center */}
        <View style={[styles.circleContainer, { left: -50 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="lock-closed" size={20} color="#666" />
          </View>
        </View>

        {/* Third Circle - 10px left from center */}
        <View style={[styles.circleContainer, { left: -85 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="lock-closed" size={20} color="#666" />
          </View>
        </View>

        {/* Fourth Circle - 5px left from center */}
        <View style={[styles.circleContainer, { left: -50 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="book" size={20} color="#666" />
          </View>
        </View>

        {/* Fifth Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="trophy" size={20} color="#666" />
          </View>
        </View>

        {/* Sixth Circle - Square with rounded corners */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.squareBox}>
            <Ionicons name="trophy" size={30} color="#666" />
          </View>
        </View>

        {/* Linear line with text */}
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.levelText}>Level 24 Bölüm 7</Text>
          <View style={styles.line} />
        </View>

        {/* Second set of circles - going to the right */}
        {/* First Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="star" size={20} color="#666" />
          </View>
        </View>

        {/* Second Circle - 5px right from center */}
        <View style={[styles.circleContainer, { left: 50 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="lock-closed" size={20} color="#666" />
          </View>
        </View>

        {/* Third Circle - 10px right from center */}
        <View style={[styles.circleContainer, { left: 85 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="book" size={20} color="#666" />
          </View>
        </View>

        {/* Fourth Circle - 5px right from center */}
        <View style={[styles.circleContainer, { left: 50 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="trophy" size={20} color="#666" />
          </View>
        </View>

        {/* Fifth Circle - Center */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.inactiveCircle}>
            <Ionicons name="star" size={20} color="#666" />
          </View>
        </View>

        {/* Sixth Circle - Square with rounded corners */}
        <View style={[styles.circleContainer, { left: 0 }]}>
          <View style={styles.squareBox}>
            <Ionicons name="trophy" size={30} color="#666" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    width: '100%',
    paddingHorizontal: 50, // Add horizontal padding to ensure circles are visible
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
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
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  progressRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  squareBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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