import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EnteteTableau() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TEKTAL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEBD00",
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  logo: { fontSize: 28, fontWeight: "800", color: "#111" },
});
