import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import PostsList from "../components/PostList";
import RenderPostsMediaList from "../components/RenderPostsMediaList";

const Media = () => {
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postsLoading = useSelector(
    (state: any) => state.userPosts.postsLoading
  );
  const posts = useSelector((state: any) => state.userPosts.posts);
  const mediaPosts = posts.filter((item) => item.postType !== "text");
  const errorGettingPosts = useSelector(
    (state: any) => state.userPosts.getUserPostsErr
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      {postsLoading ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size={30} color={colors.themeColor} />
        </View>
      ) : errorGettingPosts ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <Text>Error getting Media...</Text>
        </View>
      ) : (
        <RenderPostsMediaList data={mediaPosts} Component={PostsList} />
      )}
    </View>
  );
};

export default Media;

const styles = StyleSheet.create({});
