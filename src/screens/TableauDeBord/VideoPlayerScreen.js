// // screens/TableauDeBord/VideoPlayer.js
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// export default function VideoPlayer({ route, navigation }) {
//   const { path } = route.params;
  
//   const [showControls, setShowControls] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const mapRef = useRef(null);

//   // ✅ Créer le player vidéo
//   const player = useVideoPlayer(path.videoUri, (player) => {
//     player.loop = false;
//   });

//   // ✅ UTILISER LES VRAIES COORDONNÉES GPS
//   const pathCoordinates = path.coordinates && path.coordinates.length > 0
//     ? path.coordinates
//     : [
//         // Coordonnées par défaut si pas de GPS
//         { latitude: 14.6937, longitude: -17.4441 },
//         { latitude: 14.6945, longitude: -17.4450 },
//         { latitude: 14.6950, longitude: -17.4465 },
//         { latitude: 14.6960, longitude: -17.4480 },
//         { latitude: 14.6970, longitude: -17.4490 },
//       ];

//   const startLocation = path.startLocation || pathCoordinates[0];
//   const endLocation = path.endLocation || pathCoordinates[pathCoordinates.length - 1];

//   // ✅ Calculer le centre de la carte
//   const mapRegion = {
//     latitude: (startLocation.latitude + endLocation.latitude) / 2,
//     longitude: (startLocation.longitude + endLocation.longitude) / 2,
//     latitudeDelta: Math.abs(startLocation.latitude - endLocation.latitude) * 2 || 0.01,
//     longitudeDelta: Math.abs(startLocation.longitude - endLocation.longitude) * 2 || 0.01,
//   };

//   // ✅ Play/Pause
//   const handlePlayPause = () => {
//     if (player.playing) {
//       player.pause();
//       setShowControls(true);
//     } else {
//       player.play();
//       setTimeout(() => {
//         setShowControls(false);
//       }, 2000);
//     }
//   };

//   // ✅ Afficher/masquer contrôles
//   const handleVideoPress = () => {
//     setShowControls(!showControls);
//   };

//   // ✅ Basculer plein écran
//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//     setShowControls(true);
//   };

//   // ✅ Recentrer la carte
//   const recenterMap = () => {
//     if (mapRef.current) {
//       mapRef.current.animateToRegion(mapRegion, 500);
//     }
//   };

//   // ✅ Composant Vidéo réutilisable
//   const VideoPlayerComponent = ({ fullscreen = false }) => (
//     <TouchableOpacity
//       style={[
//         styles.videoContainer,
//         fullscreen && styles.videoContainerFullscreen,
//       ]}
//       activeOpacity={1}
//       onPress={handleVideoPress}
//     >
//       <VideoView
//         player={player}
//         style={styles.video}
//         contentFit="contain"
//         allowsFullscreen={false}
//         allowsPictureInPicture={false}
//       />

//       {/* Contrôles */}
//       {showControls && (
//         <>
//           <View style={styles.videoControls}>
//             <TouchableOpacity
//               style={styles.playPauseButton}
//               onPress={handlePlayPause}
//               activeOpacity={0.7}
//             >
//               <LinearGradient
//                 colors={['#FFC837', '#FEBD00']}
//                 style={styles.playPauseGradient}
//               >
//                 <Ionicons
//                   name={player.playing ? 'pause' : 'play'}
//                   size={36}
//                   color="#fff"
//                 />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           {/* Bouton Plein écran */}
//           {!fullscreen && (
//             <TouchableOpacity
//               style={styles.fullscreenButton}
//               onPress={toggleFullscreen}
//             >
//               <Ionicons name="expand" size={20} color="#fff" />
//             </TouchableOpacity>
//           )}
//         </>
//       )}

