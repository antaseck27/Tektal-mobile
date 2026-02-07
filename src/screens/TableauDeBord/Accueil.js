import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import EnteteTableau from "../../components/EnteteTableau";
import CarteTrajet from "../../components/CarteTrajet";

export default function Accueil() {
  return (
    <View style={styles.container}>
      <EnteteTableau />
      <ScrollView contentContainerStyle={styles.content}>
        <CarteTrajet
          titre="Vers Bakeli School of Technology"
          sousTitre="Dakar - 1:20"
          image={require("../../../assets/tektal.jpeg")}
        />
        <CarteTrajet
          titre="Aller à l’UCAD"
          image={require("../../../assets/tektal.jpeg")}
        />
        <CarteTrajet
          titre="Route vers Volkeno"
          sousTitre="Dakar - 1:00"
          image={require("../../../assets/tektal.jpeg")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { padding: 16, paddingTop: 12 },
});
