import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/supabase';

export default function QuestionScreen({ navigation, route }) {
  const { userProfile, refreshUserProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mistakes, setMistakes] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Get the specific bölüm and level from route params, or use current from profile
  const targetLevel = route?.params?.level || userProfile?.current_level || 1;
  const targetBolum = route?.params?.bolum || userProfile?.current_bolum || 1;

  useEffect(() => {
    loadQuestions();
  }, [targetLevel, targetBolum]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const currentKidem = userProfile?.current_kidem || 1;

      console.log('Loading questions for:', { currentKidem, targetLevel, targetBolum });

      const questionsData = await DatabaseService.getQuestions(
        'TYT', // Default to TYT for now
        null, // No specific division
        currentKidem,
        targetLevel,
        targetBolum
      );

      if (questionsData && questionsData.length > 0) {
        // Debug: Log the first question structure
        console.log('First question structure:', JSON.stringify(questionsData[0], null, 2));
        
        // Shuffle questions for variety
        const shuffledQuestions = questionsData.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        console.log(`Loaded ${shuffledQuestions.length} questions`);
      } else {
        console.log('No questions found for current level');
        Alert.alert('No Questions', 'No questions available for your current level.');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = answer === currentQuestion.correct_answer;
    
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setMistakes(prev => prev + 1);
    }

    // Record the attempt (but don't block if it fails)
    DatabaseService.recordQuestionAttempt(
      userProfile.id,
      currentQuestion.id, // Use the UUID 'id' field instead of 'question_id'
      isAnswerCorrect,
      null, // timeSpent
      userProfile // Pass userProfile for kidem, level, bolum
    ).catch(error => {
      console.log('Failed to record attempt, but continuing:', error);
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // End of questions
      handleFinishBolum();
    }
  };

  const handleFinishBolum = () => {
    const successRate = (correctAnswers / questions.length) * 100;
    const maxMistakes = 3;
    
    if (mistakes <= maxMistakes) {
      Alert.alert(
        'Bölüm Tamamlandı!',
        `Tebrikler! ${correctAnswers}/${questions.length} doğru cevap.`,
        [
          {
            text: 'Devam Et',
            onPress: () => {
              // Update user progress
              updateUserProgress();
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Bölüm Başarısız',
        `${mistakes} hata yaptınız. Maksimum ${maxMistakes} hata izin verilir.`,
        [
          {
            text: 'Tekrar Dene',
            onPress: () => {
              // Reset for retry
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setIsCorrect(false);
              setMistakes(0);
              setCorrectAnswers(0);
            }
          }
        ]
      );
    }
  };

  const updateUserProgress = async () => {
    try {
      const currentKidem = userProfile?.current_kidem || 1;
      const currentLevel = userProfile?.current_level || 1;
      const currentBolum = userProfile?.current_bolum || 1;

      // Calculate new progress - advance from the completed bölüm
      let newKidem = currentKidem;
      let newLevel = currentLevel;
      let newBolum = targetBolum + 1; // Advance from the bölüm that was just completed

      // Check if we need to advance to next level (12 bölüms per level)
      if (newBolum > 12) {
        newBolum = 1;
        newLevel += 1;
      }

      // Check if we need to advance to next kıdem (100 levels per kıdem)
      if (newLevel > 100) {
        newLevel = 1;
        newKidem += 1;
      }

      // Update user profile
      await DatabaseService.updateUserProfile(userProfile.id, {
        current_kidem: newKidem,
        current_level: newLevel,
        current_bolum: newBolum,
        total_questions_answered: (userProfile.total_questions_answered || 0) + questions.length,
        total_correct_answers: (userProfile.total_correct_answers || 0) + correctAnswers,
        total_points: (userProfile.total_points || 0) + (correctAnswers * 10),
      });

      // Update user progress table
      try {
        await DatabaseService.updateUserProgress(userProfile.id, {
          current_kidem: newKidem,
          current_level: newLevel,
          current_bolum: newBolum,
        });
      } catch (progressError) {
        console.log('Progress update failed, but continuing:', progressError.message);
      }

      // Update user statistics
      // try {
      //   await DatabaseService.updateUserStatistics(userProfile.id, {
      //     total_questions_answered: (userProfile.total_questions_answered || 0) + questions.length,
      //   });
      // } catch (statsError) {
      //   console.log('Statistics update failed, but continuing:', statsError.message);
      // }

      // Create achievement if bölüm completed successfully
      if (mistakes <= 3) {
        try {
          await DatabaseService.createUserAchievement(userProfile.id, {
            achievement_type: 'bolum_completed',
            achievement_name: `Bölüm ${targetBolum} Tamamlandı`,
            points_earned: correctAnswers * 10,
          });
        } catch (achievementError) {
          console.log('Achievement creation failed, but continuing:', achievementError.message);
        }
      }

      // Refresh the user profile to update UI
      await refreshUserProfile();

      Alert.alert('İlerleme Güncellendi', 'Yeni seviyenize geçtiniz!', [
        {
          text: 'Tamam',
          onPress: () => {
            // Navigate back to main screen
            navigation.goBack();
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Hata', 'İlerleme güncellenirken hata oluştu.', [
        {
          text: 'Tamam',
          onPress: () => {
            // Navigate back to main screen even if update fails
            navigation.goBack();
          }
        }
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000080" />
          <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noQuestionsContainer}>
          <Ionicons name="alert-circle" size={60} color="#666" />
          <Text style={styles.noQuestionsText}>Bu seviye için soru bulunamadı</Text>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  let options = [];
  
  try {
    if (currentQuestion.options) {
      // Check if options is already an array or needs parsing
      if (Array.isArray(currentQuestion.options)) {
        options = currentQuestion.options;
      } else {
        // If it's a string, try to parse it
        options = JSON.parse(currentQuestion.options);
      }
    }
  } catch (error) {
    console.error('Error parsing options JSON:', error);
    console.log('Raw options data:', currentQuestion.options);
    // Fallback to empty array if JSON parsing fails
    options = [];
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Soru {currentQuestionIndex + 1} / {questions.length}
        </Text>
        <Text style={styles.mistakesText}>
          Hatalar: {mistakes}/3
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        {currentQuestion.sub_text && (
          <Text style={styles.subText}>{currentQuestion.sub_text}</Text>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              isAnswered && option === currentQuestion.correct_answer && styles.correctOption,
              isAnswered && selectedAnswer === option && option !== currentQuestion.correct_answer && styles.incorrectOption,
            ]}
            onPress={() => handleAnswerSelect(option)}
            disabled={isAnswered}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === option && styles.selectedOptionText,
              isAnswered && option === currentQuestion.correct_answer && styles.correctOptionText,
              isAnswered && selectedAnswer === option && option !== currentQuestion.correct_answer && styles.incorrectOptionText,
            ]}>
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackContent}>
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "close-circle"} 
              size={40} 
              color={isCorrect ? "#32CD32" : "#FF4444"} 
            />
            <Text style={styles.feedbackText}>
              {isCorrect ? "Doğru!" : "Yanlış!"}
            </Text>
            <Text style={styles.correctAnswerText}>
              Doğru cevap: {currentQuestion.correct_answer}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mistakesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4444',
  },
  questionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#000080',
    borderColor: '#000080',
  },
  correctOption: {
    backgroundColor: '#32CD32',
    borderColor: '#32CD32',
  },
  incorrectOption: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  feedbackContainer: {
    padding: 20,
    marginTop: 20,
  },
  feedbackContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: '#000080',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 