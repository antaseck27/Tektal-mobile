import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBg} />

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.formBlock}>
          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Email</Text>
          </View>

          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Mot de passe</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.text}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>S’inscrire</Text>
            </TouchableOpacity>
          </View>
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 42,
    paddingHorizontal: 28,
    paddingBottom: 16,
    marginTop: -55,
  },

  back: { color: "#0F2B5B", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 11, marginTop: 30 },

  formBlock: { alignItems: "center", marginTop: 46, gap: 6 },

  inputFake: {
    width: "100%",
    backgroundColor: "#0F2B5B",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  inputText: { color: "#FFF" },

  primaryButton: {
    marginTop: 6,
    backgroundColor: "#0F2B5B",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },

  link: { color: "#081D4F", textAlign: "center", marginTop: 8, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 6 },
  text: { color: "#0F2B5B" },
});
