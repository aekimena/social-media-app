import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import IonIcons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";

const RenderTxtInputForFollowers = ({ input, setInput, placeholder }) => {
  return (
    <View
      style={{
        marginTop: 15,
        borderBottomWidth: 0.5,
        borderColor: colors.iconColor,
        paddingBottom: 10,
        paddingHorizontal: 15,
      }}
    >
      <View style={styles.txtInputCont}>
        <IonIcons name="search-outline" color={colors.iconColor} size={16} />
        <TextInput
          style={styles.txtInput}
          placeholder={placeholder}
          placeholderTextColor={colors.iconColor}
          defaultValue={input}
          onChangeText={(newTxt) => setInput(newTxt)}
        />
      </View>
    </View>
  );
};

export default RenderTxtInputForFollowers;

const styles = StyleSheet.create({
  txtInputCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f8f8",
    height: 50,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  txtInput: {
    flex: 1,
    height: "100%",
    width: "100%",
    color: colors.textColor,
    fontSize: texts.sm,
  },
});
