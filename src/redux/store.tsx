import { configureStore } from "@reduxjs/toolkit";
import feedsSlice from "./features/feeds";
import userSlice from "./features/userDetails";
import userPosts from "./features/userPosts";
import postInView from "./features/postInView";
import viewedUsers from "./features/viewedUsers";
import viewedPosts from "./features/viewedPosts";
import commentInView from "./features/commentInView";
import followersInView from "./features/followersInView";
import followingInView from "./features/followingInView";
import mediaSlice from "./features/uploadMediaSlice";
import imagesInView from "./features/imagesInView";
import homeUpdate from "./features/homeUpdate";
import postsFromSocket from "./features/postsFromSocket";

export default configureStore({
  reducer: {
    feeds: feedsSlice,
    userDetails: userSlice,
    userPosts,
    postInView,
    commentInView,
    viewedUsers,
    viewedPosts,
    followersInView,
    followingInView,
    mediaSlice,
    imagesInView,
    homeUpdate,
    postsFromSocket,
  },
});
