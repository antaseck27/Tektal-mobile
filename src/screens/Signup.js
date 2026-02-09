


// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function Signup({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <View style={styles.topBg}>
//         <ImageBackground
//           source={require("../../assets/img2.jpeg")}
//           style={styles.bgImage}
//         >
//           <LinearGradient
//             colors={["#D9A600", "#D9A600", "#D9D9D9"]}
//             locations={[0, 0.55, 1]}
//             start={{ x: 0.5, y: 0 }}
//             end={{ x: 0.5, y: 1 }}
//             style={styles.gradient}
//           />
//         </ImageBackground>
//       </View>

//       <View style={styles.card}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.back}>← Retour</Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>Inscription</Text>

//         <View style={styles.formBlock}>
//           <View style={styles.inputFake}>
//             <Text style={styles.inputText}>Nom</Text>
//           </View>

//           <View style={styles.inputFake}>
//             <Text style={styles.inputText}>Email</Text>
//           </View>

//           <View style={styles.inputFake}>
//             <Text style={styles.inputText}>Mot de passe</Text>
//           </View>

//           <View style={styles.inputFake}>
//             <Text style={styles.inputText}>Confirmer mot de passe</Text>
//           </View>

//           <TouchableOpacity style={styles.primaryButton}>
//             <Text style={styles.primaryButtonText}>S’inscrire</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F4B000" },

//   topBg: { flex: 3 },
//   bgImage: { flex: 1 },
//   gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

//   card: {
//     flex: 7,
//     backgroundColor: "#FFF",
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     paddingTop: 22,
//     paddingHorizontal: 28,
//     paddingBottom: 16,
//     marginTop: -55,
//   },

//   back: { color: "black", marginBottom: 12 },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 16,
//   },

//   formBlock: { alignItems: "center", marginTop: 20, gap: 18 },

//   inputFake: {
//     width: "100%",
//     backgroundColor: "#D9D9D9",
//     borderRadius: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//   },
//   inputText: { color: "#FFF" },

//   primaryButton: {
//     marginTop: 20,
//     backgroundColor: "#F4B000",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 24,
//   },
//   primaryButtonText: { color: "#FFF", fontWeight: "600" },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../services/authService";

export default function Signup({ navigation }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await register({ email, password });
    if (res?.email) {
      Alert.alert("Succès", "Compte créé. Vérifie ton email.");
      navigation.navigate("Login");
    } else {
      Alert.alert("Erreur", JSON.stringify(res));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBg}>
        <ImageBackground
          source={require("../../assets/img2.jpeg")}
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

        <Text style={styles.title}>Inscription</Text>

        <View style={styles.formBlock}>
          <TextInput
            style={styles.inputFake}
            placeholder="Nom"
            placeholderTextColor="#FFF"
            value={nom}
            onChangeText={setNom}
          />

          <TextInput
            style={styles.inputFake}
            placeholder="Email"
            placeholderTextColor="#FFF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.inputFake}
            placeholder="Mot de passe"
            placeholderTextColor="#FFF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.primaryButtonText}>S’inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4B000" },
  topBg: { flex: 3 },
  bgImage: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

  card: {
    flex: 7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 22,
    paddingHorizontal: 28,
    paddingBottom: 16,
    marginTop: -55,
  },

  back: { color: "black", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },

  formBlock: { alignItems: "center", marginTop: 20, gap: 18 },

  inputFake: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    color: "#FFF",
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#F4B000",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },
});
