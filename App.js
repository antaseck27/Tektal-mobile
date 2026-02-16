// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PathProvider } from "./src/context/PathContext";

import Welcome from "./src/screens/Welcome";
import Home1 from "./src/screens/Home1";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import ForgotPassword from "./src/screens/ForgotPassword";
import DashboardNavigator from "./src/navigation/DashboardNavigator";

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
    },
  },
};

export default function App() {
  return (
    <PathProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home1" component={Home1} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PathProvider>
  );
}