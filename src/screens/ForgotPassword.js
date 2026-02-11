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
import { resetPassword } from "../services/authService";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleReset = async () => {
    if (loading) return;
    if (!email) {
      setStatus({ type: "error", message: "Email obligatoire." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await resetPassword(email);
      if (res.ok) {
        setStatus({
          type: "success",
          message: "Email envoyé. Vérifie ta boîte de réception.",
        });
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
          source={require("../../assets/img1.jpeg")}
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

        <Text style={styles.title}>Réinitialiser le mot de passe</Text>
        <Text style={styles.subtitle}>
          Nous vous enverrons un e-mail avec le lien de réinitialisation.
        </Text>

        <View style={styles.formBlock}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Réinitialiser</Text>
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

  back: { color: "black", marginBottom: 29 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10,
    color: "black",
  },
  subtitle: {
    marginTop: 6,
    color: "#0F2B5B",
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 10,
  },

  formBlock: { alignItems: "center", marginTop: 22, gap: 18 },

  input: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 28,
    color: "#FFF",
  },

  primaryButton: {
    marginTop: 4,
    backgroundColor: "#FEBD00",
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