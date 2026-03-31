// // screens/TableauDeBord/VideoPlayerScreen.js
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
//   Alert,
// } from 'react-native';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Clipboard from 'expo-clipboard';

// const { width, height } = Dimensions.get('window');

// export default function VideoPlayer({ route, navigation }) {
//   const { path } = route.params;
//   const [showControls, setShowControls] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [mapRegion, setMapRegion] = useState(null);
//   const mapRef = useRef(null);

//   // ✅ Créer le player vidéo
//   const player = useVideoPlayer(path.videoUri, (player) => {
//     player.loop = false;
//   });

//   // ✅ Fonction formatTime
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ✅ UTILISER LES VRAIES COORDONNÉES GPS
//   const pathCoordinates =
//     path.coordinates && path.coordinates.length > 0
//       ? path.coordinates
//       : [
//           { latitude: 14.6937, longitude: -17.4441 },
//           { latitude: 14.6945, longitude: -17.4450 },
//           { latitude: 14.6950, longitude: -17.4465 },
//           { latitude: 14.6960, longitude: -17.4480 },
//           { latitude: 14.6970, longitude: -17.4490 },
//         ];

//   const startLocation = path.startLocation || pathCoordinates[0];
//   const endLocation = path.endLocation || pathCoordinates[pathCoordinates.length - 1];

//   const initialRegion = {
//     latitude: (startLocation.latitude + endLocation.latitude) / 2,
//     longitude: (startLocation.longitude + endLocation.longitude) / 2,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
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

//   const handleVideoPress = () => {
//     setShowControls(!showControls);
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//     setShowControls(true);
//   };

//   const recenterMap = () => {
//     if (mapRef.current) {
//       mapRef.current.animateToRegion(initialRegion, 500);
//     }
//   };

//   // ✅ Fonction de partage — lien vers le site web Vercel
//   const handleShare = async () => {
//     try {
//       if (!path.share_token) {
//         Alert.alert('Erreur', 'Token de partage manquant pour ce trajet.');
//         return;
//       }

//       // ✅ URL vers le site web Vercel (joli lien à partager)
//       const shareUrl = `https://tektal-web-appli.vercel.app/share/${path.share_token}`;
//       await Clipboard.setStringAsync(shareUrl);
//       Alert.alert(
//         '🔗 Lien copié !',
//         `Le lien de partage a été copié :\n\n${shareUrl}\n\nVous pouvez maintenant le partager sur WhatsApp, SMS, email, etc.`,
//         [{ text: 'OK', style: 'default' }]
//       );
//     } catch (error) {
//       console.error('Erreur partage:', error);
//       Alert.alert('Erreur', 'Impossible de copier le lien de partage');
//     }
//   };

//   // ✅ Composant Vidéo réutilisable
//   const VideoPlayerComponent = ({ fullscreen = false }) => (
//     <TouchableOpacity
//       activeOpacity={1}
//       onPress={handleVideoPress}
//       style={fullscreen ? styles.videoContainerFullscreen : styles.videoContainer}
//     >
//       <VideoView
//         player={player}
//         style={fullscreen ? styles.videoContainerFullscreen : styles.video}
//         contentFit="contain"
//         nativeControls={false}
//       />

//       {showControls && (
//         <>
//           <View style={styles.controlsOverlay} />

//           <View style={styles.videoControls}>
//             <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
//               <LinearGradient
//                 colors={['#FEBD00', '#FF9500']}
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

//           {!fullscreen && (
//             <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
//               <Ionicons name="expand" size={20} color="#fff" />
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//       {/* Header */}
//       <LinearGradient
//         colors={['rgba(0,0,0,0.8)', 'transparent']}
//         style={styles.header}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={22} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {path.title}
//           </Text>
//           <Text style={styles.headerSubtitle}>Par {path.creator}</Text>
//         </View>

//         {/* ✅ BOUTON PARTAGER */}
//         <TouchableOpacity
//           onPress={handleShare}
//           activeOpacity={0.7}
//           style={styles.shareButton}
//         >
//           <Ionicons name="share-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       <ScrollView
//         style={styles.content}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* MAP SECTION */}
//         <View style={styles.mapSection}>
//           <View style={styles.mapContainer}>
//             <MapView
//               ref={mapRef}
//               style={styles.map}
//               mapType="satellite"
//               initialRegion={initialRegion}
//               onRegionChangeComplete={setMapRegion}
//               scrollEnabled={true}
//               zoomEnabled={true}
//               pitchEnabled={true}
//               rotateEnabled={true}
//             >
//               <Polyline
//                 coordinates={pathCoordinates}
//                 strokeColor="#007AFF"
//                 strokeWidth={4}
//                 lineDashPattern={[1]}
//               />

