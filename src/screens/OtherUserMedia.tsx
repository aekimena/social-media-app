import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";
import PostsList from "../components/PostList";
import RenderPostsMediaList from "../components/RenderPostsMediaList";

const OtherUserMedia = () => {
  const userId = useSelector((state: any) => state.viewedPosts.userId);
  const viewedPosts = useSelector((state: any) => state.viewedPosts.posts);
  const savedPost = viewedPosts.find((obj) => obj.userId == userId);
  const postsLoading = useSelector((state: any) => state.viewedPosts.loading);
  const mediaPosts = savedPost?.posts.filter(
    (item: any) => item.postType !== "text"
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      {postsLoading ? (
        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size={30} color={colors.themeColor} />
        </View>
      ) : (
        <RenderPostsMediaList data={mediaPosts} Component={PostsList} />
      )}
    </View>
  );
};

export default OtherUserMedia;

const styles = StyleSheet.create({});
