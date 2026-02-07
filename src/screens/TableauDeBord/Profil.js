// screens/Profil.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profil({ navigation }) {
  // Données utilisateur (simulées - à remplacer par vraies données)
  const [user, setUser] = useState({
    name: 'Mamadou Diallo',
    phone: '+221 77 123 45 67',
    campus: 'Bakeli Dakar',
    role: 'user', // 'user' ou 'admin'
    createdPaths: 12,
    savedPaths: 8,
  });

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            // TODO: Logique de déconnexion
            console.log('Déconnexion...');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité à venir');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec dégradé */}
      <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
        <View style={styles.headerContent}>
          {/* Photo de profil */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#FEBD00" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Nom et campus */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userCampus}>{user.campus}</Text>

          {/* Badge admin si applicable */}
          {user.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFD700" />
              <Text style={styles.adminBadgeText}>Administrateur</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.createdPaths}</Text>
          <Text style={styles.statLabel}>Chemins créés</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.savedPaths}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {/* Mes chemins */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Mes chemins', 'Liste de vos chemins créés')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="map-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Mes chemins</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Favoris */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Favoris')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Favoris</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Modifier le profil */}
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="create-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Modifier le profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Paramètres */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Paramètres', 'Page de paramètres')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Paramètres</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Aide */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Aide', 'Centre d\'aide')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Aide</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Déconnexion */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>
              Déconnexion
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.versionText}>Version 1.0.0 (MVP)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FEBD00',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userCampus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  adminBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FEBD00',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 40,
  },
});