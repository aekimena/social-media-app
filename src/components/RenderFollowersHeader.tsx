import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";

const RenderFollowersHeader = ({ item }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}
    >
      {item.avatarUrl == null ? (
        <Image
          source={require("../../assets/images/placeholder-img.jpg")}
          style={styles.avatar}
        />
      ) : (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={{ fontSize: texts.sm, color: colors.iconColor }}>
          @{item.username}
        </Text>
      </View>
    </View>
  );
};

export default RenderFollowersHeader;

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
  },
  name: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "500",
  },
});
