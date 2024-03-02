import { createSlice } from "@reduxjs/toolkit";

const imagesInView = createSlice({
  name: "ImagesInView",
  initialState: {
    post: {},
    startIndex: null,
  },
  reducers: {
    updateImagesInView: (state, action) => {
      state.post = action.payload;
    },
    updateStartIndex: (state, action) => {
      state.startIndex = action.payload;
    },
    likeImages: (state: any, action) => {
      const likes = [...state.post.likes, action.payload];
      state.post = { ...state.post, likes };
    },
    unlikeImage: (state: any, action) => {
      const likes = state.post.likes.filter(
        (item) => item._id !== action.payload._id
      );
      state.post = { ...state.post, likes };
    },
  },
});

export const { likeImages, unlikeImage, updateImagesInView, updateStartIndex } =
  imagesInView.actions;
export default imagesInView.reducer;
