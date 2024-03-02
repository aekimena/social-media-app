import { createSlice } from "@reduxjs/toolkit";

const postInViewSlice = createSlice({
  name: "postInView",
  initialState: {
    post: {},
    uploadingComments: [],
  },
  reducers: {
    newPostInView: (state, action) => {
      state.post = action.payload;
    },
    likePostInView: (state, action) => {
      state.post = action.payload;
    },
    unlikePostInView: (state, action) => {
      state.post = action.payload;
    },
    commentOnPost: (state, action) => {
      state.post = action.payload;
    },
    replyToComment: (state: any, action) => {
      const newComments = state.post.comments.map((item) => {
        if (item._id == action.payload.commentId) {
          return {
            ...item,
            childComments: [...item.childComments, action.payload.reply],
          };
        }
        return item;
      });
      state.post = { ...state.post, comments: newComments };
    },
    bookmarkPostInView: (state, action) => {
      state.post = action.payload;
    },
    delBookmarkInView: (state, action) => {
      state.post = action.payload;
    },
    addUploadingComments: (state, action) => {
      state.uploadingComments = [...state.uploadingComments, action.payload];
    },
    delUploadingComments: (state, action) => {
      state.uploadingComments = state.uploadingComments.filter(
        (obj) => obj.fakeId !== action.payload.fakeId
      );
    },
    likeComment: (state: any, action) => {
      const newComments = state.post.comments.map((item) => {
        if (item._id == action.payload.commentId) {
          return {
            ...item,
            likes: [...item.likes, action.payload.commenter],
          };
        }
        return item;
      });
      state.post = { ...state.post, comments: newComments };
    },
    unlikeComment: (state: any, action) => {
      const newComments = state.post.comments.map((item) => {
        if (item._id == action.payload.commentId) {
          return {
            ...item,
            likes: item.likes.filter(
              (obj) => obj._id !== action.payload.commenter._id
            ),
          };
        }
        return item;
      });
      state.post = { ...state.post, comments: newComments };
    },
  },
});

export const {
  newPostInView,
  likePostInView,
  unlikePostInView,
  commentOnPost,
  replyToComment,
  bookmarkPostInView,
  delBookmarkInView,
  addUploadingComments,
  delUploadingComments,
  likeComment,
  unlikeComment,
} = postInViewSlice.actions;

export default postInViewSlice.reducer;
