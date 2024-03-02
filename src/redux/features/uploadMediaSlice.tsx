import { createSlice } from "@reduxjs/toolkit";

const uploadMediaSlice = createSlice({
  name: "uploadMediaSlice",
  initialState: {
    imageUrls: [],
    pickedImages: [],
  },
  reducers: {
    addUrl: (state, action) => {
      state.imageUrls = [...state.imageUrls, action.payload];
    },
    addPickedImage: (state, action) => {
      state.pickedImages = [...state.pickedImages, ...action.payload];
    },
    delAUrl: (state, action) => {
      state.imageUrls = state.imageUrls.filter(
        (item) => item !== action.payload
      );
    },
    delAPickedImage: (state, action) => {
      state.pickedImages = state.pickedImages.filter(
        (item) => item.uri !== action.payload.uri
      );
    },
    clearAllImageArray: (state) => {
      state.imageUrls = [];
      state.pickedImages = [];
    },
  },
});

export const {
  addUrl,
  addPickedImage,
  delAPickedImage,
  delAUrl,
  clearAllImageArray,
} = uploadMediaSlice.actions;

export default uploadMediaSlice.reducer;
