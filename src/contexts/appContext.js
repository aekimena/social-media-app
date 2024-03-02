import React, { createContext, useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPost,
  addNewPostLocally,
  addUploadingPosts,
  commentOnPost,
  delUploadingPosts,
  updateUploadStatus,
  updateUploading,
} from "../redux/features/feeds";
import {
  addPost,
  addUserPostLocally,
  commentOnUserPost,
} from "../redux/features/userPosts";
import {
  addUploadingComments,
  delUploadingComments,
  newPostInView,
  replyToComment,
} from "../redux/features/postInView";
import {
  addUploadingReply,
  deluploadingReply,
  updateCommentInView,
} from "../redux/features/commentInView";
import { addUrl, clearAllImageArray } from "../redux/features/uploadMediaSlice";
import { hideUpdate, showUpdate } from "../redux/features/homeUpdate";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import {
  ADD_MEDIA_POST,
  ADD_TEXT_POST,
  POST_COMMENT,
  POST_REPLY,
} from "../utils/gqlSchemas";

export const AppContext = React.createContext(null);

export default function AppContextProvider({ children }) {
  const user = useSelector((state) => state.userDetails.user[0]);
  const postInView = useSelector((state) => state.postInView.post);
  const commentInView = useSelector((state) => state.commentInView.comment);
  const imageUrls = useSelector((state) => state.mediaSlice.imageUrls);
  const pickedImages = useSelector((state) => state.mediaSlice.pickedImages);
  const [addTextPost, { data, loading, error }] = useMutation(ADD_TEXT_POST);
  const [addMediaPost] = useMutation(ADD_MEDIA_POST);
  const [postAComment] = useMutation(POST_COMMENT);
  const [postAReply] = useMutation(POST_REPLY);
  const [counter, setCounter] = useState(0);

  const dispatch = useDispatch();
  async function uploadTextPost(text, id, standBy) {
    try {
      dispatch(updateUploading(true));
      await addTextPost({
        variables: { id: id, text: text },
      })
        .then((res) => {
          dispatch(addNewPostLocally(res.data.addTextPost));
          dispatch(addUserPostLocally(res.data.addTextPost));
          dispatch(delUploadingPosts(standBy));
          dispatch(
            showUpdate({
              iconName: "checkmark",
              text: "Your post has been uploaded successfully.",
            })
          );
          setTimeout(() => {
            dispatch(hideUpdate());
          }, 3000);
        })
        .catch((err) => {
          dispatch(delUploadingPosts(standBy));
          dispatch(addUploadingPosts({ ...standBy, status: "failed" }));
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      dispatch(delUploadingPosts(standBy));
    }
  }
  async function uploadMediaPost(text, id, array, standBy) {
    try {
      dispatch(updateUploading(true));
      await addMediaPost({
        variables: { id: id, caption: text, mediaUrls: array },
      })
        .then((res) => {
          dispatch(addNewPostLocally(res.data.addMediaPost));
          dispatch(addUserPostLocally(res.data.addMediaPost));
          dispatch(delUploadingPosts(standBy));
          dispatch(clearAllImageArray());
          dispatch(
            showUpdate({
              iconName: "checkmark",
              text: "Your post has been uploaded successfully.",
            })
          );
          setTimeout(() => {
            dispatch(hideUpdate());
          }, 3000);
        })
        .catch((err) => {
          dispatch(delUploadingPosts(standBy));
          dispatch(addUploadingPosts({ ...standBy, status: "failed" }));
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      dispatch(delUploadingPosts(standBy));
    }
  }

  async function handleMediaUpload(standBy) {
    dispatch(addUploadingPosts(standBy));
    try {
      pickedImages.map(async (item) => {
        const { uri } = item;

        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = uri.substring(uri.lastIndexOf("/") + 1);

        const metadata = {
          contentType: item.mimeType,
          name: item.fileName,
          size: item.filesize,
        };

        await uploadBytes(
          ref(storage, "postImages/" + filename),
          blob,
          metadata
        )
          .then(() => {
            getDownloadURL(ref(storage, "postImages/" + filename)).then(
              (downloadURL) => {
                dispatch(addUrl(downloadURL));
                console.log("url", downloadURL);
                setCounter((prev) => prev + 1);
                console.log(counter);
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function uploadComment(text, userId, postId, standBy) {
    try {
      await postAComment({
        variables: { userId, text, postId },
      })
        .then((res) => {
          if (postInView._id == res.data.postAComment.post._id) {
            dispatch(
              newPostInView({
                ...postInView,
                comments: [res.data.postAComment, ...postInView.comments],
              })
            );
          }
          dispatch(delUploadingComments(standBy));
          console.log("comment uploaded");
          dispatch(commentOnPost({ postId: postId, user: { _id: userId } }));
          dispatch(
            commentOnUserPost({ postId: postId, user: { _id: userId } })
          );
        })
        .catch((err) => {
          dispatch(delUploadingComments(standBy));
          dispatch(addUploadingComments({ ...standBy, status: "failed" }));
          console.log(err);
        });
    } catch (err) {
      console.log("error from deep within", err);
      dispatch(delUploadingComments(standBy));
    }
  }
  async function uploadReply(text, userId, postId, commentId, standBy) {
    try {
      await postAReply({
        variables: { userId, text, postId, commentId },
      })
        .then((res) => {
          if (commentInView._id == res.data.postAReply.parentComment._id) {
            dispatch(
              updateCommentInView({
                ...commentInView,
                childComments: [
                  res.data.postAReply,
                  ...commentInView.childComments,
                ],
              })
            );
            if (postInView._id == res.data.postAReply.post._id) {
              dispatch(
                replyToComment({ commentId, reply: res.data.postAReply })
              );
            }
          }

          ////////

          dispatch(deluploadingReply(standBy));
          console.log("comment uploaded");
        })
        .catch((err) => {
          dispatch(deluploadingReply(standBy));
          dispatch(addUploadingReply({ ...standBy, status: "failed" }));
          console.log(err);
        });
    } catch (err) {
      console.log("error from deep within", err);
      dispatch(deluploadingReply(standBy));
    }
  }

  const HomeFeedScrollRef = useRef();
  const BSRefForUserPosts = useRef();
  const BSRefForOtherUserPosts = useRef();
  const BSRefForAvatarImg = useRef();
  const BSRefForUserPageMenu = useRef();
  const BSRefForOtherUserPageMenu = useRef();
  return (
    <AppContext.Provider
      value={{
        uploadTextPost,
        uploadComment,
        uploadReply,
        uploadMediaPost,
        HomeFeedScrollRef,
        BSRefForAvatarImg,
        BSRefForOtherUserPageMenu,
        BSRefForOtherUserPosts,
        BSRefForUserPageMenu,
        BSRefForUserPosts,
        handleMediaUpload,
        counter,
        setCounter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
