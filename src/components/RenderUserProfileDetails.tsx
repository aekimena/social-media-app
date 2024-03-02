import { Linking, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import IonIcon from "react-native-vector-icons/Ionicons";

const RenderUserProfileDetails = ({ user }) => {
  return (
    <>
      <View>
        <Text style={styles.headerName}>{user?.name}</Text>
        <Text style={{ fontSize: texts.sm, color: colors.iconColor }}>
          @{user?.username}
        </Text>
      </View>
      <View style={{ gap: 3 }}>
        {user?.bio !== "" && user?.bio !== null && (
          <Text style={{ color: colors.postTextColor, fontSize: 14 }}>
            {user?.bio}
          </Text>
        )}
        {user?.website !== "" && user?.website !== null && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <IonIcon name="link-outline" size={20} color={colors.textColor} />
            <Text
              onPress={() => Linking.openURL(user?.website)}
              style={styles.link}
            >
              {user?.website}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default RenderUserProfileDetails;

const styles = StyleSheet.create({
  headerName: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "500",
  },
  username: {
    color: colors.iconColor,
    fontSize: texts.sm,
  },
  link: {
    color: colors.textColor,
    fontWeight: "500",
    fontSize: texts.sm,
  },
});
