import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Signup({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBg} />

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Inscription</Text>

        <View style={styles.formBlock}>
          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Nom</Text>
          </View>

          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Email</Text>
          </View>

          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Mot de passe</Text>
          </View>

          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Confirmer mot de passe</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>S’inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2B5B" },

  topBg: { flex: 3, backgroundColor: "#0F2B5B" },

  card: {
    flex: 7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 22,
    paddingHorizontal: 28,
    paddingBottom: 16,
    marginTop: -55,
  },

  back: { color: "#0F2B5B", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },

  formBlock: { alignItems: "center" },
  inputFake: {
    width: "100%",
    backgroundColor: "#0F2B5B",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  inputText: { color: "#FFF" },

  primaryButton: {
    marginTop: 4,
    backgroundColor: "#0F2B5B",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },
});
