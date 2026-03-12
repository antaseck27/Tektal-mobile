// src/screens/TableauDeBord/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen({ route, navigation }) {
  const { path } = route.params || {};

  // ✅ Filtre coords invalides (null, NaN)
  const validCoords = (path?.coordinates || []).filter(
    (c) => c && c.latitude != null && c.longitude != null &&
           !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
  );

  const hasCoords = validCoords.length >= 2;

  const region = hasCoords
    ? {
        latitude: validCoords[0].latitude,
        longitude: validCoords[0].longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }
    : {
        // Dakar par défaut
        latitude: 14.6928,
        longitude: -17.4467,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{path?.title || 'Carte'}</Text>
          {path?.creator && path.creator !== 'Inconnu'
            ? <Text style={styles.headerSub}>Par {path.creator}</Text>
            : null
          }
        </View>
      </View>

      <MapView style={styles.map} initialRegion={region} showsUserLocation>
        {hasCoords && (
          <>
            <Marker
              coordinate={validCoords[0]}
              title="Départ"
              description={path?.departure || 'Départ'}
              pinColor="#FEBD00"
            />
            <Marker
              coordinate={validCoords[validCoords.length - 1]}
              title="Arrivée"
              description={path?.destination || 'Arrivée'}
              pinColor="#FF3B30"
            />
            <Polyline
              coordinates={validCoords}
              strokeColor="#FEBD00"
              strokeWidth={4}
            />
          </>
        )}
      </MapView>

      <View style={styles.infoBadge}>
        {hasCoords ? (
          <>
            <View style={styles.badgeRow}>
              <View style={styles.dotStart} />
              <Text style={styles.badgeText}>{path?.departure || 'Départ'}</Text>
            </View>
            <View style={styles.badgeLine} />
            <View style={styles.badgeRow}>
              <View style={styles.dotEnd} />
              <Text style={styles.badgeText}>{path?.destination || 'Arrivée'}</Text>
            </View>
            {path?.establishment
              ? <Text style={styles.badgeCampus}>🏫 {path.establishment}</Text>
              : null
            }
            <Text style={styles.badgeDuration}>⏱ {path?.duration || '–'}</Text>
          </>
        ) : (
          <Text style={styles.noGpsText}>
            ⚠️ Coordonnées GPS non disponibles pour ce chemin.{'\n'}
            Enregistrez le chemin avec GPS pour afficher la carte.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  map: { flex: 1 },
  infoBadge: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 6,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dotStart: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FEBD00' },
  dotEnd: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF3B30' },
  badgeText: { fontSize: 15, color: '#1a1a1a', fontWeight: '500', flex: 1 },
  badgeLine: { width: 2, height: 18, backgroundColor: '#eee', marginLeft: 5, marginVertical: 3 },
  badgeCampus: { marginTop: 8, fontSize: 13, color: '#666' },
  badgeDuration: { marginTop: 6, fontSize: 13, color: '#888', textAlign: 'center' },
  noGpsText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 22 },
});