//       {/* Overlay noir semi-transparent pour voir les contrôles */}
//       {showControls && (
//         <View style={styles.controlsOverlay} />
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <LinearGradient
//         colors={['rgba(0,0,0,0.8)', 'transparent']}
//         style={styles.header}
//       >
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {path.title}
//           </Text>
//           <Text style={styles.headerSubtitle}>Par {path.creator}</Text>
//         </View>
//         <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
//           <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* MAP SECTION */}
//         <View style={styles.mapSection}>
//           <View style={styles.mapContainer}>
//             <MapView
//               ref={mapRef}
//               style={styles.map}
//               initialRegion={mapRegion}
//               showsUserLocation={false}
//               showsMyLocationButton={false}
//               showsCompass={true}
//               showsScale={true}
//               showsTraffic={false}
//               showsBuildings={true}
//               showsIndoors={true}
//               loadingEnabled={true}
//               mapType="standard"
//               scrollEnabled={true}
//               zoomEnabled={true}
//               pitchEnabled={true}
//               rotateEnabled={true}
//               toolbarEnabled={true}
//             >
//               {/* ✅ Ligne bleue pour l'itinéraire RÉEL */}
//               <Polyline
//                 coordinates={pathCoordinates}
//                 strokeColor="#007AFF"
//                 strokeWidth={5}
//                 lineCap="round"
//                 lineJoin="round"
//               />

//               {/* ✅ Marqueur de départ */}
//               <Marker
//                 coordinate={startLocation}
//                 title="Départ"
//                 description={path.departure || path.title.split('→')[0]?.trim()}
//               >
//                 <View style={styles.startMarker}>
//                   <Ionicons name="location" size={24} color="#fff" />
//                 </View>
//               </Marker>

//               {/* ✅ Marqueur d'arrivée */}
//               <Marker
//                 coordinate={endLocation}
//                 title="Arrivée"
//                 description={path.destination || path.title.split('→')[1]?.trim()}
//               >
//                 <View style={styles.endMarker}>
//                   <Ionicons name="flag" size={20} color="#fff" />
//                 </View>
//               </Marker>
//             </MapView>

//             {/* Badges overlay */}
//             <View style={styles.mapOverlay}>
//               <View style={styles.mapInfoBadge}>
//                 <Ionicons name="time-outline" size={16} color="#FEBD00" />
//                 <Text style={styles.mapInfoText}>{path.duration}</Text>
//               </View>
              
//               {/* Badge nombre de points GPS */}
//               {path.coordinates && path.coordinates.length > 0 && (
//                 <View style={styles.gpsBadge}>
//                   <Ionicons name="navigate" size={14} color="#34C759" />
//                   <Text style={styles.gpsBadgeText}>
//                     {path.coordinates.length} points
//                   </Text>
//                 </View>
//               )}

//               {path.isOfficial && (
//                 <View style={styles.officialBadge}>
//                   <Ionicons name="shield-checkmark" size={14} color="#fff" />
//                   <Text style={styles.officialBadgeText}>Officiel</Text>
//                 </View>
//               )}
//             </View>

//             {/* ✅ Bouton pour recentrer la carte */}
//             <TouchableOpacity
//               style={styles.recenterButton}
//               onPress={recenterMap}
//             >
//               <Ionicons name="locate" size={24} color="#007AFF" />
//             </TouchableOpacity>
//           </View>

//           {/* Locations Info */}
//           <View style={styles.locationsInfo}>
//             <View style={styles.locationItem}>
//               <View style={[styles.locationDot, { backgroundColor: '#34C759' }]} />
//               <View style={styles.locationTextContainer}>
//                 <Text style={styles.locationLabel}>Départ</Text>
//                 <Text style={styles.locationText} numberOfLines={1}>
//                   {path.departure || path.title.split('→')[0]?.trim()}
//                 </Text>
//                 <Text style={styles.coordsText}>
//                   {startLocation.latitude.toFixed(4)}, {startLocation.longitude.toFixed(4)}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.locationDivider}>
//               <View style={styles.dottedLine} />
//             </View>

//             <View style={styles.locationItem}>
//               <View style={[styles.locationDot, { backgroundColor: '#FF3B30' }]} />
//               <View style={styles.locationTextContainer}>
//                 <Text style={styles.locationLabel}>Arrivée</Text>
//                 <Text style={styles.locationText} numberOfLines={1}>
//                   {path.destination || path.title.split('→')[1]?.trim()}
//                 </Text>
//                 <Text style={styles.coordsText}>
//                   {endLocation.latitude.toFixed(4)}, {endLocation.longitude.toFixed(4)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* VIDEO SECTION */}
//         <View style={styles.videoSection}>
//           <View style={styles.videoHeader}>
//             <Text style={styles.videoTitle}>Vidéo du trajet</Text>
//           </View>

//           <VideoPlayerComponent fullscreen={false} />
//         </View>

