import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";

const RenderUserPostsFollowersFollowing = ({
  posts,
  seeFollowers,
  seeFollowing,
  user,
}) => {
  return (
    <View style={styles.numbersCont}>
      <View style={styles.length_lengthName}>
        <Text style={styles.length}>{posts?.length}</Text>
        <Text style={styles.lengthName}>Posts</Text>
      </View>
      <Pressable style={styles.length_lengthName} onPress={seeFollowers}>
        <Text style={styles.length}>{user?.followers.length}</Text>
        <Text style={styles.lengthName}>Followers</Text>
      </Pressable>
      <Pressable style={styles.length_lengthName} onPress={seeFollowing}>
        <Text style={styles.length}>{user?.following?.length}</Text>
        <Text style={styles.lengthName}>Following</Text>
      </Pressable>
    </View>
  );
};

export default RenderUserPostsFollowersFollowing;

const styles = StyleSheet.create({
  numbersCont: { flexDirection: "row", alignItems: "center", gap: 20 },
  length_lengthName: { alignItems: "center", gap: 3 },
  length: { fontWeight: "500", color: colors.text },
  lengthName: { fontSize: texts.sm, color: colors.iconColor },
  headerName: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "500",
  },
});
