import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

const RenderUserPageHeaders = ({ func }) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.headers}>
      <Pressable onPress={() => navigation.goBack()}>
        <IonIcon name="arrow-back-outline" size={20} color={colors.iconColor} />
      </Pressable>
      <View style={[{ gap: 20, flexDirection: "row", alignItems: "center" }]}>
        <Pressable>
          <IonIcon name="search-outline" size={20} color={colors.iconColor} />
        </Pressable>
        <Pressable onPress={func}>
          <IonIcon name="menu-outline" size={25} color={colors.iconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default RenderUserPageHeaders;

const styles = StyleSheet.create({
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: 10,
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#777",
  },
});
