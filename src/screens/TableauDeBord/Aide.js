import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FAQ = [
  {
    id: "1",
    q: "Comment creer un chemin ?",
    a: "Allez dans Ajouter, renseignez depart/destination, enregistrez la video puis publiez.",
  },
  {
    id: "2",
    q: "Comment ajouter un favori ?",
    a: "Depuis Accueil ou un chemin, appuyez sur l'icone coeur pour ajouter/retirer un favori.",
  },
  {
    id: "3",
    q: "Pourquoi ma video ne se publie pas ?",
    a: "Verifiez la connexion internet, les permissions (camera/micro/localisation) et reessayez.",
  },
  {
    id: "4",
    q: "Comment modifier mon profil ?",
    a: "Depuis Profil > Modifier le profil, changez vos infos puis enregistrez.",
  },
];

export default function Aide({ navigation }) {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const openMail = async () => {
    const email = "support@tektal.com";
    const subject = "Support mobile TEKTAL";
    const body = "Bonjour, j'ai besoin d'aide concernant...";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("Erreur", "Impossible d'ouvrir l'application email.");
      return;
    }
    Linking.openURL(url);
  };

  const openWhatsApp = async () => {
    const phone = "221771234567"; // format international sans +
    const text = "Bonjour, j'ai besoin d'aide sur TEKTAL mobile.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("Erreur", "Impossible d'ouvrir WhatsApp.");
      return;
    }
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Questions frequentes</Text>

          {FAQ.map((item) => {
            const isOpen = openId === item.id;
            return (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#666"
                  />
                </TouchableOpacity>

                {isOpen && <Text style={styles.faqAnswer}>{item.a}</Text>}
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contacter le support</Text>

          <TouchableOpacity style={styles.contactBtn} onPress={openMail}>
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={styles.contactBtnText}>Envoyer un email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactBtn, styles.whatsappBtn]}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.contactBtnText}>Contacter sur WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>TEKTAL Mobile • Aide</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

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
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },

  faqItem: {
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
    paddingVertical: 10,
  },
  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#666",
  },

  contactBtn: {
    backgroundColor: "#FEBD00",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
  },
  contactBtnText: { color: "#fff", fontWeight: "700" },

  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 8,
  },
});
