import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";
import { texts } from "../../utils/texts";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import {
  addPost,
  updateGetUserPostsErr,
  updatePostLoading,
} from "../../redux/features/userPosts";
import { updateUserId } from "../../redux/features/followersInView";
import { AppContext } from "../../contexts/appContext";
import UserAvatarPress from "../../components/BottomSheets/UserAvatarPress";
import UserMenuPress from "../../components/BottomSheets/UserMenuPress";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PostMediaRoute } from "../../routes/PostsMediaRoute";
import { Image } from "expo-image";
import { GET_POSTS, GET_USER_POSTS } from "../../utils/gqlSchemas";
import RenderUserProfileAvatar from "../../components/RenderUserProfileAvatar";
import RenderUserPostsFollowersFollowing from "../../components/RenderUserPostsFollowersFollowing";
import RenderUserProfileDetails from "../../components/RenderUserProfileDetails";
import RenderUserPageHeaders from "../../components/RenderUserPageHeaders";

const ListHeader = () => {
  const { BSRefForAvatarImg } = useContext(AppContext);
  const navigation = useNavigation<any>();
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const postsLoading = useSelector(
    (state: any) => state.userPosts.postsLoading
  );
  const posts = useSelector((state: any) => state.userPosts.posts);
  const dispatch = useDispatch();

  function handleSeeFollowers() {
    (async () => {
      dispatch(updateUserId(user._id));
    })().then(() => {
      navigation.navigate("FollowUnfollowRoute", {
        screen: "Followers",
      });
    });
  }
  function handleSeeFollowing() {
    (async () => {
      dispatch(updateUserId(user._id));
    })().then(() => {
      navigation.navigate("FollowUnfollowRoute", {
        screen: "Following",
      });
    });
  }

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 20, gap: 5 }}>
      <View style={styles.image_Numbers}>
        <Pressable onPress={() => BSRefForAvatarImg.current.open()}>
          <RenderUserProfileAvatar user={user} />
        </Pressable>

        <View>
          <RenderUserPostsFollowersFollowing
            user={user}
            posts={posts}
            seeFollowers={handleSeeFollowers}
            seeFollowing={handleSeeFollowing}
          />
        </View>
      </View>
      <RenderUserProfileDetails user={user} />
    </View>
  );
};

const UserPage = () => {
  const navigation = useNavigation();
  const { BSRefForUserPageMenu } = useContext(AppContext);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GET_USER_POSTS, {
    variables: { id: user._id },
  });
  const [getPostsError, setGetPostsError] = useState(false);
  const [gettingPosts, setGettingPosts] = useState(true);
  const postsLoading = useSelector(
    (state: any) => state.userPosts.postsLoading
  );
  const posts = useSelector((state: any) => state.userPosts.posts);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "100%"], []);

  useEffect(() => {
    try {
      posts.length < 1 && dispatch(updatePostLoading(true));
      if (!loading && !error) {
        const { userPosts } = data;

        userPosts.map((item: any) => {
          const postExists = posts.find((obj: any) => obj._id == item._id);
          if (!postExists) {
            dispatch(addPost(item));
          }
        });
        dispatch(updatePostLoading(false));
        setGettingPosts(false);
      }
    } catch (err) {
      console.log(err);
      dispatch(updatePostLoading(false));
      setGettingPosts(false);
      dispatch(updateGetUserPostsErr(true));
      setGetPostsError(true);
    }
  }, [data, loading, error]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <RenderUserPageHeaders
          func={() => BSRefForUserPageMenu.current.open()}
        />
        {postsLoading || gettingPosts ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={30} color={colors.themeColor} />
          </View>
        ) : getPostsError ? (
          <Text>Error getting posts...</Text>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <ListHeader />
            </View>

            <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
              <View style={styles.contentContainer}>
                <PostMediaRoute />
              </View>
            </BottomSheet>
            <UserAvatarPress />
            <UserMenuPress />
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },

  image_Numbers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
