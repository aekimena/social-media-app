import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { texts } from "../utils/texts";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

const Images = () => {
  const navigation = useNavigation<any>();
  const postDetails = useSelector((state: any) => state.imagesInView.post);
  const startIndex = useSelector((state: any) => state.imagesInView.startIndex);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postLiked = postDetails.likes.find((obj: any) => obj._id == user._id);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<any>();

  useEffect(() => {
    const offset = startIndex * width;
    scrollRef.current.scrollTo({ x: offset, animated: false });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar backgroundColor={"#000"} barStyle={"light-content"} />
      <Pressable style={styles.headers} onPress={() => navigation.goBack()}>
        <IonIcons name="arrow-back" color={"#fff"} size={20} />
      </Pressable>
      <View style={styles.imagesView}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {postDetails.mediaUrls.map((item, index) => (
            <Image
              source={{ uri: item }}
              contentFit="contain"
              transition={1000}
              style={{ width, flex: 1 }}
              key={index}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.footers}>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons
            name={postLiked ? "heart" : "heart-outline"}
            color={postLiked ? "#FF6666" : "#fff"}
            size={20}
          />
          <Text style={{ fontSize: texts.xs, color: "#fff" }}>
            {postDetails.likes?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons name="chatbox-outline" color={"#fff"} size={20} />
          <Text style={{ fontSize: texts.xs, color: "#fff" }}>
            {postDetails.comments?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons name={"bookmark-outline"} color={"#fff"} size={20} />
          <Text style={{ fontSize: texts.xs, color: "#fff" }}>
            {postDetails.bookmarks?.length}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Images;

const styles = StyleSheet.create({
  headers: {
    height: 80,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
  },
  footers: {
    height: 80,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 40,
    alignItems: "center",
    backgroundColor: "#000",
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  imagesView: { flex: 1 },
});
