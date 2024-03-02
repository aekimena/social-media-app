import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import IonIcons from "react-native-vector-icons/Ionicons";

const RenderActionBtnsForCommentsPostInView = ({
  liked,
  item,
  unlikeFunc,
  likeFunc,
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
      <TouchableOpacity
        onPress={liked ? unlikeFunc : likeFunc}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
      >
        <IonIcons
          size={15}
          color={liked ? colors.likeColor : colors.iconColor}
          name={liked ? "heart" : "heart-outline"}
        />
        <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
          {item.likes?.length}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
      >
        <IonIcons size={15} color={colors.iconColor} name="chatbox-outline" />
        <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
          {item.childComments?.length}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderActionBtnsForCommentsPostInView;

const styles = StyleSheet.create({});
