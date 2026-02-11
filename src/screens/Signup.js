
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
//   container: { flex: 1, backgroundColor: "#f0e322ff" },

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
//     backgroundColor: "#f0e322ff",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 24,
//   },
//   primaryButtonText: { color: "#FFF", fontWeight: "600" },
// });

// // relierrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr

// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ImageBackground,
// //   TextInput,
// //   ActivityIndicator,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// // } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { register } from "../services/api";

// // export default function Signup({ navigation }) {
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //     re_password: "",
// //   });
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (name, value) => {
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleSignup = async () => {
// //     // Validation
// //     if (
// //       !formData.username ||
// //       !formData.email ||
// //       !formData.password ||
// //       !formData.re_password
// //     ) {
// //       Alert.alert("Erreur", "Veuillez remplir tous les champs");
// //       return;
// //     }

// //     if (formData.password !== formData.re_password) {
// //       Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
// //       return;
// //     }

// //     if (formData.password.length < 8) {
// //       Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères");
// //       return;
// //     }

// //     setLoading(true);

// //     // Appel à l'API
// //     const result = await register(formData);

// //     setLoading(false);

// //     if (result.success) {
// //       Alert.alert(
// //         "Inscription réussie ! 🎉",
// //         "Un email d'activation a été envoyé à votre adresse email.",
// //         [
// //           {
// //             text: "OK",
// //             onPress: () => navigation.navigate("Login"),
// //           },
// //         ]
// //       );
// //     } else {
// //       let errorMessage = "Une erreur est survenue";

// //       if (result.error.email) {
// //         errorMessage = result.error.email[0];
// //       } else if (result.error.username) {
// //         errorMessage = result.error.username[0];
// //       } else if (result.error.password) {
// //         errorMessage = result.error.password[0];
// //       }

// //       Alert.alert("Erreur d'inscription", errorMessage);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === "ios" ? "padding" : "height"}
// //     >
// //       <View style={styles.topBg}>
// //         <ImageBackground
// //           source={require("../../assets/img2.jpeg")}
// //           style={styles.bgImage}
// //         >
// //           <LinearGradient
// //             colors={["#D9A600", "#D9A600", "#D9D9D9"]}
// //             locations={[0, 0.55, 1]}
// //             start={{ x: 0.5, y: 0 }}
// //             end={{ x: 0.5, y: 1 }}
// //             style={styles.gradient}
// //           />
// //         </ImageBackground>
// //       </View>

// //       <View style={styles.card}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Text style={styles.back}>← Retour</Text>
// //         </TouchableOpacity>

// //         <Text style={styles.title}>Inscription</Text>

// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.formBlock}
// //         >
// //           {/* Input Nom */}
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Nom d'utilisateur"
// //             placeholderTextColor="#999"
// //             value={formData.username}
// //             onChangeText={(value) => handleChange("username", value)}
// //             autoCapitalize="none"
// //             editable={!loading}
// //           />

// //           {/* Input Email */}
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Email"
// //             placeholderTextColor="#999"
// //             value={formData.email}
// //             onChangeText={(value) => handleChange("email", value)}
// //             keyboardType="email-address"
// //             autoCapitalize="none"
// //             editable={!loading}
// //           />

// //           {/* Input Mot de passe */}
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Mot de passe (min. 8 caractères)"
// //             placeholderTextColor="#999"
// //             value={formData.password}
// //             onChangeText={(value) => handleChange("password", value)}
// //             secureTextEntry
// //             editable={!loading}
// //           />

// //           {/* Input Confirmer mot de passe */}
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Confirmer mot de passe"
// //             placeholderTextColor="#999"
// //             value={formData.re_password}
// //             onChangeText={(value) => handleChange("re_password", value)}
// //             secureTextEntry
// //             editable={!loading}
// //           />

// //           {/* Bouton Inscription */}
// //           <TouchableOpacity
// //             style={[styles.primaryButton, loading && styles.buttonDisabled]}
// //             onPress={handleSignup}
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#FFF" />
// //             ) : (
// //               <Text style={styles.primaryButtonText}>S'inscrire</Text>
// //             )}
// //           </TouchableOpacity>

// //           {/* Lien connexion */}
// //           <View style={styles.row}>
// //             <Text style={styles.text}>Déjà un compte ? </Text>
// //             <TouchableOpacity
// //               onPress={() => navigation.navigate("Login")}
// //               disabled={loading}
// //             >
// //               <Text style={styles.link}>Se connecter</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </ScrollView>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#FEBD00" },

// //   topBg: { flex: 3 },
// //   bgImage: { flex: 1 },
// //   gradient: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },

// //   card: {
// //     flex: 7,
// //     backgroundColor: "#FFF",
// //     borderTopLeftRadius: 40,
// //     borderTopRightRadius: 40,
// //     paddingTop: 22,
// //     paddingHorizontal: 28,
// //     paddingBottom: 16,
// //     marginTop: -55,
// //   },

// //   back: { color: "black", marginBottom: 12 },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //     textAlign: "center",
// //     marginBottom: 16,
// //   },

// //   formBlock: { alignItems: "center", marginTop: 20, gap: 18, paddingBottom: 40 },

// //   input: {
// //     width: "100%",
// //     backgroundColor: "#F5F5F5",
// //     borderRadius: 24,
// //     paddingVertical: 14,
// //     paddingHorizontal: 18,
// //     fontSize: 16,
// //     color: "#333",
// //     borderWidth: 1,
// //     borderColor: "#E0E0E0",
// //   },

// //   primaryButton: {
// //     marginTop: 20,
// //     backgroundColor: "#FEBD00",
// //     paddingVertical: 14,
// //     paddingHorizontal: 32,
// //     borderRadius: 24,
// //     minWidth: 150,
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   primaryButtonText: { color: "#FFF", fontWeight: "600", textAlign: "center" },

// //   row: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
// //   text: { color: "#666", fontSize: 14 },
// //   link: { color: "#FEBD00", fontWeight: "700", fontSize: 14 },
// // });
