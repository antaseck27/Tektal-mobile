// screens/TableauDeBord/Accueil.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePaths } from '../../context/PathContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

export default function Accueil({ navigation }) {
  const { paths, loading, toggleFavorite, refreshPaths, deletePath } = usePaths();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPaths();
    setRefreshing(false);
  };

  const handleOpenPath = (path) => {
    navigation.navigate('VideoPlayer', { path });
  };

  const handleToggleFavorite = async (id) => {
    await toggleFavorite(id);
  };

  const handleDeletePath = (path) => {
    Alert.alert(
      'Supprimer le chemin',
      `Êtes-vous sûr de vouloir supprimer "${path.title}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deletePath(path.id);
            await refreshPaths();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
        <Text style={styles.loadingText}>Chargement des chemins...</Text>
      </View>
    );
  }

  if (paths.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header sans bords arrondis */}
        <LinearGradient 
          colors={['#FFC837', '#FEBD00']} 
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Bonjour 👋</Text>
              <Text style={styles.headerTitle}>Mamadou</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationIconContainer}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>0</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* État vide */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="map-outline" size={80} color="#FEBD00" />
          </View>
          <Text style={styles.emptyTitle}>Aucun chemin pour le moment</Text>
          <Text style={styles.emptyText}>
            Explorez de nouveaux horizons en créant votre premier chemin d'apprentissage
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Ajouter')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFC837', '#FEBD00']}
              style={styles.createButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
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
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#FEBD00"
          colors={['#FEBD00']}
        />
      }
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header sans bords arrondis */}
      <LinearGradient 
        colors={['#FFC837', '#FEBD00']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Bonjour 👋</Text>
            <Text style={styles.headerTitle}>Mamadou</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {paths.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{paths.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Featured Section - Sans "Tout voir" */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Derniers chemins</Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {paths.slice(0, 5).map((path, index) => (
            <TouchableOpacity
              key={path.id}
              style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 8 }]}
              onPress={() => handleOpenPath(path)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: path.thumbnail }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredTopBadges}>
                  {path.isOfficial && (
                    <View style={styles.officialBadgeFeatured}>
                      <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
                      <Text style={styles.officialBadgeText}>Officiel</Text>
                    </View>
                  )}
                </View>

                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={2}>
                    {path.title}
                  </Text>
                  <Text style={styles.featuredCreator} numberOfLines={1}>
                    Par {path.creator}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="time-outline" size={13} color="#fff" />
                      <Text style={styles.featuredMetaText}>{path.duration}</Text>
                    </View>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="play-circle-outline" size={13} color="#fff" />
                      <Text style={styles.featuredMetaText}>Vidéo</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              {/* Play button en bas à droite - jaune */}
              <View style={styles.playButtonOverlay}>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={18} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* All Paths Section */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tous les chemins</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#FEBD00" />
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {paths.map((path) => (
            <TouchableOpacity
              key={path.id}
              style={styles.pathCard}
              onPress={() => handleOpenPath(path)}
              activeOpacity={0.7}
            >
              <View style={styles.pathThumbnailContainer}>
                <Image
                  source={{ uri: path.thumbnail }}
                  style={styles.pathThumbnail}
                  resizeMode="cover"
                />
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
                <Text style={styles.pathTitle} numberOfLines={2}>
                  {path.title}
                </Text>
                <Text style={styles.pathCreator} numberOfLines={1}>
                  Par {path.creator}
                </Text>
                <View style={styles.pathMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#999" />
                    <Text style={styles.metaText}>{path.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="play-circle-outline" size={12} color="#999" />
                    <Text style={styles.metaText}>Vidéo</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(path.id)}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={path.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={path.isFavorite ? '#FF3B30' : '#ccc'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePath(path)}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#FF3B30"
                  />
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#666',
    fontWeight: '500'
  },

  // Header SANS bords arrondis
  header: { 
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  headerGreeting: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff',
    letterSpacing: 0.5
  },
  notificationButton: { 
    padding: 8 
  },
  notificationIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFC837'
  },
  notificationBadgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },

  // Empty state
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 32,
    marginTop: 40
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center'
  },
  emptyText: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20
  },
  createButton: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#FEBD00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14
  },
  createButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginLeft: 8,
    fontSize: 16
  },

  // Featured section
  featuredSection: { 
    marginTop: 24,
    marginBottom: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 0.3
  },
  featuredScroll: { 
    paddingRight: 20
  },
  featuredCard: { 
    width: CARD_WIDTH, 
    height: 200, 
    marginRight: 8,
    borderRadius: 20, 
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: '#fff'
  },
  featuredImage: { 
    width: '100%', 
    height: '100%' 
  },
  featuredGradient: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'space-between',
    padding: 16
  },
  featuredTopBadges: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  // Badge BLANC avec texte JAUNE
  officialBadgeFeatured: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 16,
  },
  officialBadgeText: { 
    color: '#FEBD00',
    fontSize: 11, 
    marginLeft: 4,
    fontWeight: '600'
  },
  featuredInfo: {
    marginBottom: 4
  },
  featuredTitle: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22
  },
  featuredCreator: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginBottom: 8
  },
  featuredMeta: { 
    flexDirection: 'row',
    gap: 12
  },
  featuredMetaItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  featuredMetaText: { 
    color: '#fff', 
    fontSize: 12, 
    marginLeft: 4,
    fontWeight: '500'
  },
  // Play button en bas à droite - JAUNE
  playButtonOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEBD00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },

  // Recent section
  recentSection: { 
    marginTop: 16,
    paddingHorizontal: 20
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  recentList: {
    gap: 12
  },
  pathCard: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    padding: 12
  },
  pathThumbnailContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden'
  },
  pathThumbnail: { 
    width: '100%', 
    height: '100%'
  },
  officialBadgeSmall: { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    backgroundColor: 'rgba(255, 215, 0, 0.95)', 
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailPlayButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(254, 189, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pathInfo: { 
    flex: 1, 
    marginLeft: 16,
    justifyContent: 'center'
  },
  pathTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20
  },
  pathCreator: { 
    fontSize: 13, 
    color: '#666',
    marginBottom: 6
  },
  pathMeta: { 
    flexDirection: 'row',
    gap: 12
  },
  metaItem: { 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  metaText: { 
    fontSize: 12, 
    color: '#999', 
    marginLeft: 4,
    fontWeight: '500'
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4
  },
  favoriteButton: { 
    padding: 8
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4
  },
  bottomSpacing: {
    height: 32
  }
});