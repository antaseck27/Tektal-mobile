// src/screens/Login.js
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
import { login } from "../services/authService";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleLogin = async () => {
    if (loading) return;
    if (!email || !password) {
      setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await login({ email, password });
      if (res.ok) {
        setStatus({ type: "success", message: "Vous êtes connecté." });
        setTimeout(() => navigation.navigate("Dashboard"), 800);
      } else {
        setStatus({ type: "error", message: res.data?.detail || JSON.stringify(res.data) });
      }
    } catch {
      setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ KeyboardAvoidingView pousse le contenu vers le haut quand le clavier s'ouvre
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Image de fond — hauteur fixe, pas flex */}
      <View style={styles.topBg}>
        <ImageBackground source={require("../../assets/img1.jpeg")} style={styles.bgImage}>
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

      {/* ✅ ScrollView sur la card — permet de scroller si clavier trop haut */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.formBlock}>
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
              onSubmitEditing={handleLogin}
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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.primaryButtonText}>Se connecter</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.text}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>S'inscrire</Text>
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

  // ✅ card devient ScrollView — flex:1 pour prendre le reste de l'écran
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
    marginBottom: 11,
    marginTop: 20,
    color: "black",
  },

  formBlock: { alignItems: "center", marginTop: 36, gap: 18 },

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
    backgroundColor: "#FEBD00",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

  link: { color: "#FEBD00", textAlign: "center", marginTop: 4, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  text: { color: "#666", fontSize: 14 },

  statusText: { marginTop: 8, textAlign: "center", fontWeight: "600" },
  statusSuccess: { color: "#1f9d55" },
  statusError: { color: "#c53030" },
});


// // Login.js
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
// import { login } from "../services/authService";

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ type: "", message: "" });

//   const handleLogin = async () => {
//     if (loading) return;
//     if (!email || !password) {
//       setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
//       return;
//     }

//     setLoading(true);
//     setStatus({ type: "", message: "" });

//     try {
//       const res = await login({ email, password });
//       if (res.ok) {
//         setStatus({ type: "success", message: "Vous êtes connecté." });
//         setTimeout(() => navigation.navigate("Dashboard"), 800);
//       } else {
//         setStatus({
//           type: "error",
//           message: res.data?.detail || JSON.stringify(res.data),
//         });
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
//         <ImageBackground source={require("../../assets/img1.jpeg")} style={styles.bgImage}>
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

//         <Text style={styles.title}>Connexion</Text>

//         <View style={styles.formBlock}>
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
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Se connecter</Text>}
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
//             <Text style={styles.link}>Mot de passe oublié ?</Text>
//           </TouchableOpacity>

//           <View style={styles.row}>
//             <Text style={styles.text}>Pas de compte ? </Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//               <Text style={styles.link}>S'inscrire</Text>
//             </TouchableOpacity>
//           </View>

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
//     paddingTop: 42,
//     paddingHorizontal: 28,
//     paddingBottom: 16,
//     marginTop: -55,
//     zIndex: 2,
//     elevation: 2,
//   },

//   back: { color: "black", marginBottom: 12 },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 11,
//     marginTop: 30,
//     color: "black",
//   },

//   formBlock: { alignItems: "center", marginTop: 46, gap: 18 },

//   input: {
//     width: "100%",
//     backgroundColor: "#D9D9D9",
//     borderRadius: 24,
//     paddingVertical: 19,
//     paddingHorizontal: 18,
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
//     paddingHorizontal: 18,
//     color: "#FFF",
//   },
//   eyeBtn: {
//     padding: 4,
//   },

//   primaryButton: {
//     marginTop: 6,
//     backgroundColor: "#FEBD00",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 24,
//     minWidth: 160,
//     alignItems: "center",
//   },
//   primaryButtonDisabled: { opacity: 0.7 },
//   primaryButtonText: { color: "#FFF", fontWeight: "600" },

//   link: { color: "#f0e322ff", textAlign: "center", marginTop: 17, fontWeight: "700" },
//   row: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
//   text: { color: "#111010ff", fontSize: 12, marginTop: 20 },

//   statusText: { marginTop: 12, textAlign: "center", fontWeight: "600" },
//   statusSuccess: { color: "#1f9d55" },
//   statusError: { color: "#c53030" },
// });
