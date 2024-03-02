import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { colors } from "../utils/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../contexts/appContext";
import { useDispatch, useSelector } from "react-redux";
import { addUploadingPosts } from "../redux/features/feeds";
import {
  addPickedImage,
  delAPickedImage,
  delAUrl,
} from "../redux/features/uploadMediaSlice";
import { texts } from "../utils/texts";

const NewPost = () => {
  const [postTxt, setPostTxt] = useState("");
  const navigation = useNavigation<any>();
  const pickedImages = useSelector(
    (state: any) => state.mediaSlice.pickedImages
  );
  const { uploadTextPost, handleMediaUpload } = useContext(AppContext);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const dispatch = useDispatch();
  const imageUrls = useSelector((state: any) => state.mediaSlice.imageUrls);
  const textMode = pickedImages.length == 0;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result.assets);

    if (!result.canceled) {
      dispatch(addPickedImage(result.assets));
      console.log(pickedImages.length);
    }
  };

  // text post upload
  function handlePostUpload() {
    const standBy = {
      text: postTxt,
      userId: user._id,
      status: "pending",
      fakeId: Date.now(),
    };
    dispatch(addUploadingPosts(standBy));
    uploadTextPost(postTxt, user._id, standBy);
    navigation.navigate("Home");
  }

  // media post upload
  function handlePostUploadFromHere() {
    const standBy = {
      text: postTxt,
      userId: user._id,
      mediaUrls: imageUrls,
      postType: "media",
      status: "pending",
      fakeId: Date.now(),
    };
    handleMediaUpload(standBy); // a function in context api should begin the media upload process
    navigation.navigate("Home", { standBy, postTxt: postTxt }); // navigate back to home, where this params will be needed.
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headers}>
        <Pressable onPress={() => navigation.goBack()}>
          <IonIcons name="close-outline" size={25} colors={colors.iconColor} />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
          <Pressable onPress={pickImage}>
            <IonIcons
              name="images-outline"
              color={colors.iconColor}
              size={25}
            />
          </Pressable>

          <TouchableOpacity
            style={styles.postBtn}
            activeOpacity={0.8}
            onPress={textMode ? handlePostUpload : handlePostUploadFromHere}
            disabled={textMode && postTxt == ""}
          >
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#fff" }}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {textMode ? (
        <View style={styles.avatarTextinputCont}>
          <Image
            source={
              user.avatarUrl == ("" || null)
                ? require("../../assets/images/placeholder-img.jpg")
                : { uri: user.avatarUrl }
            }
            style={{ height: 30, width: 30, borderRadius: 15 }}
          />
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.textinput}
              placeholder="Write something..."
              placeholderTextColor={colors.iconColor}
              multiline
              defaultValue={postTxt}
              onChangeText={(newTxt) => setPostTxt(newTxt)}
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 15 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Image
              source={
                user.avatarUrl == ("" || null)
                  ? require("../../assets/images/placeholder-img.jpg")
                  : { uri: user.avatarUrl }
              }
              style={{ height: 30, width: 30, borderRadius: 15 }}
            />

            <View style={{ flex: 1, height: "100%", gap: 10 }}>
              <TextInput
                style={[styles.textinput, { height: "auto" }]}
                placeholder="Add a caption..."
                placeholderTextColor={colors.iconColor}
                multiline
                defaultValue={postTxt}
                onChangeText={(newTxt) => setPostTxt(newTxt)}
              />

              <ScrollView
                style={{ height: "100%" }}
                contentContainerStyle={{
                  gap: 10,
                  paddingTop: 10,
                  paddingBottom: 50,
                }}
              >
                {pickedImages.map((item, index) => (
                  <View style={{ width: "100%" }} key={index}>
                    <Image
                      source={{ uri: item.uri }}
                      contentFit="cover"
                      style={[styles.image, { backgroundColor: "#f8f8f8" }]}
                    />
                    <Pressable
                      style={[styles.absPressable, { top: 10 }]}
                      onPress={() => {
                        dispatch(delAUrl(item.url));
                        dispatch(delAPickedImage(item));
                      }}
                    >
                      <IonIcons name="close-outline" color="#fff" size={20} />
                    </Pressable>
                    <View style={styles.bottomIcons}>
                      <View style={styles.bottomIcon}>
                        <IonIcons
                          name="create-outline"
                          color="#fff"
                          size={15}
                        />
                      </View>
                      <View style={styles.bottomIcon}>
                        <IonIcons
                          name="person-outline"
                          color="#fff"
                          size={15}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.iconColor,
  },
  postBtn: {
    backgroundColor: colors.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  avatarTextinputCont: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },
  textinput: {
    height: "100%",
    width: "100%",
    color: colors.textColor,
    fontSize: 17,
    textAlignVertical: "top",
    marginTop: 3,
  },
  absPressable: {
    position: "absolute",
    right: 15,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomIcons: {
    position: "absolute",
    bottom: 10,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  bottomIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
  },
});
