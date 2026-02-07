import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Tektal</Text>
      <Text style={styles.subtitle}>
        Suis le chemin, découvre tes services et avance plus vite.
      </Text>

      {/* TODO BACKEND: charger ici les infos utilisateur / stats / contenu dynamique */}
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
