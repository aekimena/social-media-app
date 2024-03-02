import { createSlice } from "@reduxjs/toolkit";

const userPostsSlice = createSlice({
  name: "userPosts",
  initialState: {
    posts: [],
    postsLoading: false,
    getUserPostsErr: false,
  },
  reducers: {
    addPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
      state.posts = state.posts.sort((a, b) => b.createdAt - a.createdAt);
    },
    addUserPostLocally: (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.posts = state.posts.sort((a, b) => b.createdAt - a.createdAt);
    },
    updatePostLoading: (state, action) => {
      state.postsLoading = action.payload;
    },
    updateGetUserPostsErr: (state, action) => {
      state.getUserPostsErr = action.payload;
    },
    likeUserPost: (state, action) => {
      const newArr = state.posts.map((item) => {
        if (item._id == action.payload.postId) {
          return { ...item, likes: [...item.likes, action.payload.user] };
        }
        return item;
      });

      state.posts = newArr;
    },
    unLikeUserPost: (state, action) => {
      const newArr = state.posts.map((item) => {
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

      state.posts = newArr;
    },
    commentOnUserPost: (state, action) => {
      const newArr = state.posts.map((item) => {
        if (item._id == action.payload.postId) {
          return { ...item, comments: [...item.comments, action.payload.user] };
        }
        return item;
      });

      state.posts = newArr;
    },
    bookmarkUserPost: (state, action) => {
      const newArr = state.posts.map((item) => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            bookmarks: [...item.bookmarks, action.payload.user],
          };
        }
        return item;
      });

      state.posts = newArr;
    },
    delBookmarkUserPost: (state, action) => {
      const newArr = state.posts.map((item) => {
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

      state.posts = newArr;
    },
  },
});

export const {
  addPost,
  updatePostLoading,
  likeUserPost,
  unLikeUserPost,
  bookmarkUserPost,
  delBookmarkUserPost,
  commentOnUserPost,
  addUserPostLocally,
  updateGetUserPostsErr,
} = userPostsSlice.actions;
export default userPostsSlice.reducer;
