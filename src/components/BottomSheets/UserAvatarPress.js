import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { AppContext } from "../../contexts/appContext";
import { colors } from "../../utils/colors";
import { texts } from "../../utils/texts";

const UserAvatarPress = () => {
  const { BSRefForAvatarImg } = useContext(AppContext);
  return (
    <RBSheet
      ref={BSRefForAvatarImg}
      height={150}
      closeOnDragDown={true}
      closeOnPressMask={false}
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
          <Text style={styles.text}>View Profile Image</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Edit Profile Image</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
            styles.textCont,
          ]}
        >
          <Text style={styles.text}>Change Profile Image</Text>
        </Pressable>
      </View>
    </RBSheet>
  );
};

export default UserAvatarPress;

const styles = StyleSheet.create({
  textCont: {
    paddingVertical: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: colors.textColor,
    fontSize: texts.sm,
  },
});
