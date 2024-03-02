import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { colors } from "../utils/colors";
import {
  addViewedPost,
  updateViewedPostsLoading,
} from "../redux/features/viewedPosts";
import { gql, useQuery } from "@apollo/client";
import PostsList from "../components/PostList";
import { GET_OTHER_USER_POSTS } from "../utils/gqlSchemas";
import RenderPostsMediaList from "../components/RenderPostsMediaList";

const OtherUserPosts = () => {
  const userId = useSelector((state: any) => state.viewedPosts.userId);
  const viewedUsers = useSelector((state: any) => state.viewedUsers.users);
  const findingUser = useSelector((state: any) => state.viewedUsers.loading);
  const viewedPosts = useSelector((state: any) => state.viewedPosts.posts);
  const savedPost = viewedPosts.find((obj) => obj.userId == userId);
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GET_OTHER_USER_POSTS, {
    variables: { id: userId },
  });
  const [gettingPosts, setGettingPosts] = useState(false);
  const [getPostsError, setGetPostsError] = useState(false);

  useEffect(() => {
    dispatch(updateViewedPostsLoading(true));
    setGettingPosts(true);
    const postsExist = viewedPosts.find((obj) => obj.userId == userId);
    if (postsExist) {
      // setExistingPosts(postsExist.posts);
      setGettingPosts(false);
      dispatch(updateViewedPostsLoading(false));
    } else if (!loading && !error) {
      // setExistingPosts(data.userPosts);

      dispatch(
        addViewedPost({
          userId: userId,
          posts: data.userPosts,
        })
      );
      dispatch(updateViewedPostsLoading(false));
      setGettingPosts(false);
    } else if (error) {
      console.log(error);
      dispatch(updateViewedPostsLoading(false));
      setGetPostsError(true);
      setGettingPosts(false);
    }
  }, [data, loading, error]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      {gettingPosts ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size={30} color={colors.themeColor} />
        </View>
      ) : getPostsError ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <Text>Error getting posts...</Text>
        </View>
      ) : (
        <RenderPostsMediaList data={savedPost?.posts} Component={PostsList} />
      )}
    </View>
  );
};

export default OtherUserPosts;

const styles = StyleSheet.create({});
