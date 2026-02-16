import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getMyPaths } from "../../services/authService";

export default function MesChemins({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paths, setPaths] = useState([]);

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const loadPaths = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getMyPaths();

      if (!res?.ok) {
        const msg = res?.data?.detail || "Impossible de charger vos chemins.";
        Alert.alert("Erreur", String(msg));
        setPaths([]);
        return;
      }

      const list = normalizeList(res.data);
      setPaths(list);
    } catch {
      Alert.alert("Erreur", "Erreur reseau. Reessayez.");
      setPaths([]);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPaths(false);
    }, [loadPaths])
  );

  const onRefresh = () => {
    loadPaths(true);
  };

  const handleOpenPath = (path) => {
    navigation.navigate("VideoPlayer", { path });
  };

  const renderItem = ({ item }) => {
    const thumb =
      item.thumbnail ||
      item.thumbnail_url ||
      item.video_thumbnail ||
      "https://via.placeholder.com/300x200.png?text=TEKTAL";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleOpenPath(item)}
      >
        <Image source={{ uri: thumb }} style={styles.thumbnail} />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || "Chemin"}
          </Text>

          <Text style={styles.metaLine} numberOfLines={1}>
            {item.start_label || item.departure || "-"} → {item.end_label || item.destination || "-"}
          </Text>

          <View style={styles.badges}>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={12} color="#666" />
              <Text style={styles.badgeText}>{item.duration || "-"}</Text>
            </View>

            {(item.is_official || item.isOfficial) && (
              <View style={[styles.badge, styles.badgeOfficial]}>
                <Ionicons name="shield-checkmark" size={12} color="#FEBD00" />
                <Text style={[styles.badgeText, { color: "#FEBD00" }]}>Officiel</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Ionicons name="map-outline" size={72} color="#FEBD00" />
      <Text style={styles.emptyTitle}>Aucun chemin cree</Text>
      <Text style={styles.emptyText}>
        Vos chemins publies apparaitront ici.
      </Text>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate("Ajouter")}
      >
        <Text style={styles.createBtnText}>Creer un chemin</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#FEBD00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes chemins</Text>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{paths.length}</Text>
        </View>
      </View>

      <FlatList
        data={paths}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={renderItem}
        contentContainerStyle={paths.length ? styles.list : styles.listEmpty}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FEBD00"
            colors={["#FEBD00"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  header: {
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  countPill: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FEBD00",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  countText: { color: "#fff", fontWeight: "700" },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  list: { padding: 14, paddingBottom: 28 },
  listEmpty: { flexGrow: 1, padding: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#1b1b1b" },
  metaLine: { marginTop: 4, fontSize: 12, color: "#666" },

  badges: { flexDirection: "row", gap: 8, marginTop: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeOfficial: {
    backgroundColor: "#FFF8E1",
  },
  badgeText: { fontSize: 11, color: "#666", fontWeight: "600" },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: { marginTop: 14, fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  emptyText: { marginTop: 8, textAlign: "center", color: "#666", lineHeight: 20 },
  createBtn: {
    marginTop: 18,
    backgroundColor: "#FEBD00",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createBtnText: { color: "#fff", fontWeight: "700" },
});
