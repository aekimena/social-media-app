import { createSlice } from "@reduxjs/toolkit";

const followersInView = createSlice({
  name: "followersInView",
  initialState: {
    followers: [],
    userId: null,
  },
  reducers: {
    updateUserId: (state, action) => {
      state.userId = action.payload;
    },
    updateFollowersInView: (state, action) => {
      state.followers = action.payload;
    },
  },
});

export const { updateFollowersInView, updateUserId } = followersInView.actions;
export default followersInView.reducer;
