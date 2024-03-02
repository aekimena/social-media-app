import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import {
  addUploadingReply,
  likeReply,
  unlikeReply,
  updateCommentInView,
} from "../redux/features/commentInView";
import { AppContext } from "../contexts/appContext";
import { likeComment, unlikeComment } from "../redux/features/postInView";
import { GET_REPLIES } from "../utils/gqlSchemas";
import RenderUserAvatarInCommentsPostInView from "../components/RenderUserAvatarInCommentsPostInView";
import RenderActionBtnsForCommentsPostInView from "../components/RenderActionBtnsForCommentsPostInView";
import RenderAvatarNamesForCommentsPostInView from "../components/RenderAvatarNamesForCommentsPostInView";
import RenderHeadersForCommentsPostInView from "../components/RenderHeadersForCommentsPostInView";

const ReplyList = ({ item }) => {
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const timestampString = item.createdAt;
  const timestamp = parseInt(timestampString);
  const dateObject = new Date(timestamp);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const replyLiked = item.likes.find((obj) => obj._id == user._id);

  const dateString = `${day}/${month}/${year}`;
  function handleCommentPress() {
    dispatch(updateCommentInView(item));
    navigation.push("Comment");
  }

  function likeAReply() {
    dispatch(likeReply({ user: { _id: user._id }, replyId: item._id }));
  }
  function unlikeAReply() {
    dispatch(unlikeReply({ user: { _id: user._id }, replyId: item._id }));
  }
  return (
    <Pressable
      onPress={null}
      style={({ pressed }) => [
        styles.replyCont,
        {
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
          liked={replyLiked}
          likeFunc={likeAReply}
          unlikeFunc={unlikeAReply}
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

const CommentHeader = () => {
  const commentDetails = useSelector(
    (state: any) => state.commentInView.comment
  );
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const commentLiked = commentDetails.likes?.find(
    (obj: any) => obj._id == user._id
  );
  const dispatch = useDispatch();

  const timestampString = commentDetails.createdAt;
  const timestamp = parseInt(timestampString);
  const dateObject = new Date(timestamp);

  const minute = dateObject.getMinutes();
  const hour = dateObject.getHours();
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();

  const dateString = `${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  } ${day}/${month}/${year}`;

  function likeAComment() {
    const likes = [...commentDetails.likes, { _id: user._id }];
    dispatch(updateCommentInView({ ...commentDetails, likes }));
    dispatch(
      likeComment({
        commentId: commentDetails._id,
        commenter: { _id: user._id },
      })
    );
  }

  function unlikeAComment() {
    const likes = commentDetails.likes.filter((obj) => obj._id !== user._id);
    dispatch(updateCommentInView({ ...commentDetails, likes }));
    dispatch(
      unlikeComment({
        commentId: commentDetails._id,
        commenter: { _id: user._id },
      })
    );
  }

  return (
    <View style={styles.postCont}>
      <View style={styles.postHeader}>
        <RenderAvatarNamesForCommentsPostInView
          pressFunc={null}
          details={commentDetails}
          user={user}
        />
        <Pressable>
          <IonIcons
            name="ellipsis-horizontal"
            color={colors.iconColor}
            size={20}
          />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <Text
          style={{
            fontSize: texts.md,
            color: colors.postTextColor,
          }}
        >
          {commentDetails.text}
        </Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>

      <View style={styles.actionBtnsCont}>
        <TouchableOpacity
          style={styles.actionBtns}
          activeOpacity={0.5}
          onPress={commentLiked ? unlikeAComment : likeAComment}
        >
          <IonIcons
            name={commentLiked ? "heart" : "heart-outline"}
            color={commentLiked ? "#FF6666" : colors.iconColor}
            size={20}
          />
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            {commentDetails.likes?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtns} activeOpacity={0.5}>
          <IonIcons name="chatbox-outline" color={colors.iconColor} size={20} />
          <Text style={{ fontSize: texts.xs, color: colors.iconColor }}>
            {commentDetails.childComments?.length}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Input = () => {
  const { uploadReply } = useContext(AppContext);
  const commentDetails = useSelector(
    (state: any) => state.commentInView.comment
  );
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const [inputTxt, setInputTxt] = useState("");
  const dispatch = useDispatch();

  async function sendComment() {
    const standBy = {
      postId: commentDetails.post?._id,
      text: inputTxt,
      userId: user._id,
      commentId: commentDetails._id,
      status: "pending",
      fakeId: Date.now(),
    };
    dispatch(addUploadingReply(standBy));
    uploadReply(
      inputTxt,
      user._id,
      commentDetails.post?._id,
      commentDetails._id,
      standBy
    );
    setInputTxt("");
  }
  return (
    <View style={styles.bottomView}>
      <Text style={{ fontSize: texts.sm, color: colors.themeColor }}>
        Replying to @{commentDetails.owner?.username}
      </Text>
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

const Comment = () => {
  const navigation = useNavigation<any>();
  const commentDetails = useSelector(
    (state: any) => state.commentInView.comment
  );
  const dispatch = useDispatch();
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [getError, setGetError] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_REPLIES, {
    variables: { commentId: commentDetails._id },
  });

  const repliesUploading = useSelector(
    (state: any) => state.commentInView.uploadingReplies
  );

  const replyIsUploading = repliesUploading?.find(
    (obj) => obj.commentId == commentDetails._id
  );

  const pending = replyIsUploading?.status == "pending";
  const failed = replyIsUploading?.status == "failed";

  useEffect(() => {
    (async () => {
      setCommentsLoading(true);
      await refetch()
        .then((res) => {
          const { replies } = res.data;
          dispatch(
            updateCommentInView({ ...commentDetails, childComments: replies })
          );
          setCommentsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setGetError(true);
          setCommentsLoading(false);
        });
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <RenderHeadersForCommentsPostInView text={"Comment"} />
      {replyIsUploading && (
        <View style={styles.statusView}>
          {pending && (
            <Text style={{ color: "#fff", fontSize: texts.sm }}>
              {"Uploading reply..."}
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
                Reply upload failed!
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
          <CommentHeader />

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
          data={commentDetails.childComments}
          ListHeaderComponent={<CommentHeader />}
          keyExtractor={(item: any) => item?._id}
          renderItem={(item: any) => <ReplyList {...item} />}
          contentContainerStyle={{ gap: 0 }}
        />
      )}
      <Input />
    </SafeAreaView>
  );
};

export default Comment;

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
  replyCont: { flexDirection: "row", gap: 10, padding: 15 },
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
  bottomView: {
    width: "100%",
    padding: 15,
    borderTopWidth: 0.5,
    borderColor: colors.iconColor,
    gap: 5,
  },
});
