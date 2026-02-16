// screens/TableauDeBord/StepCreationScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function StepCreationScreen({ route, navigation }) {
  const { videoUri, videoDuration, departure, destination, pathType, startLocation, endLocation } = route.params;

  // ✅ États pour les steps (2 à 6 étapes obligatoires)
  const [steps, setSteps] = useState([
    { step_number: 1, start_time: 0, end_time: 10, text: '' },
    { step_number: 2, start_time: 10, end_time: videoDuration, text: '' },
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = false;
  });

  // ✅ Ajouter une étape (max 6)
  const addStep = () => {
    if (steps.length >= 6) {
      Alert.alert('Limite atteinte', 'Vous pouvez créer maximum 6 étapes');
      return;
    }

    const lastStep = steps[steps.length - 1];
    const newStartTime = lastStep.end_time;

    const newStep = {
      step_number: steps.length + 1,
      start_time: newStartTime,
      end_time: videoDuration,
      text: '',
    };

    // Ajuster le end_time de la dernière étape
    const updatedSteps = [...steps];
    updatedSteps[steps.length - 1].end_time = newStartTime + (videoDuration - newStartTime) / 2;

    setSteps([...updatedSteps, newStep]);
  };

  // ✅ Supprimer une étape (min 2)
  const removeStep = (index) => {
    if (steps.length <= 2) {
      Alert.alert('Minimum requis', 'Un chemin doit avoir au moins 2 étapes');
      return;
    }

    const updatedSteps = steps.filter((_, i) => i !== index);
    
    // Réajuster les numéros d'étapes
    updatedSteps.forEach((step, i) => {
      step.step_number = i + 1;
    });

    setSteps(updatedSteps);
    
    if (currentStepIndex >= updatedSteps.length) {
      setCurrentStepIndex(updatedSteps.length - 1);
    }
  };

  // ✅ Mettre à jour le texte d'une étape
  const updateStepText = (index, text) => {
    const updatedSteps = [...steps];
    updatedSteps[index].text = text;
    setSteps(updatedSteps);
  };

  // ✅ Mettre à jour le timing d'une étape
  const updateStepTime = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = Math.round(value);

    // Validation: start_time < end_time
    if (field === 'start_time' && value >= updatedSteps[index].end_time) {
      updatedSteps[index].end_time = Math.min(value + 1, videoDuration);
    }
    if (field === 'end_time' && value <= updatedSteps[index].start_time) {
      updatedSteps[index].start_time = Math.max(value - 1, 0);
    }

    setSteps(updatedSteps);
  };

  // ✅ Jouer/Pause la vidéo
  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  // ✅ Aller à l'étape sélectionnée dans la vidéo
  const goToStep = (step) => {
    player.currentTime = step.start_time;
    player.play();
    setIsPlaying(true);
  };

  // ✅ Validation et soumission
  const handleSubmit = () => {
    // Vérifier que toutes les étapes ont un texte
    const emptySteps = steps.filter(step => !step.text.trim());
    
    if (emptySteps.length > 0) {
      Alert.alert(
        'Étapes incomplètes',
        `Veuillez ajouter des instructions pour ${emptySteps.length === 1 ? 'l\'étape' : 'les étapes'} ${emptySteps.map(s => s.step_number).join(', ')}`
      );
      return;
    }

    // Vérifier que start_time < end_time pour chaque step
    const invalidSteps = steps.filter(step => step.start_time >= step.end_time);
    
    if (invalidSteps.length > 0) {
      Alert.alert(
        'Timings invalides',
        'Chaque étape doit avoir un temps de début inférieur au temps de fin'
      );
      return;
    }

    // ✅ Naviguer vers l'écran de confirmation finale
    navigation.navigate('PathConfirmation', {
      videoUri,
      videoDuration,
      departure,
      destination,
      pathType,
      startLocation,
      endLocation,
      steps,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FEBD00', '#FFD700']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Découper en étapes</Text>
          <Text style={styles.headerSubtitle}>
            {departure} → {destination}
          </Text>
        </View>

        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>{steps.length}/6</Text>
        </View>
      </LinearGradient>

      {/* Vidéo */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          allowsFullscreen={false}
        />
        
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTime}>
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Ionicons name="information-circle" size={20} color="#FEBD00" />
        <Text style={styles.instructionsText}>
          Définissez 2 à 6 étapes importantes du trajet avec leurs instructions
        </Text>
      </View>

      {/* Liste des étapes */}
      <ScrollView style={styles.stepsContainer} showsVerticalScrollIndicator={false}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepCard,
              currentStepIndex === index && styles.stepCardActive,
            ]}
          >
            {/* En-tête de l'étape */}
            <View style={styles.stepHeader}>
              <TouchableOpacity
                style={styles.stepNumberButton}
                onPress={() => {
                  setCurrentStepIndex(index);
                  goToStep(step);
                }}
              >
                <LinearGradient
                  colors={currentStepIndex === index ? ['#FEBD00', '#FFD700'] : ['#e0e0e0', '#e0e0e0']}
                  style={styles.stepNumberGradient}
                >
                  <Text style={styles.stepNumber}>{step.step_number}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.stepTitle}>Étape {step.step_number}</Text>

              {steps.length > 2 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeStep(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                </TouchableOpacity>
              )}
            </View>

            {/* Timing */}
            <View style={styles.timingSection}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>Début</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={step.start_time.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      updateStepTime(index, 'start_time', value);
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.timeUnit}>sec</Text>
                </View>
              </View>

              <Ionicons name="arrow-forward" size={16} color="#999" />

              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>Fin</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={step.end_time.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      updateStepTime(index, 'end_time', value);
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.timeUnit}>sec</Text>
                </View>
              </View>
            </View>

            {/* Sliders pour ajustement visuel */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Début: {formatTime(step.start_time)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={videoDuration}
                value={step.start_time}
                onValueChange={(value) => updateStepTime(index, 'start_time', value)}
                minimumTrackTintColor="#FEBD00"
                maximumTrackTintColor="#e0e0e0"
                thumbTintColor="#FEBD00"
                step={1}
              />
            </View>

            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Fin: {formatTime(step.end_time)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={videoDuration}
                value={step.end_time}
                onValueChange={(value) => updateStepTime(index, 'end_time', value)}
                minimumTrackTintColor="#FEBD00"
                maximumTrackTintColor="#e0e0e0"
                thumbTintColor="#FEBD00"
                step={1}
              />
            </View>

            {/* Instruction textuelle */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionLabel}>
                <Ionicons name="text" size={16} color="#FEBD00" /> Instruction
              </Text>
              <TextInput
                style={styles.instructionInput}
                placeholder="Ex: Tournez à droite après le bâtiment A"
                placeholderTextColor="#999"
                value={step.text}
                onChangeText={(text) => updateStepText(index, text)}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              <Text style={styles.charCount}>
                {step.text.length}/200
              </Text>
            </View>

            {/* Bouton preview de cette étape */}
            <TouchableOpacity
              style={styles.previewStepButton}
              onPress={() => goToStep(step)}
            >
              <Ionicons name="play-circle" size={20} color="#FEBD00" />
              <Text style={styles.previewStepText}>
                Voir cette étape
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Bouton ajouter une étape */}
        {steps.length < 6 && (
          <TouchableOpacity
            style={styles.addStepButton}
            onPress={addStep}
          >
            <Ionicons name="add-circle" size={24} color="#FEBD00" />
            <Text style={styles.addStepText}>Ajouter une étape</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bouton de validation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#FEBD00', '#FFD700']}
            style={styles.submitGradient}
          >
            <Text style={styles.submitButtonText}>
              Continuer
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stepCounter: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepCounterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  // Vidéo
  videoContainer: {
    height: height * 0.25,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(254,189,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  videoTime: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Instructions
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4D6',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },

  // Steps
  stepsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCardActive: {
    borderColor: '#FEBD00',
    backgroundColor: '#FFFBF0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberButton: {
    marginRight: 12,
  },
  stepNumberGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },

  // Timing
  timingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeUnit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },

  // Sliders
  sliderSection: {
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },

  // Instruction
  instructionSection: {
    marginTop: 8,
  },
  instructionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },

  // Preview step
  previewStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    gap: 6,
  },
  previewStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FEBD00',
  },

  // Add step
  addStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEBD00',
    borderStyle: 'dashed',
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  addStepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEBD00',
  },

  // Footer
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  bottomSpacing: {
    height: 20,
  },
});