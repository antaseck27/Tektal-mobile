// src/screens/Signup.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { register } from "../services/authService";

export default function Signup({ navigation }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSignup = async () => {
    if (loading) return;
    if (!email || !password) {
      setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await register({ email, password, name: nom });
      if (res.ok) {
        setStatus({ type: "success", message: "Compte créé. Vérifie ton email." });
        setTimeout(() => navigation.navigate("Login"), 800);
      } else {
        setStatus({ type: "error", message: JSON.stringify(res.data) });
      }
    } catch {
      setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topBg}>
        <ImageBackground source={require("../../assets/img2.jpeg")} style={styles.bgImage}>
          <LinearGradient
            pointerEvents="none"
            colors={["#D9A600", "#D9A600", "#D9D9D9"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          />
        </ImageBackground>
      </View>

      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Inscription</Text>

        <View style={styles.formBlock}>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            placeholderTextColor="#999"
            value={nom}
            onChangeText={setNom}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.primaryButtonText}>S'inscrire</Text>
            }
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.text}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          {status.message ? (
            <Text style={[styles.statusText, status.type === "success" ? styles.statusSuccess : styles.statusError]}>
              {status.message}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEBD00" },

  topBg: { height: 220, zIndex: 0 },
  bgImage: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -55,
    zIndex: 2,
  },
  cardContent: {
    paddingTop: 32,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  back: { color: "black", marginBottom: 12 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10,
    color: "black",
  },

  formBlock: { alignItems: "center", marginTop: 20, gap: 18 },

  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: "#1a1a1a",
    fontSize: 15,
  },

  passwordWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 24,
    paddingRight: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: "#1a1a1a",
    fontSize: 15,
  },
  eyeBtn: { padding: 4 },

  primaryButton: {
    marginTop: 6,
    backgroundColor: "#F4B000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

  link: { color: "#FEBD00", textAlign: "center", fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  text: { color: "#666", fontSize: 14 },

  statusText: { marginTop: 8, textAlign: "center", fontWeight: "600" },
  statusSuccess: { color: "#1f9d55" },
  statusError: { color: "#c53030" },
});



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { register } from "../services/authService";

// export default function Signup({ navigation }) {
//   const [nom, setNom] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ type: "", message: "" });

//   const handleSignup = async () => {
//     if (loading) return;
//     if (!email || !password) {
//       setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
//       return;
//     }

//     setLoading(true);
//     setStatus({ type: "", message: "" });

//     try {
//       const res = await register({ email, password, name: nom });
//       if (res.ok) {
//         setStatus({ type: "success", message: "Compte créé. Vérifie ton email." });
//         setTimeout(() => navigation.navigate("Login"), 800);
//       } else {
//         setStatus({ type: "error", message: JSON.stringify(res.data) });
//       }
//     } catch (e) {
//       setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topBg}>
//         <ImageBackground source={require("../../assets/img2.jpeg")} style={styles.bgImage}>
//           <LinearGradient
//             pointerEvents="none"
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
//           <TextInput
//             style={styles.input}
//             placeholder="Nom complet"
//             placeholderTextColor="#FFF"
//             value={nom}
//             onChangeText={setNom}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#FFF"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />

//           <View style={styles.passwordWrap}>
//             <TextInput
//               style={styles.passwordInput}
//               placeholder="Mot de passe"
//               placeholderTextColor="#FFF"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword((prev) => !prev)}
//               style={styles.eyeBtn}
//               activeOpacity={0.7}
//             >
//               <Ionicons
//                 name={showPassword ? "eye-off-outline" : "eye-outline"}
//                 size={22}
//                 color="#FFF"
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
//             onPress={handleSignup}
//             disabled={loading}
//           >
//             {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>S'inscrire</Text>}
//           </TouchableOpacity>

//           {status.message ? (
//             <Text
//               style={[
//                 styles.statusText,
//                 status.type === "success" ? styles.statusSuccess : styles.statusError,
//               ]}
//             >
//               {status.message}
//             </Text>
//           ) : null}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FEBD00" },
//   topBg: { flex: 4, zIndex: 0 },
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
//     zIndex: 2,
//     elevation: 2,
//   },
//   back: { color: "black", marginBottom: 12 },
//   title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },
//   formBlock: { alignItems: "center", marginTop: 20, gap: 28 },

//   input: {
//     width: "100%",
//     backgroundColor: "#D9D9D9",
//     borderRadius: 24,
//     paddingVertical: 19,
//     paddingHorizontal: 28,
//     color: "#FFF",
//   },

//   passwordWrap: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#D9D9D9",
//     borderRadius: 24,
//     paddingRight: 14,
//   },
//   passwordInput: {
//     flex: 1,
//     paddingVertical: 19,
//     paddingHorizontal: 28,
//     color: "#FFF",
//   },
//   eyeBtn: {
//     padding: 4,
//   },

//   primaryButton: {
//     marginTop: 20,
//     backgroundColor: "#F4B000",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 24,
//     minWidth: 160,
//     alignItems: "center",
//   },
//   primaryButtonDisabled: { opacity: 0.7 },
//   primaryButtonText: { color: "#FFF", fontWeight: "600" },
//   statusText: { marginTop: 12, textAlign: "center", fontWeight: "600" },
//   statusSuccess: { color: "#1f9d55" },
//   statusError: { color: "#c53030" },
// });
