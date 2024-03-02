import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userDetails",
  initialState: {
    user: [],
    userLoading: true,
  },
  reducers: {
    updateUserDetails: (state, action) => {
      state.user = [action.payload];
    },
    updateUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    updateFollowUser: (state, action) => {
      state.user = [
        {
          ...state.user[0],
          following: [...state.user[0].following, action.payload],
        },
      ];
    },
    updateUnfollowUser: (state, action) => {
      state.user = [
        {
          ...state.user[0],
          following: state.user[0].following.filter(
            (obj) => obj._id !== action.payload._id
          ),
        },
      ];
    },
    newFollower: (state, action) => {
      state.user = [
        {
          ...state.user[0],
          followers: [...state.user[0].followers, action.payload],
        },
      ];
    },
    unfollowed: (state, action) => {
      state.user = [
        {
          ...state.user[0],
          followers: state.user[0].followers.filter(
            (obj) => obj._id !== action.payload._id
          ),
        },
      ];
    },
  },
});

export const {
  updateUserDetails,
  updateUserLoading,
  updateFollowUser,
  updateUnfollowUser,
  newFollower,
  unfollowed,
} = userSlice.actions;
export default userSlice.reducer;
