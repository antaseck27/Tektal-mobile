// screens/TableauDeBord/PathConfirmationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createPath, uploadToCloudinary } from '../../services/authService';
import { usePaths } from '../../context/PathContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PathConfirmationScreen({ route, navigation }) {
  const {
    videoUri,
    videoDuration,
    departure,
    destination,
    pathType,
    startLocation,
    endLocation,
    steps,
  } = route.params;

  const { refreshPaths } = usePaths();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState(''); // 'upload', 'saving'

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStage('upload');

    try {
      Alert.alert('📤 Upload', 'Envoi de la vidéo en cours...');
      
      const uploadResult = await uploadToCloudinary(videoUri);
      
      setUploadProgress(50);

      if (!uploadResult.ok) {
        throw new Error(uploadResult.error || 'Échec upload Cloudinary');
      }

      setUploadStage('saving');

      // ✅ Nettoyer les données avant envoi
      const cleanedSteps = steps.map(step => ({
        step_number: parseInt(step.step_number) || 1,
        start_time: parseFloat(step.start_time) || 0,
        end_time: parseFloat(step.end_time) || 10,
        text: (step.text || '').replace(/\n/g, ' ').trim(),
      }));

      // ✅ Formater les coordonnées en STRING pour Django
      const pathData = {
        title: `${departure} → ${destination}`,
        start_label: departure || '',
        end_label: destination || '',
        start_lat: startLocation?.latitude ? startLocation.latitude.toFixed(6).toString() : null,
        start_lng: startLocation?.longitude ? startLocation.longitude.toFixed(6).toString() : null,
        end_lat: endLocation?.latitude ? endLocation.latitude.toFixed(6).toString() : null,
        end_lng: endLocation?.longitude ? endLocation.longitude.toFixed(6).toString() : null,
        video_url: uploadResult.data.secure_url,
        duration: Math.round(videoDuration) || 0,
        is_official: pathType === 'official',
        steps: cleanedSteps,
      };

      console.log('📤 Envoi au backend:', JSON.stringify(pathData, null, 2));

      setUploadProgress(75);

      const result = await createPath(pathData);

      setUploadProgress(100);

      if (result.ok) {
        console.log('✅ Chemin créé avec ID:', result.data.id);
        
        // ✅ Sauvegarder les coordonnées GPS localement
        const gpsCoordinates = route.params.coordinates || [];
        
        if (gpsCoordinates.length > 0) {
          await AsyncStorage.setItem(
            `path_gps_${result.data.id}`, 
            JSON.stringify(gpsCoordinates)
          );
          console.log(`📍 ${gpsCoordinates.length} points GPS sauvegardés localement`);
        }
        
        // Rafraîchir la liste des chemins
        console.log('✅ Rafraîchissement de la liste...');
        await refreshPaths();
        
        Alert.alert(
          '🎉 Chemin publié !',
          `Votre chemin "${departure} → ${destination}" a été publié avec succès.`,
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
                        routes: [{ name: 'Tabs' }],
                      },
                    },
                  ],
                });
              },
            },
          ]
        );
      } else {
        console.error('❌ Erreurs Django:', result.data);
        
        let errorMessage = 'Une erreur est survenue lors de la publication.';
        
        if (result.status === 500) {
          errorMessage = 'Erreur serveur (500). Veuillez réessayer plus tard ou contacter l\'administrateur.';
        } else if (result.data) {
          if (typeof result.data === 'object') {
            const errorDetails = Object.entries(result.data)
              .map(([field, messages]) => {
                const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                return `${field}: ${msg}`;
              })
              .join('\n');
            
            errorMessage = errorDetails || JSON.stringify(result.data);
          } else {
            errorMessage = result.data.toString();
          }
        } else if (result.error) {
          errorMessage = result.error;
        }

        Alert.alert('❌ Erreur', errorMessage);
      }
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      
      let userMessage = error.message;
      if (error.message.includes('network') || error.message.includes('Network')) {
        userMessage = 'Problème de connexion internet. Vérifiez votre réseau.';
      } else if (error.message.includes('timeout')) {
        userMessage = 'Le téléchargement a pris trop de temps.';
      }
      
      Alert.alert('❌ Erreur', userMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressText = () => {
    if (uploadStage === 'upload') return 'Upload de la vidéo...';
    if (uploadStage === 'saving') return 'Enregistrement du chemin...';
    return 'Traitement en cours...';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => !isSubmitting && navigation.goBack()}
          disabled={isSubmitting}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Confirmation</Text>
          <Text style={styles.headerSubtitle}>Vérifiez avant de publier</Text>
        </View>

        <View style={styles.headerBadge}>
          <Ionicons
            name={pathType === 'official' ? 'shield-checkmark' : 'people'}
            size={24}
            color="#333"
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vidéo */}
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Aperçu de la vidéo</Text>
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              allowsFullscreen={false}
            />
          </View>
        </View>

        {/* Informations du chemin */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations du chemin</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#34C759" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Départ</Text>
                <Text style={styles.infoValue}>{departure}</Text>
                {startLocation && (
                  <Text style={styles.coordsText}>
                    {startLocation.latitude.toFixed(6)}, {startLocation.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="flag" size={20} color="#FF3B30" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Arrivée</Text>
                <Text style={styles.infoValue}>{destination}</Text>
                {endLocation && (
                  <Text style={styles.coordsText}>
                    {endLocation.latitude.toFixed(6)}, {endLocation.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#FEBD00" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Durée</Text>
                <Text style={styles.infoValue}>{formatTime(videoDuration)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name={pathType === 'official' ? 'shield-checkmark' : 'people'}
                size={20}
                color="#FEBD00"
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>
                  {pathType === 'official' ? 'Officiel' : 'Communautaire'}
                </Text>
              </View>
            </View>
            
            {/* ✅ Afficher le nombre de points GPS */}
            {route.params.coordinates && route.params.coordinates.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="navigate" size={20} color="#007AFF" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Points GPS</Text>
                    <Text style={styles.infoValue}>
                      {route.params.coordinates.length} points enregistrés
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Étapes */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>
            Étapes du trajet ({steps.length})
          </Text>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{step.step_number}</Text>
                </View>
                <Text style={styles.stepTitle}>Étape {step.step_number}</Text>
              </View>

              <View style={styles.stepTiming}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.stepTimingText}>
                  {formatTime(step.start_time)} - {formatTime(step.end_time)}
                </Text>
              </View>

              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* Avertissement */}
        <View style={styles.warningCard}>
          <Ionicons name="information-circle" size={24} color="#FF9500" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Important</Text>
            <Text style={styles.warningText}>
              Une fois publié, votre chemin sera visible par{' '}
              {pathType === 'official'
                ? 'votre établissement pour validation'
                : 'tous les utilisateurs de la communauté'}
              .
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Footer avec boutons */}
      <View style={styles.footer}>
        {isSubmitting && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {getProgressText()} {uploadProgress}%
            </Text>
          </View>
        )}

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, styles.publishButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={isSubmitting ? ['#ccc', '#ccc'] : ['#FEBD00', '#FFD700']}
              style={styles.publishGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.publishButtonText}>Publier</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay de chargement */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FEBD00" />
            <Text style={styles.loadingText}>{getProgressText()}</Text>
            <Text style={styles.loadingSubtext}>
              {uploadProgress}% - Ne fermez pas l'application
            </Text>
          </View>
        </View>
      )}
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
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  videoSection: {},
  videoContainer: {
    height: 200,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoSection: {},
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  coordsText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  stepsSection: {},
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FEBD00',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEBD00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stepTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  stepTimingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FEBD00',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  publishButton: {},
  publishGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});