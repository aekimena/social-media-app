import { createSlice } from "@reduxjs/toolkit";

const followingInView = createSlice({
  name: "followingInView",
  initialState: {
    following: [],
    userId: null,
  },
  reducers: {
    updateUserId: (state, action) => {
      state.userId = action.payload;
    },
    updateFollowingInView: (state, action) => {
      state.following = action.payload;
    },
  },
});

export const { updateFollowingInView, updateUserId } = followingInView.actions;
export default followingInView.reducer;
