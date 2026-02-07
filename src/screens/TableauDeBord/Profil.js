import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Profil() {
  return (
    <View style={styles.container}>
      <Text>Profil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
