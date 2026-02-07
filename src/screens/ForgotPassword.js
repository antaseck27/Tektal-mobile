import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ForgotPassword({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBg} />

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Réinitialiser le mot de passe</Text>
        <Text style={styles.subtitle}>
          Nous vous enverrons un e-mail avec le lien de réinitialisation
        </Text>

        <View style={styles.formBlock}>
          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Email</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0e322ff" },

  topBg: { flex: 3, backgroundColor: "#f0e322ff" },

  card: {
    flex: 7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 22,
    paddingHorizontal: 28,
    paddingBottom: 16,
    marginTop: -55,
  },

  back: { color: "black", marginBottom: 12 },
  
  // title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
   title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 11,
    marginTop: 30,
    color: "black",
  },
  subtitle: { marginTop: 10, color: "#0F2B5B", textAlign: "center", paddingHorizontal: 20 , fontSize: 17 , padding: 20 },

  formBlock: { alignItems: "center", marginTop: 18 ,gap: 18},
  inputFake: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 12,
    marginTop: 20,
  },
  inputText: { color: "#FFF" },

  primaryButton: {
    marginTop: 4,
    backgroundColor: "#FEBD00",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },
});
