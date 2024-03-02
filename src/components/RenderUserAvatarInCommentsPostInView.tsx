import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const RenderUserAvatarInCommentsPostInView = ({ item, user }) => {
  return (
    <View>
      {item.owner.avatarUrl == ("" || null) ? (
        <Image
          source={require("../../assets/images/placeholder-img.jpg")}
          style={styles.postAvatar}
        />
      ) : item.owner._id == user._id ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.postAvatar} />
      ) : (
        <Image
          source={{ uri: item.owner.avatarUrl }}
          style={styles.postAvatar}
        />
      )}
    </View>
  );
};

export default RenderUserAvatarInCommentsPostInView;

const styles = StyleSheet.create({
  postAvatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    resizeMode: "cover",
  },
});
