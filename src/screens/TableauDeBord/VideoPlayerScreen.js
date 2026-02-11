// screens/TableauDeBord/VideoPlayer.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ route, navigation }) {
  const { path } = route.params;
  
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapRef = useRef(null);

  // ✅ Créer le player vidéo
  const player = useVideoPlayer(path.videoUri, (player) => {
    player.loop = false;
  });

  // ✅ UTILISER LES VRAIES COORDONNÉES GPS
  const pathCoordinates = path.coordinates && path.coordinates.length > 0
    ? path.coordinates
    : [
        // Coordonnées par défaut si pas de GPS
        { latitude: 14.6937, longitude: -17.4441 },
        { latitude: 14.6945, longitude: -17.4450 },
        { latitude: 14.6950, longitude: -17.4465 },
        { latitude: 14.6960, longitude: -17.4480 },
        { latitude: 14.6970, longitude: -17.4490 },
      ];

  const startLocation = path.startLocation || pathCoordinates[0];
  const endLocation = path.endLocation || pathCoordinates[pathCoordinates.length - 1];

  // ✅ Calculer le centre de la carte
  const mapRegion = {
    latitude: (startLocation.latitude + endLocation.latitude) / 2,
    longitude: (startLocation.longitude + endLocation.longitude) / 2,
    latitudeDelta: Math.abs(startLocation.latitude - endLocation.latitude) * 2 || 0.01,
    longitudeDelta: Math.abs(startLocation.longitude - endLocation.longitude) * 2 || 0.01,
  };

  // ✅ Play/Pause
  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
      setShowControls(true);
    } else {
      player.play();
      setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  // ✅ Afficher/masquer contrôles
  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  // ✅ Basculer plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  // ✅ Recentrer la carte
  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(mapRegion, 500);
    }
  };

  // ✅ Composant Vidéo réutilisable
  const VideoPlayerComponent = ({ fullscreen = false }) => (
    <TouchableOpacity
      style={[
        styles.videoContainer,
        fullscreen && styles.videoContainerFullscreen,
      ]}
      activeOpacity={1}
      onPress={handleVideoPress}
    >
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      {/* Contrôles */}
      {showControls && (
        <>
          <View style={styles.videoControls}>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={handlePlayPause}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#FFC837', '#FEBD00']}
                style={styles.playPauseGradient}
              >
                <Ionicons
                  name={player.playing ? 'pause' : 'play'}
                  size={36}
                  color="#fff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bouton Plein écran */}
          {!fullscreen && (
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={toggleFullscreen}
            >
              <Ionicons name="expand" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Overlay noir semi-transparent pour voir les contrôles */}
      {showControls && (
        <View style={styles.controlsOverlay} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {path.title}
          </Text>
          <Text style={styles.headerSubtitle}>Par {path.creator}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MAP SECTION */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={mapRegion}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={true}
              showsScale={true}
              showsTraffic={false}
              showsBuildings={true}
              showsIndoors={true}
              loadingEnabled={true}
              mapType="standard"
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
              toolbarEnabled={true}
            >
              {/* ✅ Ligne bleue pour l'itinéraire RÉEL */}
              <Polyline
                coordinates={pathCoordinates}
                strokeColor="#007AFF"
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />

              {/* ✅ Marqueur de départ */}
              <Marker
                coordinate={startLocation}
                title="Départ"
                description={path.departure || path.title.split('→')[0]?.trim()}
              >
                <View style={styles.startMarker}>
                  <Ionicons name="location" size={24} color="#fff" />
                </View>
              </Marker>

              {/* ✅ Marqueur d'arrivée */}
              <Marker
                coordinate={endLocation}
                title="Arrivée"
                description={path.destination || path.title.split('→')[1]?.trim()}
              >
                <View style={styles.endMarker}>
                  <Ionicons name="flag" size={20} color="#fff" />
                </View>
              </Marker>
            </MapView>

            {/* Badges overlay */}
            <View style={styles.mapOverlay}>
              <View style={styles.mapInfoBadge}>
                <Ionicons name="time-outline" size={16} color="#FEBD00" />
                <Text style={styles.mapInfoText}>{path.duration}</Text>
              </View>
              
              {/* Badge nombre de points GPS */}
              {path.coordinates && path.coordinates.length > 0 && (
                <View style={styles.gpsBadge}>
                  <Ionicons name="navigate" size={14} color="#34C759" />
                  <Text style={styles.gpsBadgeText}>
                    {path.coordinates.length} points
                  </Text>
                </View>
              )}

              {path.isOfficial && (
                <View style={styles.officialBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#fff" />
                  <Text style={styles.officialBadgeText}>Officiel</Text>
                </View>
              )}
            </View>

            {/* ✅ Bouton pour recentrer la carte */}
            <TouchableOpacity
              style={styles.recenterButton}
              onPress={recenterMap}
            >
              <Ionicons name="locate" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Locations Info */}
          <View style={styles.locationsInfo}>
            <View style={styles.locationItem}>
              <View style={[styles.locationDot, { backgroundColor: '#34C759' }]} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Départ</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {path.departure || path.title.split('→')[0]?.trim()}
                </Text>
                <Text style={styles.coordsText}>
                  {startLocation.latitude.toFixed(4)}, {startLocation.longitude.toFixed(4)}
                </Text>
              </View>
            </View>

            <View style={styles.locationDivider}>
              <View style={styles.dottedLine} />
            </View>

            <View style={styles.locationItem}>
              <View style={[styles.locationDot, { backgroundColor: '#FF3B30' }]} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Arrivée</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {path.destination || path.title.split('→')[1]?.trim()}
                </Text>
                <Text style={styles.coordsText}>
                  {endLocation.latitude.toFixed(4)}, {endLocation.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* VIDEO SECTION */}
        <View style={styles.videoSection}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoTitle}>Vidéo du trajet</Text>
          </View>

          <VideoPlayerComponent fullscreen={false} />
        </View>

        {/* ✅ SECTION DESCRIPTION */}
        {path.description && (
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#FEBD00" />
              <Text style={styles.descriptionTitle}>Description du trajet</Text>
            </View>
            <Text style={styles.descriptionText}>{path.description}</Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={24} color="#FEBD00" />
              <Text style={styles.infoCardValue}>{path.duration}</Text>
              <Text style={styles.infoCardLabel}>Durée</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="videocam-outline" size={24} color="#FEBD00" />
              <Text style={styles.infoCardValue}>Vidéo</Text>
              <Text style={styles.infoCardLabel}>Format</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={24} color="#FEBD00" />
              <Text style={styles.infoCardValue}>{path.campus}</Text>
              <Text style={styles.infoCardLabel}>Campus</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* MODAL PLEIN ÉCRAN */}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        onRequestClose={toggleFullscreen}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden />

          {/* Header plein écran */}
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity
              style={styles.fullscreenCloseButton}
              onPress={toggleFullscreen}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullscreenTitle}>{path.title}</Text>
          </View>

          <VideoPlayerComponent fullscreen={true} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
  },

  // MAP SECTION
  mapSection: {
    backgroundColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  mapContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mapInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52,199,89,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  gpsBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  officialBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  endMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  locationsInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  locationDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 6,
  },
  dottedLine: {
    width: 1,
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    borderStyle: 'dotted',
  },

  // VIDEO SECTION
  videoSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  videoHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  videoContainer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainerFullscreen: {
    width: width,
    height: height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    pointerEvents: 'none',
  },
  videoControls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FEBD00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  playPauseGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ DESCRIPTION SECTION
  descriptionSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },

  // FULLSCREEN
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullscreenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  fullscreenCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },

  // Info Section
  infoSection: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});