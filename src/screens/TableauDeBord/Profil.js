


// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/TableauDeBord/Profil.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getProfile, logout } from "../../services/authService";

export default function Profil({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "",
    phone: "",
    campus: "Bakeli Dakar",
    role: "user",
    createdPaths: 0,
    savedPaths: 0,
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (!mounted) return;

        if (res?.ok) {
          const u = res.data || {};
          setUser((prev) => ({
            ...prev,
            name:
              u.full_name ||
              u.name ||
              (u.email ? u.email.split("@")[0] : "Utilisateur"),
            email: u.email || "",
            phone: u.phone || "",
            campus: u.campus || prev.campus,
            role: u.role || "user",
            createdPaths: Number.isFinite(u.created_paths) ? u.created_paths : prev.createdPaths,
            savedPaths: Number.isFinite(u.saved_paths) ? u.saved_paths : prev.savedPaths,
          }));
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const performLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de se deconnecter. Reessayez.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Deconnexion", "Voulez-vous vraiment vous deconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Deconnexion",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Modifier le profil", "Fonctionnalite a venir");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#FEBD00", "#FFD700"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#FEBD00" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userCampus}>{user.campus}</Text>

          {user.role === "admin" && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFD700" />
              <Text style={styles.adminBadgeText}>Administrateur</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.createdPaths}</Text>
          <Text style={styles.statLabel}>Chemins crees</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.savedPaths}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert("Mes chemins", "Liste de vos chemins crees")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="map-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Mes chemins</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Favoris")}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Favoris</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="create-outline" size={24} color="#FEBD00" />
            <Text style={styles.menuItemText}>Modifier le profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert("Parametres", "Page de parametres")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Parametres</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert("Aide", "Centre d'aide")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Aide</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout} disabled={loggingOut}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>
              {loggingOut ? "Deconnexion..." : "Deconnexion"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Version 1.0.0 (MVP)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { paddingTop: 60, paddingBottom: 30, alignItems: "center" },
  headerContent: { alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FEBD00",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  userCampus: { fontSize: 16, color: "#fff", opacity: 0.9 },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  adminBadgeText: { color: "#FFD700", fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#FEBD00", marginBottom: 4 },
  statLabel: { fontSize: 14, color: "#666" },
  statDivider: { width: 1, backgroundColor: "#e0e0e0", marginHorizontal: 20 },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemText: { fontSize: 16, color: "#333", marginLeft: 16, fontWeight: "500" },
  menuDivider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 8 },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 24,
    marginBottom: 40,
  },
});
