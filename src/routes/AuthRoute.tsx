import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/authScreens/Login";
import Username from "../screens/authScreens/Username";
import SignUp from "../screens/authScreens/SignUp";

const Stack = createNativeStackNavigator();
export const AuthRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "card" }}
    >
      <Stack.Screen component={Login} name="Login" />
      <Stack.Screen component={Username} name="Username" />
      <Stack.Screen component={SignUp} name="SignUp" />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
