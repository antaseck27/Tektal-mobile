
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../services/authService";

export default function Signup({ navigation }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSignup = async () => {
    if (loading) return;
    if (!email || !password) {
      setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await register({ email, password, full_name: nom });
      if (res.ok) {
        setStatus({ type: "success", message: "Compte créé. Vérifie ton email." });
        setTimeout(() => navigation.navigate("Login"), 800);
      } else {
        setStatus({ type: "error", message: JSON.stringify(res.data) });
      }
    } catch (e) {
      setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBg}>
        <ImageBackground
          source={require("../../assets/img2.jpeg")}
          style={styles.bgImage}
        >
          <LinearGradient
            pointerEvents="none"
            colors={["#D9A600", "#D9A600", "#D9D9D9"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          />
        </ImageBackground>
      </View>

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Inscription</Text>

        <View style={styles.formBlock}>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            placeholderTextColor="#FFF"
            value={nom}
            onChangeText={setNom}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#FFF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>S’inscrire</Text>
            )}
          </TouchableOpacity>

          {status.message ? (
            <Text
              style={[
                styles.statusText,
                status.type === "success" ? styles.statusSuccess : styles.statusError,
              ]}
            >
              {status.message}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEBD00" },

  topBg: { flex: 4, zIndex: 0 },
  bgImage: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

  card: {
    flex: 7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 22,
    paddingHorizontal: 28,
    paddingBottom: 16,
    marginTop: -55,
    zIndex: 2,
    elevation: 2,
  },

  back: { color: "black", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },

  formBlock: { alignItems: "center", marginTop: 20, gap: 28 },

  input: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 28,
    color: "#FFF",
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#F4B000",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    minWidth: 160,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },

  statusText: { marginTop: 12, textAlign: "center", fontWeight: "600" },
  statusSuccess: { color: "#1f9d55" },
  statusError: { color: "#c53030" },
});
