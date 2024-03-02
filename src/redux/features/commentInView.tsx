import { createSlice } from "@reduxjs/toolkit";

const commentInViewSlice = createSlice({
  name: "commentInView",
  initialState: {
    comment: {},
    uploadingReplies: [],
  },
  reducers: {
    updateCommentInView: (state, action) => {
      state.comment = action.payload;
    },
    addUploadingReply: (state, action) => {
      state.uploadingReplies = [...state.uploadingReplies, action.payload];
    },
    deluploadingReply: (state, action) => {
      state.uploadingReplies = state.uploadingReplies.filter(
        (obj) => obj.fakeId !== action.payload.fakeId
      );
    },

    likeReply: (state: any, action) => {
      const newReplies = state.comment.childComments.map((item) => {
        if (item._id == action.payload.replyId) {
          return {
            ...item,
            likes: [...item.likes, action.payload.user],
          };
        }
        return item;
      });
      state.comment = { ...state.comment, childComments: newReplies };
    },
    unlikeReply: (state: any, action) => {
      const newReplies = state.comment.childComments.map((item) => {
        if (item._id == action.payload.replyId) {
          return {
            ...item,
            likes: item.likes.filter(
              (obj) => obj._id !== action.payload.user._id
            ),
          };
        }
        return item;
      });
      state.comment = { ...state.comment, childComments: newReplies };
    },
  },
});

export const {
  updateCommentInView,
  addUploadingReply,
  deluploadingReply,
  likeReply,
  unlikeReply,
} = commentInViewSlice.actions;

export default commentInViewSlice.reducer;
