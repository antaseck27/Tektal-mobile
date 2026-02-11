// screens/TableauDeBord/VideoRecorderScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { usePaths } from '../../context/PathContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoRecorderScreen({ route, navigation }) {
  const { departure, destination, pathType } = route.params;
  const { addPath } = usePaths();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  // ✅ États
  const [step, setStep] = useState('description'); // 'description' | 'recording' | 'preview'
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facing, setFacing] = useState('back');
  const [isSaving, setIsSaving] = useState(false);
  
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);

  const MAX_RECORDING_TIME = 45;

  const player = useVideoPlayer(videoUri || '', player => {
    if (videoUri) {
      player.loop = true;
      player.play();
    }
  });

  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!microphonePermission?.granted) await requestMicrophonePermission();
      if (!mediaPermission?.granted) await requestMediaPermission();
      if (!locationPermission?.granted) await requestLocationPermission();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (locationPermission?.granted) {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          console.log('📍 Position initiale:', location.coords);
        } catch (error) {
          console.error('Erreur obtention position:', error);
        }
      }
    })();
  }, [locationPermission]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // ✅ Passer à l'étape enregistrement
  const handleStartRecording = () => {
    if (!description.trim()) {
      Alert.alert('Description manquante', 'Veuillez ajouter une description du trajet');
      return;
    }
    setStep('recording');
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingTime(0);
        setCoordinates([]);

        if (locationPermission?.granted) {
          locationSubscription.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 5,
            },
            (location) => {
              const newCoord = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: Date.now(),
              };
              
              setCoordinates((prev) => [...prev, newCoord]);
              console.log('📍 GPS:', newCoord);
            }
          );
        }

        const video = await cameraRef.current.recordAsync({
          maxDuration: MAX_RECORDING_TIME,
        });

        setVideoUri(video.uri);
        setIsRecording(false);
        setStep('preview');

        if (locationSubscription.current) {
          locationSubscription.current.remove();
        }
      } catch (error) {
        console.log('Erreur enregistrement:', error);
        Alert.alert('Erreur', 'Impossible d\'enregistrer la vidéo');
        setIsRecording(false);
        
        if (locationSubscription.current) {
          locationSubscription.current.remove();
        }
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    }
  };

  const retakeVideo = () => {
    setVideoUri(null);
    setRecordingTime(0);
    setCoordinates([]);
    setStep('recording');
  };

  const handleValidate = async () => {
    if (!videoUri) {
      Alert.alert('Erreur', 'Aucune vidéo enregistrée');
      return;
    }

    setIsSaving(true);

    try {
      const pathData = {
        title: `${departure} → ${destination}`,
        departure,
        destination,
        pathType,
        videoUri,
        duration: `${recordingTime} sec`,
        steps: 0,
        creator: 'Mamadou',
        campus: 'Bakeli Dakar',
        isOfficial: pathType === 'official',
        isFavorite: false,
        thumbnail: videoUri,
        views: 0,
        likes: 0,
        coordinates: coordinates.length > 0 ? coordinates : null,
        startLocation: coordinates.length > 0 ? coordinates[0] : currentLocation,
        endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : null,
        description: description.trim(),
      };

      console.log('📍 Nombre de points GPS enregistrés:', coordinates.length);
      console.log('Sauvegarde du chemin:', pathData);

      const result = await addPath(pathData);

      setIsSaving(false);

      if (result.success) {
        Alert.alert(
          '🎉 Chemin publié !',
          `Vidéo enregistrée avec ${coordinates.length} points GPS`,
          [
            {
              text: 'Voir mes chemins',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Dashboard',
                      state: {
                        routes: [{ name: 'Accueil' }],
                      },
                    },
                  ],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder le chemin');
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Erreur validation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasAllPermissions =
    cameraPermission?.granted &&
    microphonePermission?.granted &&
    mediaPermission?.granted &&
    locationPermission?.granted;

  if (cameraPermission === null || microphonePermission === null || mediaPermission === null || locationPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
        <Text style={styles.loadingText}>Chargement des permissions...</Text>
      </View>
    );
  }

  if (!hasAllPermissions) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="location-outline" size={80} color="#999" />
        <Text style={styles.permissionText}>
          Permissions requises
        </Text>
        <Text style={styles.permissionSubtext}>
          Veuillez autoriser l'accès à la caméra, au micro, à la bibliothèque et à la localisation GPS
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ ÉTAPE 1: DESCRIPTION
  if (step === 'description') {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#FEBD00', '#FFD700']}
          style={styles.descriptionScreenGradient}
        >
          <ScrollView 
            contentContainerStyle={styles.descriptionScreenContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.descriptionScreenHeader}>
              <TouchableOpacity
                style={styles.closeButtonWhite}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="close" size={30} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Icône */}
            <View style={styles.descriptionIconContainer}>
              <View style={styles.descriptionIconCircle}>
                <Ionicons name="document-text" size={60} color="#FEBD00" />
              </View>
            </View>

            {/* Titre */}
            <Text style={styles.descriptionScreenTitle}>
              Décrivez votre trajet
            </Text>
            <Text style={styles.descriptionScreenSubtitle}>
              {departure} → {destination}
            </Text>

            {/* Champ de description */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionLabel}>
                Description du trajet
              </Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Ex: Passer par la grande porte, tourner à droite après le bâtiment A, prendre l'escalier au fond du couloir..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
                autoFocus
              />
              <View style={styles.descriptionFooter}>
                <Text style={styles.characterCount}>
                  {description.length}/500 caractères
                </Text>
                {description.length >= 20 && (
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                )}
              </View>
            </View>

            {/* Conseils */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>
                <Ionicons name="bulb" size={16} color="#FEBD00" /> Conseils
              </Text>
              <Text style={styles.tipsText}>
                • Décrivez les points de repère visibles{'\n'}
                • Mentionnez les virages et changements de direction{'\n'}
                • Indiquez les obstacles ou difficultés éventuels
              </Text>
            </View>

            {/* Bouton suivant */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                !description.trim() && styles.nextButtonDisabled
              ]}
              onPress={handleStartRecording}
              disabled={!description.trim()}
            >
              <Text style={styles.nextButtonText}>
                Commencer l'enregistrement
              </Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  // ✅ ÉTAPE 2: ENREGISTREMENT
  if (step === 'recording') {
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="video"
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setStep('description')}
              >
                <Ionicons name="arrow-back" size={30} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>
                  {departure} → {destination}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {pathType === 'official' ? '🛡️ Officiel' : '👥 Communautaire'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
              >
                <Ionicons name="camera-reverse" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.gpsIndicator}>
              <Ionicons 
                name={currentLocation ? "location" : "location-outline"} 
                size={16} 
                color={currentLocation ? "#34C759" : "#999"} 
              />
              <Text style={styles.gpsIndicatorText}>
                {currentLocation ? "GPS actif" : "En attente GPS..."}
              </Text>
              {isRecording && (
                <Text style={styles.gpsCount}>{coordinates.length} pts</Text>
              )}
            </View>

            <View style={styles.timerContainer}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>
                  {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                </Text>
              </View>
            </View>

            {!isRecording && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>
                  📹 Enregistrez votre trajet en vidéo verticale
                </Text>
                <Text style={styles.instructionsSubtext}>
                  📍 Le GPS enregistrera automatiquement votre parcours
                </Text>
              </View>
            )}

            <View style={styles.controls}>
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && styles.recordButtonActive,
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={!currentLocation}
              >
                <View style={[
                  styles.recordButtonInner,
                  isRecording && styles.recordButtonInnerActive,
                ]} />
              </TouchableOpacity>

              {isRecording && (
                <Text style={styles.recordingText}>● En cours...</Text>
              )}
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // ✅ ÉTAPE 3: PRÉVISUALISATION
  if (step === 'preview') {
    return (
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          allowsFullscreen
          allowsPictureInPicture
        />

        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Prévisualisation</Text>
          <Text style={styles.previewSubtitle}>
            {departure} → {destination}
          </Text>
          <Text style={styles.previewDuration}>
            Durée: {formatTime(recordingTime)}
          </Text>
          {coordinates.length > 0 && (
            <View style={styles.gpsBadge}>
              <Ionicons name="location" size={14} color="#FEBD00" />
              <Text style={styles.gpsText}>{coordinates.length} points GPS</Text>
            </View>
          )}
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.retakeButton]}
            onPress={retakeVideo}
            disabled={isSaving}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Refaire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.validateButton]}
            onPress={handleValidate}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Publier</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isSaving && (
          <View style={styles.savingOverlay}>
            <View style={styles.savingBox}>
              <ActivityIndicator size="large" color="#FEBD00" />
              <Text style={styles.savingText}>Publication en cours...</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // DESCRIPTION SCREEN
  descriptionScreenGradient: {
    flex: 1,
  },
  descriptionScreenContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  descriptionScreenHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  closeButtonWhite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  descriptionIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  descriptionScreenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionScreenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 150,
    borderWidth: 2,
    borderColor: '#FEBD00',
  },
  descriptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Permissions & Loading
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },

  // Recording Screen
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    gap: 6,
  },
  gpsIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  gpsCount: {
    color: '#FEBD00',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEBD00',
  },
  instructionsContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  instructionsSubtext: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordButtonActive: {
    borderColor: '#ff3b30',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff3b30',
  },
  recordButtonInnerActive: {
    borderRadius: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginTop: 15,
  },

  // Preview
  previewHeader: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
  },
  previewDuration: {
    fontSize: 12,
    color: '#FEBD00',
    marginTop: 5,
    fontWeight: 'bold',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52,199,89,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  gpsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: '#666',
  },
  validateButton: {
    backgroundColor: '#FEBD00',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FEBD00',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  savingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});