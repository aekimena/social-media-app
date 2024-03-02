import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OtherUserPage from "../screens/OtherUserPage";

export const OtherUserRoute = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "card" }}
    >
      <Stack.Screen name="OtherUserPage" component={OtherUserPage} />
    </Stack.Navigator>
  );
};

// export default OtherUserRoute;

const styles = StyleSheet.create({});
