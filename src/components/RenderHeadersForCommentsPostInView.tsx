import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import IonIcons from "react-native-vector-icons/Ionicons";

const RenderHeadersForCommentsPostInView = ({ text }) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.headers}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <IonIcons
            name="arrow-back-outline"
            size={20}
            color={colors.iconColor}
          />
        </Pressable>
        <Text
          style={{
            color: colors.textColor,
            fontSize: texts.md,
            fontWeight: "500",
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default RenderHeadersForCommentsPostInView;

const styles = StyleSheet.create({
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#777",
  },
});
