import { Image } from "expo-image";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import { useSelector } from "react-redux";

const dummyStatus = [
  {
    id: 1,
    user: "Barry jhayyyyyyyyyyyy",
    avatar: require("../../assets/images/placeholder-img.jpg"),
  },
];

const StatusHeader = () => {
  const user = useSelector((state: any) => state.userDetails.user[0]);
  return (
    <Pressable style={{ width: 65, alignItems: "center" }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 65,
        }}
      >
        {user.avatarUrl == "" || user.avatarUrl == null ? (
          <Image
            source={require("../../assets/images/placeholder-img.jpg")}
            style={styles.userAvatar}
          />
        ) : (
          <Image source={{ uri: user.avatarUrl }} style={styles.userAvatar} />
        )}
        <View style={{ position: "absolute", zIndex: 2 }}>
          <IonIcons name="add" size={30} color={"#fff"} />
        </View>
        <View style={styles.layer}></View>
      </View>

      <Text
        numberOfLines={1}
        style={{ color: colors.textColor, fontSize: texts.xs }}
      >
        {user.username}
      </Text>
    </Pressable>
  );
};

const StatusList = ({ item }) => (
  <Pressable style={{ width: 60, alignItems: "center" }}>
    <View style={styles.imageCont}>
      <Image source={item.avatar} style={styles.statusAvatar} />
    </View>

    <Text
      numberOfLines={1}
      style={{ color: colors.textColor, fontSize: texts.xs }}
    >
      {item.user}
    </Text>
  </Pressable>
);

const Status = () => (
  <FlatList
    data={dummyStatus}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item: any) => item.id}
    renderItem={(item) => <StatusList {...item} />}
    ListHeaderComponent={<StatusHeader />}
    contentContainerStyle={styles.flatlistContentStyle}
    style={{
      paddingBottom: 10,
      maxHeight: 100, // without this, the flatlist takes the available height
    }}
  />
);

export default Status;

const styles = StyleSheet.create({
  statusAvatar: {
    height: 60,
    width: "100%",
    borderRadius: 30,
    resizeMode: "cover",
  },
  userAvatar: {
    height: 65,
    width: 65,
    borderRadius: 65 / 2,
  },
  layer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 65 / 2,
  },
  imageCont: {
    height: 65,
    width: 65,
    borderRadius: 65 / 2,
    borderColor: colors.themeColor,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  flatlistContentStyle: {
    gap: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    height: "auto",
  },
});
