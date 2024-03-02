import { createSlice } from "@reduxjs/toolkit";

const viewedUsers = createSlice({
  name: "viewedUsers",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {
    addAUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },

    addFollower: (state, action) => {
      const newArr = state.users.map((item) => {
        if (item._id == action.payload.userId) {
          return {
            ...item,
            followers: [...item.followers, action.payload.newFollower],
          };
        }
        return item;
      });
      state.users = newArr;
    },
    delFollower: (state, action) => {
      const newArr = state.users.map((item) => {
        if (item._id == action.payload.userId) {
          return {
            ...item,
            followers: item.followers.filter(
              (obj) => obj._id !== action.payload.followerId
            ),
          };
        }
        return item;
      });
      state.users = newArr;
    },
  },
});

export const { addAUser, updateLoading, addFollower, delFollower } =
  viewedUsers.actions;
export default viewedUsers.reducer;
