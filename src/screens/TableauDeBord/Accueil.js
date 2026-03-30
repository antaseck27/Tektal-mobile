// // src/screens/TableauDeBord/Accueil.jsx
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, RefreshControl, ActivityIndicator, Dimensions,
//   StatusBar, Alert, FlatList, Share, Linking, Platform,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import * as MediaLibrary from 'expo-media-library';
// import * as FileSystem from 'expo-file-system';
// import { usePaths } from '../../context/PathContext';
// import { getProfile } from '../../services/authService';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.65;
// const APP_SHARE_BASE_URL = 'https://tektal.app/path';

// const filterValidCoords = (coords = []) =>
//   coords.filter(
//     (c) => c && c.latitude != null && c.longitude != null &&
//            !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
//   );

// export default function Accueil({ navigation }) {
//   const { paths, loading, toggleFavorite, refreshPaths } = usePaths();
//   const [refreshing, setRefreshing] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [viewMode, setViewMode] = useState('tiktok'); // ✅ Vue TikTok par défaut
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef(null);

//   const goToAjouter = useCallback(() => {
//     const currentRoutes = navigation.getState()?.routeNames || [];
//     if (currentRoutes.includes('Ajouter')) { navigation.navigate('Ajouter'); return; }
//     navigation.navigate('Dashboard', { screen: 'Ajouter' });
//   }, [navigation]);

//   const loadUser = useCallback(async () => {
//     try {
//       const res = await getProfile();
//       if (!res?.ok) return;
//       const u = res.data || {};
//       setUserName(u.full_name?.trim() || u.name?.trim() || (u.email ? u.email.split('@')[0] : '') || '');
//     } catch { /* ignore */ }
//   }, []);

//   useEffect(() => { loadUser(); }, [loadUser]);
//   useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([refreshPaths(), loadUser()]);
//     setRefreshing(false);
//   };

//   const handleOpenPath = (path) => navigation.navigate('VideoPlayer', { path });
//   const handleToggleFavorite = async (id) => await toggleFavorite(id);

//   const handleViewMap = (path) => {
//     const validCoords = filterValidCoords(path.coordinates);
//     if (validCoords.length < 1) {
//       Alert.alert('Carte indisponible', "Ce chemin n'a pas encore de coordonnées GPS enregistrées.", [{ text: 'OK' }]);
//       return;
//     }
//     navigation.navigate('Map', { path: { ...path, coordinates: validCoords } });
//   };

//   const handleShare = async (path) => {
//     try {
//       const token = path.share_token || String(path.id);
//       const shareUrl = `${APP_SHARE_BASE_URL}/${token}`;
//       const creatorLine = path.creator && path.creator !== 'Inconnu' ? `👤 Créé par ${path.creator}\n` : '';
//       const shareMessage = `🗺️ Découvre ce chemin : "${path.title}"\n${creatorLine}\n👉 ${shareUrl}`;

//       Alert.alert('Partager ce chemin', `Token : ${token}`, [
//         {
//           text: '📱 Partager via...',
//           onPress: async () => {
//             try {
//               await Share.share({ message: shareMessage, title: path.title, ...(Platform.OS === 'ios' ? { url: shareUrl } : {}) });
//             } catch { Alert.alert('Erreur', 'Impossible de partager.'); }
//           },
//         },
//         {
//           text: '💬 WhatsApp',
//           onPress: async () => {
//             const encoded = encodeURIComponent(shareMessage);
//             try {
//               const canOpen = await Linking.canOpenURL(`whatsapp://send?text=${encoded}`);
//               await Linking.openURL(canOpen ? `whatsapp://send?text=${encoded}` : `https://wa.me/?text=${encoded}`);
//             } catch { Alert.alert('Erreur', "Impossible d'ouvrir WhatsApp."); }
//           },
//         },
//         { text: 'Annuler', style: 'cancel' },
//       ]);
//     } catch {
//       Alert.alert('Erreur', "Impossible de partager ce contenu.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FEBD00" />
//         <Text style={styles.loadingText}>Chargement des chemins...</Text>
//       </View>
//     );
//   }

//   // ===== VUE TIKTOK =====
//   if (viewMode === 'tiktok') {
//     if (paths.length === 0) {
//       return (
//         <View style={styles.tiktokContainer}>
//           <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//             <Ionicons name="grid-outline" size={28} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.emptyTiktokContainer}>
//             <Ionicons name="videocam-off-outline" size={80} color="#999" />
//             <Text style={styles.emptyTiktokText}>Aucune vidéo disponible</Text>
//             <TouchableOpacity style={styles.createTiktokButton} onPress={goToAjouter}>
//               <Text style={styles.createTiktokButtonText}>Créer un chemin</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }
//     return (
//       <View style={styles.tiktokContainer}>
//         <StatusBar barStyle="light-content" />
//         <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//           <Ionicons name="grid-outline" size={28} color="#FFF" />
//         </TouchableOpacity>
//         <FlatList
//           ref={flatListRef}
//           data={paths}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item) => String(item.id)}
//           getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
//           onMomentumScrollEnd={(event) => {
//             const index = Math.round(event.nativeEvent.contentOffset.y / height);
//             setCurrentIndex(index);
//           }}
//           renderItem={({ item, index }) => (
//             <VideoItem
//               path={item}
//               isActive={index === currentIndex}
//               onToggleFavorite={handleToggleFavorite}
//               onViewSteps={handleOpenPath}
//               onViewMap={handleViewMap}
//               onShare={handleShare}
//             />
//           )}
//         />
//       </View>
//     );
//   }

//   // ===== VUE CLASSIQUE =====
//   if (paths.length === 0) {
//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//           <View style={styles.headerContent}>
//             <View>
//               <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//               {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//             </View>
//             <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//               <Ionicons name="play-circle" size={32} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyIconContainer}>
//             <Ionicons name="map-outline" size={80} color="#FEBD00" />
//           </View>
//           <Text style={styles.emptyTitle}>Aucun chemin pour le moment</Text>
//           <Text style={styles.emptyText}>Explorez de nouveaux horizons en créant votre premier chemin d'apprentissage</Text>
//           <TouchableOpacity style={styles.createButton} onPress={goToAjouter} activeOpacity={0.8}>
//             <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.createButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//               <Ionicons name="add-circle-outline" size={22} color="#fff" />
//               <Text style={styles.createButtonText}>Créer un chemin</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FEBD00" colors={['#FEBD00']} />}
//     >
//       <StatusBar barStyle="light-content" />
//       <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//             {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//           </View>
//           <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//             <Ionicons name="play-circle" size={32} color="#FFF" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <View style={styles.featuredSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Derniers chemins</Text>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll} snapToInterval={CARD_WIDTH + 16} decelerationRate="fast">
//           {paths.slice(0, 5).map((path, index) => (
//             <TouchableOpacity key={path.id} style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 8 }]} onPress={() => handleOpenPath(path)} activeOpacity={0.9}>
//               <Image source={{ uri: path.thumbnail }} style={styles.featuredImage} resizeMode="cover" />
//               <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredGradient}>
//                 <View style={styles.featuredTopBadges}>
//                   {path.isOfficial && (
//                     <View style={styles.officialBadgeFeatured}>
//                       <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
//                       <Text style={styles.officialBadgeText}>Officiel</Text>
//                     </View>
//                   )}
//                 </View>
//                 <View style={styles.featuredInfo}>
//                   <Text style={styles.featuredTitle} numberOfLines={2}>{path.title}</Text>
//                   <Text style={styles.featuredCreator} numberOfLines={1}>Par {path.creator}</Text>
//                   <View style={styles.featuredMeta}>
//                     <View style={styles.featuredMetaItem}>
//                       <Ionicons name="time-outline" size={13} color="#fff" />
//                       <Text style={styles.featuredMetaText}>{path.duration}</Text>
//                     </View>
//                   </View>
//                   {path.publishedAt && (
//                     <View style={styles.featuredDateItem}>
//                       <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.75)" />
//                       <Text style={styles.featuredDateText}>{path.publishedAt}</Text>
//                     </View>
//                   )}
//                 </View>
//               </LinearGradient>
//               <View style={styles.playButtonOverlay}>
//                 <View style={styles.playButton}>
//                   <Ionicons name="play" size={18} color="#fff" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.recentSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Tous les chemins</Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Ionicons name="refresh" size={20} color="#FEBD00" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.recentList}>
//           {paths.map((path) => (
//             <TouchableOpacity key={path.id} style={styles.pathCard} onPress={() => handleOpenPath(path)} activeOpacity={0.7}>
//               <View style={styles.pathThumbnailContainer}>
//                 <Image source={{ uri: path.thumbnail }} style={styles.pathThumbnail} resizeMode="cover" />
//                 {path.isOfficial && (
//                   <View style={styles.officialBadgeSmall}>
//                     <Ionicons name="shield-checkmark" size={10} color="#fff" />
//                   </View>
//                 )}
//                 <View style={styles.thumbnailPlayButton}>
//                   <Ionicons name="play" size={16} color="#fff" />
//                 </View>
//               </View>
//               <View style={styles.pathInfo}>
//                 <Text style={styles.pathTitle} numberOfLines={2}>{path.title}</Text>
//                 <Text style={styles.pathCreator} numberOfLines={1}>Par {path.creator}</Text>
//                 {path.establishment && (
//                   <Text style={styles.pathEstablishment} numberOfLines={1}>🏫 {path.establishment}</Text>
//                 )}
//                 <View style={styles.pathMeta}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="time-outline" size={12} color="#999" />
//                     <Text style={styles.metaText}>{path.duration}</Text>
//                   </View>
//                 </View>
//                 {path.publishedAt && (
//                   <View style={styles.publishedAtRow}>
//                     <Ionicons name="calendar-outline" size={11} color="#bbb" />
//                     <Text style={styles.publishedAtText}>{path.publishedAt}</Text>
//                   </View>
//                 )}
//               </View>
//               <View style={styles.cardActions}>
//                 <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorite(path.id)} activeOpacity={0.6}>
//                   <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={24} color={path.isFavorite ? '#FF3B30' : '#ccc'} />
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={styles.bottomSpacing} />
//       </View>
//     </ScrollView>
//   );
// }

