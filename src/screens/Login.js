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
// import { login } from "../services/authService";

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
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
//         <ImageBackground
//           source={require("../../assets/img1.jpeg")}
//           style={styles.bgImage}
//         >
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

//           <TextInput
//             style={styles.input}
//             placeholder="Mot de passe"
//             placeholderTextColor="#FFF"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <TouchableOpacity
//             style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#FFF" />
//             ) : (
//               <Text style={styles.primaryButtonText}>Se connecter</Text>
//             )}
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


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { login, getProfile, logout } from "../services/authService";
import { setAuth } from "../store/authSlice";

export default function Login({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      if (!res.ok) {
        setStatus({
          type: "error",
          message: res.data?.detail || JSON.stringify(res.data),
        });
        return;
      }

      const me = await getProfile();
      if (!me.ok) {
        await logout();
        setStatus({ type: "error", message: "Impossible de charger votre profil." });
        return;
      }

      const role = me.data?.role;
      if (role && role !== "participant") {
        await logout();
        setStatus({
          type: "error",
          message: "Accès refusé: réservé aux participants.",
        });
        return;
      }

      dispatch(setAuth(me.data));
      setStatus({ type: "success", message: "Vous êtes connecté." });
      setTimeout(() => navigation.replace("Dashboard"), 600);
    } catch (e) {
      setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBg}>
        <ImageBackground
          source={require("../../assets/img1.jpeg")}
          style={styles.bgImage}
        >
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

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.formBlock}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#FFF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            )}
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
            <Text
              style={[
                styles.statusText,
                status.type === "success" ? styles.statusSuccess : styles.statusError,
              ]}
            >
              {status.message}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEBD00" },

  topBg: { flex: 4, zIndex: 0 },
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
    zIndex: 2,
    elevation: 2,
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

  input: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    paddingVertical: 19,
    paddingHorizontal: 18,
    color: "#FFF",
  },

  primaryButton: {
    marginTop: 6,
    backgroundColor: "#FEBD00",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    minWidth: 160,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },

  link: { color: "#f0e322ff", textAlign: "center", marginTop: 17, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  text: { color: "#111010ff", fontSize: 12, marginTop: 20 },

  statusText: { marginTop: 12, textAlign: "center", fontWeight: "600" },
  statusSuccess: { color: "#1f9d55" },
  statusError: { color: "#c53030" },
});