//         {/* ✅ SECTION DESCRIPTION */}
//         {path.description && (
//           <View style={styles.descriptionSection}>
//             <View style={styles.descriptionHeader}>
//               <Ionicons name="document-text-outline" size={20} color="#FEBD00" />
//               <Text style={styles.descriptionTitle}>Description du trajet</Text>
//             </View>
//             <Text style={styles.descriptionText}>{path.description}</Text>
//           </View>
//         )}

//         {/* Info Section */}
//         <View style={styles.infoSection}>
//           <View style={styles.infoRow}>
//             <View style={styles.infoCard}>
//               <Ionicons name="time-outline" size={24} color="#FEBD00" />
//               <Text style={styles.infoCardValue}>{path.duration}</Text>
//               <Text style={styles.infoCardLabel}>Durée</Text>
//             </View>

//             <View style={styles.infoCard}>
//               <Ionicons name="videocam-outline" size={24} color="#FEBD00" />
//               <Text style={styles.infoCardValue}>Vidéo</Text>
//               <Text style={styles.infoCardLabel}>Format</Text>
//             </View>

//             <View style={styles.infoCard}>
//               <Ionicons name="location-outline" size={24} color="#FEBD00" />
//               <Text style={styles.infoCardValue}>{path.campus}</Text>
//               <Text style={styles.infoCardLabel}>Campus</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       {/* MODAL PLEIN ÉCRAN */}
//       <Modal
//         visible={isFullscreen}
//         animationType="fade"
//         onRequestClose={toggleFullscreen}
//         supportedOrientations={['portrait', 'landscape']}
//       >
//         <View style={styles.fullscreenContainer}>
//           <StatusBar hidden />

//           {/* Header plein écran */}
//           <View style={styles.fullscreenHeader}>
//             <TouchableOpacity
//               style={styles.fullscreenCloseButton}
//               onPress={toggleFullscreen}
//             >
//               <Ionicons name="close" size={28} color="#fff" />
//             </TouchableOpacity>
//             <Text style={styles.fullscreenTitle}>{path.title}</Text>
//           </View>

//           <VideoPlayerComponent fullscreen={true} />
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 16,
//     paddingHorizontal: 20,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerInfo: {
//     flex: 1,
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   moreButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 100,
//   },

//   // MAP SECTION
//   mapSection: {
//     backgroundColor: '#fff',
//     borderRadius: 0,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//   },
//   mapContainer: {
//     height: height * 0.4,
//     position: 'relative',
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   mapOverlay: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     gap: 8,
//   },
//   mapInfoBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   mapInfoText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   gpsBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(52,199,89,0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//   },
//   gpsBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   officialBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFD700',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//   },
//   officialBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   recenterButton: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   startMarker: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#34C759',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#fff',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   endMarker: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FF3B30',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#fff',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   locationsInfo: {
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   locationItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 12,
//   },
//   locationTextContainer: {
//     flex: 1,
//   },
//   locationLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 2,
//     fontWeight: '500',
//   },
//   locationText: {
//     fontSize: 15,
//     color: '#1a1a1a',
//     fontWeight: '600',
//   },
//   coordsText: {
//     fontSize: 11,
//     color: '#666',
//     marginTop: 2,
//     fontFamily: 'monospace',
//   },
//   locationDivider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingLeft: 6,
//   },
//   dottedLine: {
//     width: 1,
//     height: 20,
//     borderLeftWidth: 2,
//     borderLeftColor: '#ccc',
//     borderStyle: 'dotted',
//   },

//   // VIDEO SECTION
//   videoSection: {
//     backgroundColor: '#fff',
//     marginTop: 16,
//     marginHorizontal: 20,
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//   },
//   videoHeader: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   videoTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   videoContainer: {
//     width: '100%',
//     height: height * 0.3,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   videoContainerFullscreen: {
//     width: width,
//     height: height,
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   controlsOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     pointerEvents: 'none',
//   },
//   videoControls: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -40,
//     marginTop: -40,
//   },
//   playPauseButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     overflow: 'hidden',
//     elevation: 8,
//     shadowColor: '#FEBD00',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//   },
//   playPauseGradient: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullscreenButton: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // ✅ DESCRIPTION SECTION
//   descriptionSection: {
//     backgroundColor: '#fff',
//     marginTop: 16,
//     marginHorizontal: 20,
//     borderRadius: 16,
//     padding: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//   },
//   descriptionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     gap: 8,
//   },
//   descriptionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   descriptionText: {
//     fontSize: 14,
//     lineHeight: 22,
//     color: '#666',
//   },

