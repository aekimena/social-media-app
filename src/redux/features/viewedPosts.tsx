import { createSlice } from "@reduxjs/toolkit";

const viewedPosts = createSlice({
  name: "viewedPosts",
  initialState: {
    posts: [],
    userId: null,
    loading: false,
  },
  reducers: {
    newUserId: (state, action) => {
      state.userId = action.payload;
    },
    addViewedPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
    },
    updateViewedPostsLoading: (state, action) => {
      state.loading = action.payload;
    },
    likePostInViewedPosts: (state, action) => {
      const newArr = state.posts.map((item) => {
        const newPosts = item.posts.map((obj) => {
          if (obj._id == action.payload.postId) {
            return { ...obj, likes: [...obj.likes, action.payload.liker] };
          }
          return obj;
        });
        if (item.userId == action.payload.userId) {
          return { ...item, posts: newPosts };
        }
        return item;
      });
      state.posts = newArr;
    },
    unlikePostInViewedPosts: (state, action) => {
      const newArr = state.posts.map((item) => {
        const newPosts = item.posts.map((obj) => {
          if (obj._id == action.payload.postId) {
            return {
              ...obj,
              likes: obj.likes.filter(
                (like) => like._id !== action.payload.liker._id
              ),
            };
          }
          return obj;
        });
        if (item.userId == action.payload.userId) {
          return { ...item, posts: newPosts };
        }
        return item;
      });
      state.posts = newArr;
    },
  },
});

export const {
  addViewedPost,
  updateViewedPostsLoading,
  likePostInViewedPosts,
  unlikePostInViewedPosts,
  newUserId,
} = viewedPosts.actions;
export default viewedPosts.reducer;
