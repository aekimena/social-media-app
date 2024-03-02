import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { Image } from "expo-image";
import IonIcons from "@expo/vector-icons/Ionicons";
import { texts } from "../utils/texts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { gql, useMutation } from "@apollo/client";
import { useDebounce } from "use-debounce";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { updateUserDetails } from "../redux/features/userDetails";
import { CHECK_USERNAME, UPDATE_PROFILE } from "../utils/gqlSchemas";

const EditProfile = () => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [value] = useDebounce(username, 2000);
  const [bio, SetBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.website);
  const [imageUrl, setImageUrl] = useState(user.avatarUrl);
  const [image, setImage] = useState(null);
  const [checkUsername] = useMutation(CHECK_USERNAME);
  const [inputErr, setInputErr] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [updating, setUpdating] = useState(false);
  const btnDisabled =
    [username, name].includes("") || !usernameValid || updating;
  const dispatch = useDispatch();

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  async function updateUserProfile() {
    if (
      username == user.username &&
      name == user.name &&
      bio == user.bio &&
      website == user.website &&
      imageUrl == user.avatarUrl
    ) {
      navigation.goBack();
    } else {
      setUpdating(true);
      if (imageUrl == user.avatarUrl || imageUrl == "" || imageUrl == null) {
        updateProfile({
          variables: {
            id: user._id,
            name,
            username,
            bio,
            website,
            avatarUrl: imageUrl,
          },
        })
          .then((res) => {
            dispatch(updateUserDetails(res.data.updateProfile));
            navigation.goBack();
          })
          .catch((err) => {
            console.log("server error", err);
            setUpdating(false);
          });
      } else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

        const metadata = {
          contentType: image.mimeType,
          name: image.fileName,
          size: image.filesize,
        };
        await uploadBytes(
          ref(storage, "AvatarImages/" + filename),
          blob,
          metadata
        )
          .then((snapshot) => {
            getDownloadURL(ref(storage, "AvatarImages/" + filename))
              .then((downloadURL) => {
                updateProfile({
                  variables: {
                    id: user._id,
                    name,
                    username,
                    bio,
                    website,
                    avatarUrl: downloadURL,
                  },
                })
                  .then((res) => {
                    dispatch(updateUserDetails(res.data.updateProfile));
                    navigation.goBack();
                  })
                  .catch((err) => {
                    console.log("server error", err);
                    setUpdating(false);
                  });
              })
              .catch((err) => {
                console.log("upload uri error", err);
                setUpdating(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      setImage(result.assets[0]);
    }
  };

  function usernameCheck() {
    checkUsername({
      variables: { username },
    })
      .then((res) => {
        console.log(res.data.checkUsername);
        if (res.data.checkUsername && username !== user.username) {
          setUsernameValid(false);
          setInputErr("This username is taken");
        } else {
          setInputErr("This username is available");
          setUsernameValid(true);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
  useEffect(() => {
    username !== "" && usernameCheck();
  }, [value]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.backgroundColor}
        barStyle="dark-content"
      />
      <Pressable
        style={{ paddingVertical: 20 }}
        onPress={() => navigation.goBack()}
      >
        <IonIcons name="arrow-back" color={colors.iconColor} size={25} />
      </Pressable>
      <ScrollView>
        <Pressable onPress={pickImage} style={styles.avatarCont}>
          {imageUrl == null ? (
            <Image
              source={require("../../assets/images/placeholder-img.jpg")}
              contentFit="cover"
              style={styles.avatar}
            />
          ) : (
            <Image
              source={{ uri: imageUrl }}
              contentFit="cover"
              style={styles.avatar}
            />
          )}
          <View style={styles.cameraIconCont}>
            <IonIcons name="camera" color={"#fff"} size={25} />
          </View>
        </Pressable>
        <View style={{ gap: 15 }}>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ color: colors.iconColor }}>Name</Text>
              <IonIcons
                name="create-outline"
                color={colors.iconColor}
                size={16}
              />
            </View>
            <TextInput
              style={styles.textInput}
              defaultValue={name}
              onChangeText={(newTxt) => setName(newTxt)}
              placeholder="Name"
              placeholderTextColor={"#888"}
            />
          </View>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ color: colors.iconColor }}>Username</Text>
              <IonIcons
                name="create-outline"
                color={colors.iconColor}
                size={16}
              />
            </View>
            <TextInput
              style={styles.textInput}
              defaultValue={username}
              onChangeText={(newTxt) => setUsername(newTxt)}
              placeholder="Unique username"
              placeholderTextColor={"#888"}
            />
            {!usernameValid &&
              username !== "" &&
              username !== user.username && (
                <Text
                  style={{
                    fontSize: texts.xs,
                    color: usernameValid ? "green" : "red",
                  }}
                >
                  {inputErr}
                </Text>
              )}
          </View>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ color: colors.iconColor }}>Bio</Text>
              <IonIcons
                name="create-outline"
                color={colors.iconColor}
                size={16}
              />
            </View>
            <TextInput
              style={[
                styles.textInput,
                { minHeight: 45, height: "auto", paddingVertical: 5 },
              ]}
              defaultValue={bio}
              onChangeText={(newTxt) => SetBio(newTxt)}
              multiline
              maxLength={200}
              placeholder="Anything about you..."
              placeholderTextColor={"#888"}
            />
          </View>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ color: colors.iconColor }}>Website</Text>
              <IonIcons
                name="create-outline"
                color={colors.iconColor}
                size={16}
              />
            </View>
            <TextInput
              style={styles.textInput}
              defaultValue={website}
              onChangeText={(newTxt) => setWebsite(newTxt)}
              placeholder="https://www.example.com"
              placeholderTextColor={"#888"}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={btnDisabled}
          onPress={updateUserProfile}
          style={styles.btn}
        >
          {updating ? (
            <ActivityIndicator color={"#fff"} size={30} />
          ) : (
            <Text
              style={{ color: "#fff", fontSize: texts.md, fontWeight: "500" }}
            >
              Submit changes
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 15,
  },
  avatarCont: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#000",
    height: 110,
    width: 110,
    borderRadius: 110 / 2,
  },
  cameraIconCont: {
    position: "absolute",
    bottom: 0,
    width: 110,
    height: 110 / 2,
    borderBottomLeftRadius: 110 / 2,
    borderBottomRightRadius: 110 / 2,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  textInput: {
    height: 45,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    color: colors.textColor,
    fontSize: texts.sm,
    paddingHorizontal: 15,
  },
  btn: {
    backgroundColor: colors.themeColor,
    height: 50,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
});
