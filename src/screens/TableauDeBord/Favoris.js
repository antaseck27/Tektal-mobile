

// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/TableauDeBord/Favoris.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePaths } from "../../context/PathContext";

export default function Favoris({ navigation }) {
  const { paths, loading, toggleFavorite, refreshPaths } = usePaths();
  const [refreshing, setRefreshing] = useState(false);

  const favoritePaths = useMemo(
    () => (paths || []).filter((p) => p.isFavorite),
    [paths]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshPaths?.();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    await toggleFavorite(id);
  };

  const handleOpenPath = (path) => {
    navigation.navigate("VideoPlayer", { path });
  };

  const renderPathCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handleOpenPath(item)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{
            uri:
              item.thumbnail ||
              "https://via.placeholder.com/300x200.png?text=TEKTAL",
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {(item.isOfficial || item.is_official) && (
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
          </View>
        )}
        <View style={styles.playButtonOverlay}>
          <Ionicons name="play" size={16} color="#fff" />
        </View>
      </View>

      <View style={styles.pathInfo}>
        <Text style={styles.pathTitle} numberOfLines={2}>
          {item.title || "Chemin"}
        </Text>
        <Text style={styles.pathCreator} numberOfLines={1}>
          Par {item.creator || "Utilisateur"}
        </Text>

        <View style={styles.pathMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#999" />
            <Text style={styles.metaText}>{item.duration || "-"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="play-circle-outline" size={12} color="#999" />
            <Text style={styles.metaText}>Vidéo</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
        activeOpacity={0.7}
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
        Les chemins que vous sauvegardez apparaîtront ici.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Accueil")}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>Explorer les chemins</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
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

      <FlatList
        data={favoritePaths}
        renderItem={renderPathCard}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          favoritePaths.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FEBD00"
            colors={["#FEBD00"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#666", fontWeight: "500" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1a1a1a" },
  headerRight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEBD00",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteCount: { fontSize: 16, fontWeight: "bold", color: "#fff" },

  list: { padding: 20 },
  emptyList: { flexGrow: 1 },

  pathCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  thumbnailContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: { width: "100%", height: "100%" },
  officialBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,215,0,0.95)",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(254,189,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  pathInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  pathTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 20,
  },
  pathCreator: { fontSize: 13, color: "#666", marginBottom: 6 },
  pathMeta: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12, color: "#999", marginLeft: 4, fontWeight: "500" },
  removeButton: { justifyContent: "center", alignItems: "center", padding: 8 },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: "bold", color: "#1a1a1a", marginBottom: 12 },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: "#FEBD00",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  exploreButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
