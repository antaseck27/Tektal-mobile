// screens/Admin/PendingPathsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getPendingPaths,
  approvePath,
  rejectPath,
  getPathById,
} from '../../services/adminPathService';

export default function PendingPathsScreen({ navigation }) {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPaths = useCallback(async () => {
    setLoading(true);
    const result = await getPendingPaths();
    if (result.ok) {
      setPaths(result.data.results || result.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger les chemins en attente');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPaths();
    setRefreshing(false);
  };

  const handleApprove = async (pathId, title) => {
    Alert.alert(
      'Approuver ce chemin ?',
      `"${title}" sera visible par tous les utilisateurs`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Approuver',
          style: 'default',
          onPress: async () => {
            const result = await approvePath(pathId);
            if (result.ok) {
              Alert.alert('✅ Approuvé', 'Le chemin a été approuvé');
              loadPaths();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (pathId, title) => {
    Alert.prompt(
      'Rejeter ce chemin ?',
      `Raison du rejet de "${title}" (optionnel) :`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Rejeter',
          style: 'destructive',
          onPress: async (reason) => {
            const result = await rejectPath(pathId, reason || '');
            if (result.ok) {
              Alert.alert('❌ Rejeté', 'Le chemin a été rejeté');
              loadPaths();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleViewDetails = async (pathId) => {
    const result = await getPathById(pathId);
    if (result.ok) {
      navigation.navigate('PathDetails', { path: result.data });
    } else {
      Alert.alert('Erreur', 'Impossible de charger les détails');
    }
  };

  const renderPathCard = ({ item }) => (
    <View style={styles.pathCard}>
      <View style={styles.pathHeader}>
        <View style={styles.pathInfo}>
          <Text style={styles.pathTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.pathSubtitle}>
            Par {item.creator || item.user_name || 'Utilisateur'}
          </Text>
        </View>
        {item.is_official && (
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#fff" />
            <Text style={styles.officialText}>Officiel</Text>
          </View>
        )}
      </View>

      <View style={styles.pathMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.metaText}>
            {new Date(item.created_at).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>

      <View style={styles.pathActions}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleViewDetails(item.id)}
        >
          <Ionicons name="eye-outline" size={20} color="#007AFF" />
          <Text style={styles.detailsButtonText}>Voir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(item.id, item.title)}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
          <Text style={styles.rejectButtonText}>Rejeter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(item.id, item.title)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.approveButtonText}>Approuver</Text>
        </TouchableOpacity>
      </View>
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
      <LinearGradient
        colors={['#FEBD00', '#FFD700']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chemins en attente</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{paths.length}</Text>
        </View>
      </LinearGradient>

      {paths.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Aucun chemin en attente</Text>
          <Text style={styles.emptySubtitle}>
            Tous les chemins ont été traités
          </Text>
        </View>
      ) : (
        <FlatList
          data={paths}
          renderItem={renderPathCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FEBD00"
            />
          }
        />
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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  pathCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pathSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  officialText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  pathMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  pathActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff0f0',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#34C759',
    gap: 6,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});