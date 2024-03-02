import { createSlice } from "@reduxjs/toolkit";

const postsFromSocket = createSlice({
  name: "postsFromSocket",
  initialState: {
    collection: [],
    showIndicator: false,
  },
  reducers: {
    addToSocketPosts: (state, action) => {
      const postExists = state.collection.find(
        (obj) => obj._id === action.payload._id
      );
      if (postExists) {
        null;
      } else {
        state.collection = [action.payload, ...state.collection];
      }
    },
    delCollection: (state) => {
      state.collection = [];
    },
    showIndicator: (state, action) => {
      state.showIndicator = action.payload;
    },
  },
});

export const { addToSocketPosts, delCollection, showIndicator } =
  postsFromSocket.actions;

export default postsFromSocket.reducer;
