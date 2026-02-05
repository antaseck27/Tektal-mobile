import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const BG_URI =
  "https://i.pinimg.com/1200x/53/8f/29/538f290ca82585e94f0f7cbaab199e6e.jpg";

export default function Home1({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        <View style={styles.imageClip}>
          <ImageBackground source={{ uri: BG_URI }} style={styles.imageBg}>
            <View style={styles.imageOverlay} />
          </ImageBackground>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.topBlock}>
          <Text style={styles.logo}>TEKTAL</Text>
          <Text style={styles.subtitle}>Suis le chemin. Visuellement.</Text>
        </View>

        <View style={styles.middleBlock}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Commencer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleRow}>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>
                Continuer avec google
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          En continuant, vous acceptez nos conditions d’utilisation
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2B5B" },

  imageWrap: { flex: 3, zIndex: 1 },
  imageClip: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  imageBg: { flex: 1, width: "100%" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 35, 94, 0.86)",
  },

  card: {
    flex: 7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 26,
    paddingHorizontal: 28,
    paddingBottom: 16,
    justifyContent: "space-between",
    marginTop: -55,
    zIndex: 2,
    elevation: 2,
  },

  topBlock: { alignItems: "center", marginTop: 24 },
  logo: { fontSize: 28, fontWeight: "700", color: "#0F2B5B" },
  subtitle: { marginTop: 10, color: "#0F2B5B", fontStyle: "italic" },

  middleBlock: { alignItems: "center" },
  primaryButton: {
    backgroundColor: "#0F2B5B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },

  googleButton: {
    marginTop: 10,
    backgroundColor: "#0F2B5B",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  googleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: { fontSize: 12, fontWeight: "700", color: "#0F2B5B" },
  googleButtonText: { color: "#FFF", fontSize: 12 },

  footer: { fontSize: 12, color: "#0F2B5B", textAlign: "center" },
});
