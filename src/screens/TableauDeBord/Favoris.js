import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Favoris() {
  return (
    <View style={styles.container}>
      <Text>Favoris</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
