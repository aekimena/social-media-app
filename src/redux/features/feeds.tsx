import { createSlice } from "@reduxjs/toolkit";

export const feedsSlice = createSlice({
  name: "feeds",
  initialState: {
    feedsArray: [],
    feedsLoading: false,
    postUploading: false,
    postUploadingStatus: "Uploading post...",
    uploadingPosts: [],
  },
  reducers: {
    updateFeedLoading: (state, action) => {
      state.feedsLoading = action.payload;
    },
    addNewPost: (state, action) => {
      const postExists = state.feedsArray.find(
        (obj) => obj._id === action.payload._id
      );
      if (postExists) {
        null;
      } else {
        state.feedsArray = [...state.feedsArray, action.payload];
      }
    },
    addReloadedPost: (state, action) => {
      const postExists = state.feedsArray.find(
        (obj) => obj._id === action.payload._id
      );
      if (postExists) {
        null;
      } else {
        state.feedsArray = [action.payload, ...state.feedsArray];
      }
    },
    addNewPostLocally: (state, action) => {
      const postExists = state.feedsArray.find(
        (obj) => obj._id === action.payload._id
      );
      if (postExists) {
        null;
      } else {
        state.feedsArray = [action.payload, ...state.feedsArray];
      }
    },
    deletePost: (state) => {},
    likePost: (state, action) => {
      const newArr = state.feedsArray.map((item) => {
        if (item._id == action.payload.postId) {
          const likes = item.likes;
          const postLiked = likes.find(
            (obj) => obj._id == action.payload.user._id
          );
          if (postLiked) {
            null;
          } else {
            return { ...item, likes: [...item.likes, action.payload.user] };
          }
        }
        return item;
      });

      state.feedsArray = newArr;
    },
    unlikePost: (state, action) => {
      const newArr = state.feedsArray.map((item) => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            likes: item.likes.filter(
              (obj: any) => obj._id !== action.payload.user._id
            ),
          };
        }
        return item;
      });

      state.feedsArray = newArr;
    },
    commentOnPost: (state, action) => {
      const newArr = state.feedsArray.map((item) => {
        if (item._id == action.payload.postId) {
          return { ...item, comments: [...item.comments, action.payload.user] };
        }
        return item;
      });

      state.feedsArray = newArr;
    },
    replyToComment: (state) => {},
    bookmarkPost: (state, action) => {
      const newArr = state.feedsArray.map((item) => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            bookmarks: [...item.bookmarks, action.payload.user],
          };
        }
        return item;
      });

      state.feedsArray = newArr;
    },
    delBookmark: (state, action) => {
      const newArr = state.feedsArray.map((item) => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            bookmarks: item.bookmarks.filter(
              (obj: any) => obj._id !== action.payload.user._id
            ),
          };
        }
        return item;
      });

      state.feedsArray = newArr;
    },
    updateUploading: (state, action) => {
      state.postUploading = action.payload;
    },
    updateUploadStatus: (state, action) => {
      state.postUploadingStatus = action.payload;
    },

    addUploadingPosts: (state, action) => {
      state.uploadingPosts = [...state.uploadingPosts, action.payload];
    },
    delUploadingPosts: (state, action) => {
      state.uploadingPosts = state.uploadingPosts.filter(
        (obj) => obj.fakeId !== action.payload.fakeId
      );
    },
    delPreviousUploadingPost: (state) => {
      const newArr = state.uploadingPosts.slice(1);
      state.uploadingPosts = newArr;
    },
  },
});

export const {
  updateFeedLoading,
  addNewPost,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost,
  replyToComment,
  bookmarkPost,
  delBookmark,
  updateUploadStatus,
  updateUploading,
  addUploadingPosts,
  delUploadingPosts,
  addNewPostLocally,
  addReloadedPost,
  delPreviousUploadingPost,
} = feedsSlice.actions;

export default feedsSlice.reducer;
