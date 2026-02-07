import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function CarteTrajet({ titre, sousTitre, image }) {
  return (
    <View style={styles.card}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.radius}>
        <View style={styles.overlay} />
        <View style={styles.textBlock}>
          <Text style={styles.title}>{titre}</Text>
          {sousTitre ? <Text style={styles.subtitle}>{sousTitre}</Text> : null}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 18, overflow: "hidden" },
  image: { height: 180, justifyContent: "flex-end" },
  radius: { borderRadius: 18 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  textBlock: { padding: 12 },
  title: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  subtitle: { color: "#FFF", marginTop: 4 },
});
