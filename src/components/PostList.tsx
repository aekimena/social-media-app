import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { likePost, unlikePost } from "../redux/features/feeds";
import { Image } from "expo-image";
import IonIcons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import { useNavigation } from "@react-navigation/native";
import {
  likePostInView,
  newPostInView,
  unlikePostInView,
} from "../redux/features/postInView";
import {
  bookmarkUserPost,
  delBookmarkUserPost,
  likeUserPost,
  unLikeUserPost,
} from "../redux/features/userPosts";
import {
  likePostInViewedPosts,
  newUserId,
  unlikePostInViewedPosts,
} from "../redux/features/viewedPosts";
import MediaPostType from "./MediaPostType";
import { gql, useMutation } from "@apollo/client";
import { LIKE_POST, UNLIKE_POST } from "../utils/gqlSchemas";

const PostsList = ({ item }) => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postLiked = item.likes.find((obj: any) => obj._id == user._id);
  const postInView = useSelector((state: any) => state.postInView.post);

  const isIsoDate = item.createdAt.includes("T" || "Z"); // the time from socket.io is in iso format, so this helps handle the time display correctly
  const timestampString = item.createdAt;
  const timestamp = isIsoDate ? timestampString : parseInt(timestampString);
  const dateObject = new Date(timestamp);

  const day = isIsoDate ? dateObject.getUTCDate() : dateObject.getDate();
  const month = isIsoDate
    ? dateObject.getUTCMonth() + 1
    : dateObject.getMonth() + 1;
  const year = isIsoDate
    ? dateObject.getUTCFullYear()
    : dateObject.getFullYear();
  const dateString = `${day}/${month}/${year}`;
  const [likePostFromDB] = useMutation(LIKE_POST);
  const [unlikePostFromDB] = useMutation(UNLIKE_POST);

  function handlePress() {
    dispatch(newPostInView(item));
    navigation.navigate("ViewPost");
  }
  const data = {
    user: { _id: user._id },
    postId: item._id,
  };

  const dispatch = useDispatch();

  function likeAPost() {
    dispatch(likePost(data));
    dispatch(likeUserPost(data));
    dispatch(
      likePostInViewedPosts({
        userId: item.owner._id,
        postId: item._id,
        liker: { _id: user._id },
      })
    );
    if (postInView._id == item._id) {
      const likes = [...postInView.likes, { _id: user._id }];
      dispatch(likePostInView({ ...postInView, likes: likes }));
    }
    likePostFromDB({ variables: { postId: item._id, userId: user._id } })
      .then((res) => {
        if (res.data.likePost) {
          console.log("post liked");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function unLikeAPost() {
    dispatch(unlikePost(data));
    dispatch(unLikeUserPost(data));
    dispatch(
      unlikePostInViewedPosts({
        userId: item.owner._id,
        postId: item._id,
        liker: { _id: user._id },
      })
    );
    if (postInView._id == item._id) {
      const likes = postInView.likes.filter((obj: any) => obj._id !== user._id);
      dispatch(unlikePostInView({ ...postInView, likes: likes }));
    }
    unlikePostFromDB({ variables: { postId: item._id, userId: user._id } })
      .then((res) => {
        if (res.data.unlikePost) {
          console.log("post unliked");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAvatarPress() {
    if (item.owner._id == user._id) {
      navigation.navigate("UserPage");
    } else {
      dispatch(newUserId(item.owner._id));
      navigation.navigate("OtherUserRoute", {
        params: { userDetails: item.owner },
        screen: "OtherUserPage",
      });
    }
  }

  const RenderImage = () => {
    if (item.owner._id == user._id) {
      return (
        <Image source={{ uri: user.avatarUrl }} style={styles.postAvatar} />
      );
    } else if (
      item.owner?.avatarUrl == null ||
      item.owner?.avatarUrl == "" ||
      item.owner?.avatarUrl == undefined
    ) {
      return (
        <Image
          source={require("../../assets/images/placeholder-img.jpg")}
          style={styles.postAvatar}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: item.owner?.avatarUrl }}
          style={styles.postAvatar}
        />
      );
    }
  };
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.postCont,
        {
          // backgroundColor: pressed ? "rgba(0,0,0,0.1)" : colors.backgroundColor,
          backgroundColor: colors.backgroundColor,
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
        <Pressable style={styles.postAvatarImgRing} onPress={handleAvatarPress}>
          <RenderImage />
        </Pressable>
        <View style={{ flex: 1, gap: 8 }}>
          <View>
            <Text style={styles.postName}>{item.owner.name}</Text>
            <Text style={{ fontSize: texts.sm, color: colors.iconColor }}>
              @{item.owner.username}
            </Text>
          </View>

          {item.postType !== "text" && (item.caption !== "" || null) && (
            <View style={{ paddingHorizontal: 0 }}>
              <Text style={{ color: colors.postTextColor, fontSize: texts.sm }}>
                <Text style={{ fontWeight: "600" }}>{item.username}</Text>
                {item.caption}
              </Text>
            </View>
          )}
          {item.postType == "text" && (
            <>
              <View style={{ paddingHorizontal: 0 }}>
                <Text
                  style={{
                    fontSize: texts.md,
                    color: colors.postTextColor,
                  }}
                  numberOfLines={6}
                >
                  {item.text}
                </Text>
              </View>
            </>
          )}
          {item.postType !== "text" && <MediaPostType item={item} />}
          <View style={styles.bottoms}>
            <View style={styles.actionBtnsCont}>
              <TouchableOpacity
                style={styles.actionBtns}
                onPress={postLiked ? unLikeAPost : likeAPost}
                activeOpacity={0.5}
              >
                <IonIcons
                  name={postLiked ? "heart" : "heart-outline"}
                  color={postLiked ? "#FF6666" : colors.iconColor}
                  size={15}
                />
                <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
                  {item.likes?.length}
                </Text>
              </TouchableOpacity>
              <View style={styles.actionBtns}>
                <IonIcons
                  name="chatbox-outline"
                  color={colors.iconColor}
                  size={15}
                />
                <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
                  {item.comments?.length}
                </Text>
              </View>
              <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
                <IonIcons
                  name={"bookmark-outline"}
                  color={colors.iconColor}
                  size={15}
                />
                <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
                  {item.bookmarks?.length}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.iconColor, fontSize: texts.xs }}>
              {dateString}
            </Text>
          </View>
        </View>
        <Pressable>
          <IonIcons
            name="ellipsis-horizontal"
            color={colors.iconColor}
            size={20}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default PostsList;

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  postAvatarImgRing: {
    justifyContent: "center",
    alignItems: "center",
  },
  postAvatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    resizeMode: "cover",
  },
  postName: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "600",
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  postCont: {
    padding: 15,
  },
  bottoms: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionBtnsCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconTxt: { fontSize: texts.xs, color: colors.iconColor },
});
