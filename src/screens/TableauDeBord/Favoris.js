// screens/Favoris.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Favoris({ navigation }) {
  // Données de chemins favoris (simulées - à remplacer par vraies données)
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      title: 'Bakeli → Rond-Point Liberté 6',
      creator: 'Fatou Sall',
      duration: '8 min',
      steps: 4,
      thumbnail: null,
      isOfficial: true,
    },
    {
      id: '2',
      title: 'Campus → Supermarché Auchan',
      creator: 'Moussa Kane',
      duration: '12 min',
      steps: 6,
      thumbnail: null,
      isOfficial: false,
    },
    {
      id: '3',
      title: 'Gare routière → Marché Sandaga',
      creator: 'Aminata Diop',
      duration: '15 min',
      steps: 5,
      thumbnail: null,
      isOfficial: true,
    },
  ]);

  const handleRemoveFavorite = (id) => {
    Alert.alert(
      'Retirer des favoris',
      'Voulez-vous retirer ce chemin de vos favoris ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleOpenPath = (path) => {
    // TODO: Navigation vers l'écran de lecture du chemin
    Alert.alert('Ouvrir chemin', `Lecture de: ${path.title}`);
  };

  const renderPathCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handleOpenPath(item)}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        <Ionicons name="map" size={40} color="#FEBD00" />
        {item.isOfficial && (
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
          </View>
        )}
      </View>

      {/* Informations */}
      <View style={styles.pathInfo}>
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
        </View>
      </View>

      {/* Bouton retirer */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color="#FEBD00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptyText}>
        Les chemins que vous sauvegarderez apparaîtront ici
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Feed')}
      >
        <Text style={styles.exploreButtonText}>Explorer les chemins</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <View style={styles.headerRight}>
          <Text style={styles.favoriteCount}>{favorites.length}</Text>
        </View>
      </View>

      {/* Liste des favoris */}
      <FlatList
        data={favorites}
        renderItem={renderPathCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          favorites.length === 0 ? styles.emptyList : styles.list
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
    backgroundColor: '#f5f5f5',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEBD00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteCount: {
    fontSize: 16,
    fontWeight: 'bold',
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
  thumbnail: {
    width: 80,
    height: 80,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathInfo: {
    flex: 1,
    marginLeft: 12,
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
    marginBottom: 8,
  },
  pathMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#FEBD00',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});