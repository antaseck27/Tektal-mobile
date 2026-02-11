

// /Users/antayussuf/Desktop/volkeno/tektal-mobile/src/screens/Dashboard.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getProfile } from "../services/authService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (!mounted) return;
        if (res?.ok) {
          const user = res.data || {};
          setUserName(
            user.full_name ||
            user.name ||
            (user.email ? user.email.split("@")[0] : "Utilisateur")
          );
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Tektal</Text>
      <Text style={styles.subtitle}>Bonjour {userName}</Text>
      <Text style={styles.subtitle}>
        Suis le chemin, découvre tes services et avance plus vite.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e322ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#FFF" },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },
});
