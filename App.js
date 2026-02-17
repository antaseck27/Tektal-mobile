
// // App.js
// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "./src/store";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { PathProvider } from "./src/context/PathContext";

// import Welcome from "./src/screens/Welcome";
// import Home1 from "./src/screens/Home1";
// import Login from "./src/screens/Login";
// import Signup from "./src/screens/Signup";
// import ForgotPassword from "./src/screens/ForgotPassword";
// import OngletsPrincipaux from "./src/navigation/OngletsPrincipaux";

// import Ajouter from "./src/screens/TableauDeBord/Ajouter";
// import VideoRecorderScreen from "./src/screens/TableauDeBord/VideoRecorderScreen";
// import VideoPlayerScreen from "./src/screens/TableauDeBord/VideoPlayerScreen";
// import MesChemins from "./src/screens/TableauDeBord/MesChemins";
// import Parametres from "./src/screens/TableauDeBord/Parametres";
// import Aide from "./src/screens/TableauDeBord/Aide";
// import EditProfil from "./src/screens/TableauDeBord/EditProfil";
// import DashboardNavigator from "./src/navigation/DashboardNavigator";

// const Stack = createNativeStackNavigator();

// const linking = {
//   prefixes: ["tektal://"],
//   config: {
//     screens: {
//       Welcome: "welcome",
//       Home1: "home1",
//       Login: "login",
//       Signup: "signup",
//       ForgotPassword: "forgot-password",
//       Dashboard: "dashboard",
//       Ajouter: "ajouter",
//       MesChemins: "mes-chemins",
//       Parametres: "parametres",
//       Aide: "aide",
//       EditProfil: "edit-profil",
//       VideoRecorder: "video-recorder",
//       VideoPlayer: "video-player",
//     },
//   },
// };

// export default function App() {
//   return (
//     <Provider store={store}>
//       <PathProvider>
//         <NavigationContainer linking={linking}>
//           <Stack.Navigator initialRouteName="Welcome">
//             <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
//             <Stack.Screen name="Home1" component={Home1} options={{ headerShown: false }} />
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
//             <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
//             <Stack.Screen name="Dashboard" component={OngletsPrincipaux} options={{ headerShown: false }} />

//             <Stack.Screen name="Ajouter" component={Ajouter} options={{ headerShown: false }} />
//             <Stack.Screen name="MesChemins" component={MesChemins} options={{ headerShown: false }} />
//             <Stack.Screen name="Parametres" component={Parametres} options={{ headerShown: false }} />
//             <Stack.Screen name="Aide" component={Aide} options={{ headerShown: false }} />
//             <Stack.Screen name="EditProfil" component={EditProfil} options={{ headerShown: false }} />

//             <Stack.Screen
//               name="VideoRecorder"
//               component={VideoRecorderScreen}
//               options={{ headerShown: false, presentation: "fullScreenModal" }}
//             />
//             <Stack.Screen
//               name="VideoPlayer"
//               component={VideoPlayerScreen}
//               options={{ headerShown: false, presentation: "fullScreenModal", animation: "fade" }}
//             />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </PathProvider>
//     </Provider>

   
//   );
// }



// App.js
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PathProvider } from "./src/context/PathContext";

import Welcome from "./src/screens/Welcome";
import Home1 from "./src/screens/Home1";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import ForgotPassword from "./src/screens/ForgotPassword";
import DashboardNavigator from "./src/navigation/DashboardNavigator";

import Ajouter from "./src/screens/TableauDeBord/Ajouter";
import VideoRecorderScreen from "./src/screens/TableauDeBord/VideoRecorderScreen";
import VideoPlayerScreen from "./src/screens/TableauDeBord/VideoPlayerScreen";
import MesChemins from "./src/screens/TableauDeBord/MesChemins";
import Parametres from "./src/screens/TableauDeBord/Parametres";
import Aide from "./src/screens/TableauDeBord/Aide";
import EditProfil from "./src/screens/TableauDeBord/EditProfil";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["tektal://"],
  config: {
    screens: {
      Welcome: "welcome",
      Home1: "home1",
      Login: "login",
      Signup: "signup",
      ForgotPassword: "forgot-password",
      Dashboard: "dashboard",
      Ajouter: "ajouter",
      MesChemins: "mes-chemins",
      Parametres: "parametres",
      Aide: "aide",
      EditProfil: "edit-profil",
      VideoRecorder: "video-recorder",
      VideoPlayer: "video-player",
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PathProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Home1" component={Home1} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Dashboard" component={DashboardNavigator} />

            <Stack.Screen name="Ajouter" component={Ajouter} />
            <Stack.Screen name="MesChemins" component={MesChemins} />
            <Stack.Screen name="Parametres" component={Parametres} />
            <Stack.Screen name="Aide" component={Aide} />
            <Stack.Screen name="EditProfil" component={EditProfil} />

            <Stack.Screen
              name="VideoRecorder"
              component={VideoRecorderScreen}
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
              name="VideoPlayer"
              component={VideoPlayerScreen}
              options={{ presentation: "fullScreenModal", animation: "fade" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PathProvider>
    </Provider>
  );
}
