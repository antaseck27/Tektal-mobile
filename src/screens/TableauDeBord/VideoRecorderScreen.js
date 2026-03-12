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
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { height } = Dimensions.get('window');
const MAX_RECORDING_TIME = 120;

const toSeconds = (duration) => {
  if (!duration && duration !== 0) return 0;
  const n = Number(duration);
  if (!Number.isFinite(n)) return 0;
  return n > 1000 ? Math.round(n / 1000) : Math.round(n);
};

export default function VideoRecorderScreen({ route, navigation }) {
  const {
    departure,
    destination,
    pathType,
    establishmentId,
  } = route.params || {};

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const [step, setStep] = useState('recording');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facing, setFacing] = useState('back');
  
  const [videoSegments, setVideoSegments] = useState([]);
  const [finalVideoUri, setFinalVideoUri] = useState(null);
  const [videoOrigin, setVideoOrigin] = useState('camera');

  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const locationSubscription = useRef(null);

  const player = useVideoPlayer(finalVideoUri || '', (playerInstance) => {
    if (finalVideoUri) {
      playerInstance.loop = true;
      playerInstance.play();
    }
  });

  const hasCameraPerms = cameraPermission?.granted && microphonePermission?.granted;

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
        } catch (error) {
          console.error('Erreur position:', error);
        }
      }
    })();
  }, [locationPermission?.granted]);

  useEffect(() => {
    if (!isRecording || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_RECORDING_TIME) {
          handleFinishRecording();
          return MAX_RECORDING_TIME;
        }
        return prev + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, isPaused]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSubscription.current) locationSubscription.current.remove();
    };
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) {
      Alert.alert('Erreur', 'Caméra non disponible');
      return;
    }

    try {
      setIsRecording(true);
      setIsPaused(false);

      if (videoSegments.length === 0 && locationPermission?.granted) {
        try {
          locationSubscription.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 5,
            },
            (location) => {
              setCoordinates((prev) => [...prev, {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: Date.now(),
              }]);
            }
          );
        } catch (e) {
          console.log('GPS non disponible:', e);
        }
      }

      const video = await cameraRef.current.recordAsync();

      if (video?.uri) {
        setVideoSegments((prev) => [...prev, video.uri]);
        console.log('✅ Segment enregistré:', video.uri);
      }

    } catch (error) {
      console.log('Erreur enregistrement:', error);
      if (!error.message?.includes('stopped') && !error.message?.includes('cancel')) {
        Alert.alert('Erreur', "Impossible d'enregistrer la vidéo.");
      }
    }
  };

  const pauseRecording = () => {
    if (cameraRef.current && isRecording && !isPaused) {
      cameraRef.current.stopRecording();
      setIsPaused(true);
      console.log('⏸️ Pause enregistrement');
    }
  };

  const resumeRecording = () => {
    if (isPaused) {
      setIsPaused(false);
      startRecording();
      console.log('▶️ Reprise enregistrement');
    }
  };

  const handleFinishRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
    setIsRecording(false);
    setIsPaused(false);

    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    if (videoSegments.length > 0) {
      // ✅ Utiliser le dernier segment (le plus complet)
      const lastSegment = videoSegments[videoSegments.length - 1];
      setFinalVideoUri(lastSegment);
      setStep('preview');
      
      if (videoSegments.length > 1) {
        Alert.alert(
          'Information',
          `${videoSegments.length} segments enregistrés. Utilisation du dernier segment.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert('Erreur', 'Aucune vidéo enregistrée');
    }
  };

  const pickFromGallery = async () => {
    if (!mediaPermission?.granted) {
      const req = await requestMediaPermission();
      if (!req.granted) {
        Alert.alert('Permission requise', "Autorisez l'accès à la galerie.");
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const picked = result.assets?.[0];
      if (!picked?.uri) {
        Alert.alert('Erreur', 'Impossible de récupérer la vidéo sélectionnée.');
        return;
      }

      setFinalVideoUri(picked.uri);
      setRecordingTime(toSeconds(picked.duration));
      setVideoOrigin('gallery');
      setVideoSegments([]);
      setStep('preview');
      
    } catch (error) {
      console.error('Erreur galerie:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie.");
    }
  };

  const retakeVideo = () => {
    if (videoOrigin === 'gallery') {
      pickFromGallery();
      return;
    }
    setFinalVideoUri(null);
    setVideoSegments([]);
    setRecordingTime(0);
    setCoordinates([]);
    setVideoOrigin('camera');
    setStep('recording');
  };

  const handleValidate = () => {
    if (!finalVideoUri) {
      Alert.alert('Erreur', 'Aucune vidéo disponible');
      return;
    }
    navigation.navigate('StepCreation', {
      videoUri: finalVideoUri,
      videoDuration: recordingTime,
      departure,
      destination,
      pathType,
      videoSource: videoOrigin,
      establishmentId,
      startLocation: coordinates.length > 0 ? coordinates[0] : currentLocation,
      endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : currentLocation,
      gpsCoordinates: coordinates,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasCameraPerms) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="videocam-outline" size={80} color="#999" />
        <Text style={styles.permissionText}>Permissions requises</Text>
        <Text style={styles.permissionSubtext}>
          Veuillez autoriser l'accès à la caméra, au micro et à la galerie.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={async () => {
          await requestCameraPermission();
          await requestMicrophonePermission();
          await requestMediaPermission();
        }}>
          <Text style={styles.backButtonText}>Autoriser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backButton, styles.backSecondary]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'recording') {
    return (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{departure} → {destination}</Text>
            </View>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <Ionicons name="camera-reverse" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bouton Galerie */}
          <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
            <Ionicons name="images" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>
                {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
              </Text>
            </View>
            {videoSegments.length > 0 && (
              <View style={styles.segmentBadge}>
                <Text style={styles.segmentText}>{videoSegments.length} segment(s)</Text>
              </View>
            )}
          </View>

          <View style={styles.controls}>
            {!isRecording && videoSegments.length === 0 && (
              <Text style={styles.instructionsText}>Appuyez pour commencer</Text>
            )}
            
            {isRecording && !isPaused && (
              <Text style={styles.recordingText}>● Enregistrement...</Text>
            )}

            {isPaused && (
              <Text style={styles.pausedText}>⏸️ En pause</Text>
            )}

            <View style={styles.controlButtons}>
              {!isRecording || isPaused ? (
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={isPaused ? resumeRecording : startRecording}
                >
                  <View style={styles.recordButtonInner}>
                    <Ionicons name={isPaused ? "play" : "ellipse"} size={40} color="#fff" />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.pauseButton}
                  onPress={pauseRecording}
                >
                  <Ionicons name="pause" size={40} color="#fff" />
                </TouchableOpacity>
              )}

              {(isRecording || isPaused || videoSegments.length > 0) && (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={handleFinishRecording}
                >
                  <Ionicons name="stop" size={28} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'preview') {
    return (
      <View style={styles.container}>
        <VideoView player={player} style={styles.video} allowsFullscreen allowsPictureInPicture />

        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Prévisualisation</Text>
          <Text style={styles.previewDuration}>Durée: {formatTime(recordingTime)}</Text>
          <View style={styles.sourceBadge}>
            <Ionicons
              name={videoOrigin === 'gallery' ? 'images-outline' : 'videocam-outline'}
              size={14}
              color="#FEBD00"
            />
            <Text style={styles.sourceBadgeText}>
              {videoOrigin === 'gallery' ? 'Galerie' : 'Caméra'}
            </Text>
          </View>
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity style={[styles.actionButton, styles.retakeButton]} onPress={retakeVideo}>
            <Ionicons name={videoOrigin === 'gallery' ? 'images-outline' : 'refresh'} size={24} color="#fff" />
            <Text style={styles.actionButtonText}>
              {videoOrigin === 'gallery' ? 'Autre vidéo' : 'Refaire'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.validateButton]} onPress={handleValidate}>
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
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, flex: 1, justifyContent: 'space-between' },
  video: { flex: 1, backgroundColor: '#000' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  permissionText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  permissionSubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, marginHorizontal: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  flipButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  galleryButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  timerContainer: { alignItems: 'center', marginTop: 20 },
  timerBox: { backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  timerText: { fontSize: 18, fontWeight: 'bold', color: '#FEBD00' },
  segmentBadge: { backgroundColor: '#FEBD00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  segmentText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  controls: { position: 'absolute', bottom: 40, alignSelf: 'center', alignItems: 'center', width: '100%' },
  instructionsText: { fontSize: 16, color: '#fff', marginBottom: 20, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
  recordingText: { fontSize: 16, fontWeight: 'bold', color: '#ff3b30', marginBottom: 15 },
  pausedText: { fontSize: 16, fontWeight: 'bold', color: '#FEBD00', marginBottom: 15 },
  controlButtons: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  recordButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  recordButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' },
  pauseButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  stopButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' },
  previewHeader: { position: 'absolute', top: 60, alignSelf: 'center', alignItems: 'center' },
  previewTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  previewDuration: { fontSize: 12, color: '#FEBD00', marginTop: 5, fontWeight: 'bold' },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(254,189,0,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8, gap: 4, borderWidth: 1, borderColor: '#FEBD00' },
  sourceBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  previewActions: { position: 'absolute', bottom: 40, alignSelf: 'center', width: '92%', gap: 12 },
  actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, gap: 8 },
  retakeButton: { backgroundColor: '#666' },
  validateButton: { backgroundColor: '#FEBD00' },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#FEBD00', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25, marginBottom: 10 },
  backSecondary: { backgroundColor: '#999' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

// // screens/TableauDeBord/VideoRecorderScreen.js
// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';

// const MAX_RECORDING_TIME = 120;

// const toSeconds = (duration) => {
//   if (!duration && duration !== 0) return 0;
//   const n = Number(duration);
//   if (!Number.isFinite(n)) return 0;
//   return n > 1000 ? Math.round(n / 1000) : Math.round(n);
// };

// export default function VideoRecorderScreen({ route, navigation }) {
//   const {
//     departure,
//     destination,
//     pathType,
//     videoSource = 'camera',
//     selectedVideo = null,
//   } = route.params || {};

//   const initialGalleryUri = selectedVideo?.uri || null;
//   const isInitialGalleryFlow = videoSource === 'gallery' && !!initialGalleryUri;

//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
//   const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
//   const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

//   const [step, setStep] = useState(isInitialGalleryFlow ? 'preview' : 'recording');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [videoUri, setVideoUri] = useState(initialGalleryUri);
//   const [recordingTime, setRecordingTime] = useState(toSeconds(selectedVideo?.duration));
//   const [facing, setFacing] = useState('back');
//   const [videoOrigin, setVideoOrigin] = useState(isInitialGalleryFlow ? 'gallery' : 'camera');
//   const [isMuted, setIsMuted] = useState(false);

//   const [coordinates, setCoordinates] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);

//   const cameraRef = useRef(null);
//   const timerRef = useRef(null);
//   const locationSubscription = useRef(null);

//   const player = useVideoPlayer(videoUri || '', (playerInstance) => {
//     if (videoUri) {
//       playerInstance.loop = true;
//       playerInstance.muted = isMuted;
//       playerInstance.play();
//     }
//   });

//   useEffect(() => {
//     if (!player) return;
//     player.muted = isMuted;
//   }, [isMuted, player]);

//   const needsCameraPermissions = step === 'recording';
//   const hasCameraPerms = cameraPermission?.granted && microphonePermission?.granted;
//   const hasMediaPerm = mediaPermission?.granted;

//   useEffect(() => {
//     (async () => {
//       if (needsCameraPermissions) {
//         if (!cameraPermission?.granted) await requestCameraPermission();
//         if (!microphonePermission?.granted) await requestMicrophonePermission();
//       } else {
//         if (!mediaPermission?.granted) await requestMediaPermission();
//       }

//       if (!locationPermission?.granted) {
//         await requestLocationPermission();
//       }
//     })();
//   }, [needsCameraPermissions]);

//   useEffect(() => {
//     (async () => {
//       if (locationPermission?.granted) {
//         try {
//           const location = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.High,
//           });
//           setCurrentLocation({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           });
//         } catch (error) {
//           console.error('Erreur position:', error);
//         }
//       }
//     })();
//   }, [locationPermission?.granted]);

//   useEffect(() => {
//     if (!isRecording) {
//       if (timerRef.current) clearInterval(timerRef.current);
//       return;
//     }

//     timerRef.current = setInterval(() => {
//       setRecordingTime((prev) => {
//         if (prev >= MAX_RECORDING_TIME) {
//           stopRecording();
//           return MAX_RECORDING_TIME;
//         }
//         return prev + 1;
//       });
//     }, 1000);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRecording]);

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (locationSubscription.current) locationSubscription.current.remove();
//     };
//   }, []);

//   const permissionLoading = useMemo(() => {
//     if (needsCameraPermissions) {
//       return cameraPermission === null || microphonePermission === null || locationPermission === null;
//     }
//     return mediaPermission === null || locationPermission === null;
//   }, [needsCameraPermissions, cameraPermission, microphonePermission, mediaPermission, locationPermission]);

//   const missingRequiredPermissions = useMemo(() => {
//     if (needsCameraPermissions) return !hasCameraPerms;
//     return !hasMediaPerm;
//   }, [needsCameraPermissions, hasCameraPerms, hasMediaPerm]);

//   const requestMissingPermissions = async () => {
//     if (needsCameraPermissions) {
//       if (!cameraPermission?.granted) await requestCameraPermission();
//       if (!microphonePermission?.granted) await requestMicrophonePermission();
//       if (!locationPermission?.granted) await requestLocationPermission();
//     } else {
//       if (!mediaPermission?.granted) await requestMediaPermission();
//     }
//   };

//   const startRecording = async () => {
//     if (!cameraRef.current) return;
//     if (!isCameraReady) {
//       Alert.alert('Patientez', "La caméra n'est pas encore prête.");
//       return;
//     }
//     if (isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
//       setCoordinates([]);

//       if (locationPermission?.granted) {
//         locationSubscription.current = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             timeInterval: 2000,
//             distanceInterval: 5,
//           },
//           (location) => {
//             const newCoord = {
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//               timestamp: Date.now(),
//             };
//             setCoordinates((prev) => [...prev, newCoord]);
//           }
//         );
//       }

//       const video = await cameraRef.current.recordAsync({
//         maxDuration: MAX_RECORDING_TIME,
//       });

//       setVideoUri(video.uri);
//       setVideoOrigin('camera');
//       setIsRecording(false);
//       setStep('preview');

//       if (locationSubscription.current) locationSubscription.current.remove();
//     } catch (error) {
//       console.log('Erreur enregistrement:', error);
//       Alert.alert('Erreur', "Impossible d'enregistrer la vidéo");
//       setIsRecording(false);
//       if (locationSubscription.current) locationSubscription.current.remove();
//     }
//   };

//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording();
//       setIsRecording(false);
//       if (locationSubscription.current) locationSubscription.current.remove();
//     }
//   };

//   const pickAnotherFromGallery = async () => {
//     if (!mediaPermission?.granted) {
//       const req = await requestMediaPermission();
//       if (!req.granted) {
//         Alert.alert('Permission requise', "Autorisez l'accès à la galerie.");
//         return;
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['videos'],
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (result.canceled) return;

//     const picked = result.assets?.[0];
//     if (!picked?.uri) {
//       Alert.alert('Erreur', 'Impossible de récupérer la vidéo sélectionnée.');
//       return;
//     }

//     setVideoUri(picked.uri);
//     setRecordingTime(toSeconds(picked.duration));
//     setVideoOrigin('gallery');
//     setCoordinates([]);
//     setStep('preview');
//   };

//   const retakeVideo = () => {
//     if (videoOrigin === 'gallery') {
//       pickAnotherFromGallery();
//       return;
//     }

//     setVideoUri(null);
//     setRecordingTime(0);
//     setCoordinates([]);
//     setVideoOrigin('camera');
//     setStep('recording');
//   };

//   const handleValidate = () => {
//     if (!videoUri) {
//       Alert.alert('Erreur', 'Aucune vidéo disponible');
//       return;
//     }

//     navigation.navigate('StepCreation', {
//       videoUri,
//       videoDuration: recordingTime,
//       departure,
//       destination,
//       pathType,
//       videoSource: videoOrigin,
//       startLocation: coordinates.length > 0 ? coordinates[0] : currentLocation,
//       endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : currentLocation,
//     });
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor((seconds || 0) / 60);
//     const secs = (seconds || 0) % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (permissionLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FEBD00" />
//         <Text style={styles.loadingText}>Chargement des permissions...</Text>
//       </View>
//     );
//   }

//   if (missingRequiredPermissions) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Ionicons name={needsCameraPermissions ? 'videocam-outline' : 'images-outline'} size={80} color="#999" />
//         <Text style={styles.permissionText}>Permissions requises</Text>
//         <Text style={styles.permissionSubtext}>
//           {needsCameraPermissions
//             ? "Veuillez autoriser l'accès à la caméra et au micro."
//             : "Veuillez autoriser l'accès à la galerie pour importer une vidéo."}
//         </Text>

//         <TouchableOpacity style={styles.backButton} onPress={requestMissingPermissions}>
//           <Text style={styles.backButtonText}>Autoriser</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.backButton, styles.backSecondary]} onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (step === 'recording') {
//     return (
//       <View style={styles.container}>
//         <CameraView
//           ref={cameraRef}
//           style={StyleSheet.absoluteFillObject}
//           facing={facing}
//           mode="video"
//           onCameraReady={() => setIsCameraReady(true)}
//         />

//         <View style={styles.overlay} pointerEvents="box-none">
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
//               <Ionicons name="arrow-back" size={30} color="#fff" />
//             </TouchableOpacity>

//             <View style={styles.headerInfo}>
//               <Text style={styles.headerTitle}>
//                 {departure} → {destination}
//               </Text>
//               <Text style={styles.headerSubtitle}>
//                 {pathType === 'official' ? '🛡️ Officiel' : '👥 Communautaire'}
//               </Text>
//             </View>

//             <TouchableOpacity style={styles.flipButton} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
//               <Ionicons name="camera-reverse" size={30} color="#fff" />
//             </TouchableOpacity>
//           </View>

//           <View>
//             <View style={styles.gpsIndicator}>
//               <Ionicons name={currentLocation ? 'location' : 'location-outline'} size={16} color={currentLocation ? '#34C759' : '#999'} />
//               <Text style={styles.gpsIndicatorText}>{currentLocation ? 'GPS actif' : 'GPS non disponible'}</Text>
//               {isRecording && <Text style={styles.gpsCount}>{coordinates.length} pts</Text>}
//             </View>

//             <View style={styles.timerContainer}>
//               <View style={styles.timerBox}>
//                 <Text style={styles.timerText}>
//                   {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
//                 </Text>
//               </View>
//             </View>

//             {!isRecording && (
//               <View style={styles.instructionsContainer}>
//                 <Text style={styles.instructionsText}>📹 Enregistrez votre trajet en vidéo verticale</Text>
//                 <Text style={styles.instructionsSubtext}>📍 Le GPS sera capturé si disponible</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.controls}>
//             <TouchableOpacity
//               style={[
//                 styles.recordButton,
//                 isRecording && styles.recordButtonActive,
//                 !isCameraReady && { opacity: 0.5 },
//               ]}
//               onPress={isRecording ? stopRecording : startRecording}
//               disabled={!isCameraReady}
//             >
//               <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]} />
//             </TouchableOpacity>

//             {isRecording && <Text style={styles.recordingText}>● En cours...</Text>}
//           </View>
//         </View>
//       </View>
//     );
//   }

//   if (step === 'preview') {
//     return (
//       <View style={styles.container}>
//         <VideoView player={player} style={styles.video} allowsFullscreen allowsPictureInPicture />

//         <View style={styles.previewHeader}>
//           <Text style={styles.previewTitle}>Prévisualisation</Text>
//           <Text style={styles.previewSubtitle}>
//             {departure} → {destination}
//           </Text>
//           <Text style={styles.previewDuration}>Durée: {formatTime(recordingTime)}</Text>

//           <TouchableOpacity style={styles.soundButton} onPress={() => setIsMuted((v) => !v)}>
//             <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
//             <Text style={styles.soundButtonText}>{isMuted ? 'Son OFF' : 'Son ON'}</Text>
//           </TouchableOpacity>

//           <View style={styles.sourceBadge}>
//             <Ionicons name={videoOrigin === 'gallery' ? 'images-outline' : 'videocam-outline'} size={14} color="#FEBD00" />
//             <Text style={styles.sourceBadgeText}>
//               Source: {videoOrigin === 'gallery' ? 'Galerie' : 'Caméra'}
//             </Text>
//           </View>

//           {coordinates.length > 0 && (
//             <View style={styles.gpsBadge}>
//               <Ionicons name="location" size={14} color="#FEBD00" />
//               <Text style={styles.gpsText}>{coordinates.length} points GPS</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.previewActions}>
//           <TouchableOpacity style={[styles.actionButton, styles.retakeButton]} onPress={retakeVideo}>
//             <Ionicons name={videoOrigin === 'gallery' ? 'images-outline' : 'refresh'} size={24} color="#fff" />
//             <Text style={styles.actionButtonText}>
//               {videoOrigin === 'gallery' ? 'Choisir autre vidéo' : 'Refaire'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.actionButton, styles.validateButton]} onPress={handleValidate}>
//             <Ionicons name="arrow-forward" size={24} color="#fff" />
//             <Text style={styles.actionButtonText}>Continuer</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return null;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'space-between',
//   },
//   video: {
//     flex: 1,
//     backgroundColor: '#000',
//   },

//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   permissionText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginTop: 20,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   permissionSubtext: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#666',
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   closeButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerInfo: {
//     flex: 1,
//     marginHorizontal: 15,
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#fff',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   flipButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gpsIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 10,
//     gap: 6,
//   },
//   gpsIndicatorText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   gpsCount: {
//     color: '#FEBD00',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   timerContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   timerBox: {
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   timerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FEBD00',
//   },
//   instructionsContainer: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//     marginTop: 20,
//   },
//   instructionsText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   instructionsSubtext: {
//     fontSize: 14,
//     color: '#fff',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   controls: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   recordButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: '#fff',
//   },
//   recordButtonActive: {
//     borderColor: '#ff3b30',
//   },
//   recordButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#ff3b30',
//   },
//   recordButtonInnerActive: {
//     borderRadius: 8,
//   },
//   recordingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ff3b30',
//     marginTop: 15,
//   },

//   previewHeader: {
//     position: 'absolute',
//     top: 60,
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   previewTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   previewSubtitle: {
//     fontSize: 14,
//     color: '#fff',
//     marginTop: 10,
//   },
//   previewDuration: {
//     fontSize: 12,
//     color: '#FEBD00',
//     marginTop: 5,
//     fontWeight: 'bold',
//   },
//   soundButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   soundButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   sourceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(254,189,0,0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 8,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: '#FEBD00',
//   },
//   sourceBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   gpsBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(52,199,89,0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 8,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: '#34C759',
//   },
//   gpsText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   previewActions: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     width: '92%',
//     gap: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 16,
//     gap: 8,
//   },
//   retakeButton: {
//     backgroundColor: '#666',
//   },
//   validateButton: {
//     backgroundColor: '#FEBD00',
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   backButton: {
//     backgroundColor: '#FEBD00',
//     paddingHorizontal: 30,
//     paddingVertical: 14,
//     borderRadius: 25,
//     marginBottom: 10,
//   },
//   backSecondary: {
//     backgroundColor: '#999',
//   },
//   backButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });







// // screens/TableauDeBord/VideoRecorderScreen.js
// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';

// const { height } = Dimensions.get('window');
// const MAX_RECORDING_TIME = 120;

// const toSeconds = (duration) => {
//   if (!duration && duration !== 0) return 0;
//   const n = Number(duration);
//   if (!Number.isFinite(n)) return 0;
//   return n > 1000 ? Math.round(n / 1000) : Math.round(n);
// };

// export default function VideoRecorderScreen({ route, navigation }) {
//   const {
//     departure,
//     destination,
//     pathType,
//     videoSource = 'camera',
//     selectedVideo = null,
//     establishmentId,
//   } = route.params || {};

//   const initialGalleryUri = selectedVideo?.uri || null;
//   const isInitialGalleryFlow = videoSource === 'gallery' && !!initialGalleryUri;

//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
//   const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
//   const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

//   const [step, setStep] = useState(isInitialGalleryFlow ? 'preview' : 'recording');
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoUri, setVideoUri] = useState(initialGalleryUri);
//   const [recordingTime, setRecordingTime] = useState(toSeconds(selectedVideo?.duration));
//   const [facing, setFacing] = useState('back');
//   const [videoOrigin, setVideoOrigin] = useState(isInitialGalleryFlow ? 'gallery' : 'camera');

//   const [coordinates, setCoordinates] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);

//   const cameraRef = useRef(null);
//   const timerRef = useRef(null);
//   const locationSubscription = useRef(null);

//   const player = useVideoPlayer(videoUri || '', (playerInstance) => {
//     if (videoUri) {
//       playerInstance.loop = true;
//       playerInstance.play();
//     }
//   });

//   const needsCameraPermissions = step === 'recording';
//   const hasCameraPerms = cameraPermission?.granted && microphonePermission?.granted;
//   const hasMediaPerm = mediaPermission?.granted;

//   useEffect(() => {
//     (async () => {
//       if (needsCameraPermissions) {
//         if (!cameraPermission?.granted) await requestCameraPermission();
//         if (!microphonePermission?.granted) await requestMicrophonePermission();
//       } else {
//         if (!mediaPermission?.granted) await requestMediaPermission();
//       }
//       if (!locationPermission?.granted) await requestLocationPermission();
//     })();
//   }, [needsCameraPermissions]);

//   useEffect(() => {
//     (async () => {
//       if (locationPermission?.granted) {
//         try {
//           const location = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.High,
//           });
//           setCurrentLocation({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           });
//         } catch (error) {
//           console.error('Erreur position:', error);
//         }
//       }
//     })();
//   }, [locationPermission?.granted]);

//   useEffect(() => {
//     if (!isRecording) {
//       if (timerRef.current) clearInterval(timerRef.current);
//       return;
//     }
//     timerRef.current = setInterval(() => {
//       setRecordingTime((prev) => {
//         if (prev >= MAX_RECORDING_TIME) {
//           stopRecording();
//           return MAX_RECORDING_TIME;
//         }
//         return prev + 1;
//       });
//     }, 1000);
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (locationSubscription.current) locationSubscription.current.remove();
//     };
//   }, []);

//   const permissionLoading = useMemo(() => {
//     if (needsCameraPermissions) {
//       return cameraPermission === null || microphonePermission === null || locationPermission === null;
//     }
//     return mediaPermission === null || locationPermission === null;
//   }, [needsCameraPermissions, cameraPermission, microphonePermission, mediaPermission, locationPermission]);

//   const missingRequiredPermissions = useMemo(() => {
//     if (needsCameraPermissions) return !hasCameraPerms;
//     return !hasMediaPerm;
//   }, [needsCameraPermissions, hasCameraPerms, hasMediaPerm]);

//   const requestMissingPermissions = async () => {
//     if (needsCameraPermissions) {
//       if (!cameraPermission?.granted) await requestCameraPermission();
//       if (!microphonePermission?.granted) await requestMicrophonePermission();
//       if (!locationPermission?.granted) await requestLocationPermission();
//     } else {
//       if (!mediaPermission?.granted) await requestMediaPermission();
//     }
//   };

//   const startRecording = async () => {
//     if (!cameraRef.current) {
//       Alert.alert('Erreur', 'Caméra non disponible');
//       return;
//     }

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
//       setCoordinates([]);

//       if (locationPermission?.granted) {
//         try {
//           locationSubscription.current = await Location.watchPositionAsync(
//             {
//               accuracy: Location.Accuracy.High,
//               timeInterval: 2000,
//               distanceInterval: 5,
//             },
//             (location) => {
//               setCoordinates((prev) => [...prev, {
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//                 timestamp: Date.now(),
//               }]);
//             }
//           );
//         } catch (e) {
//           console.log('GPS non disponible:', e);
//         }
//       }

//       const video = await cameraRef.current.recordAsync();

//       if (video?.uri) {
//         setVideoUri(video.uri);
//         setVideoOrigin('camera');
//         setStep('preview');
//       } else {
//         Alert.alert('Erreur', "Impossible de récupérer la vidéo enregistrée.");
//       }

//     } catch (error) {
//       console.log('Erreur enregistrement:', error);
//       if (!error.message?.includes('stopped') && !error.message?.includes('cancel')) {
//         Alert.alert('Erreur', "Impossible d'enregistrer la vidéo. Vérifiez les permissions.");
//       }
//     } finally {
//       setIsRecording(false);
//       if (locationSubscription.current) {
//         locationSubscription.current.remove();
//         locationSubscription.current = null;
//       }
//     }
//   };

//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording();
//     }
//   };

//   const pickAnotherFromGallery = async () => {
//     if (!mediaPermission?.granted) {
//       const req = await requestMediaPermission();
//       if (!req.granted) {
//         Alert.alert('Permission requise', "Autorisez l'accès à la galerie.");
//         return;
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['videos'],
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (result.canceled) return;

//     const picked = result.assets?.[0];
//     if (!picked?.uri) {
//       Alert.alert('Erreur', 'Impossible de récupérer la vidéo sélectionnée.');
//       return;
//     }

//     setVideoUri(picked.uri);
//     setRecordingTime(toSeconds(picked.duration));
//     setVideoOrigin('gallery');
//     setCoordinates([]);
//     setStep('preview');
//   };

//   const retakeVideo = () => {
//     if (videoOrigin === 'gallery') {
//       pickAnotherFromGallery();
//       return;
//     }
//     setVideoUri(null);
//     setRecordingTime(0);
//     setCoordinates([]);
//     setVideoOrigin('camera');
//     setStep('recording');
//   };

//   const handleValidate = () => {
//     if (!videoUri) {
//       Alert.alert('Erreur', 'Aucune vidéo disponible');
//       return;
//     }
//     navigation.navigate('StepCreation', {
//       videoUri,
//       videoDuration: recordingTime,
//       departure,
//       destination,
//       pathType,
//       videoSource: videoOrigin,
//       establishmentId,
//       startLocation: coordinates.length > 0 ? coordinates[0] : currentLocation,
//       endLocation: coordinates.length > 0 ? coordinates[coordinates.length - 1] : currentLocation,
//       gpsCoordinates: coordinates,
//     });
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor((seconds || 0) / 60);
//     const secs = (seconds || 0) % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (permissionLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FEBD00" />
//         <Text style={styles.loadingText}>Chargement des permissions...</Text>
//       </View>
//     );
//   }

//   if (missingRequiredPermissions) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Ionicons name={needsCameraPermissions ? 'videocam-outline' : 'images-outline'} size={80} color="#999" />
//         <Text style={styles.permissionText}>Permissions requises</Text>
//         <Text style={styles.permissionSubtext}>
//           {needsCameraPermissions
//             ? "Veuillez autoriser l'accès à la caméra et au micro."
//             : "Veuillez autoriser l'accès à la galerie pour importer une vidéo."}
//         </Text>
//         <TouchableOpacity style={styles.backButton} onPress={requestMissingPermissions}>
//           <Text style={styles.backButtonText}>Autoriser</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.backButton, styles.backSecondary]} onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (step === 'recording') {
//     return (
//       <View style={styles.container}>
//         <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

//         <View style={styles.overlay} pointerEvents="box-none">
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
//               <Ionicons name="arrow-back" size={30} color="#fff" />
//             </TouchableOpacity>
//             <View style={styles.headerInfo}>
//               <Text style={styles.headerTitle}>{departure} → {destination}</Text>
//               <Text style={styles.headerSubtitle}>
//                 {pathType === 'official' ? '🛡️ Officiel' : '👥 Communautaire'}
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.flipButton}
//               onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
//             >
//               <Ionicons name="camera-reverse" size={30} color="#fff" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.gpsIndicator}>
//             <Ionicons
//               name={currentLocation ? 'location' : 'location-outline'}
//               size={16}
//               color={currentLocation ? '#34C759' : '#999'}
//             />
//             <Text style={styles.gpsIndicatorText}>
//               {currentLocation ? 'GPS actif' : 'GPS non disponible'}
//             </Text>
//             {isRecording && <Text style={styles.gpsCount}>{coordinates.length} pts</Text>}
//           </View>

//           <View style={styles.timerContainer}>
//             <View style={styles.timerBox}>
//               <Text style={styles.timerText}>
//                 {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
//               </Text>
//             </View>
//           </View>

//           {!isRecording && (
//             <View style={styles.instructionsContainer}>
//               <Text style={styles.instructionsText}>📹 Enregistrez votre trajet en vidéo</Text>
//               <Text style={styles.instructionsSubtext}>📍 Le GPS sera capturé automatiquement</Text>
//             </View>
//           )}

//           <View style={styles.controls}>
//             <TouchableOpacity
//               style={[styles.recordButton, isRecording && styles.recordButtonActive]}
//               onPress={isRecording ? stopRecording : startRecording}
//             >
//               <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]} />
//             </TouchableOpacity>
//             {isRecording && <Text style={styles.recordingText}>● En cours...</Text>}
//           </View>
//         </View>
//       </View>
//     );
//   }

//   if (step === 'preview') {
//     return (
//       <View style={styles.container}>
//         <VideoView player={player} style={styles.video} allowsFullscreen allowsPictureInPicture />

//         <View style={styles.previewHeader}>
//           <Text style={styles.previewTitle}>Prévisualisation</Text>
//           <Text style={styles.previewSubtitle}>{departure} → {destination}</Text>
//           <Text style={styles.previewDuration}>Durée: {formatTime(recordingTime)}</Text>
//           <View style={styles.sourceBadge}>
//             <Ionicons
//               name={videoOrigin === 'gallery' ? 'images-outline' : 'videocam-outline'}
//               size={14}
//               color="#FEBD00"
//             />
//             <Text style={styles.sourceBadgeText}>
//               {videoOrigin === 'gallery' ? 'Galerie' : 'Caméra'}
//             </Text>
//           </View>
//           {coordinates.length > 0 && (
//             <View style={styles.gpsBadge}>
//               <Ionicons name="location" size={14} color="#34C759" />
//               <Text style={styles.gpsText}>{coordinates.length} points GPS</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.previewActions}>
//           <TouchableOpacity style={[styles.actionButton, styles.retakeButton]} onPress={retakeVideo}>
//             <Ionicons name={videoOrigin === 'gallery' ? 'images-outline' : 'refresh'} size={24} color="#fff" />
//             <Text style={styles.actionButtonText}>
//               {videoOrigin === 'gallery' ? 'Autre vidéo' : 'Refaire'}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.actionButton, styles.validateButton]} onPress={handleValidate}>
//             <Ionicons name="arrow-forward" size={24} color="#fff" />
//             <Text style={styles.actionButtonText}>Continuer</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return null;
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   camera: { flex: 1 },
//   overlay: { ...StyleSheet.absoluteFillObject, flex: 1, justifyContent: 'space-between' },
//   video: { flex: 1, backgroundColor: '#000' },
//   permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
//   permissionText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, textAlign: 'center' },
//   permissionSubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
//   loadingText: { marginTop: 20, fontSize: 16, color: '#666' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
//   closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   headerInfo: { flex: 1, marginHorizontal: 15 },
//   headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
//   headerSubtitle: { fontSize: 12, color: '#fff', textAlign: 'center', marginTop: 4 },
//   flipButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   gpsIndicator: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 10, gap: 6 },
//   gpsIndicatorText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   gpsCount: { color: '#FEBD00', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
//   timerContainer: { alignItems: 'center', marginTop: 20 },
//   timerBox: { backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
//   timerText: { fontSize: 18, fontWeight: 'bold', color: '#FEBD00' },
//   instructionsContainer: { position: 'absolute', top: '40%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 40 },
//   instructionsText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
//   instructionsSubtext: { fontSize: 14, color: '#fff', marginTop: 10, textAlign: 'center' },
//   controls: { position: 'absolute', bottom: 40, alignSelf: 'center', alignItems: 'center' },
//   recordButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
//   recordButtonActive: { borderColor: '#ff3b30' },
//   recordButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ff3b30' },
//   recordButtonInnerActive: { borderRadius: 8 },
//   recordingText: { fontSize: 16, fontWeight: 'bold', color: '#ff3b30', marginTop: 15 },
//   previewHeader: { position: 'absolute', top: 60, alignSelf: 'center', alignItems: 'center' },
//   previewTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
//   previewSubtitle: { fontSize: 14, color: '#fff', marginTop: 10 },
//   previewDuration: { fontSize: 12, color: '#FEBD00', marginTop: 5, fontWeight: 'bold' },
//   sourceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(254,189,0,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8, gap: 4, borderWidth: 1, borderColor: '#FEBD00' },
//   sourceBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   gpsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52,199,89,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8, gap: 4, borderWidth: 1, borderColor: '#34C759' },
//   gpsText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   previewActions: { position: 'absolute', bottom: 40, alignSelf: 'center', width: '92%', gap: 12 },
//   actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, gap: 8 },
//   retakeButton: { backgroundColor: '#666' },
//   validateButton: { backgroundColor: '#FEBD00' },
//   actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   backButton: { backgroundColor: '#FEBD00', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25, marginBottom: 10 },
//   backSecondary: { backgroundColor: '#999' },
//   backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// });