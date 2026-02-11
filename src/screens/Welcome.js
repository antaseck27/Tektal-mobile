
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/tektal.jpeg")}
        style={styles.bg}
      >
       <LinearGradient
  colors={["#dba719ff", "#C99500", "#D9D9D9"]}
  locations={[0, 0.55, 1]}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={styles.overlay}
/>


        <View style={styles.content}>
          <Text style={styles.logo}>TEKTAL</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home1")}
          >
            <Text style={styles.buttonText}>Suivant</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  bg: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },

  content: { alignItems: "center" },

  logo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginBottom: 18,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  buttonText: { color: "#1E3A8A", fontSize: 16, fontWeight: "600" },
  arrow: { color: "#1E3A8A", fontSize: 18, fontWeight: "700" },
});


// // / import React from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ImageBackground,
// // } from "react-native";

// // const BG_URI =
// //   "https://i.pinimg.com/1200x/53/8f/29/538f290ca82585e94f0f7cbaab199e6e.jpg";

// // export default function Welcome({ navigation }) {
// //   return (
// //     <View style={styles.container}>
// //       <ImageBackground source={{ uri: BG_URI }} style={styles.bg}>
// //         <View style={styles.overlay} />

// //         <View style={styles.content}>
// //           <Text style={styles.logo}>TEKTAL</Text>

// //           <TouchableOpacity
// //             style={styles.button}
// //             onPress={() => navigation.navigate("Home1")}
// //           >
// //             <Text style={styles.buttonText}>Suivant</Text>
// //             <Text style={styles.arrow}>→</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ImageBackground>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#FFFFFF" },

// //   bg: { flex: 1, justifyContent: "center", alignItems: "center" },

// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: "rgba(214, 162, 12, 0.65)", // jaune transparent
// //   },

// //   content: { alignItems: "center" },

// //   logo: {
// //     fontSize: 34,
// //     fontWeight: "700",
// //     color: "#FFFFFF",
// //     letterSpacing: 1,
// //     marginBottom: 18,
// //   },

// //   button: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFFFFF",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 24,
// //     gap: 8,
// //   },
// //   buttonText: { color: "#1E3A8A", fontSize: 16, fontWeight: "600" },
// //   arrow: { color: "#1E3A8A", fontSize: 18, fontWeight: "700" },
// // });



// // relierrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function Welcome({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require("../../assets/tektal.jpeg")}
//         style={styles.bg}
//       >
//        <LinearGradient
//   colors={["#dba719ff", "#C99500", "#D9D9D9"]}
//   locations={[0, 0.55, 1]}
//   start={{ x: 0.5, y: 0 }}
//   end={{ x: 0.5, y: 1 }}
//   style={styles.overlay}
// />


//         <View style={styles.content}>
//           <Text style={styles.logo}>TEKTAL</Text>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => navigation.navigate("Home1")}
//           >
//             <Text style={styles.buttonText}>Suivant</Text>
//             <Text style={styles.arrow}>→</Text>
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },

//   bg: { flex: 1, justifyContent: "center", alignItems: "center" },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     opacity: 0.7,
//   },

//   content: { alignItems: "center" },

//   logo: {
//     fontSize: 34,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 1,
//     marginBottom: 18,
//   },

//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 24,
//     gap: 8,
//   },
//   buttonText: { color: "#1E3A8A", fontSize: 16, fontWeight: "600" },
//   arrow: { color: "#1E3A8A", fontSize: 18, fontWeight: "700" },
// });
