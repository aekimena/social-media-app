import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import IonIcons from "react-native-vector-icons/Ionicons";
import { texts } from "../utils/texts";
import { useDispatch } from "react-redux";
import {
  updateImagesInView,
  updateStartIndex,
} from "../redux/features/imagesInView";
import { useNavigation } from "@react-navigation/native";

const MediaPostType = ({ item }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  function handleImgPress(startIndex) {
    dispatch(updateStartIndex(startIndex)); // update the index to start with when user presses image
    dispatch(updateImagesInView(item)); // update the image urls array in state

    navigation.navigate("Images");
  }
  return (
    <View style={styles.container}>
      {item.mediaUrls.length == 1 && (
        <View style={styles.media1Cont}>
          <Pressable onPress={() => handleImgPress(0)}>
            <Image
              style={styles.mediaImg}
              source={{ uri: item.mediaUrls[0] }}
              contentFit="cover"
              transition={1000}
            />
          </Pressable>
        </View>
      )}
      {item.mediaUrls.length == 2 && (
        <View
          style={[styles.postImg2Cont, { height: width / 2, width: "100%" }]}
        >
          {item.mediaUrls.map((url, index) => (
            <View style={{ flex: 1 }} key={index}>
              <Pressable
                onPress={() => handleImgPress(index)}
                style={styles.twoImagesCont}
              >
                <Image
                  source={{ uri: url }}
                  style={[
                    styles.postImg2,
                    {
                      borderTopLeftRadius: index == 0 ? 10 : 0,
                      borderTopRightRadius: index == 0 ? 0 : 10,
                      borderBottomLeftRadius: index == 0 ? 10 : 0,
                      borderBottomRightRadius: index == 0 ? 0 : 10,
                    },
                  ]}
                  contentFit="cover"
                  transition={1000}
                />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {item.mediaUrls.length >= 3 && (
        <View
          style={[styles.postImg2Cont, { height: width / 2, width: "100%" }]}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <Pressable
              onPress={() => handleImgPress(0)}
              style={{ flex: 1, backgroundColor: "#f1f1f1", borderRadius: 10 }}
            >
              <Image
                source={item.mediaUrls[0]}
                style={[
                  styles.postImg2,
                  {
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: item.mediaUrls.length > 3 ? 0 : 10,
                  },
                ]}
              />
            </Pressable>
            {item.mediaUrls.length > 3 && (
              <Pressable
                onPress={() => handleImgPress(2)}
                style={{
                  flex: 1,
                  backgroundColor: "#f1f1f1",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={item.mediaUrls[2]}
                  style={[styles.postImg2, { borderBottomLeftRadius: 10 }]}
                />
              </Pressable>
            )}
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Pressable
              onPress={() => handleImgPress(1)}
              style={{ flex: 1, backgroundColor: "#f1f1f1", borderRadius: 10 }}
            >
              <Image
                source={item.mediaUrls[1]}
                style={[styles.postImg2, { borderTopRightRadius: 10 }]}
              />
            </Pressable>
            <Pressable
              onPress={() => handleImgPress(item.mediaUrls.length > 3 ? 3 : 2)}
              style={{
                flex: 1,
                backgroundColor: "#f1f1f1",
                borderRadius: 10,
              }}
            >
              <Image
                source={item.mediaUrls[item.mediaUrls.length > 3 ? 3 : 2]}
                style={[styles.postImg2, { borderBottomRightRadius: 10 }]}
              />
              {item.mediaUrls.length > 4 && (
                <View style={styles.layer}>
                  <IonIcons name="add" size={30} color="#fff" />
                  <Text
                    style={{
                      fontSize: texts.lg,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {item.mediaUrls.length - 4}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default MediaPostType;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  twoImagesCont: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  layer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  postImg1: {
    width: "100%",
    borderRadius: 20,
  },
  postImg2Cont: {
    flexDirection: "row",
    gap: 5,
  },
  postImg2: {
    width: "100%",
    borderRadius: 10,
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  otherImgsLengthCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    position: "absolute",
  },
  otherImgsLength: {
    color: "#fff",
    fontSize: texts.xxl,
    fontWeight: "600",
  },
  postCont: {
    gap: 8,
    paddingVertical: 15,
  },
  media1Cont: {
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
  },
  mediaImg: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  mediaImg3Cont: {
    flex: 1,
  },
});
