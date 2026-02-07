// screens/Recherche.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Recherche({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'official', 'campus'

  // Données de chemins (simulées - à remplacer par vraies données)
  const [paths, setPaths] = useState([
    {
      id: '1',
      title: 'Bakeli → Rond-Point Liberté 6',
      creator: 'Fatou Sall',
      duration: '8 min',
      steps: 4,
      campus: 'Bakeli Dakar',
      isOfficial: true,
    },
    {
      id: '2',
      title: 'Campus → Supermarché Auchan',
      creator: 'Moussa Kane',
      duration: '12 min',
      steps: 6,
      campus: 'Bakeli Dakar',
      isOfficial: false,
    },
    {
      id: '3',
      title: 'Gare routière → Marché Sandaga',
      creator: 'Aminata Diop',
      duration: '15 min',
      steps: 5,
      campus: 'Bakeli Thiès',
      isOfficial: true,
    },
    {
      id: '4',
      title: 'Université → Bibliothèque',
      creator: 'Ibrahima Fall',
      duration: '5 min',
      steps: 3,
      campus: 'UCAD',
      isOfficial: false,
    },
    {
      id: '5',
      title: 'Pharmacie → Clinique',
      creator: 'Astou Ndiaye',
      duration: '10 min',
      steps: 4,
      campus: 'Bakeli Dakar',
      isOfficial: true,
    },
  ]);

  // Filtrer les chemins selon la recherche et le filtre actif
  const filteredPaths = paths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.campus.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'official') {
      return matchesSearch && path.isOfficial;
    } else if (activeFilter === 'campus') {
      return matchesSearch && path.campus === 'Bakeli Dakar'; // TODO: Remplacer par le campus de l'utilisateur
    }
    return matchesSearch;
  });

  const handleOpenPath = (path) => {
    Alert.alert('Ouvrir chemin', `Lecture de: ${path.title}`);
  };

  const renderPathCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handleOpenPath(item)}
    >
      <View style={styles.pathCardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name="map" size={32} color="#FEBD00" />
          {item.isOfficial && (
            <View style={styles.officialBadge}>
              <Ionicons name="shield-checkmark" size={10} color="#fff" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.pathCardContent}>
        <Text style={styles.pathTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.pathCreator}>Par {item.creator}</Text>
        <View style={styles.pathMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="footsteps-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{item.steps} étapes</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="school-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{item.campus}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={24} color="#FEBD00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Aucun résultat</Text>
      <Text style={styles.emptyText}>
        Essayez avec d'autres mots-clés
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rechercher</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher un chemin, lieu, campus..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
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
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'official' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('official')}
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
            Officiels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'campus' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('campus')}
        >
          <Ionicons
            name="school-outline"
            size={16}
            color={activeFilter === 'campus' ? '#fff' : '#666'}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'campus' && styles.filterChipTextActive,
            ]}
          >
            Mon campus
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
      {searchQuery.length > 0 && (
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
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FEBD00',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  pathCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pathCardLeft: {
    marginRight: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#FFFBF0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  officialBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFD700',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pathCreator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  pathMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favoriteButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultCount: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});