//               <Marker coordinate={startLocation} anchor={{ x: 0.5, y: 0.5 }}>
//                 <View style={styles.startMarker}>
//                   <Ionicons name="flag" size={18} color="#fff" />
//                 </View>
//               </Marker>

//               <Marker coordinate={endLocation} anchor={{ x: 0.5, y: 0.5 }}>
//                 <View style={styles.endMarker}>
//                   <Ionicons name="location" size={18} color="#fff" />
//                 </View>
//               </Marker>
//             </MapView>

//             <View style={styles.mapOverlay}>
//               <View style={styles.mapInfoBadge}>
//                 <Ionicons name="time-outline" size={16} color="#FEBD00" />
//                 <Text style={styles.mapInfoText}>{path.duration}</Text>
//               </View>

//               <View style={styles.zoomHintBadge}>
//                 <Ionicons name="search-outline" size={12} color="#fff" />
//                 <Text style={styles.zoomHintText}>Pincez pour zoomer</Text>
//               </View>

//               {path.coordinates && path.coordinates.length > 0 && (
//                 <View style={styles.gpsBadge}>
//                   <Ionicons name="navigate" size={12} color="#fff" />
//                   <Text style={styles.gpsBadgeText}>
//                     {path.coordinates.length} points
//                   </Text>
//                 </View>
//               )}

//               {path.isOfficial && (
//                 <View style={styles.officialBadge}>
//                   <Ionicons name="shield-checkmark" size={12} color="#fff" />
//                   <Text style={styles.officialBadgeText}>Officiel</Text>
//                 </View>
//               )}
//             </View>

//             <TouchableOpacity onPress={recenterMap} style={styles.recenterButton}>
//               <Ionicons name="locate" size={22} color="#007AFF" />
//             </TouchableOpacity>
//           </View>

//           {/* Locations Info */}
//           <View style={styles.locationsInfo}>
//             <View style={styles.locationItem}>
//               <View style={[styles.locationDot, { backgroundColor: '#34C759' }]} />
//               <View style={styles.locationTextContainer}>
//                 <Text style={styles.locationLabel}>Départ</Text>
//                 <Text style={styles.locationText}>
//                   {path.departure || path.title.split('→')[0]?.trim()}
//                 </Text>
//                 <Text style={styles.coordsText}>
//                   {startLocation.latitude.toFixed(6)}, {startLocation.longitude.toFixed(6)}
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
//                 <Text style={styles.locationText}>
//                   {path.destination || path.title.split('→')[1]?.trim()}
//                 </Text>
//                 <Text style={styles.coordsText}>
//                   {endLocation.latitude.toFixed(6)}, {endLocation.longitude.toFixed(6)}
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

//         {/* SECTION ÉTAPES */}
//         {path.steps && path.steps.length > 0 && (
//           <View style={styles.stepsSection}>
//             <View style={styles.stepsSectionHeader}>
//               <Ionicons name="list" size={22} color="#FEBD00" />
//               <Text style={styles.stepsSectionTitle}>
//                 Étapes du trajet ({path.steps.length})
//               </Text>
//             </View>

//             {path.steps.map((step, index) => (
//               <View key={index} style={styles.stepCard}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>{step.step_number}</Text>
//                 </View>

//                 <View style={styles.stepContent}>
//                   <View style={styles.stepHeader}>
//                     <Text style={styles.stepTitle}>Étape {step.step_number}</Text>
//                     <View style={styles.stepTiming}>
//                       <Ionicons name="time-outline" size={12} color="#666" />
//                       <Text style={styles.stepTimingText}>
//                         {formatTime(step.start_time)} - {formatTime(step.end_time)}
//                       </Text>
//                     </View>
//                   </View>

//                   <Text style={styles.stepText}>{step.text}</Text>

//                   <TouchableOpacity
//                     style={styles.stepPlayButton}
//                     onPress={() => {
//                       player.currentTime = step.start_time;
//                       player.play();
//                     }}
//                   >
//                     <Ionicons name="play-circle" size={16} color="#FEBD00" />
//                     <Text style={styles.stepPlayText}>Voir cette étape</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* SECTION DESCRIPTION */}
//         {path.description && (
//           <View style={styles.descriptionSection}>
//             <View style={styles.descriptionHeader}>
//               <Ionicons name="information-circle-outline" size={22} color="#FEBD00" />
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
//               <Ionicons name="school-outline" size={24} color="#FEBD00" />
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
//         statusBarTranslucent
//         onRequestClose={toggleFullscreen}
//       >
//         <View style={styles.fullscreenContainer}>
//           <StatusBar hidden />