// // ===== COMPOSANT VIDÉO TIKTOK =====
// function VideoItem({ path, isActive, onToggleFavorite, onViewSteps, onViewMap, onShare }) {
//   const videoSource = path.videoUri || null;
//   const [downloading, setDownloading] = useState(false);

//   const player = useVideoPlayer(videoSource, (p) => { p.loop = true; });

//   useEffect(() => {
//     if (!player) return;
//     try {
//       if (isActive && videoSource) { player.play(); }
//       else { player.pause(); }
//     } catch (e) { console.warn('VideoPlayer error:', e); }
//   }, [isActive, player, videoSource]);

//   // ✅ Télécharger la vidéo dans la galerie photo
//   const handleDownload = async () => {
//     if (!path.videoUri) {
//       Alert.alert('Indisponible', 'Aucune vidéo disponible pour ce chemin.');
//       return;
//     }

//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour télécharger la vidéo.");
//         return;
//       }

//       setDownloading(true);

//       const fileName = `tektal_${path.id}_${Date.now()}.mp4`;
//       const localUri = FileSystem.cacheDirectory + fileName;

//       const downloadResult = await FileSystem.downloadAsync(path.videoUri, localUri);

//       if (downloadResult.status !== 200) {
//         throw new Error('Échec du téléchargement');
//       }

//       const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
//       await MediaLibrary.createAlbumAsync('Tektal', asset, false);

//       Alert.alert('✅ Téléchargé !', 'La vidéo a été enregistrée dans votre galerie dans l\'album "Tektal".');
//     } catch (error) {
//       console.error('Erreur téléchargement:', error);
//       Alert.alert('Erreur', 'Impossible de télécharger la vidéo. Vérifiez votre connexion.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const showCreator = path.creator && path.creator !== 'Inconnu';

//   return (
//     <View style={styles.videoContainer}>
//       {videoSource ? (
//         <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
//       ) : (
//         <Image source={{ uri: path.thumbnail }} style={styles.video} resizeMode="cover" />
//       )}

//       <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.videoBottomGradient} />

//       {/* Infos bas gauche */}
//       <View style={styles.videoInfoContainer}>
//         <Text style={styles.videoTitle}>{path.title || 'Sans titre'}</Text>
//         {showCreator && <Text style={styles.videoSubtitle}>Par {path.creator}</Text>}
//         <View style={styles.videoMetaRow}>
//           <Ionicons name="time-outline" size={13} color="#FFF" />
//           <Text style={styles.videoMetaText}>{path.duration || '0 sec'}</Text>
//         </View>
//       </View>

//       {/* Actions droite */}
//       <View style={styles.videoActionsContainer}>

//         {/* Favori */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onToggleFavorite(path.id)} activeOpacity={0.7}>
//           <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={36} color={path.isFavorite ? '#FF3B30' : '#FFF'} />
//           <Text style={styles.videoActionText}>{path.isFavorite ? 'Aimé' : 'Aimer'}</Text>
//         </TouchableOpacity>

//         {/* Carte GPS */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewMap(path)} activeOpacity={0.7}>
//           <Ionicons name="map-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Carte</Text>
//         </TouchableOpacity>

//         {/* Voir détails */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewSteps(path)} activeOpacity={0.7}>
//           <Ionicons name="list-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Voir</Text>
//         </TouchableOpacity>

//         {/* Partager */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onShare(path)} activeOpacity={0.7}>
//           <Ionicons name="share-social-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Partager</Text>
//         </TouchableOpacity>

//         {/* ✅ Télécharger — icône jaune pour se démarquer */}
//         <TouchableOpacity
//           style={styles.videoActionButton}
//           onPress={handleDownload}
//           activeOpacity={0.7}
//           disabled={downloading}
//         >
//           {downloading ? (
//             <ActivityIndicator size="small" color="#FEBD00" style={{ width: 36, height: 36 }} />
//           ) : (
//             <Ionicons name="download-outline" size={36} color="#FEBD00" />
//           )}
//           <Text style={[styles.videoActionText, { color: '#FEBD00' }]}>
//             {downloading ? '...' : 'Sauver'}
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
//   loadingText: { marginTop: 16, fontSize: 16, color: '#666', fontWeight: '500' },
//   header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
//   headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerGreeting: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
//   headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
//   toggleIconRight: { backgroundColor: 'rgba(255,255,255,0.25)', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 40 },
//   emptyIconContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//   emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
//   emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
//   createButton: { borderRadius: 28, overflow: 'hidden', elevation: 4, shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
//   createButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14 },
//   createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
//   featuredSection: { marginTop: 24, marginBottom: 8 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', letterSpacing: 0.3 },
//   featuredScroll: { paddingRight: 20 },
//   featuredCard: { width: CARD_WIDTH, height: 220, marginRight: 8, borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, backgroundColor: '#fff' },
//   featuredImage: { width: '100%', height: '100%' },
//   featuredGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 16 },
//   featuredTopBadges: { flexDirection: 'row', justifyContent: 'flex-end' },
//   officialBadgeFeatured: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
//   officialBadgeText: { color: '#FEBD00', fontSize: 11, marginLeft: 4, fontWeight: '600' },
//   featuredInfo: { marginBottom: 4 },
//   featuredTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4, lineHeight: 22 },
//   featuredCreator: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 8 },
//   featuredMeta: { flexDirection: 'row', gap: 12 },
//   featuredMetaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   featuredMetaText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '500' },
//   featuredDateItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
//   featuredDateText: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
//   playButtonOverlay: { position: 'absolute', bottom: 16, right: 16 },
//   playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', elevation: 8 },
//   recentSection: { marginTop: 16, paddingHorizontal: 20 },
//   refreshButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center' },
//   recentList: { gap: 12 },
//   pathCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, padding: 12 },
//   pathThumbnailContainer: { position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
//   pathThumbnail: { width: '100%', height: '100%' },
//   officialBadgeSmall: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,215,0,0.95)', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
//   thumbnailPlayButton: { position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(254,189,0,0.95)', justifyContent: 'center', alignItems: 'center' },
//   pathInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
//   pathTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4, lineHeight: 20 },
//   pathCreator: { fontSize: 13, color: '#666', marginBottom: 2 },
//   pathEstablishment: { fontSize: 12, color: '#FEBD00', marginBottom: 4, fontWeight: '500' },
//   pathMeta: { flexDirection: 'row', gap: 12, marginBottom: 2 },
//   metaItem: { flexDirection: 'row', alignItems: 'center' },
//   metaText: { fontSize: 12, color: '#999', marginLeft: 4, fontWeight: '500' },
//   publishedAtRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
//   publishedAtText: { fontSize: 11, color: '#bbb' },
//   cardActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
//   favoriteButton: { padding: 8 },
//   bottomSpacing: { height: 32 },

//   // ===== TIKTOK =====
//   tiktokContainer: { flex: 1, backgroundColor: '#000' },
//   toggleButtonTopLeft: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.45)', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', zIndex: 100, elevation: 8 },
//   emptyTiktokContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 40 },
//   emptyTiktokText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
//   createTiktokButton: { backgroundColor: '#FEBD00', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, marginTop: 10 },
//   createTiktokButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   videoContainer: { width, height, backgroundColor: '#000' },
//   video: { width: '100%', height: '100%' },
//   videoBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
//   videoInfoContainer: { position: 'absolute', bottom: 110, left: 16, right: 110 },
//   videoTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoSubtitle: { fontSize: 13, color: '#FFF', marginBottom: 6, opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   videoMetaText: { fontSize: 13, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoActionsContainer: { position: 'absolute', right: 16, bottom: 110, gap: 26, alignItems: 'center' },
//   videoActionButton: { alignItems: 'center', gap: 5 },
//   videoActionText: { fontSize: 11, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
// });
// src/screens/TableauDeBord/Accueil.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, RefreshControl, ActivityIndicator, Dimensions,
  StatusBar, Alert, FlatList, Share, Linking, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
