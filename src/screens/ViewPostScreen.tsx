import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { colors } from "../utils/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { texts } from "../utils/texts";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  bookmarkPost,
  delBookmark,
  likePost,
  unlikePost,
} from "../redux/features/feeds";
import {
  addUploadingComments,
  bookmarkPostInView,
  delBookmarkInView,
  likeComment,
  likePostInView,
  newPostInView,
  unlikeComment,
  unlikePostInView,
} from "../redux/features/postInView";
import mongoose from "mongoose";
import { AppContext } from "../contexts/appContext";
import {
  bookmarkUserPost,
  delBookmarkUserPost,
  likeUserPost,
  unLikeUserPost,
} from "../redux/features/userPosts";
import { updateCommentInView } from "../redux/features/commentInView";
import {
  likePostInViewedPosts,
  unlikePostInViewedPosts,
} from "../redux/features/viewedPosts";
import MediaPostType from "../components/MediaPostType";
import RenderUserAvatarInCommentsPostInView from "../components/RenderUserAvatarInCommentsPostInView";
import RenderActionBtnsForCommentsPostInView from "../components/RenderActionBtnsForCommentsPostInView";
import RenderAvatarNamesForCommentsPostInView from "../components/RenderAvatarNamesForCommentsPostInView";
import RenderHeadersForCommentsPostInView from "../components/RenderHeadersForCommentsPostInView";
import { GET_COMMENTS } from "../utils/gqlSchemas";

const CommentList = ({ item }) => {
  const timestampString = item.createdAt;
  const timestamp = parseInt(timestampString);
  const dateObject = new Date(timestamp);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const postDetails = useSelector((state: any) => state.postInView.post);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const commentLiked = item?.likes?.find((obj) => obj._id == user._id);

  const dateString = `${day}/${month}/${year}`;
  function handleCommentPress() {
    dispatch(updateCommentInView(item));
    navigation.navigate("Comment");
  }

  function likeAComment() {
    dispatch(
      likeComment({ commentId: item._id, commenter: { _id: user._id } })
    );
  }

  function unlikeAComment() {
    dispatch(
      unlikeComment({ commentId: item._id, commenter: { _id: user._id } })
    );
  }
  return (
    <Pressable
      onPress={handleCommentPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          gap: 10,
          padding: 15,
          backgroundColor: pressed ? "rgba(0,0,0,0.1)" : colors.backgroundColor,
        },
      ]}
    >
      <RenderUserAvatarInCommentsPostInView item={item} user={user} />
      <View style={{ flex: 1, gap: 5 }}>
        <View>
          <Text style={[styles.postName, { fontSize: texts.sm }]}>
            {item.owner?.name}
          </Text>
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            @{item.owner?.username}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: texts.sm,
              color: colors.postTextColor,
            }}
          >
            {item?.text}
          </Text>
        </View>
        <RenderActionBtnsForCommentsPostInView
          item={item}
          liked={commentLiked}
          likeFunc={likeAComment}
          unlikeFunc={unlikeAComment}
        />
      </View>
      <Text
        style={{
          fontSize: texts.xs,
          color: colors.iconColor,
        }}
      >
        {dateString}
      </Text>
    </Pressable>
  );
};