//           {showControls && (
//             <View style={styles.fullscreenHeader}>
//               <TouchableOpacity
//                 onPress={toggleFullscreen}
//                 style={styles.fullscreenCloseButton}
//               >
//                 <Ionicons name="close" size={24} color="#fff" />
//               </TouchableOpacity>
//               <Text style={styles.fullscreenTitle} numberOfLines={1}>
//                 {path.title}
//               </Text>
//             </View>
//           )}

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
//   shareButton: {
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
//   zoomHintBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//   },
//   zoomHintText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#fff',
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
//   stepsSection: {
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
//   stepsSectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 8,
//   },
//   stepsSectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   stepCard: {
//     flexDirection: 'row',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FEBD00',
//   },
//   stepNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FEBD00',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   stepNumberText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   stepContent: {
//     flex: 1,
//   },
//   stepHeader: {
//     marginBottom: 8,
//   },
//   stepTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   stepTiming: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   stepTimingText: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   stepText: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   stepPlayButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: '#FFF8E1',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     gap: 4,
//   },
//   stepPlayText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#FEBD00',
//   },
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



// screens/TableauDeBord/VideoPlayerScreen.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Dimensions, ScrollView, Modal, useColorScheme, Animated,
  PanResponder,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = height * 0.35;

export default function VideoPlayer({ route, navigation }) {
  const { path } = route.params;
  const isDark = useColorScheme() === 'dark';

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimer = useRef(null);

  const theme = {
    bg: isDark ? '#0a0a0a' : '#F0F2F5',
    card: isDark ? '#141414' : '#fff',
    text: isDark ? '#f0f0f0' : '#111',
    subtext: isDark ? '#888' : '#666',
    border: isDark ? '#222' : '#eee',
    stepBg: isDark ? '#1a1a1a' : '#FAFAFA',
    accent: '#FEBD00',
  };

  const player = useVideoPlayer(path.videoUri, (p) => {
    p.loop = false;
  });

  // Auto-masquer les contrôles après 3s
  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }
    }, 3000);
  }, [isPlaying, controlsOpacity]);

  useEffect(() => {
    if (isPlaying) scheduleHideControls();
    return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); };
  }, [isPlaying, scheduleHideControls]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    scheduleHideControls();
  };

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
      setShowControls(true);
      Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    } else {
      player.play();
      setIsPlaying(true);
      scheduleHideControls();
    }
  };

  const seekBackward = () => {
    player.currentTime = Math.max(0, (player.currentTime || 0) - 10);
    showControlsTemporarily();
  };

  const seekForward = () => {
    player.currentTime = (player.currentTime || 0) + 10;
    showControlsTemporarily();
  };

  const formatTime = (s) => {
    const m = Math.floor((s || 0) / 60);
    const sec = Math.floor((s || 0) % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pathCoordinates =
    path.coordinates && path.coordinates.length > 0
      ? path.coordinates
      : [
          { latitude: 14.6937, longitude: -17.4441 },
          { latitude: 14.6945, longitude: -17.4450 },
          { latitude: 14.6960, longitude: -17.4480 },
          { latitude: 14.6970, longitude: -17.4490 },
        ];

  const startLocation = path.startLocation || pathCoordinates[0];
  const endLocation = path.endLocation || pathCoordinates[pathCoordinates.length - 1];
  const initialRegion = {
    latitude: (startLocation.latitude + endLocation.latitude) / 2,
    longitude: (startLocation.longitude + endLocation.longitude) / 2,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleShare = async () => {
    try {
      if (!path.share_token) { Alert.alert('Erreur', 'Token de partage manquant.'); return; }
      const shareUrl = `https://tektal-web-appli.vercel.app/share/${path.share_token}`;
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert('🔗 Lien copié !', shareUrl);
    } catch { Alert.alert('Erreur', 'Impossible de copier le lien'); }
  };

  const VideoControls = () => (
    <Animated.View style={[styles.controlsWrapper, { opacity: controlsOpacity }]}>
      {/* Gradient sombre en bas */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.controlsGradient}
        pointerEvents="none"
      />

      {/* Boutons centraux */}
      <View style={styles.centerControls}>
        {/* -10s */}
        <TouchableOpacity onPress={seekBackward} style={styles.seekButton} activeOpacity={0.7}>
          <View style={styles.seekButtonInner}>
            <Ionicons name="play-back" size={22} color="#fff" />
            <Text style={styles.seekLabel}>10</Text>
          </View>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton} activeOpacity={0.85}>
          <LinearGradient
            colors={['#FEBD00', '#F09000']}
            style={styles.playButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" style={isPlaying ? {} : { marginLeft: 3 }} />
          </LinearGradient>
        </TouchableOpacity>

        {/* +10s */}
        <TouchableOpacity onPress={seekForward} style={styles.seekButton} activeOpacity={0.7}>
          <View style={styles.seekButtonInner}>
            <Ionicons name="play-forward" size={22} color="#fff" />
            <Text style={styles.seekLabel}>10</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Durée + plein écran */}
      <View style={styles.bottomBar}>
        <Text style={styles.durationText}>{path.duration}</Text>
        <TouchableOpacity onPress={() => setIsFullscreen(true)} style={styles.expandBtn}>
          <Ionicons name="expand-outline" size={20} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ══════════════════════════════════════
            1. VIDÉO — pleine largeur, moderne
        ══════════════════════════════════════ */}
        <View style={styles.videoWrapper}>
          <TouchableOpacity activeOpacity={1} onPress={showControlsTemporarily} style={styles.videoTouchable}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="cover"
              nativeControls={false}
            />
            {showControls && <VideoControls />}
          </TouchableOpacity>

          {/* Header flottant sur la vidéo */}
          <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={styles.videoHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1}>{path.title}</Text>
              <Text style={styles.headerSub}>Par {path.creator}</Text>
            </View>
            <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Badges info sous la vidéo */}
        <View style={[styles.infoBadgesRow, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          {path.isOfficial && (
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={13} color="#FEBD00" />
              <Text style={styles.badgeText}>Officiel</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={13} color="#888" />
            <Text style={[styles.badgeText, { color: theme.subtext }]}>{path.duration}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="person-outline" size={13} color="#888" />
            <Text style={[styles.badgeText, { color: theme.subtext }]}>{path.creator}</Text>
          </View>
        </View>

        {/* ══════════════════════════════════════
            2. CARTE
        ══════════════════════════════════════ */}
        <View style={[styles.section, { backgroundColor: theme.card, marginTop: 12 }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Itinéraire</Text>
            </View>
            {path.coordinates?.length > 0 && (
              <View style={styles.gpsPill}>
                <Ionicons name="navigate" size={11} color="#fff" />
                <Text style={styles.gpsPillText}>{path.coordinates.length} pts</Text>
              </View>
            )}
          </View>

          {/* Départ → Arrivée */}
          <View style={[styles.routeRow, { borderBottomColor: theme.border }]}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#34C759' }]} />
              <View>
                <Text style={[styles.routePointLabel, { color: theme.subtext }]}>Départ</Text>
                <Text style={[styles.routePointName, { color: theme.text }]}>
                  {path.departure || path.title.split('→')[0]?.trim() || '—'}
                </Text>
              </View>
            </View>
            <View style={styles.routeArrow}>
              <View style={[styles.routeLine, { backgroundColor: theme.border }]} />
              <Ionicons name="arrow-forward" size={14} color={theme.accent} />
            </View>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#FF3B30' }]} />
              <View>
                <Text style={[styles.routePointLabel, { color: theme.subtext }]}>Arrivée</Text>
                <Text style={[styles.routePointName, { color: theme.text }]}>
                  {path.destination || path.title.split('→')[1]?.trim() || '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              mapType="satellite"
              initialRegion={initialRegion}
              scrollEnabled zoomEnabled pitchEnabled rotateEnabled
            >
              <Polyline coordinates={pathCoordinates} strokeColor="#FEBD00" strokeWidth={3} />
              <Marker coordinate={startLocation} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.markerGreen}><Ionicons name="flag" size={14} color="#fff" /></View>
              </Marker>
              <Marker coordinate={endLocation} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.markerRed}><Ionicons name="location" size={14} color="#fff" /></View>
              </Marker>
            </MapView>
            <TouchableOpacity
              style={styles.recenterBtn}
              onPress={() => mapRef.current?.animateToRegion(initialRegion, 400)}
            >
              <Ionicons name="locate" size={18} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════════════════════════════
            3. ÉTAPES
        ══════════════════════════════════════ */}
        {path.steps?.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card, marginTop: 12 }]}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionDot} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Étapes</Text>
              </View>
              <View style={styles.gpsPill}>
                <Text style={styles.gpsPillText}>{path.steps.length}</Text>
              </View>
            </View>

            <View style={{ padding: 16, gap: 12 }}>
              {path.steps.map((step, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.stepCard, { backgroundColor: theme.stepBg }]}
                  activeOpacity={0.75}
                  onPress={() => { player.currentTime = step.start_time; player.play(); setIsPlaying(true); }}
                >
                  <View style={styles.stepNumBox}>
                    <Text style={styles.stepNumText}>{step.step_number}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stepText, { color: theme.text }]}>{step.text}</Text>
                    <View style={styles.stepMeta}>
                      <Ionicons name="time-outline" size={12} color="#888" />
                      <Text style={styles.stepMetaText}>
                        {formatTime(step.start_time)} → {formatTime(step.end_time)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepPlayIcon}>
                    <Ionicons name="play-circle" size={28} color="#FEBD00" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══ MODAL PLEIN ÉCRAN ══ */}
      <Modal visible={isFullscreen} animationType="fade" statusBarTranslucent onRequestClose={() => setIsFullscreen(false)}>
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden />
          <TouchableOpacity activeOpacity={1} onPress={showControlsTemporarily} style={{ flex: 1 }}>
            <VideoView player={player} style={{ flex: 1 }} contentFit="contain" nativeControls={false} />
            {showControls && (
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: controlsOpacity }]}>
                <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
                <View style={styles.fullscreenTopBar}>
                  <TouchableOpacity onPress={() => setIsFullscreen(false)} style={styles.headerBtn}>
                    <Ionicons name="chevron-down" size={26} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.fullscreenTitle} numberOfLines={1}>{path.title}</Text>
                </View>
                <View style={styles.centerControls}>
                  <TouchableOpacity onPress={seekBackward} style={styles.seekButton}>
                    <View style={styles.seekButtonInner}>
                      <Ionicons name="play-back" size={24} color="#fff" />
                      <Text style={styles.seekLabel}>10</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                    <LinearGradient colors={['#FEBD00', '#F09000']} style={styles.playButtonGradient}>
                      <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" style={isPlaying ? {} : { marginLeft: 3 }} />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={seekForward} style={styles.seekButton}>
                    <View style={styles.seekButtonInner}>
                      <Ionicons name="play-forward" size={24} color="#fff" />
                      <Text style={styles.seekLabel}>10</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Vidéo ──
  videoWrapper: { width, height: VIDEO_HEIGHT, backgroundColor: '#000', position: 'relative' },
  videoTouchable: { width: '100%', height: '100%' },
  video: { width: '100%', height: '100%' },
  videoHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, gap: 12 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // ── Contrôles vidéo ──
  controlsWrapper: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  controlsGradient: { ...StyleSheet.absoluteFillObject },
  centerControls: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  seekButton: { alignItems: 'center', justifyContent: 'center' },
  seekButtonInner: { alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  seekLabel: { fontSize: 10, color: '#fff', fontWeight: '700', marginTop: 1 },
  playButton: { width: 68, height: 68, borderRadius: 34, overflow: 'hidden', shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  playButtonGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14 },
  durationText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  expandBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  // ── Badges ──
  infoBadgesRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 16, borderBottomWidth: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  badgeText: { fontSize: 13, fontWeight: '500', color: '#888' },

  // ── Sections ──
  section: { borderRadius: 0, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionDot: { width: 4, height: 18, borderRadius: 2, backgroundColor: '#FEBD00' },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  gpsPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEBD00', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4 },
  gpsPillText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  // ── Route ──
  routeRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  routePoint: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routePointLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
  routePointName: { fontSize: 14, fontWeight: '700' },
  routeArrow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 4 },
  routeLine: { width: 20, height: 1 },

  // ── Map ──
  mapContainer: { height: height * 0.3, position: 'relative' },
  map: { width: '100%', height: '100%' },
  recenterBtn: { position: 'absolute', bottom: 14, right: 14, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  markerGreen: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#34C759', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: '#fff' },
  markerRed: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: '#fff' },

  // ── Étapes ──
  stepCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, gap: 12, borderLeftWidth: 3, borderLeftColor: '#FEBD00' },
  stepNumBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  stepText: { fontSize: 14, fontWeight: '600', marginBottom: 6, lineHeight: 20 },
  stepMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stepMetaText: { fontSize: 12, color: '#888', fontWeight: '500' },
  stepPlayIcon: { marginLeft: 4 },

  // ── Fullscreen ──
  fullscreenContainer: { flex: 1, backgroundColor: '#000' },
  fullscreenTopBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingTop: 54, paddingBottom: 16, paddingHorizontal: 16, gap: 12 },
  fullscreenTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
});