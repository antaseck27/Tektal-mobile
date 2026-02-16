import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, updateProfile } from "../../services/authService";

export default function EditProfil({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getProfile();
        if (!mounted) return;

        if (res?.ok) {
          const u = res.data || {};
          const fullName = (u.name || u.full_name || "").trim();
          const parts = fullName.split(/\s+/).filter(Boolean);

          setPrenom(parts[0] || "");
          setNom(parts.slice(1).join(" "));
          setEmail(u.email || "");
        }
      } catch {
        Alert.alert("Erreur", "Impossible de charger le profil.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const fullName = useMemo(
    () => `${prenom.trim()} ${nom.trim()}`.replace(/\s+/g, " ").trim(),
    [prenom, nom]
  );

  const canSave = useMemo(() => {
    if (!prenom.trim()) return false;
    if (!email.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return false;
    return true;
  }, [prenom, email]);

  const handleSave = async () => {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      const payload = {
        name: fullName || prenom.trim(),
        email: email.trim().toLowerCase(),
      };

      const res = await updateProfile(payload);

      if (res?.ok) {
        Alert.alert("Succes", "Profil mis a jour.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        return;
      }

      const msg =
        res?.data?.email?.[0] ||
        res?.data?.name?.[0] ||
        res?.data?.detail ||
        "Mise a jour impossible.";
      Alert.alert("Erreur", String(msg));
    } catch {
      Alert.alert("Erreur", "Erreur reseau. Reessayez.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le profil</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.label}>Prenom</Text>
            <TextInput
              style={styles.input}
              value={prenom}
              onChangeText={setPrenom}
              placeholder="Votre prenom"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={nom}
              onChangeText={setNom}
              placeholder="Votre nom"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.preview}>
              Nom complet: {fullName || "-"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, (!canSave || saving) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

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
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  headerSpacer: { width: 38 },

  content: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    marginTop: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F6F7F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E7EB",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  preview: {
    marginTop: 14,
    color: "#666",
    fontSize: 13,
  },

  saveButton: {
    marginTop: 16,
    backgroundColor: "#FEBD00",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: { color: "#fff", fontWeight: "700" },
});
