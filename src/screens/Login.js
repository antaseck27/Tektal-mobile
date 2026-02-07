

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Login({ navigation }) {
  const handleLogin = () => {
    // TODO BACKEND: appeler l'API de connexion ici
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBg}>
        <ImageBackground
          source={require("../../assets/img1.jpeg")}
          style={styles.bgImage}
        >
          <LinearGradient
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

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.formBlock}>
          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Email</Text>
          </View>

          <View style={styles.inputFake}>
            <Text style={styles.inputText}>Mot de passe</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
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
  container: { flex: 1, backgroundColor: "#FEBD00" },

  topBg: { flex: 4 },
  bgImage: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

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

  back: { color: "black", marginBottom: 12 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 11,
    marginTop: 30,
    color: "black",
  },

  formBlock: { alignItems: "center", marginTop: 46, gap: 18 },

  inputFake: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 18,
  },
  inputText: { color: "#FFF" },

  primaryButton: {
    marginTop: 6,
    backgroundColor: "#FEBD00",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },

  link: { color: "#f0e322ff", textAlign: "center", marginTop: 17, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  text: { color: "#111010ff", fontSize: 12, marginTop: 20 },
});

