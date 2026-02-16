// screens/TableauDeBord/VideoRecorderScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function VideoRecorderScreen({ route, navigation }) {
  const { departure, destination, pathType } = route.params;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  // ✅ États
  const [step, setStep] = useState('recording'); // 'recording' | 'preview'
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facing, setFacing] = useState('back');
  
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);

  const MAX_RECORDING_TIME = 120;

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

  // ✅ Navigation vers StepCreation au lieu de sauvegarder directement
  const handleValidate = () => {
    if (!videoUri) {
      Alert.alert('Erreur', 'Aucune vidéo enregistrée');
      return;
    }

    // ✅ Naviguer vers l'écran de création des steps
    navigation.navigate('StepCreation', {
      videoUri,
      videoDuration: recordingTime,
      departure,
      destination,
      pathType,
      startLocation: coordinates.length > 0 ? coordinates[0] : currentLocation,
      endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : currentLocation,
    });
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

  // ✅ ÉTAPE ENREGISTREMENT
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
                onPress={() => navigation.goBack()}
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

  // ✅ ÉTAPE PRÉVISUALISATION
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
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Refaire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.validateButton]}
            onPress={handleValidate}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
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
});