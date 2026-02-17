// src/navigation/DashboardNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OngletsPrincipaux from './OngletsPrincipaux';
import VideoRecorderScreen from '../screens/TableauDeBord/VideoRecorderScreen';
import StepCreationScreen from '../screens/TableauDeBord/StepCreationScreen';
import PathConfirmationScreen from '../screens/TableauDeBord/PathConfirmationScreen';
import VideoPlayerScreen from '../screens/TableauDeBord/VideoPlayerScreen';

const Stack = createStackNavigator();

export default function DashboardNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={OngletsPrincipaux} />
      <Stack.Screen name="VideoRecorder" component={VideoRecorderScreen} />
      <Stack.Screen name="StepCreation" component={StepCreationScreen} />
      <Stack.Screen name="PathConfirmation" component={PathConfirmationScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
}