//   // FULLSCREEN
//   fullscreenContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//   },
//   fullscreenHeader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   fullscreenCloseButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullscreenTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginLeft: 16,
//   },

//   // Info Section
//   infoSection: {
//     marginTop: 16,
//     marginHorizontal: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   infoCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//   },
//   infoCardValue: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginTop: 8,
//     marginBottom: 4,
//   },
//   infoCardLabel: {
//     fontSize: 12,
//     color: '#999',
//     fontWeight: '500',
//   },
//   bottomSpacing: {
//     height: 40,
//   },
// });

// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/TableauDeBord/VideoPlayerScreen.js
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import MapView, { Polyline, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function VideoPlayerScreen({ route, navigation }) {
  const { path = {} } = route.params || {};

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

  const videoSource = path.video_url || path.videoUri || null;
  const isOfficial = path.is_official ?? path.isOfficial ?? false;

  const title = path.title || "Chemin";
  const creator = path.creator || "Utilisateur";
  const duration = path.duration || "-";
  const campus = path.campus || "Campus";

  const coordinates = useMemo(() => {
    if (Array.isArray(path.coordinates) && path.coordinates.length > 0) {
      const normalized = path.coordinates
        .map((c) => ({
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
        }))
        .filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude));

      if (normalized.length > 0) return normalized;
    }

    if (
      Number.isFinite(Number(path.start_lat)) &&
      Number.isFinite(Number(path.start_lng)) &&
      Number.isFinite(Number(path.end_lat)) &&
      Number.isFinite(Number(path.end_lng))
    ) {
      return [
        { latitude: Number(path.start_lat), longitude: Number(path.start_lng) },
        { latitude: Number(path.end_lat), longitude: Number(path.end_lng) },
      ];
    }

    return [
      { latitude: 14.6937, longitude: -17.4441 },
      { latitude: 14.6970, longitude: -17.4490 },
    ];
  }, [path]);

  const startLocation = coordinates[0];
  const endLocation = coordinates[coordinates.length - 1];

  const mapRegion = {
    latitude: (startLocation.latitude + endLocation.latitude) / 2,
    longitude: (startLocation.longitude + endLocation.longitude) / 2,
    latitudeDelta: Math.max(Math.abs(startLocation.latitude - endLocation.latitude) * 2, 0.01),
    longitudeDelta: Math.max(Math.abs(startLocation.longitude - endLocation.longitude) * 2, 0.01),
  };

  const departureLabel =
    path.start_label || path.departure || title.split("->")[0]?.trim() || "Départ";
  const destinationLabel =
    path.end_label || path.destination || title.split("->")[1]?.trim() || "Arrivée";

  const player = useVideoPlayer(videoSource ? { uri: videoSource } : null, (p) => {
    p.loop = false;
  });

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
      setShowControls(true);
    } else {
      player.play();
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((v) => !v);
    setShowControls(true);
  };

  const recenterMap = () => {
    mapRef.current?.animateToRegion(mapRegion, 500);
  };

  const VideoBox = ({ fullscreen = false }) => (
    <TouchableOpacity
      style={[styles.videoContainer, fullscreen && styles.videoContainerFullscreen]}
      activeOpacity={1}
      onPress={() => setShowControls((v) => !v)}
    >
      {videoSource ? (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      ) : (
        <View style={styles.noVideoContainer}>
          <Ionicons name="videocam-off-outline" size={42} color="#999" />
          <Text style={styles.noVideoText}>Aucune vidéo disponible</Text>
        </View>
      )}

      {showControls && videoSource && (
        <>
          <View style={styles.controlsOverlay} />
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause} activeOpacity={0.7}>
              <LinearGradient colors={["#FFC837", "#FEBD00"]} style={styles.playPauseGradient}>
                <Ionicons name={player.playing ? "pause" : "play"} size={36} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {!fullscreen && (
            <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
              <Ionicons name="expand" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["rgba(0,0,0,0.8)", "transparent"]} style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSubtitle}>Par {creator}</Text>
        </View>

        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={mapRegion}
            showsCompass
            showsScale
            showsBuildings
            loadingEnabled
          >
            <Polyline coordinates={coordinates} strokeColor="#007AFF" strokeWidth={5} />
            <Marker coordinate={startLocation} title="Départ" description={departureLabel}>
              <View style={styles.startMarker}>
                <Ionicons name="location" size={22} color="#fff" />
              </View>
            </Marker>
            <Marker coordinate={endLocation} title="Arrivée" description={destinationLabel}>
              <View style={styles.endMarker}>
                <Ionicons name="flag" size={18} color="#fff" />
              </View>
            </Marker>
          </MapView>

          <View style={styles.mapBadges}>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={14} color="#FEBD00" />
              <Text style={styles.badgeText}>{duration}</Text>
            </View>
            {isOfficial && (
              <View style={styles.badgeOfficial}>
                <Ionicons name="shield-checkmark" size={14} color="#fff" />
                <Text style={styles.badgeOfficialText}>Officiel</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
            <Ionicons name="locate" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.locationsInfo}>
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, { backgroundColor: "#34C759" }]} />
            <View style={styles.locationTextWrap}>
              <Text style={styles.locationLabel}>Départ</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {departureLabel}
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
            <View style={[styles.locationDot, { backgroundColor: "#FF3B30" }]} />
            <View style={styles.locationTextWrap}>
              <Text style={styles.locationLabel}>Arrivée</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {destinationLabel}
              </Text>
              <Text style={styles.coordsText}>
                {endLocation.latitude.toFixed(4)}, {endLocation.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Vidéo du trajet</Text>
          <VideoBox />
        </View>

        {!!path.description && (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descText}>{path.description}</Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={22} color="#FEBD00" />
              <Text style={styles.infoValue}>{duration}</Text>
              <Text style={styles.infoLabel}>Durée</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="videocam-outline" size={22} color="#FEBD00" />
              <Text style={styles.infoValue}>Vidéo</Text>
              <Text style={styles.infoLabel}>Format</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={22} color="#FEBD00" />
              <Text style={styles.infoValue} numberOfLines={1}>
                {campus}
              </Text>
              <Text style={styles.infoLabel}>Campus</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={isFullscreen} animationType="fade" onRequestClose={toggleFullscreen}>
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden />
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity style={styles.headerBtn} onPress={toggleFullscreen}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullscreenTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <VideoBox fullscreen />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  content: { flex: 1 },
  scrollContent: { paddingTop: 96, paddingBottom: 24 },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1, marginHorizontal: 10 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },

  mapWrap: { height: height * 0.36, backgroundColor: "#fff" },
  map: { width: "100%", height: "100%" },
  mapBadges: { position: "absolute", top: 12, right: 12, gap: 8 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: { color: "#333", fontWeight: "600", fontSize: 12 },
  badgeOfficial: {
    backgroundColor: "#FFD700",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeOfficialText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  recenterButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  startMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#34C759",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  endMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  locationsInfo: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  locationItem: { flexDirection: "row", alignItems: "flex-start" },
  locationDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 4 },
  locationTextWrap: { flex: 1 },
  locationLabel: { fontSize: 12, color: "#999", marginBottom: 2 },
  locationValue: { fontSize: 15, color: "#1a1a1a", fontWeight: "700" },
  coordsText: { fontSize: 11, color: "#666", marginTop: 2 },
  locationDivider: { paddingLeft: 5, paddingVertical: 8 },
  dottedLine: {
    width: 1,
    height: 18,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    borderStyle: "dotted",
  },

  videoSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1f1f1f", marginBottom: 10 },

  videoContainer: {
    width: "100%",
    height: height * 0.28,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  videoContainerFullscreen: {
    width: width,
    height: height,
    borderRadius: 0,
  },
  video: { width: "100%", height: "100%" },

  noVideoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  noVideoText: { color: "#999", fontSize: 14 },

  controlsOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  videoControls: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -34 }, { translateY: -34 }],
  },
  playPauseButton: { width: 68, height: 68, borderRadius: 34, overflow: "hidden" },
  playPauseGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  fullscreenButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  descSection: {
    backgroundColor: "#fff",
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 12,
  },
  descText: { color: "#555", lineHeight: 21 },

  infoSection: { marginTop: 12, marginHorizontal: 16 },
  infoRow: { flexDirection: "row", gap: 10 },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  infoValue: { marginTop: 8, fontSize: 13, fontWeight: "700", color: "#1f1f1f" },
  infoLabel: { marginTop: 3, fontSize: 11, color: "#888" },

  fullscreenContainer: { flex: 1, backgroundColor: "#000" },
  fullscreenHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fullscreenTitle: { flex: 1, color: "#fff", fontWeight: "700", fontSize: 16 },
});
