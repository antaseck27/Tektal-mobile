// screens/Favoris.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePaths } from '../../context/PathContext';

export default function Favoris({ navigation }) {
  const { paths, loading, toggleFavorite } = usePaths();

  // Filtrer uniquement les chemins favoris
  const favoritePaths = paths.filter(path => path.isFavorite);

  const handleRemoveFavorite = async (id) => {
    await toggleFavorite(id);
  };

  const handleOpenPath = (path) => {
    navigation.navigate('VideoPlayer', { path });
  };

  const renderPathCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handleOpenPath(item)}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {item.isOfficial && (
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
          </View>
        )}
        <View style={styles.playButtonOverlay}>
          <Ionicons name="play" size={16} color="#fff" />
        </View>
      </View>

      {/* Informations */}
      <View style={styles.pathInfo}>
        <Text style={styles.pathTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.pathCreator} numberOfLines={1}>
          Par {item.creator}
        </Text>

        <View style={styles.pathMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#999" />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="play-circle-outline" size={12} color="#999" />
            <Text style={styles.metaText}>Vidéo</Text>
          </View>
        </View>
      </View>

      {/* Bouton retirer favori */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
        activeOpacity={0.6}
      >
        <Ionicons name="heart" size={26} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color="#FEBD00" />
      </View>
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptyText}>
        Les chemins que vous sauvegarderez apparaîtront ici
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Accueil')}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>Explorer les chemins</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <View style={styles.headerRight}>
          <Text style={styles.favoriteCount}>{favoritePaths.length}</Text>
        </View>
      </View>

      {/* Liste des favoris */}
      <FlatList
        data={favoritePaths}
        renderItem={renderPathCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          favoritePaths.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEBD00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FEBD00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 20,
  },
  emptyList: {
    flex: 1,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  officialBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(254, 189, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  pathTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  pathCreator: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  pathMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontWeight: '500',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#FEBD00',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#FEBD00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});