// ✅ Import depuis legacy pour éviter le warning de dépréciation
import * as FileSystem from 'expo-file-system/legacy';
import { usePaths } from '../../context/PathContext';
import { getProfile } from '../../services/authService';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;
const APP_SHARE_BASE_URL = 'https://tektal.app/path';

const filterValidCoords = (coords = []) =>
  coords.filter(
    (c) => c && c.latitude != null && c.longitude != null &&
           !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
  );

export default function Accueil({ navigation }) {
  const { paths, loading, toggleFavorite, refreshPaths } = usePaths();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  // ✅ Vue TikTok par défaut
  const [viewMode, setViewMode] = useState('tiktok');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const goToAjouter = useCallback(() => {
    const currentRoutes = navigation.getState()?.routeNames || [];
    if (currentRoutes.includes('Ajouter')) { navigation.navigate('Ajouter'); return; }
    navigation.navigate('Dashboard', { screen: 'Ajouter' });
  }, [navigation]);

  const loadUser = useCallback(async () => {
    try {
      const res = await getProfile();
      if (!res?.ok) return;
      const u = res.data || {};
      setUserName(u.full_name?.trim() || u.name?.trim() || (u.email ? u.email.split('@')[0] : '') || '');
    } catch { }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);
  useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshPaths(), loadUser()]);
    setRefreshing(false);
  };

  const handleOpenPath = (path) => navigation.navigate('VideoPlayer', { path });
  const handleToggleFavorite = async (id) => await toggleFavorite(id);

  const handleViewMap = (path) => {
    const validCoords = filterValidCoords(path.coordinates);
    if (validCoords.length < 1) {
      Alert.alert('Carte indisponible', "Ce chemin n'a pas encore de coordonnées GPS enregistrées.", [{ text: 'OK' }]);
      return;
    }
    navigation.navigate('Map', { path: { ...path, coordinates: validCoords } });
  };

  const handleShare = async (path) => {
    try {
      const token = path.share_token || String(path.id);
      const shareUrl = `${APP_SHARE_BASE_URL}/${token}`;
      const creatorLine = path.creator && path.creator !== 'Inconnu' ? `👤 Créé par ${path.creator}\n` : '';
      const shareMessage = `🗺️ Découvre ce chemin : "${path.title}"\n${creatorLine}\n👉 ${shareUrl}`;

      Alert.alert('Partager ce chemin', `Token : ${token}`, [
        {
          text: '📱 Partager via...',
          onPress: async () => {
            try {
              await Share.share({ message: shareMessage, title: path.title, ...(Platform.OS === 'ios' ? { url: shareUrl } : {}) });
            } catch { Alert.alert('Erreur', 'Impossible de partager.'); }
          },
        },
        {
          text: '💬 WhatsApp',
          onPress: async () => {
            const encoded = encodeURIComponent(shareMessage);
            try {
              const canOpen = await Linking.canOpenURL(`whatsapp://send?text=${encoded}`);
              await Linking.openURL(canOpen ? `whatsapp://send?text=${encoded}` : `https://wa.me/?text=${encoded}`);
            } catch { Alert.alert('Erreur', "Impossible d'ouvrir WhatsApp."); }
          },
        },
        { text: 'Annuler', style: 'cancel' },
      ]);
    } catch {
      Alert.alert('Erreur', "Impossible de partager ce contenu.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
        <Text style={styles.loadingText}>Chargement des chemins...</Text>
      </View>
    );
  }

  // ===== VUE TIKTOK (par défaut) =====
  if (viewMode === 'tiktok') {
    if (paths.length === 0) {
      return (
        <View style={styles.tiktokContainer}>
          <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
            <Ionicons name="grid-outline" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.emptyTiktokContainer}>
            <Ionicons name="videocam-off-outline" size={80} color="#999" />
            <Text style={styles.emptyTiktokText}>Aucune vidéo disponible</Text>
            <TouchableOpacity style={styles.createTiktokButton} onPress={goToAjouter}>
              <Text style={styles.createTiktokButtonText}>Créer un chemin</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.tiktokContainer}>
        <StatusBar barStyle="light-content" />
        {/* ✅ Bouton retour vue classique en haut à gauche */}
        <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
          <Ionicons name="grid-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={paths}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / height);
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => (
            <VideoItem
              path={item}
              isActive={index === currentIndex}
              onToggleFavorite={handleToggleFavorite}
              onViewSteps={handleOpenPath}
              onViewMap={handleViewMap}
              onShare={handleShare}
            />
          )}
        />
      </View>
    );
  }

  // ===== VUE CLASSIQUE (au clic) =====
  if (paths.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Bonjour 👋</Text>
              {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
            </View>
            <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
              <Ionicons name="play-circle" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="map-outline" size={80} color="#FEBD00" />
          </View>
          <Text style={styles.emptyTitle}>Aucun chemin pour le moment</Text>
          <Text style={styles.emptyText}>Explorez de nouveaux horizons en créant votre premier chemin</Text>
          <TouchableOpacity style={styles.createButton} onPress={goToAjouter} activeOpacity={0.8}>
            <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.createButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.createButtonText}>Créer un chemin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FEBD00" colors={['#FEBD00']} />}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Bonjour 👋</Text>
            {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
          </View>
          {/* ✅ Bouton retour TikTok */}
          <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
            <Ionicons name="play-circle" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Derniers chemins</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll} snapToInterval={CARD_WIDTH + 16} decelerationRate="fast">
          {paths.slice(0, 5).map((path, index) => (
            <TouchableOpacity key={path.id} style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 8 }]} onPress={() => handleOpenPath(path)} activeOpacity={0.9}>
              <Image source={{ uri: path.thumbnail }} style={styles.featuredImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredGradient}>
                <View style={styles.featuredTopBadges}>
                  {path.isOfficial && (
                    <View style={styles.officialBadgeFeatured}>
                      <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
                      <Text style={styles.officialBadgeText}>Officiel</Text>
                    </View>
                  )}
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={2}>{path.title}</Text>
                  <Text style={styles.featuredCreator} numberOfLines={1}>Par {path.creator}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="time-outline" size={13} color="#fff" />
                      <Text style={styles.featuredMetaText}>{path.duration}</Text>
                    </View>
                  </View>
                  {path.publishedAt && (
                    <View style={styles.featuredDateItem}>
                      <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.75)" />
                      <Text style={styles.featuredDateText}>{path.publishedAt}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
              <View style={styles.playButtonOverlay}>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={18} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tous les chemins</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#FEBD00" />
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {paths.map((path) => (
            <TouchableOpacity key={path.id} style={styles.pathCard} onPress={() => handleOpenPath(path)} activeOpacity={0.7}>
              <View style={styles.pathThumbnailContainer}>
                <Image source={{ uri: path.thumbnail }} style={styles.pathThumbnail} resizeMode="cover" />
                {path.isOfficial && (
                  <View style={styles.officialBadgeSmall}>
                    <Ionicons name="shield-checkmark" size={10} color="#fff" />
                  </View>
                )}
                <View style={styles.thumbnailPlayButton}>
                  <Ionicons name="play" size={16} color="#fff" />
                </View>
              </View>
              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle} numberOfLines={2}>{path.title}</Text>
                <Text style={styles.pathCreator} numberOfLines={1}>Par {path.creator}</Text>
                {path.establishment && (
                  <Text style={styles.pathEstablishment} numberOfLines={1}>🏫 {path.establishment}</Text>
                )}
                <View style={styles.pathMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#999" />
                    <Text style={styles.metaText}>{path.duration}</Text>
                  </View>
                </View>
                {path.publishedAt && (
                  <View style={styles.publishedAtRow}>
                    <Ionicons name="calendar-outline" size={11} color="#bbb" />
                    <Text style={styles.publishedAtText}>{path.publishedAt}</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorite(path.id)} activeOpacity={0.6}>
                  <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={24} color={path.isFavorite ? '#FF3B30' : '#ccc'} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

// ===== COMPOSANT VIDÉO TIKTOK =====
function VideoItem({ path, isActive, onToggleFavorite, onViewSteps, onViewMap, onShare }) {
  const videoSource = path.videoUri || null;
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimer = useRef(null);

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = false;
  });

  useEffect(() => {
    if (!player) return;
    try {
      if (isActive && videoSource) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    } catch (e) { console.warn('VideoPlayer error:', e); }
  }, [isActive, player, videoSource]);

  // ✅ Afficher les contrôles 3 secondes puis cacher
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, []);

  // ✅ Play / Pause
  const handlePlayPause = () => {
    if (!player) return;
    try {
      if (isPlaying) { player.pause(); setIsPlaying(false); }
      else { player.play(); setIsPlaying(true); }
    } catch (e) { console.warn(e); }
    showControlsTemporarily();
  };

  // ✅ Reculer N secondes
  const handleSeekBack = (seconds) => {
    if (!player) return;
    try {
      const current = player.currentTime ?? 0;
      player.currentTime = Math.max(0, current - seconds);
    } catch (e) { console.warn(e); }
    showControlsTemporarily();
  };

  // ✅ Avancer N secondes
  const handleSeekForward = (seconds) => {
    if (!player) return;
    try {
      const current = player.currentTime ?? 0;
      player.currentTime = current + seconds;
    } catch (e) { console.warn(e); }
    showControlsTemporarily();
  };

  // ✅ Mute / Unmute
  const handleMute = () => {
    if (!player) return;
    try {
      const next = !isMuted;
      player.muted = next;
      setIsMuted(next);
    } catch (e) { console.warn(e); }
    showControlsTemporarily();
  };

  // ✅ Convertit URL Cloudinary en MP4 H264 compatible
  const getDownloadUrl = (url) => {
    if (!url) return null;
    if (url.includes('cloudinary.com')) {
      return url
        .replace('/upload/', '/upload/f_mp4,vc_h264/')
        .replace(/\.(mov|MOV|webm|mkv)$/, '.mp4');
    }
    return url;
  };

  const handleDownload = async () => {
    const rawUrl = path.videoUri;
    if (!rawUrl) {
      Alert.alert('Indisponible', 'Aucune vidéo disponible pour ce chemin.');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          "Autorisez l'accès à la galerie dans Réglages > Confidentialité > Photos."
        );
        return;
      }

      setDownloading(true);

      const downloadUrl = getDownloadUrl(rawUrl);
      const fileName = `tektal_${path.id}_${Date.now()}.mp4`;
      const localUri = FileSystem.cacheDirectory + fileName;

      console.log('⬇️ Téléchargement:', downloadUrl);

      const { status: httpStatus, uri: downloadedUri } = await FileSystem.downloadAsync(
        downloadUrl,
        localUri
      );

      if (httpStatus !== 200) throw new Error(`Erreur serveur (${httpStatus})`);

      const info = await FileSystem.getInfoAsync(downloadedUri);
      if (!info.exists || info.size === 0) throw new Error('Fichier vide ou inexistant');

      console.log('✅ Fichier téléchargé:', info.size, 'bytes');

      const asset = await MediaLibrary.createAssetAsync(downloadedUri);
      await MediaLibrary.createAlbumAsync('Tektal', asset, false);
      await FileSystem.deleteAsync(downloadedUri, { idempotent: true });

      Alert.alert('✅ Téléchargé !', 'Vidéo enregistrée dans l\'album "Tektal".');
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error.message);
      Alert.alert('Erreur', `Impossible de télécharger : ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const showCreator = path.creator && path.creator !== 'Inconnu';

  return (
    <View style={styles.videoContainer}>
      {videoSource ? (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      ) : (
        <Image source={{ uri: path.thumbnail }} style={styles.video} resizeMode="cover" />
      )}

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.videoBottomGradient} />

      {/* ✅ Zone de tap centrale pour afficher/cacher les contrôles */}
      <TouchableOpacity
        style={styles.tapZone}
        activeOpacity={1}
        onPress={showControlsTemporarily}
      />

      {/* ✅ Contrôles vidéo — apparaissent au tap, disparaissent après 3s */}
      {showControls && (
        <View style={styles.videoControls}>
          {/* Reculer 30s */}
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleSeekBack(30)}>
            <Ionicons name="play-back" size={28} color="#fff" />
            <Text style={styles.controlBtnText}>30s</Text>
          </TouchableOpacity>

          {/* Reculer 10s */}
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleSeekBack(10)}>
            <Ionicons name="play-back" size={28} color="#fff" />
            <Text style={styles.controlBtnText}>10s</Text>
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity style={[styles.controlBtn, styles.controlBtnMain]} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
          </TouchableOpacity>

          {/* Avancer 10s */}
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleSeekForward(10)}>
            <Ionicons name="play-forward" size={28} color="#fff" />
            <Text style={styles.controlBtnText}>10s</Text>
          </TouchableOpacity>

          {/* Avancer 20s */}
          <TouchableOpacity style={styles.controlBtn} onPress={() => handleSeekForward(20)}>
            <Ionicons name="play-forward" size={28} color="#fff" />
            <Text style={styles.controlBtnText}>20s</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Infos bas gauche */}
      <View style={styles.videoInfoContainer}>
        <Text style={styles.videoTitle}>{path.title || 'Sans titre'}</Text>
        {showCreator && <Text style={styles.videoSubtitle}>Par {path.creator}</Text>}
        <View style={styles.videoMetaRow}>
          <Ionicons name="time-outline" size={13} color="#FFF" />
          <Text style={styles.videoMetaText}>{path.duration || '0 sec'}</Text>
        </View>
      </View>

      {/* Actions droite */}
      <View style={styles.videoActionsContainer}>

        {/* Favori */}
        <TouchableOpacity style={styles.videoActionButton} onPress={() => onToggleFavorite(path.id)} activeOpacity={0.7}>
          <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={32} color={path.isFavorite ? '#FF3B30' : '#FFF'} />
          <Text style={styles.videoActionText}>{path.isFavorite ? 'Aimé' : 'Aimer'}</Text>
        </TouchableOpacity>

        {/* ✅ Mute / Unmute */}
        <TouchableOpacity style={styles.videoActionButton} onPress={handleMute} activeOpacity={0.7}>
          <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={32} color={isMuted ? '#FF3B30' : '#FFF'} />
          <Text style={styles.videoActionText}>{isMuted ? 'Muet' : 'Son'}</Text>
        </TouchableOpacity>

        {/* Carte GPS */}
        <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewMap(path)} activeOpacity={0.7}>
          <Ionicons name="map-outline" size={32} color="#FFF" />
          <Text style={styles.videoActionText}>Carte</Text>
        </TouchableOpacity>

        {/* Voir détails */}
        <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewSteps(path)} activeOpacity={0.7}>
          <Ionicons name="list-outline" size={32} color="#FFF" />
          <Text style={styles.videoActionText}>Voir</Text>
        </TouchableOpacity>

        {/* Partager */}
        <TouchableOpacity style={styles.videoActionButton} onPress={() => onShare(path)} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={32} color="#FFF" />
          <Text style={styles.videoActionText}>Partager</Text>
        </TouchableOpacity>

        {/* ✅ Télécharger */}
        <TouchableOpacity
          style={styles.videoActionButton}
          onPress={handleDownload}
          activeOpacity={0.7}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#FEBD00" style={{ width: 32, height: 32 }} />
          ) : (
            <Ionicons name="download-outline" size={32} color="#FEBD00" />
          )}
          <Text style={[styles.videoActionText, { color: '#FEBD00' }]}>
            {downloading ? '...' : 'Sauver'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666', fontWeight: '500' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerGreeting: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  toggleIconRight: { backgroundColor: 'rgba(255,255,255,0.25)', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 40 },
  emptyIconContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
  createButton: { borderRadius: 28, overflow: 'hidden' },
  createButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14 },
  createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  featuredSection: { marginTop: 24, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  featuredScroll: { paddingRight: 20 },
  featuredCard: { width: CARD_WIDTH, height: 220, marginRight: 8, borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff' },
  featuredImage: { width: '100%', height: '100%' },
  featuredGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 16 },
  featuredTopBadges: { flexDirection: 'row', justifyContent: 'flex-end' },
  officialBadgeFeatured: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  officialBadgeText: { color: '#FEBD00', fontSize: 11, marginLeft: 4, fontWeight: '600' },
  featuredInfo: { marginBottom: 4 },
  featuredTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4, lineHeight: 22 },
  featuredCreator: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 8 },
  featuredMeta: { flexDirection: 'row', gap: 12 },
  featuredMetaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  featuredMetaText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '500' },
  featuredDateItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  featuredDateText: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
  playButtonOverlay: { position: 'absolute', bottom: 16, right: 16 },
  playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center' },
  recentSection: { marginTop: 16, paddingHorizontal: 20 },
  refreshButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center' },
  recentList: { gap: 12 },
  pathCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', padding: 12 },
  pathThumbnailContainer: { position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
  pathThumbnail: { width: '100%', height: '100%' },
  officialBadgeSmall: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,215,0,0.95)', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  thumbnailPlayButton: { position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(254,189,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  pathInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  pathTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4, lineHeight: 20 },
  pathCreator: { fontSize: 13, color: '#666', marginBottom: 2 },
  pathEstablishment: { fontSize: 12, color: '#FEBD00', marginBottom: 4, fontWeight: '500' },
  pathMeta: { flexDirection: 'row', gap: 12, marginBottom: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#999', marginLeft: 4, fontWeight: '500' },
  publishedAtRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
  publishedAtText: { fontSize: 11, color: '#bbb' },
  cardActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
  favoriteButton: { padding: 8 },
  bottomSpacing: { height: 32 },

  // ===== TIKTOK =====
  tiktokContainer: { flex: 1, backgroundColor: '#000' },
  toggleButtonTopLeft: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.45)', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', zIndex: 100, elevation: 8 },
  emptyTiktokContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 40 },
  emptyTiktokText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
  createTiktokButton: { backgroundColor: '#FEBD00', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, marginTop: 10 },
  createTiktokButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  videoContainer: { width, height, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  videoBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 },

  // ✅ Zone de tap invisible pour déclencher les contrôles
  tapZone: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 100,
    bottom: 200,
  },

  // ✅ Contrôles vidéo centrés
  videoControls: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    width: 56,
    height: 56,
    gap: 2,
  },
  controlBtnMain: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(254,189,0,0.85)',
    borderRadius: 35,
  },
  controlBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  videoInfoContainer: { position: 'absolute', bottom: 110, left: 16, right: 110 },
  videoTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  videoSubtitle: { fontSize: 13, color: '#FFF', marginBottom: 6, opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  videoMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  videoMetaText: { fontSize: 13, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  videoActionsContainer: { position: 'absolute', right: 12, bottom: 100, gap: 20, alignItems: 'center' },
  videoActionButton: { alignItems: 'center', gap: 4 },
  videoActionText: { fontSize: 10, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
});


// // src/screens/TableauDeBord/Accueil.jsx
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, RefreshControl, ActivityIndicator, Dimensions,
//   StatusBar, Alert, FlatList, Share, Linking, Platform,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import * as MediaLibrary from 'expo-media-library';
// import * as FileSystem from 'expo-file-system';
// import { usePaths } from '../../context/PathContext';
// import { getProfile } from '../../services/authService';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.65;
// const APP_SHARE_BASE_URL = 'https://tektal.app/path';

// const filterValidCoords = (coords = []) =>
//   coords.filter(
//     (c) => c && c.latitude != null && c.longitude != null &&
//            !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
//   );

// export default function Accueil({ navigation }) {
//   const { paths, loading, toggleFavorite, refreshPaths } = usePaths();
//   const [refreshing, setRefreshing] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [viewMode, setViewMode] = useState('classic');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef(null);

//   const goToAjouter = useCallback(() => {
//     const currentRoutes = navigation.getState()?.routeNames || [];
//     if (currentRoutes.includes('Ajouter')) { navigation.navigate('Ajouter'); return; }
//     navigation.navigate('Dashboard', { screen: 'Ajouter' });
//   }, [navigation]);

//   const loadUser = useCallback(async () => {
//     try {
//       const res = await getProfile();
//       if (!res?.ok) return;
//       const u = res.data || {};
//       setUserName(u.full_name?.trim() || u.name?.trim() || (u.email ? u.email.split('@')[0] : '') || '');
//     } catch { /* ignore */ }
//   }, []);

//   useEffect(() => { loadUser(); }, [loadUser]);
//   useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([refreshPaths(), loadUser()]);
//     setRefreshing(false);
//   };

//   const handleOpenPath = (path) => navigation.navigate('VideoPlayer', { path });
//   const handleToggleFavorite = async (id) => await toggleFavorite(id);

//   const handleViewMap = (path) => {
//     const validCoords = filterValidCoords(path.coordinates);
//     if (validCoords.length < 1) {
//       Alert.alert('Carte indisponible', "Ce chemin n'a pas encore de coordonnées GPS enregistrées.", [{ text: 'OK' }]);
//       return;
//     }
//     navigation.navigate('Map', { path: { ...path, coordinates: validCoords } });
//   };

//   const handleShare = async (path) => {
//     try {
//       const token = path.share_token || String(path.id);
//       const shareUrl = `${APP_SHARE_BASE_URL}/${token}`;
//       const creatorLine = path.creator && path.creator !== 'Inconnu' ? `👤 Créé par ${path.creator}\n` : '';
//       const shareMessage = `🗺️ Découvre ce chemin : "${path.title}"\n${creatorLine}\n👉 ${shareUrl}`;

//       Alert.alert('Partager ce chemin', `Token : ${token}`, [
//         {
//           text: '📱 Partager via...',
//           onPress: async () => {
//             try {
//               await Share.share({ message: shareMessage, title: path.title, ...(Platform.OS === 'ios' ? { url: shareUrl } : {}) });
//             } catch { Alert.alert('Erreur', 'Impossible de partager.'); }
//           },
//         },
//         {
//           text: '💬 WhatsApp',
//           onPress: async () => {
//             const encoded = encodeURIComponent(shareMessage);
//             try {
//               const canOpen = await Linking.canOpenURL(`whatsapp://send?text=${encoded}`);
//               await Linking.openURL(canOpen ? `whatsapp://send?text=${encoded}` : `https://wa.me/?text=${encoded}`);
//             } catch { Alert.alert('Erreur', "Impossible d'ouvrir WhatsApp."); }
//           },
//         },
//         { text: 'Annuler', style: 'cancel' },
//       ]);
//     } catch {
//       Alert.alert('Erreur', "Impossible de partager ce contenu.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FEBD00" />
//         <Text style={styles.loadingText}>Chargement des chemins...</Text>
//       </View>
//     );
//   }

//   // ===== VUE TIKTOK =====
//   if (viewMode === 'tiktok') {
//     if (paths.length === 0) {
//       return (
//         <View style={styles.tiktokContainer}>
//           <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//             <Ionicons name="grid-outline" size={28} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.emptyTiktokContainer}>
//             <Ionicons name="videocam-off-outline" size={80} color="#999" />
//             <Text style={styles.emptyTiktokText}>Aucune vidéo disponible</Text>
//             <TouchableOpacity style={styles.createTiktokButton} onPress={goToAjouter}>
//               <Text style={styles.createTiktokButtonText}>Créer un chemin</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }
//     return (
//       <View style={styles.tiktokContainer}>
//         <StatusBar barStyle="light-content" />
//         <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//           <Ionicons name="grid-outline" size={28} color="#FFF" />
//         </TouchableOpacity>
//         <FlatList
//           ref={flatListRef}
//           data={paths}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item) => String(item.id)}
//           getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
//           onMomentumScrollEnd={(event) => {
//             const index = Math.round(event.nativeEvent.contentOffset.y / height);
//             setCurrentIndex(index);
//           }}
//           renderItem={({ item, index }) => (
//             <VideoItem
//               path={item}
//               isActive={index === currentIndex}
//               onToggleFavorite={handleToggleFavorite}
//               onViewSteps={handleOpenPath}
//               onViewMap={handleViewMap}
//               onShare={handleShare}
//             />
//           )}
//         />
//       </View>
//     );
//   }

//   // ===== VUE CLASSIQUE =====
//   if (paths.length === 0) {
//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//           <View style={styles.headerContent}>
//             <View>
//               <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//               {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//             </View>
//             <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//               <Ionicons name="play-circle" size={32} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyIconContainer}>
//             <Ionicons name="map-outline" size={80} color="#FEBD00" />
//           </View>
//           <Text style={styles.emptyTitle}>Aucun chemin pour le moment</Text>
//           <Text style={styles.emptyText}>Explorez de nouveaux horizons en créant votre premier chemin d'apprentissage</Text>
//           <TouchableOpacity style={styles.createButton} onPress={goToAjouter} activeOpacity={0.8}>
//             <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.createButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//               <Ionicons name="add-circle-outline" size={22} color="#fff" />
//               <Text style={styles.createButtonText}>Créer un chemin</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FEBD00" colors={['#FEBD00']} />}
//     >
//       <StatusBar barStyle="light-content" />
//       <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//             {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//           </View>
//           <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//             <Ionicons name="play-circle" size={32} color="#FFF" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <View style={styles.featuredSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Derniers chemins</Text>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll} snapToInterval={CARD_WIDTH + 16} decelerationRate="fast">
//           {paths.slice(0, 5).map((path, index) => (
//             <TouchableOpacity key={path.id} style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 8 }]} onPress={() => handleOpenPath(path)} activeOpacity={0.9}>
//               <Image source={{ uri: path.thumbnail }} style={styles.featuredImage} resizeMode="cover" />
//               <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredGradient}>
//                 <View style={styles.featuredTopBadges}>
//                   {path.isOfficial && (
//                     <View style={styles.officialBadgeFeatured}>
//                       <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
//                       <Text style={styles.officialBadgeText}>Officiel</Text>
//                     </View>
//                   )}
//                 </View>
//                 <View style={styles.featuredInfo}>
//                   <Text style={styles.featuredTitle} numberOfLines={2}>{path.title}</Text>
//                   <Text style={styles.featuredCreator} numberOfLines={1}>Par {path.creator}</Text>
//                   <View style={styles.featuredMeta}>
//                     <View style={styles.featuredMetaItem}>
//                       <Ionicons name="time-outline" size={13} color="#fff" />
//                       <Text style={styles.featuredMetaText}>{path.duration}</Text>
//                     </View>
//                   </View>
//                   {path.publishedAt && (
//                     <View style={styles.featuredDateItem}>
//                       <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.75)" />
//                       <Text style={styles.featuredDateText}>{path.publishedAt}</Text>
//                     </View>
//                   )}
//                 </View>
//               </LinearGradient>
//               <View style={styles.playButtonOverlay}>
//                 <View style={styles.playButton}>
//                   <Ionicons name="play" size={18} color="#fff" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.recentSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Tous les chemins</Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Ionicons name="refresh" size={20} color="#FEBD00" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.recentList}>
//           {paths.map((path) => (
//             <TouchableOpacity key={path.id} style={styles.pathCard} onPress={() => handleOpenPath(path)} activeOpacity={0.7}>
//               <View style={styles.pathThumbnailContainer}>
//                 <Image source={{ uri: path.thumbnail }} style={styles.pathThumbnail} resizeMode="cover" />
//                 {path.isOfficial && (
//                   <View style={styles.officialBadgeSmall}>
//                     <Ionicons name="shield-checkmark" size={10} color="#fff" />
//                   </View>
//                 )}
//                 <View style={styles.thumbnailPlayButton}>
//                   <Ionicons name="play" size={16} color="#fff" />
//                 </View>
//               </View>
//               <View style={styles.pathInfo}>
//                 <Text style={styles.pathTitle} numberOfLines={2}>{path.title}</Text>
//                 <Text style={styles.pathCreator} numberOfLines={1}>Par {path.creator}</Text>
//                 {path.establishment && (
//                   <Text style={styles.pathEstablishment} numberOfLines={1}>🏫 {path.establishment}</Text>
//                 )}
//                 <View style={styles.pathMeta}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="time-outline" size={12} color="#999" />
//                     <Text style={styles.metaText}>{path.duration}</Text>
//                   </View>
//                 </View>
//                 {path.publishedAt && (
//                   <View style={styles.publishedAtRow}>
//                     <Ionicons name="calendar-outline" size={11} color="#bbb" />
//                     <Text style={styles.publishedAtText}>{path.publishedAt}</Text>
//                   </View>
//                 )}
//               </View>
//               <View style={styles.cardActions}>
//                 <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorite(path.id)} activeOpacity={0.6}>
//                   <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={24} color={path.isFavorite ? '#FF3B30' : '#ccc'} />
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={styles.bottomSpacing} />
//       </View>
//     </ScrollView>
//   );
// }

// // ===== COMPOSANT VIDÉO TIKTOK =====
// function VideoItem({ path, isActive, onToggleFavorite, onViewSteps, onViewMap, onShare }) {
//   const videoSource = path.videoUri || null;
//   const [downloading, setDownloading] = useState(false);

//   const player = useVideoPlayer(videoSource, (p) => { p.loop = true; });

//   useEffect(() => {
//     if (!player) return;
//     try {
//       if (isActive && videoSource) { player.play(); }
//       else { player.pause(); }
//     } catch (e) { console.warn('VideoPlayer error:', e); }
//   }, [isActive, player, videoSource]);

//   // ✅ Télécharger la vidéo dans la galerie photo
//   const handleDownload = async () => {
//     if (!path.videoUri) {
//       Alert.alert('Indisponible', 'Aucune vidéo disponible pour ce chemin.');
//       return;
//     }

//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour télécharger la vidéo.");
//         return;
//       }

//       setDownloading(true);

//       const fileName = `tektal_${path.id}_${Date.now()}.mp4`;
//       const localUri = FileSystem.cacheDirectory + fileName;

//       const downloadResult = await FileSystem.downloadAsync(path.videoUri, localUri);

//       if (downloadResult.status !== 200) {
//         throw new Error('Échec du téléchargement');
//       }

//       const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
//       await MediaLibrary.createAlbumAsync('Tektal', asset, false);

//       Alert.alert('✅ Téléchargé !', 'La vidéo a été enregistrée dans votre galerie dans l\'album "Tektal".');
//     } catch (error) {
//       console.error('Erreur téléchargement:', error);
//       Alert.alert('Erreur', 'Impossible de télécharger la vidéo. Vérifiez votre connexion.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const showCreator = path.creator && path.creator !== 'Inconnu';

//   return (
//     <View style={styles.videoContainer}>
//       {videoSource ? (
//         <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
//       ) : (
//         <Image source={{ uri: path.thumbnail }} style={styles.video} resizeMode="cover" />
//       )}

//       <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.videoBottomGradient} />

//       {/* Infos bas gauche */}
//       <View style={styles.videoInfoContainer}>
//         <Text style={styles.videoTitle}>{path.title || 'Sans titre'}</Text>
//         {showCreator && <Text style={styles.videoSubtitle}>Par {path.creator}</Text>}
//         <View style={styles.videoMetaRow}>
//           <Ionicons name="time-outline" size={13} color="#FFF" />
//           <Text style={styles.videoMetaText}>{path.duration || '0 sec'}</Text>
//         </View>
//       </View>

//       {/* Actions droite */}
//       <View style={styles.videoActionsContainer}>

//         {/* Favori */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onToggleFavorite(path.id)} activeOpacity={0.7}>
//           <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={36} color={path.isFavorite ? '#FF3B30' : '#FFF'} />
//           <Text style={styles.videoActionText}>{path.isFavorite ? 'Aimé' : 'Aimer'}</Text>
//         </TouchableOpacity>

//         {/* Carte GPS */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewMap(path)} activeOpacity={0.7}>
//           <Ionicons name="map-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Carte</Text>
//         </TouchableOpacity>

//         {/* Voir détails */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewSteps(path)} activeOpacity={0.7}>
//           <Ionicons name="list-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Voir</Text>
//         </TouchableOpacity>

//         {/* Partager */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onShare(path)} activeOpacity={0.7}>
//           <Ionicons name="share-social-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Partager</Text>
//         </TouchableOpacity>

//         {/* ✅ Télécharger — icône jaune pour se démarquer */}
//         <TouchableOpacity
//           style={styles.videoActionButton}
//           onPress={handleDownload}
//           activeOpacity={0.7}
//           disabled={downloading}
//         >
//           {downloading ? (
//             <ActivityIndicator size="small" color="#FEBD00" style={{ width: 36, height: 36 }} />
//           ) : (
//             <Ionicons name="download-outline" size={36} color="#FEBD00" />
//           )}
//           <Text style={[styles.videoActionText, { color: '#FEBD00' }]}>
//             {downloading ? '...' : 'Sauver'}
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
//   loadingText: { marginTop: 16, fontSize: 16, color: '#666', fontWeight: '500' },
//   header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
//   headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerGreeting: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
//   headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
//   toggleIconRight: { backgroundColor: 'rgba(255,255,255,0.25)', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 40 },
//   emptyIconContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//   emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
//   emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
//   createButton: { borderRadius: 28, overflow: 'hidden', elevation: 4, shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
//   createButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14 },
//   createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
//   featuredSection: { marginTop: 24, marginBottom: 8 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', letterSpacing: 0.3 },
//   featuredScroll: { paddingRight: 20 },
//   featuredCard: { width: CARD_WIDTH, height: 220, marginRight: 8, borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, backgroundColor: '#fff' },
//   featuredImage: { width: '100%', height: '100%' },
//   featuredGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 16 },
//   featuredTopBadges: { flexDirection: 'row', justifyContent: 'flex-end' },
//   officialBadgeFeatured: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
//   officialBadgeText: { color: '#FEBD00', fontSize: 11, marginLeft: 4, fontWeight: '600' },
//   featuredInfo: { marginBottom: 4 },
//   featuredTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4, lineHeight: 22 },
//   featuredCreator: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 8 },
//   featuredMeta: { flexDirection: 'row', gap: 12 },
//   featuredMetaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   featuredMetaText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '500' },
//   featuredDateItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
//   featuredDateText: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
//   playButtonOverlay: { position: 'absolute', bottom: 16, right: 16 },
//   playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', elevation: 8 },
//   recentSection: { marginTop: 16, paddingHorizontal: 20 },
//   refreshButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center' },
//   recentList: { gap: 12 },
//   pathCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, padding: 12 },
//   pathThumbnailContainer: { position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
//   pathThumbnail: { width: '100%', height: '100%' },
//   officialBadgeSmall: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,215,0,0.95)', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
//   thumbnailPlayButton: { position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(254,189,0,0.95)', justifyContent: 'center', alignItems: 'center' },
//   pathInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
//   pathTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4, lineHeight: 20 },
//   pathCreator: { fontSize: 13, color: '#666', marginBottom: 2 },
//   pathEstablishment: { fontSize: 12, color: '#FEBD00', marginBottom: 4, fontWeight: '500' },
//   pathMeta: { flexDirection: 'row', gap: 12, marginBottom: 2 },
//   metaItem: { flexDirection: 'row', alignItems: 'center' },
//   metaText: { fontSize: 12, color: '#999', marginLeft: 4, fontWeight: '500' },
//   publishedAtRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
//   publishedAtText: { fontSize: 11, color: '#bbb' },
//   cardActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
//   favoriteButton: { padding: 8 },
//   bottomSpacing: { height: 32 },

//   // ===== TIKTOK =====
//   tiktokContainer: { flex: 1, backgroundColor: '#000' },
//   toggleButtonTopLeft: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.45)', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', zIndex: 100, elevation: 8 },
//   emptyTiktokContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 40 },
//   emptyTiktokText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
//   createTiktokButton: { backgroundColor: '#FEBD00', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, marginTop: 10 },
//   createTiktokButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   videoContainer: { width, height, backgroundColor: '#000' },
//   video: { width: '100%', height: '100%' },
//   videoBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
//   videoInfoContainer: { position: 'absolute', bottom: 110, left: 16, right: 110 },
//   videoTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoSubtitle: { fontSize: 13, color: '#FFF', marginBottom: 6, opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   videoMetaText: { fontSize: 13, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoActionsContainer: { position: 'absolute', right: 16, bottom: 110, gap: 26, alignItems: 'center' },
//   videoActionButton: { alignItems: 'center', gap: 5 },
//   videoActionText: { fontSize: 11, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
// });


// // src/screens/TableauDeBord/Accueil.jsx
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, RefreshControl, ActivityIndicator, Dimensions,
//   StatusBar, Alert, FlatList, Share, Linking, Platform,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import { usePaths } from '../../context/PathContext';
// import { getProfile } from '../../services/authService';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.65;
// const APP_SHARE_BASE_URL = 'https://tektal.app/path';

// // ✅ Filtre coords GPS invalides
// const filterValidCoords = (coords = []) =>
//   coords.filter(
//     (c) => c && c.latitude != null && c.longitude != null &&
//            !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
//   );

// export default function Accueil({ navigation }) {
//   const { paths, loading, toggleFavorite, refreshPaths, deletePath } = usePaths();
//   const [refreshing, setRefreshing] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [viewMode, setViewMode] = useState('classic');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef(null);

//   const goToAjouter = useCallback(() => {
//     const currentRoutes = navigation.getState()?.routeNames || [];
//     if (currentRoutes.includes('Ajouter')) { navigation.navigate('Ajouter'); return; }
//     navigation.navigate('Dashboard', { screen: 'Ajouter' });
//   }, [navigation]);

//   // ✅ Nom du user connecté (full_name > name > email)
//   const loadUser = useCallback(async () => {
//     try {
//       const res = await getProfile();
//       if (!res?.ok) return;
//       const u = res.data || {};
//       setUserName(u.full_name?.trim() || u.name?.trim() || (u.email ? u.email.split('@')[0] : '') || '');
//     } catch { /* ignore */ }
//   }, []);

//   useEffect(() => { loadUser(); }, [loadUser]);
//   useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([refreshPaths(), loadUser()]);
//     setRefreshing(false);
//   };

//   const handleOpenPath = (path) => navigation.navigate('VideoPlayer', { path });
//   const handleToggleFavorite = async (id) => await toggleFavorite(id);

//   // ✅ Navigation vers MapScreen — route enregistrée dans DashboardNavigator
//   const handleViewMap = (path) => {
//     const validCoords = filterValidCoords(path.coordinates);
//     if (validCoords.length < 1) {
//       Alert.alert(
//         'Carte indisponible',
//         'Ce chemin n\'a pas encore de coordonnées GPS enregistrées.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }
//     navigation.navigate('Map', { path: { ...path, coordinates: validCoords } });
//   };

//   // ✅ Partage avec share_token + WhatsApp
//   const handleShare = async (path) => {
//     try {
//       const token = path.share_token || String(path.id);
//       const shareUrl = `${APP_SHARE_BASE_URL}/${token}`;
//       const creatorLine = path.creator && path.creator !== 'Inconnu'
//         ? `👤 Créé par ${path.creator}\n` : '';
//       const shareMessage = `🗺️ Découvre ce chemin : "${path.title}"\n${creatorLine}\n👉 ${shareUrl}`;

//       Alert.alert('Partager ce chemin', `Token : ${token}`, [
//         {
//           text: '📱 Partager via...',
//           onPress: async () => {
//             try {
//               await Share.share({
//                 message: shareMessage,
//                 title: path.title,
//                 ...(Platform.OS === 'ios' ? { url: shareUrl } : {}),
//               });
//             } catch { Alert.alert('Erreur', 'Impossible de partager.'); }
//           },
//         },
//         {
//           text: '💬 WhatsApp',
//           onPress: async () => {
//             const encoded = encodeURIComponent(shareMessage);
//             try {
//               const canOpen = await Linking.canOpenURL(`whatsapp://send?text=${encoded}`);
//               await Linking.openURL(canOpen
//                 ? `whatsapp://send?text=${encoded}`
//                 : `https://wa.me/?text=${encoded}`
//               );
//             } catch { Alert.alert('Erreur', "Impossible d'ouvrir WhatsApp."); }
//           },
//         },
//         { text: 'Annuler', style: 'cancel' },
//       ]);
//     } catch {
//       Alert.alert('Erreur', "Impossible de partager ce contenu.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FEBD00" />
//         <Text style={styles.loadingText}>Chargement des chemins...</Text>
//       </View>
//     );
//   }

//   // ===== VUE TIKTOK =====
//   if (viewMode === 'tiktok') {
//     if (paths.length === 0) {
//       return (
//         <View style={styles.tiktokContainer}>
//           <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//             <Ionicons name="grid-outline" size={28} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.emptyTiktokContainer}>
//             <Ionicons name="videocam-off-outline" size={80} color="#999" />
//             <Text style={styles.emptyTiktokText}>Aucune vidéo disponible</Text>
//             <TouchableOpacity style={styles.createTiktokButton} onPress={goToAjouter}>
//               <Text style={styles.createTiktokButtonText}>Créer un chemin</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }
//     return (
//       <View style={styles.tiktokContainer}>
//         <StatusBar barStyle="light-content" />
//         <TouchableOpacity style={styles.toggleButtonTopLeft} onPress={() => setViewMode('classic')}>
//           <Ionicons name="grid-outline" size={28} color="#FFF" />
//         </TouchableOpacity>
//         <FlatList
//           ref={flatListRef}
//           data={paths}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item) => String(item.id)}
//           getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
//           onMomentumScrollEnd={(event) => {
//             const index = Math.round(event.nativeEvent.contentOffset.y / height);
//             setCurrentIndex(index);
//           }}
//           renderItem={({ item, index }) => (
//             <VideoItem
//               path={item}
//               isActive={index === currentIndex}
//               onToggleFavorite={handleToggleFavorite}
//               onViewSteps={handleOpenPath}
//               onViewMap={handleViewMap}
//               onShare={handleShare}
//             />
//           )}
//         />
//       </View>
//     );
//   }

//   // ===== VUE CLASSIQUE =====
//   if (paths.length === 0) {
//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//           <View style={styles.headerContent}>
//             <View>
//               <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//               {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//             </View>
//             <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//               <Ionicons name="play-circle" size={32} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyIconContainer}>
//             <Ionicons name="map-outline" size={80} color="#FEBD00" />
//           </View>
//           <Text style={styles.emptyTitle}>Aucun chemin pour le moment</Text>
//           <Text style={styles.emptyText}>Explorez de nouveaux horizons en créant votre premier chemin d'apprentissage</Text>
//           <TouchableOpacity style={styles.createButton} onPress={goToAjouter} activeOpacity={0.8}>
//             <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.createButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//               <Ionicons name="add-circle-outline" size={22} color="#fff" />
//               <Text style={styles.createButtonText}>Créer un chemin</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FEBD00" colors={['#FEBD00']} />}
//     >
//       <StatusBar barStyle="light-content" />
//       <LinearGradient colors={['#FFC837', '#FEBD00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//             {userName ? <Text style={styles.headerTitle}>{userName}</Text> : null}
//           </View>
//           <TouchableOpacity style={styles.toggleIconRight} onPress={() => setViewMode('tiktok')}>
//             <Ionicons name="play-circle" size={32} color="#FFF" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {/* Derniers chemins */}
//       <View style={styles.featuredSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Derniers chemins</Text>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll} snapToInterval={CARD_WIDTH + 16} decelerationRate="fast">
//           {paths.slice(0, 5).map((path, index) => (
//             <TouchableOpacity key={path.id} style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 8 }]} onPress={() => handleOpenPath(path)} activeOpacity={0.9}>
//               <Image source={{ uri: path.thumbnail }} style={styles.featuredImage} resizeMode="cover" />
//               <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredGradient}>
//                 <View style={styles.featuredTopBadges}>
//                   {path.isOfficial && (
//                     <View style={styles.officialBadgeFeatured}>
//                       <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
//                       <Text style={styles.officialBadgeText}>Officiel</Text>
//                     </View>
//                   )}
//                 </View>
//                 <View style={styles.featuredInfo}>
//                   <Text style={styles.featuredTitle} numberOfLines={2}>{path.title}</Text>
//                   <Text style={styles.featuredCreator} numberOfLines={1}>Par {path.creator}</Text>
//                   <View style={styles.featuredMeta}>
//                     <View style={styles.featuredMetaItem}>
//                       <Ionicons name="time-outline" size={13} color="#fff" />
//                       <Text style={styles.featuredMetaText}>{path.duration}</Text>
//                     </View>
//                   </View>
//                   {path.publishedAt && (
//                     <View style={styles.featuredDateItem}>
//                       <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.75)" />
//                       <Text style={styles.featuredDateText}>{path.publishedAt}</Text>
//                     </View>
//                   )}
//                 </View>
//               </LinearGradient>
//               <View style={styles.playButtonOverlay}>
//                 <View style={styles.playButton}>
//                   <Ionicons name="play" size={18} color="#fff" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Tous les chemins */}
//       <View style={styles.recentSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Tous les chemins</Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Ionicons name="refresh" size={20} color="#FEBD00" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.recentList}>
//           {paths.map((path) => (
//             <TouchableOpacity key={path.id} style={styles.pathCard} onPress={() => handleOpenPath(path)} activeOpacity={0.7}>
//               <View style={styles.pathThumbnailContainer}>
//                 <Image source={{ uri: path.thumbnail }} style={styles.pathThumbnail} resizeMode="cover" />
//                 {path.isOfficial && (
//                   <View style={styles.officialBadgeSmall}>
//                     <Ionicons name="shield-checkmark" size={10} color="#fff" />
//                   </View>
//                 )}
//                 <View style={styles.thumbnailPlayButton}>
//                   <Ionicons name="play" size={16} color="#fff" />
//                 </View>
//               </View>
//               <View style={styles.pathInfo}>
//                 <Text style={styles.pathTitle} numberOfLines={2}>{path.title}</Text>
//                 <Text style={styles.pathCreator} numberOfLines={1}>Par {path.creator}</Text>
//                 {path.establishment && (
//                   <Text style={styles.pathEstablishment} numberOfLines={1}>🏫 {path.establishment}</Text>
//                 )}
//                 <View style={styles.pathMeta}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="time-outline" size={12} color="#999" />
//                     <Text style={styles.metaText}>{path.duration}</Text>
//                   </View>
//                 </View>
//                 {path.publishedAt && (
//                   <View style={styles.publishedAtRow}>
//                     <Ionicons name="calendar-outline" size={11} color="#bbb" />
//                     <Text style={styles.publishedAtText}>{path.publishedAt}</Text>
//                   </View>
//                 )}
//               </View>
//               <View style={styles.cardActions}>
//                 <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorite(path.id)} activeOpacity={0.6}>
//                   <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={24} color={path.isFavorite ? '#FF3B30' : '#ccc'} />
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={styles.bottomSpacing} />
//       </View>
//     </ScrollView>
//   );
// }

// // ===== COMPOSANT VIDÉO TIKTOK =====
// function VideoItem({ path, isActive, onToggleFavorite, onViewSteps, onViewMap, onShare }) {
//   const videoSource = path.videoUri || null;

//   const player = useVideoPlayer(videoSource, (p) => { p.loop = true; });

//   useEffect(() => {
//     if (!player) return;
//     try {
//       if (isActive && videoSource) { player.play(); }
//       else { player.pause(); }
//     } catch (e) { console.warn('VideoPlayer error:', e); }
//   }, [isActive, player, videoSource]);

//   // ✅ Vrai créateur depuis PathContext (résolу via resolveCreatorName)
//   const showCreator = path.creator && path.creator !== 'Inconnu';

//   return (
//     <View style={styles.videoContainer}>
//       {videoSource ? (
//         <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
//       ) : (
//         <Image source={{ uri: path.thumbnail }} style={styles.video} resizeMode="cover" />
//       )}

//       {/* ✅ Gradient léger bas uniquement — pas de fond noir sur la vidéo */}
//       <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.videoBottomGradient} />

//       {/* Infos bas gauche : titre · créateur · durée */}
//       <View style={styles.videoInfoContainer}>
//         <Text style={styles.videoTitle}>{path.title || 'Sans titre'}</Text>
//         {showCreator && <Text style={styles.videoSubtitle}>Par {path.creator}</Text>}
//         <View style={styles.videoMetaRow}>
//           <Ionicons name="time-outline" size={13} color="#FFF" />
//           <Text style={styles.videoMetaText}>{path.duration || '0 sec'}</Text>
//         </View>
//       </View>

//       {/* Actions droite */}
//       <View style={styles.videoActionsContainer}>
//         {/* Favori */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onToggleFavorite(path.id)} activeOpacity={0.7}>
//           <Ionicons name={path.isFavorite ? 'heart' : 'heart-outline'} size={36} color={path.isFavorite ? '#FF3B30' : '#FFF'} />
//           <Text style={styles.videoActionText}>{path.isFavorite ? 'Aimé' : 'Aimer'}</Text>
//         </TouchableOpacity>

//         {/* ✅ Carte GPS — navigue vers MapScreen */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewMap(path)} activeOpacity={0.7}>
//           <Ionicons name="map-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Carte</Text>
//         </TouchableOpacity>

//         {/* Voir détails */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onViewSteps(path)} activeOpacity={0.7}>
//           <Ionicons name="list-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Voir</Text>
//         </TouchableOpacity>

//         {/* Partager */}
//         <TouchableOpacity style={styles.videoActionButton} onPress={() => onShare(path)} activeOpacity={0.7}>
//           <Ionicons name="share-social-outline" size={36} color="#FFF" />
//           <Text style={styles.videoActionText}>Partager</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
//   loadingText: { marginTop: 16, fontSize: 16, color: '#666', fontWeight: '500' },
//   header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
//   headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerGreeting: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
//   headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
//   toggleIconRight: {
//     backgroundColor: 'rgba(255,255,255,0.25)', width: 52, height: 52, borderRadius: 26,
//     alignItems: 'center', justifyContent: 'center',
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
//   },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 40 },
//   emptyIconContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//   emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
//   emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
//   createButton: { borderRadius: 28, overflow: 'hidden', elevation: 4, shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
//   createButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14 },
//   createButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
//   featuredSection: { marginTop: 24, marginBottom: 8 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', letterSpacing: 0.3 },
//   featuredScroll: { paddingRight: 20 },
//   featuredCard: { width: CARD_WIDTH, height: 220, marginRight: 8, borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, backgroundColor: '#fff' },
//   featuredImage: { width: '100%', height: '100%' },
//   featuredGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 16 },
//   featuredTopBadges: { flexDirection: 'row', justifyContent: 'flex-end' },
//   officialBadgeFeatured: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
//   officialBadgeText: { color: '#FEBD00', fontSize: 11, marginLeft: 4, fontWeight: '600' },
//   featuredInfo: { marginBottom: 4 },
//   featuredTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4, lineHeight: 22 },
//   featuredCreator: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 8 },
//   featuredMeta: { flexDirection: 'row', gap: 12 },
//   featuredMetaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   featuredMetaText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '500' },
//   featuredDateItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
//   featuredDateText: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
//   playButtonOverlay: { position: 'absolute', bottom: 16, right: 16 },
//   playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', elevation: 8 },
//   recentSection: { marginTop: 16, paddingHorizontal: 20 },
//   refreshButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center' },
//   recentList: { gap: 12 },
//   pathCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, padding: 12 },
//   pathThumbnailContainer: { position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
//   pathThumbnail: { width: '100%', height: '100%' },
//   officialBadgeSmall: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(255,215,0,0.95)', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
//   thumbnailPlayButton: { position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(254,189,0,0.95)', justifyContent: 'center', alignItems: 'center' },
//   pathInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
//   pathTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4, lineHeight: 20 },
//   pathCreator: { fontSize: 13, color: '#666', marginBottom: 2 },
//   pathEstablishment: { fontSize: 12, color: '#FEBD00', marginBottom: 4, fontWeight: '500' },
//   pathMeta: { flexDirection: 'row', gap: 12, marginBottom: 2 },
//   metaItem: { flexDirection: 'row', alignItems: 'center' },
//   metaText: { fontSize: 12, color: '#999', marginLeft: 4, fontWeight: '500' },
//   publishedAtRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
//   publishedAtText: { fontSize: 11, color: '#bbb' },
//   cardActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
//   favoriteButton: { padding: 8 },
//   bottomSpacing: { height: 32 },

//   // ===== TIKTOK =====
//   tiktokContainer: { flex: 1, backgroundColor: '#000' },
//   toggleButtonTopLeft: {
//     position: 'absolute', top: 60, left: 20,
//     backgroundColor: 'rgba(0,0,0,0.45)', width: 50, height: 50, borderRadius: 25,
//     alignItems: 'center', justifyContent: 'center', zIndex: 100, elevation: 8,
//   },
//   emptyTiktokContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 40 },
//   emptyTiktokText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
//   createTiktokButton: { backgroundColor: '#FEBD00', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, marginTop: 10 },
//   createTiktokButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   videoContainer: { width, height, backgroundColor: '#000' },
//   video: { width: '100%', height: '100%' },
//   // ✅ Gradient bas uniquement — vidéo entièrement visible
//   videoBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
//   videoInfoContainer: { position: 'absolute', bottom: 110, left: 16, right: 110 },
//   videoTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoSubtitle: { fontSize: 13, color: '#FFF', marginBottom: 6, opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   videoMetaText: { fontSize: 13, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
//   videoActionsContainer: { position: 'absolute', right: 16, bottom: 110, gap: 26, alignItems: 'center' },
//   videoActionButton: { alignItems: 'center', gap: 5 },
//   videoActionText: { fontSize: 11, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
// });
