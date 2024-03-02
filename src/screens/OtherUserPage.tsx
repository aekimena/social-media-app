import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { texts } from "../utils/texts";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, gql, useMutation } from "@apollo/client";
import { addPost, updatePostLoading } from "../redux/features/userPosts";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  addAUser,
  addFollower,
  delFollower,
  updateLoading,
} from "../redux/features/viewedUsers";
import {
  addViewedPost,
  updateViewedPostsLoading,
} from "../redux/features/viewedPosts";
import {
  updateFollowUser,
  updateUnfollowUser,
} from "../redux/features/userDetails";
import { updateUserId } from "../redux/features/followersInView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OtherUserPostMediaRoute } from "../routes/OtherUserPostMediaRoute";
import { Image } from "expo-image";
import RenderUserPostsFollowersFollowing from "../components/RenderUserPostsFollowersFollowing";
import RenderUserProfileDetails from "../components/RenderUserProfileDetails";
import RenderUserProfileAvatar from "../components/RenderUserProfileAvatar";
import RenderUserPageHeaders from "../components/RenderUserPageHeaders";
import { FOLLOW_USER, GET_USER, UNFOLLOW_USER } from "../utils/gqlSchemas";

const ListHeader = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const paramId = route.params.userDetails._id;
  const viewedUsers = useSelector((state: any) => state.viewedUsers.users);
  const userDetails = viewedUsers.find((obj) => obj._id == paramId);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const findingPosts = useSelector((state: any) => state.viewedPosts.loading);
  const viewedPosts = useSelector((state: any) => state.viewedPosts.posts);
  const postsExist = viewedPosts.find((obj) => obj.userId == userDetails?._id);
  const following = user.following.find((obj) => obj._id == userDetails?._id);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unFollowUser] = useMutation(UNFOLLOW_USER);

  async function handleFollowUserInDB() {
    await followUser({
      variables: { userId: paramId, followerId: user._id },
    })
      .then((res) => {
        if (res.data.followUser) {
          console.log("followed");
        }
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  }
  async function handleUnFollowUserInDB() {
    await unFollowUser({
      variables: { userId: paramId, followerId: user._id },
    })
      .then((res) => {
        if (res.data.unFollowUser) {
          console.log("unfollowed");
        }
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  }

  function handleFollow() {
    if (!following) {
      dispatch(
        addFollower({
          userId: userDetails?._id,
          newFollower: {
            _id: user._id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        })
      );
      dispatch(
        updateFollowUser({
          _id: userDetails?._id,
          username: userDetails?.username,
          name: userDetails?.name,
          avatarUrl: userDetails?.avatarUrl,
        })
      );

      handleFollowUserInDB();
    } else {
      // setIsFollwoing(!isFollowing);
      dispatch(delFollower({ userId: userDetails?._id, followerId: user._id }));
      dispatch(updateUnfollowUser({ _id: userDetails?._id }));
      handleUnFollowUserInDB();
    }
  }

  function handleSeeFollowers() {
    (async () => {
      dispatch(updateUserId(paramId));
    })().then(() => {
      navigation.navigate("FollowUnfollowRoute", {
        screen: "Followers",
      });
    });
  }
  function handleSeeFollowing() {
    (async () => {
      dispatch(updateUserId(paramId));
    })().then(() => {
      navigation.navigate("FollowUnfollowRoute", {
        screen: "Following",
      });
    });
  }

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 20, gap: 5 }}>
      <View style={styles.image_Numbers}>
        <RenderUserProfileAvatar user={userDetails} />
        <View>
          <RenderUserPostsFollowersFollowing
            posts={postsExist?.posts}
            seeFollowers={handleSeeFollowers}
            seeFollowing={handleSeeFollowing}
            user={userDetails}
          />
          <TouchableOpacity
            onPress={handleFollow}
            activeOpacity={0.8}
            style={[
              styles.followBtn,
              { backgroundColor: following ? "#f1f1f1" : colors.themeColor },
            ]}
          >
            <Text
              style={{
                color: following ? "#333" : "#fff",
                fontSize: texts.sm,
              }}
            >
              {following ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <RenderUserProfileDetails user={userDetails} />
    </View>
  );
};

const OtherUserPage = () => {
  const route = useRoute<any>();
  const paramId = route.params.userDetails._id;
  const userDetails = route.params.userDetails;
  const findingUser = useSelector((state: any) => state.viewedUsers.loading);
  const [gettingUser, setGettingUser] = useState(true);
  const viewedUsers = useSelector((state: any) => state.viewedUsers.users);
  const navigation = useNavigation();
  const [existingUser, setExistingUser] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: paramId },
  });
  const userViewed = viewedUsers.find((obj) => obj._id == paramId);
  const [getError, setGetError] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "100%"], []);

  useEffect(() => {
    try {
      dispatch(updateLoading(true));
      const userViewed = viewedUsers.find((obj) => obj._id == paramId);
      if (userViewed) {
        // setExistingUser(userViewed);
        dispatch(updateLoading(false));
        setGettingUser(false);
      } else if (!loading && !error) {
        console.log(data);
        // setExistingUser(data.oneUser);
        dispatch(addAUser(data.oneUser));
        dispatch(updateLoading(false));
        setGettingUser(false);
      }
    } catch (err) {
      console.log(err);
      dispatch(updateLoading(false));
      setGettingUser(false);
      setGetError(true);
    }
  }, [data, error, loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <RenderUserPageHeaders func={null} />
        <View style={{ flex: 1 }}>
          {findingUser || gettingUser ? (
            <View style={styles.flex}>
              <ActivityIndicator size={30} color={colors.themeColor} />
            </View>
          ) : getError && !findingUser ? (
            <View style={styles.flex}>
              <Text>Error getting data...</Text>
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <ListHeader />
              </View>
              <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
              >
                <View style={{ flex: 1 }}>
                  <OtherUserPostMediaRoute />
                </View>
              </BottomSheet>
            </>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default OtherUserPage;

const styles = StyleSheet.create({
  image_Numbers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  followBtn: {
    height: 40,
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
