


// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import Welcome from "./src/screens/Welcome";
// import Home1 from "./src/screens/Home1";
// import Login from "./src/screens/Login";
// import Signup from "./src/screens/Signup";
// import ForgotPassword from "./src/screens/ForgotPassword";
// import Dashboard from "./src/screens/Dashboard";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Welcome">
//         <Stack.Screen
//           name="Welcome"
//           component={Welcome}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Home1"
//           component={Home1}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={Signup}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ForgotPassword"
//           component={ForgotPassword}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Dashboard"
//           component={Dashboard}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PathProvider } from "./src/context/PathContext";

import Welcome from "./src/screens/Welcome";
import Home1 from "./src/screens/Home1";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import ForgotPassword from "./src/screens/ForgotPassword";
import OngletsPrincipaux from "./src/navigation/OngletsPrincipaux";
import VideoRecorderScreen from "./src/screens/TableauDeBord/VideoRecorderScreen";
import VideoPlayerScreen from "./src/screens/TableauDeBord/VideoPlayerScreen"; // ✅ AJOUT

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PathProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home1"
            component={Home1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={OngletsPrincipaux}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VideoRecorder"
            component={VideoRecorderScreen}
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal'
            }}
          />

          {/* ✅ ROUTE LECTEUR VIDÉO */}
          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerScreen}
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'fade'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PathProvider>
  );
}
