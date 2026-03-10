// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { getProfile, getPaths, toggleFavorite } from "../services/authService";

const { width, height } = Dimensions.get("window");

export default function Dashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");
  const [viewMode, setViewMode] = useState("welcome"); // "welcome" ou "tiktok"
  const [paths, setPaths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Charger le profil
        const resProfile = await getProfile();
        if (!mounted) return;
        if (resProfile?.ok) {
          const user = resProfile.data || {};
          setUserName(
            user.full_name ||
              user.name ||
              (user.email ? user.email.split("@")[0] : "Utilisateur")
          );
        }

        // Charger les chemins/vidéos
        const resPaths = await getPaths();
        if (!mounted) return;
        if (resPaths?.ok && resPaths.data) {
          const pathsData = Array.isArray(resPaths.data.results)
            ? resPaths.data.results
            : Array.isArray(resPaths.data)
            ? resPaths.data
            : [];
          setPaths(pathsData);
        }
      } catch (e) {
        console.error("Erreur chargement:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleFavorite = async (pathId, isFavorite) => {
    try {
      const res = await toggleFavorite(pathId);
      if (res?.ok) {
        setPaths((prev) =>
          prev.map((p) =>
            p.id === pathId ? { ...p, isFavorite: !isFavorite } : p
          )
        );
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de modifier le favori");
    }
  };

  const handleViewMap = (path) => {
    navigation.navigate("Map", { path });
  };

  const handleViewSteps = (path) => {
    navigation.navigate("PathDetail", { pathId: path.id });
  };

  const handleViewProfile = (path) => {
    Alert.alert(
      "Créateur",
      `Créé par: ${path.user?.name || path.user?.email || "Inconnu"}`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
      </View>
    );
  }

  // Vue d'accueil simple
  if (viewMode === "welcome") {
    return (
      <View style={styles.welcomeContainer}>
        {/* Bouton Toggle en haut à droite */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setViewMode("tiktok")}
        >
          <Ionicons name="play-circle" size={28} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Bienvenue sur Tektal</Text>
        <Text style={styles.subtitle}>Bonjour {userName}</Text>
        <Text style={styles.description}>
          Suis le chemin, découvre tes services et avance plus vite.
        </Text>

        <TouchableOpacity
          style={styles.discoverButton}
          onPress={() => setViewMode("tiktok")}
        >
          <Ionicons name="compass" size={24} color="#FFF" />
          <Text style={styles.discoverText}>Découvrir les chemins</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Vue TikTok
  return (
    <View style={styles.tiktokContainer}>
      {/* Bouton Toggle pour revenir */}
      <TouchableOpacity
        style={styles.backToggleButton}
        onPress={() => setViewMode("welcome")}
      >
        <Ionicons name="home" size={24} color="#FFF" />
      </TouchableOpacity>

      {paths.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-off-outline" size={80} color="#999" />
          <Text style={styles.emptyText}>Aucune vidéo disponible</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("Ajouter")}
          >
            <Text style={styles.createButtonText}>Créer un chemin</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={paths}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.y / height
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => (
            <VideoItem
              path={item}
              isActive={index === currentIndex}
              onToggleFavorite={handleToggleFavorite}
              onViewMap={handleViewMap}
              onViewSteps={handleViewSteps}
              onViewProfile={handleViewProfile}
            />
          )}
        />
      )}
    </View>
  );
}

// Composant pour chaque vidéo
function VideoItem({
  path,
  isActive,
  onToggleFavorite,
  onViewMap,
  onViewSteps,
  onViewProfile,
}) {
  const player = useVideoPlayer(path.video_url || "", (playerInstance) => {
    if (isActive && path.video_url) {
      playerInstance.loop = true;
      playerInstance.play();
    } else {
      playerInstance.pause();
    }
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  return (
    <View style={styles.videoContainer}>
      {/* Vidéo en plein écran */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Gradient overlay pour lisibilité */}
      <View style={styles.gradient} />

      {/* Informations en bas à gauche */}
      <View style={styles.infoContainer}>
        <Text style={styles.pathTitle}>{path.title || "Sans titre"}</Text>
        <Text style={styles.pathSubtitle}>
          {path.start_label} → {path.end_label || "Destination"}
        </Text>
        <View style={styles.creatorContainer}>
          <Ionicons name="person-circle" size={20} color="#FFF" />
          <Text style={styles.creatorText}>
            {path.user?.name || path.user?.email || "Anonyme"}
          </Text>
        </View>
      </View>

      {/* Icônes à droite (style TikTok) */}
      <View style={styles.actionsContainer}>
        {/* Profil créateur */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onViewProfile(path)}
        >
          <Ionicons name="person-circle-outline" size={36} color="#FFF" />
        </TouchableOpacity>

        {/* Favori */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onToggleFavorite(path.id, path.isFavorite)}
        >
          <Ionicons
            name={path.isFavorite ? "heart" : "heart-outline"}
            size={36}
            color={path.isFavorite ? "#FF3B30" : "#FFF"}
          />
          <Text style={styles.actionText}>{path.likes || 0}</Text>
        </TouchableOpacity>

        {/* Carte */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onViewMap(path)}
        >
          <Ionicons name="map-outline" size={36} color="#FFF" />
          <Text style={styles.actionText}>Carte</Text>
        </TouchableOpacity>

        {/* Étapes */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onViewSteps(path)}
        >
          <Ionicons name="list-outline" size={36} color="#FFF" />
          <Text style={styles.actionText}>
            {path.steps?.length || 0} étapes
          </Text>
        </TouchableOpacity>

        {/* Partager */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={36} color="#FFF" />
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FEBD00",
    alignItems: "center",
    justifyContent: "center",
  },

  // Vue Welcome
  welcomeContainer: {
    flex: 1,
    backgroundColor: "#FEBD00",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  toggleButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.9,
  },
  discoverButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 40,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  discoverText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FEBD00",
  },

  // Vue TikTok
  tiktokContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  backToggleButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#FEBD00",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Vidéo
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "transparent",
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  },

  // Infos en bas à gauche
  infoContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 100,
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  pathSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 12,
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creatorText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },

  // Actions à droite (style TikTok)
  actionsContainer: {
    position: "absolute",
    right: 12,
    bottom: 100,
    gap: 24,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
});






// // /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/Dashboard.js
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { getProfile } from "../services/authService";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [userName, setUserName] = useState("Utilisateur");

//   useEffect(() => {
//     let mounted = true;

//     const loadProfile = async () => {
//       try {
//         const res = await getProfile();
//         if (!mounted) return;
//         if (res?.ok) {
//           const user = res.data || {};
//           setUserName(
//             user.full_name ||
//             user.name ||
//             (user.email ? user.email.split("@")[0] : "Utilisateur")
//           );
//         }
//       } catch (e) {
//         // ignore
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadProfile();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#111" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bienvenue sur Tektal</Text>
//       <Text style={styles.subtitle}>Bonjour {userName}</Text>
//       <Text style={styles.subtitle}>
//         Suis le chemin, découvre tes services et avance plus vite.
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0e322ff",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   title: { fontSize: 24, fontWeight: "700", color: "#FFF" },
//   subtitle: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#FFF",
//     textAlign: "center",
//   },
// });
