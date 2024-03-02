import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import PostsList from "../components/PostList";
import RenderPostsMediaList from "../components/RenderPostsMediaList";

const Posts = () => {
  // const window = useWindowDimensions();
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postsLoading = useSelector(
    (state: any) => state.userPosts.postsLoading
  );
  const errorGettingPosts = useSelector(
    (state: any) => state.userPosts.getUserPostsErr
  );
  const posts = useSelector((state: any) => state.userPosts.posts);
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      {postsLoading ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size={30} color={colors.themeColor} />
        </View>
      ) : errorGettingPosts ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <Text>Error getting posts...</Text>
        </View>
      ) : (
        <RenderPostsMediaList data={posts} Component={PostsList} />
      )}
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
