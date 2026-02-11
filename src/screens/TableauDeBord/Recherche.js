// screens/Recherche.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePaths } from '../../context/PathContext';

export default function Recherche({ navigation }) {
  const { paths, loading, toggleFavorite } = usePaths();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'official', 'favorites'

  // Filtrer les chemins selon la recherche et le filtre actif
  const filteredPaths = paths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.creator.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'official') {
      return matchesSearch && path.isOfficial;
    } else if (activeFilter === 'favorites') {
      return matchesSearch && path.isFavorite;
    }
    return matchesSearch;
  });

  const handleOpenPath = (path) => {
    navigation.navigate('VideoPlayer', { path });
  };

  const handleToggleFavorite = async (id) => {
    await toggleFavorite(id);
  };

  const renderPathCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handleOpenPath(item)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {item.isOfficial && (
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={10} color="#fff" />
          </View>
        )}
        <View style={styles.playButtonOverlay}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
      </View>

      <View style={styles.pathCardContent}>
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

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item.id)}
        activeOpacity={0.6}
      >
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isFavorite ? '#FF3B30' : '#ccc'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="search-outline" size={80} color="#FEBD00" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery.length > 0 ? 'Aucun résultat' : 'Rechercher un chemin'}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery.length > 0
          ? 'Essayez avec d\'autres mots-clés'
          : 'Tapez pour rechercher un chemin, lieu ou créateur'}
      </Text>
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
        <Text style={styles.headerTitle}>Rechercher</Text>
        <Text style={styles.headerSubtitle}>
          {paths.length} chemin{paths.length > 1 ? 's' : ''} disponible{paths.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher un chemin, lieu, créateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.6}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Tous ({paths.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'official' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('official')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="shield-checkmark"
            size={16}
            color={activeFilter === 'official' ? '#fff' : '#666'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'official' && styles.filterChipTextActive,
            ]}
          >
            Officiels ({paths.filter(p => p.isOfficial).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'favorites' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('favorites')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="heart"
            size={16}
            color={activeFilter === 'favorites' ? '#fff' : '#666'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'favorites' && styles.filterChipTextActive,
            ]}
          >
            Favoris ({paths.filter(p => p.isFavorite).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Résultats */}
      <FlatList
        data={filteredPaths}
        renderItem={renderPathCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredPaths.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Compteur de résultats */}
      {searchQuery.length > 0 && filteredPaths.length > 0 && (
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>
            {filteredPaths.length} résultat{filteredPaths.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#FEBD00',
    borderColor: '#FEBD00',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
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
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  officialBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(254, 189, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathCardContent: {
    flex: 1,
    marginLeft: 12,
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
  favoriteButton: {
    justifyContent: 'center',
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
  },
  resultCount: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  resultCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});