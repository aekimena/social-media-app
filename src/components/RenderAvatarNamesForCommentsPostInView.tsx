import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";

const RenderAvatarNamesForCommentsPostInView = ({
  details,
  user,
  pressFunc,
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Pressable style={styles.postAvatarImgRing} onPress={pressFunc}>
        {details.owner.avatarUrl == ("" || null) ? (
          <Image
            source={require("../../assets/images/placeholder-img.jpg")}
            style={styles.postAvatar}
          />
        ) : details.owner._id == user._id ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.postAvatar} />
        ) : (
          <Image
            source={{ uri: details.owner.avatarUrl }}
            style={styles.postAvatar}
          />
        )}
      </Pressable>
      <View>
        <Text style={styles.postName}>{details.owner?.name}</Text>
        <Text style={{ fontSize: texts.sm, color: colors.iconColor }}>
          @{details.owner?.username}
        </Text>
      </View>
    </View>
  );
};

export default RenderAvatarNamesForCommentsPostInView;

const styles = StyleSheet.create({
  postAvatarImgRing: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  postAvatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    resizeMode: "cover",
  },
  postName: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "600",
  },
});
