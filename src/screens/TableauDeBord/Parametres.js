import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "tektal_settings_v1";

const DEFAULT_SETTINGS = {
  notifications: true,
  autoplayVideos: true,
  downloadWifiOnly: true,
  darkMode: false,
  language: "fr",
  mapType: "standard",
};

const languageLabel = (lang) => (lang === "fr" ? "Francais" : "English");
const mapTypeLabel = (type) => (type === "standard" ? "Standard" : "Satellite");

export default function Parametres({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const saveSettings = async (next) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      Alert.alert("Erreur", "Impossible de sauvegarder les parametres.");
    }
  };

  const toggle = async (key) => {
    const next = { ...settings, [key]: !settings[key] };
    await saveSettings(next);
  };

  const cycleLanguage = async () => {
    const next = { ...settings, language: settings.language === "fr" ? "en" : "fr" };
    await saveSettings(next);
  };

  const cycleMapType = async () => {
    const next = {
      ...settings,
      mapType: settings.mapType === "standard" ? "satellite" : "standard",
    };
    await saveSettings(next);
  };

  const resetAll = () => {
    Alert.alert("Reinitialiser", "Remettre les parametres par defaut ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        style: "destructive",
        onPress: async () => {
          await saveSettings(DEFAULT_SETTINGS);
          Alert.alert("OK", "Parametres reinitialises.");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FEBD00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <SettingSwitch
            icon="notifications-outline"
            label="Notifications"
            value={settings.notifications}
            onChange={() => toggle("notifications")}
          />
          <SettingSwitch
            icon="play-circle-outline"
            label="Lecture auto des videos"
            value={settings.autoplayVideos}
            onChange={() => toggle("autoplayVideos")}
          />
          <SettingSwitch
            icon="cellular-outline"
            label="Telechargement Wi-Fi uniquement"
            value={settings.downloadWifiOnly}
            onChange={() => toggle("downloadWifiOnly")}
          />
          <SettingSwitch
            icon="moon-outline"
            label="Mode sombre (UI locale)"
            value={settings.darkMode}
            onChange={() => toggle("darkMode")}
          />
        </View>

        <View style={styles.card}>
          <SettingAction
            icon="language-outline"
            label="Langue"
            value={languageLabel(settings.language)}
            onPress={cycleLanguage}
          />
          <SettingAction
            icon="map-outline"
            label="Type de carte"
            value={mapTypeLabel(settings.mapType)}
            onPress={cycleMapType}
          />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <Ionicons name="refresh-outline" size={18} color="#fff" />
          <Text style={styles.resetButtonText}>Reinitialiser les parametres</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingSwitch({ icon, label, value, onChange }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="#666" />
        <Text style={styles.rowLabel} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: "#FEBD00" }} />
    </View>
  );
}

function SettingAction({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="#666" />
        <Text style={styles.rowLabel} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  row: {
    minHeight: 56,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  rowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: "#222",
    fontWeight: "500",
  },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowValue: { color: "#666", fontSize: 13 },

  resetButton: {
    marginTop: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  resetButtonText: { color: "#fff", fontWeight: "700" },
});