const Post = () => {
  const navigation = useNavigation<any>();
  const postDetails = useSelector((state: any) => state.postInView.post);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postLiked = postDetails.likes?.find((obj: any) => obj._id == user._id);
  const postBookmarked = postDetails.bookmarks?.find(
    (obj: any) => obj._id == user._id
  );
  const isIsoDate = postDetails.createdAt.includes("T" || "Z");
  const timestampString = postDetails.createdAt;
  const timestamp = isIsoDate ? timestampString : parseInt(timestampString);
  const dateObject = new Date(timestamp);

  const minute = isIsoDate
    ? dateObject.getUTCMinutes()
    : dateObject.getMinutes();
  const hour = isIsoDate ? dateObject.getUTCHours() : dateObject.getHours();
  const day = isIsoDate ? dateObject.getUTCDate() : dateObject.getDate();
  const month = isIsoDate
    ? dateObject.getUTCMonth() + 1
    : dateObject.getMonth() + 1;
  const year = isIsoDate
    ? dateObject.getUTCFullYear()
    : dateObject.getFullYear();

  const dateString = `${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  } ${day}/${month}/${year}`;

  const dispatch = useDispatch();

  const data = {
    user: { _id: user._id },
    postId: postDetails._id,
  };

  function likeAPost() {
    const likes = [...postDetails.likes, { _id: user._id }];
    dispatch(likePostInView({ ...postDetails, likes: likes }));
    dispatch(likePost(data));
    dispatch(likeUserPost(data));
    dispatch(
      likePostInViewedPosts({
        userId: postDetails.owner._id,
        postId: postDetails._id,
        liker: { _id: user._id },
      })
    );
  }
  function unLikeAPost() {
    const likes = postDetails.likes.filter((obj: any) => obj._id !== user._id);
    dispatch(unlikePostInView({ ...postDetails, likes: likes }));
    dispatch(unlikePost(data));
    dispatch(unLikeUserPost(data));
    dispatch(
      unlikePostInViewedPosts({
        userId: postDetails.owner._id,
        postId: postDetails._id,
        liker: { _id: user._id },
      })
    );
  }

  function handleAvatarPress() {
    if (postDetails.owner._id == user._id) {
      navigation.navigate("UserPage");
    } else {
      navigation.navigate("OtherUserRoute", {
        params: { userDetails: postDetails.owner },
        screen: "OtherUserPage",
      });
    }
  }
  return (
    <View style={styles.postCont}>
      <View style={styles.postHeader}>
        <RenderAvatarNamesForCommentsPostInView
          details={postDetails}
          user={user}
          pressFunc={handleAvatarPress}
        />
        <Pressable>
          <IonIcons
            name="ellipsis-horizontal"
            color={colors.iconColor}
            size={20}
          />
        </Pressable>
      </View>
      {postDetails.postType == "text" && (
        <View style={{ paddingHorizontal: 15 }}>
          <Text
            style={{
              fontSize: texts.md,
              color: colors.postTextColor,
            }}
          >
            {postDetails.text}
          </Text>
          <Text style={styles.date}>{dateString}</Text>
        </View>
      )}
      {postDetails.postType !== "text" && <MediaPostType item={postDetails} />}
      <View style={styles.actionBtnsCont}>
        <TouchableOpacity
          style={styles.actionBtns}
          activeOpacity={0.5}
          onPress={postLiked ? unLikeAPost : likeAPost}
        >
          <IonIcons
            name={postLiked ? "heart" : "heart-outline"}
            color={postLiked ? "#FF6666" : colors.iconColor}
            size={20}
          />
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            {postDetails.likes?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons name="chatbox-outline" color={colors.iconColor} size={20} />
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            {postDetails.comments?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons
            name={postBookmarked ? "bookmark" : "bookmark-outline"}
            color={postBookmarked ? colors.themeColor : colors.iconColor}
            size={20}
          />
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            {postDetails.bookmarks?.length}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Input = () => {
  const { uploadComment } = useContext(AppContext);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const savedPost = useSelector((state: any) => state.postInView.post);
  const savedComments = useSelector(
    (state: any) => state.postInView.post.comments
  );
  const [inputTxt, setInputTxt] = useState("");
  const dispatch = useDispatch();

  async function sendComment() {
    const standBy = {
      postId: savedPost._id,
      text: inputTxt,
      userId: user._id,
      status: "pending",
      fakeId: Date.now(),
    };
    dispatch(addUploadingComments(standBy));
    uploadComment(inputTxt, user._id, savedPost._id, standBy);
    setInputTxt("");
  }
  return (
    <View
      style={{
        width: "100%",
        padding: 15,
        borderTopWidth: 0.5,
        borderColor: colors.iconColor,
      }}
    >
      <View style={styles.txtInputCont}>
        <TextInput
          style={styles.txtInput}
          placeholder="Say something..."
          placeholderTextColor={colors.iconColor}
          multiline
          defaultValue={inputTxt}
          onChangeText={(newTxt) => setInputTxt(newTxt)}
        />
        <Pressable onPress={sendComment}>
          <IonIcons name="send" color={colors.themeColor} size={25} />
        </Pressable>
      </View>
    </View>
  );
};

const ViewPostScreen = () => {
  const navigation = useNavigation<any>();
  const postDetails = useSelector((state: any) => state.postInView.post);
  const dispatch = useDispatch();
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [getError, setGetError] = useState(false);
  const savedPost = useSelector((state: any) => state.postInView.post);
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId: postDetails._id },
  });

  const commentsUploading = useSelector(
    (state: any) => state.postInView.uploadingComments
  );

  const commentIsUploading = commentsUploading?.find(
    (obj) => obj.postId == savedPost._id
  );

  const pending = commentIsUploading?.status == "pending";
  const failed = commentIsUploading?.status == "failed";

  useEffect(() => {
    (async () => {
      setCommentsLoading(true);
      refetch()
        .then((res) => {
          const { comments } = res.data;
          dispatch(newPostInView({ ...savedPost, comments: comments }));
          setCommentsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setGetError(true);
          setCommentsLoading(false);
        });
    })();
  }, [data, loading, error]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <RenderHeadersForCommentsPostInView text={"Post"} />
      {commentIsUploading && (
        <View
          style={[
            styles.statusView,
            { backgroundColor: failed ? "red" : colors.themeColor },
          ]}
        >
          {pending && (
            <Text style={{ color: "#fff", fontSize: texts.sm }}>
              {"Uploading comment..."}
            </Text>
          )}
          {failed && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: texts.sm }}>
                Comment upload failed!
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 25 }}
              >
                <Text style={{ color: "#fff", fontSize: texts.sm }}>Retry</Text>
                <IonIcons name="close" color="#fff" size={20} />
              </View>
            </View>
          )}
        </View>
      )}

      {commentsLoading || getError ? (
        <>
          <Post />
          <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
            {commentsLoading ? (
              <ActivityIndicator size={20} color={colors.themeColor} />
            ) : (
              <Text>Error getting comments...</Text>
            )}
          </View>
        </>
      ) : (
        <FlatList
          data={savedPost.comments}
          ListHeaderComponent={<Post />}
          keyExtractor={(item: any) => item._id}
          renderItem={(item: any) => <CommentList {...item} />}
          contentContainerStyle={{ gap: 0 }}
        />
      )}
      <Input />
    </SafeAreaView>
  );
};

export default ViewPostScreen;

const styles = StyleSheet.create({
  postCont: {
    gap: 8,
    backgroundColor: colors.backgroundColor,
    paddingTop: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  postName: {
    fontSize: texts.sm,
    color: colors.textColor,
    fontWeight: "600",
  },
  date: {
    color: colors.iconColor,
    fontSize: texts.xs,
    marginTop: 5,
  },
  actionBtnsCont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.iconColor,
    paddingVertical: 10,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  txtInputCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f8f8",
    minHeight: 50,
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
  statusView: {
    height: 40,
    width: "100%",
    backgroundColor: colors.themeColor,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
