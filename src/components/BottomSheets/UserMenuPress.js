import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { AppContext } from "../../contexts/appContext";
import { colors } from "../../utils/colors";
import { texts } from "../../utils/texts";
import { useNavigation } from "@react-navigation/native";

const UserMenuPress = () => {
  const { BSRefForUserPageMenu } = useContext(AppContext);
  const navigation = useNavigation();
  return (
    <RBSheet
      ref={BSRefForUserPageMenu}
      height={200}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.2)",
        },
        draggableIcon: {
          backgroundColor: colors.iconColor,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: 5,
        }}
      >
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Settings</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            BSRefForUserPageMenu.current.close();
            navigation.navigate("EditProfile");
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Edit Profile</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Help center</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Log Out</Text>
        </Pressable>
      </View>
    </RBSheet>
  );
};

export default UserMenuPress;

const styles = StyleSheet.create({
  textCont: {
    paddingVertical: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: colors.textColor,
    fontSize: 16,
  },
});
