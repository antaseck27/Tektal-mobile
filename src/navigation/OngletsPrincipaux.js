import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Accueil from "../screens/TableauDeBord/Accueil";
import Recherche from "../screens/TableauDeBord/Recherche";
import Ajouter from "../screens/TableauDeBord/Ajouter";
import Favoris from "../screens/TableauDeBord/Favoris";
import Profil from "../screens/TableauDeBord/Profil";

const Tab = createBottomTabNavigator();

export default function OngletsPrincipaux() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 60, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          let icon = "home-outline";
          if (route.name === "Accueil") icon = "home-outline";
          if (route.name === "Recherche") icon = "search-outline";
          if (route.name === "Ajouter") icon = "add-circle-outline";
          if (route.name === "Favoris") icon = "bookmark-outline";
          if (route.name === "Profil") icon = "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={Accueil} />
      <Tab.Screen name="Recherche" component={Recherche} />
      <Tab.Screen name="Ajouter" component={Ajouter} />
      <Tab.Screen name="Favoris" component={Favoris} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}
