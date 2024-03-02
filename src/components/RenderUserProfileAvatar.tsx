import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const RenderUserProfileAvatar = ({ user }) => {
  return user?.avatarUrl == ("" || null) ? (
    <Image
      source={require("../../assets/images/placeholder-img.jpg")}
      contentFit="cover"
      style={styles.headerImage}
    />
  ) : (
    <Image
      source={{ uri: user?.avatarUrl }}
      contentFit="cover"
      style={styles.headerImage}
    />
  );
};

export default RenderUserProfileAvatar;

const styles = StyleSheet.create({
  headerImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
});
