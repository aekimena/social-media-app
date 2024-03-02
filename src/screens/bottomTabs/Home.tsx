import {
  ActivityIndicator,
  FlatList,
  // Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useQuery, gql } from "@apollo/client";
import { colors } from "../../utils/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import { texts } from "../../utils/texts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPost,
  addNewPostLocally,
  addReloadedPost,
  addUploadingPosts,
  delPreviousUploadingPost,
  delUploadingPosts,
  likePost,
  unlikePost,
  updateFeedLoading,
} from "../../redux/features/feeds";
import PostsList from "../../components/PostList";
import StatusList from "../../components/StatusList";
import { AppContext } from "../../contexts/appContext";
import { socket } from "../../socket";
import { hideUpdate, showUpdate } from "../../redux/features/homeUpdate";
import {
  addToSocketPosts,
  delCollection,
  showIndicator,
} from "../../redux/features/postsFromSocket";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { addUrl } from "../../redux/features/uploadMediaSlice";
import { unLikeUserPost } from "../../redux/features/userPosts";
import { unlikePostInViewedPosts } from "../../redux/features/viewedPosts";
import { newFollower, unfollowed } from "../../redux/features/userDetails";
import { GET_POSTS, RELOAD_POSTS } from "../../utils/gqlSchemas";

const LoadingMoreIndicator = () => {
  return (
    <View
      style={{
        height: 50,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={20} color={colors.themeColor} />
    </View>
  );
};

const Home = () => {
  const { HomeFeedScrollRef, counter, setCounter } = useContext(AppContext);
  const feeds = useSelector((state: any) => state.feeds.feedsArray);
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const startNo = feeds.length;
  const endNo = feeds.length + 10;
  const latestPostId = useSelector(
    (state: any) => state.feeds.feedsArray[0]?._id
  );
  const latestPost = useSelector((state: any) => state.feeds.feedsArray[0]);
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: {
      start: startNo,
      end: endNo,
    },
  });
  const { error: reloadErr, refetch: reloadRefetch } = useQuery(RELOAD_POSTS, {
    variables: {
      id: latestPostId,
    },
  });

  const [moreDataLeft, setMoreDataLeft] = useState(true);
  const [loadingDone, setLoadingDone] = useState(true);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const postsUploading = useSelector(
    (state: any) => state.feeds.uploadingPosts
  );

  const postIsUploading = postsUploading.length > 0;

  const pending = postsUploading[0]?.status == "pending";
  const failed = postsUploading[0]?.status == "failed";
  const [refreshing, setRefreshing] = useState(false);

  const isUpdateShown = useSelector(
    (state: any) => state.homeUpdate.updateShown
  );
  const iconName = useSelector((state: any) => state.homeUpdate.iconName);
  const updateTxt = useSelector((state: any) => state.homeUpdate.text);
  const [gettingPosts, setGettingPosts] = useState(true);
  const newPosts = useSelector(
    (state: any) => state.postsFromSocket.collection
  );
  const newPostsLength = useSelector(
    (state: any) => state.postsFromSocket.collection.length
  );
  const indicatorShown = useSelector(
    (state: any) => state.postsFromSocket.showIndicator
  );

  const [topIndicatorShown, setTopIndicatorShown] = useState(false);
  const route = useRoute<any>();
  const imageUrls = useSelector((state: any) => state.mediaSlice.imageUrls);
  const { uploadMediaPost } = useContext(AppContext);
  const pickedImages = useSelector(
    (state: any) => state.mediaSlice.pickedImages
  );

  useEffect(() => {
    if (counter == pickedImages.length && counter !== 0) {
      const { postTxt, standBy } = route.params;
      uploadMediaPost(postTxt, user._id, imageUrls, standBy);
      setCounter(0);
    }
  }, [counter, pickedImages]);

  /////

  async function reloadUserFeed() {
    setRefreshing(true);
    console.log(latestPost);
    await reloadRefetch()
      .then((res) => {
        const { reloadFeed } = res.data;
        // console.log(reloadFeed);
        if (reloadFeed.length > 0) {
          reloadFeed.map((item: any) => {
            const postExists = feeds.find((obj: any) => obj._id === item._id);
            if (postExists) {
              null;
            } else {
              dispatch(addReloadedPost(item));
            }
          });
          dispatch(delCollection());
          setRefreshing(false);
        } else if (reloadErr) {
          console.log(reloadErr);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setRefreshing(false);
      });
  }

  const getData = () => {
    setLoadingDone(false);
    try {
      if (feeds.length == 0) {
        setGettingPosts(true);
      }

      if (data) {
        const { posts } = data;

        posts.map((item: any) => {
          const postExists = feeds.find((obj: any) => obj._id === item._id);
          if (postExists) {
            null;
          } else {
            dispatch(addNewPost(item));
          }
        });
        if (posts.length == 0) {
          console.log("no more data");
          setMoreDataLeft(false);
        }
      }
      setLoadingDone(true);
      setGettingPosts(false);
    } catch (error) {
      console.log(error);
      setGettingPosts(false);
      setLoadingDone(true);
      setMoreDataLeft(false);
    }
  };

  useEffect(() => {
    getData();
  }, [data, loading, error]);

  useEffect(() => {
    socket.connect();
    socket.on("post uploaded", (data) => {
      const posterId = user.following.find((obj) => obj._id == data.owner._id);
      if (posterId && data.owner._id !== user._id) {
        dispatch(addToSocketPosts(data));
      }
    });

    socket.on("post liked", (data) => {
      if (data.post.owner._id == user._id && data.liker._id !== user._id) {
        dispatch(
          likePost({
            user: { _id: data.liker._id },
            postId: data.post._id,
          })
        );
        dispatch(
          showUpdate({
            iconName: "heart",
            text: `@${data.liker.username} liked your post`,
          })
        );

        setTimeout(() => {
          dispatch(hideUpdate(null));
        }, 3000);
      }
    });
    socket.on("post unliked", (data) => {
      if (data.post.owner._id == user._id && data.unliker._id !== user._id) {
        const unLikeObj = {
          user: { _id: data.unliker._id },
          postId: data.post._id,
        };
        dispatch(unlikePost(unLikeObj));
        dispatch(unLikeUserPost(unLikeObj));
      }
    });

    socket.on("followed", (data) => {
      if (data.user._id == user._id) {
        dispatch(newFollower({ _id: data.follower._id }));
        dispatch(
          showUpdate({
            iconName: "person",
            text: `@${data.follower.username} followed you.`,
          })
        );

        setTimeout(() => {
          dispatch(hideUpdate(null));
        }, 3000);
      }
    });
    socket.on("unFollowed", (data) => {
      if (data.user._id == user._id) {
        dispatch(unfollowed({ _id: data.follower._id }));
      }
    });

    socket.on("commented", (data) => {
      console.log(data);
      if (data.owner == user._id) {
        dispatch(
          showUpdate({
            iconName: "chatbubbles",
            text: `@${data.owner.username} commented on your post.`,
          })
        );

        setTimeout(() => {
          dispatch(hideUpdate(null));
        }, 3000);
      }
    });

    socket.on("replied", (data) => {
      if (data.post.owner._id == user._id) {
        dispatch(
          showUpdate({
            iconName: "chatbubbles",
            text: `@${data.owner.username} replied to a comment on your post.`,
          })
        );

        setTimeout(() => {
          dispatch(hideUpdate(null));
        }, 3000);
      }
    });
  }, []);

  // i'm trying to find a way to indicate new posts, but i can only do it when a scroll event is detected. i need a better solution
  function handleNewPostIndicator(event) {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 200 && indicatorShown) {
      dispatch(delCollection(null));
      dispatch(showIndicator(false));
      setTopIndicatorShown(false);
    } else if (contentOffset.y <= 500) {
      if (newPostsLength > 0) {
        newPosts.map((item) => {
          dispatch(addNewPostLocally(item));
        });
        dispatch(delCollection(null));
      }
    } else {
      if (newPostsLength > 0) {
        newPosts.map((item) => {
          dispatch(addNewPostLocally(item));
        });
        dispatch(showIndicator(true));
        setTopIndicatorShown(true);
      }
    }
  }

  function handleTopIndicatorPress() {
    HomeFeedScrollRef.current.scrollToOffset({
      animated: true,
      offset: 0,
    });
    dispatch(delCollection(null));
    dispatch(showIndicator(false));
    setTopIndicatorShown(false);
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <StatusBar translucent={false} backgroundColor={colors.backgroundColor} />

      <View style={styles.headers}>
        <Text style={styles.appName}>SocialBox</Text>
        <View style={styles.headerInnerRow}>
          <Pressable
            onPress={() => navigation.navigate("NewPost")}
            style={styles.headerIconsCont}
          >
            <IonIcons name="add" color={colors.iconColor} size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Search")}
            style={styles.headerIconsCont}
          >
            <IonIcons
              name="search-outline"
              color={colors.iconColor}
              size={20}
            />
          </Pressable>
        </View>
      </View>
      {postIsUploading && (
        <View
          style={[
            styles.postUploadView,
            { backgroundColor: failed ? "red" : colors.themeColor },
          ]}
        >
          {pending && (
            <Text style={{ color: "#fff", fontSize: texts.sm }}>
              {`Uploading post 1/${postsUploading.length}`}
            </Text>
          )}
          {failed && (
            <View>
              <Text style={{ color: "#fff", fontSize: texts.sm }}>
                {`Post upload 1/${postsUploading.length} failed!`}
              </Text>
            </View>
          )}
          {pending && <ActivityIndicator size={20} color={"#fff"} />}
          {failed && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 25 }}
            >
              <Text style={{ color: "#fff", fontSize: texts.sm }}>Retry</Text>
              <Pressable
                onPress={() => {
                  dispatch(delPreviousUploadingPost());
                }}
              >
                <IonIcons name="close" color="#fff" size={20} />
              </Pressable>
            </View>
          )}
        </View>
      )}

      {gettingPosts ? (
        <>
          <View style={styles.gettingPostCont}>
            <StatusList />
            <View style={styles.spinnerCont}>
              <ActivityIndicator size={30} color={colors.themeColor} />
            </View>
          </View>
        </>
      ) : (
        <FlatList
          ref={HomeFeedScrollRef}
          data={feeds}
          keyExtractor={(item) => item._id}
          renderItem={(item) => <PostsList {...item} />}
          ListHeaderComponent={<StatusList />}
          contentContainerStyle={{ gap: 0, paddingVertical: 15 }}
          ItemSeparatorComponent={() => (
            <View style={styles.postSeperator}></View>
          )}
          ListFooterComponent={
            feeds.length < 1 ? null : loading || !loadingDone ? (
              <LoadingMoreIndicator />
            ) : null
          }
          refreshControl={
            <RefreshControl
              colors={[colors.themeColor]}
              refreshing={refreshing}
              onRefresh={reloadUserFeed}
            />
          }
          onEndReached={loadingDone && moreDataLeft && getData}
          onScroll={handleNewPostIndicator}
        />
      )}

      {isUpdateShown && (
        <View style={styles.infoBoxCont}>
          <View style={styles.infoBox}>
            <IonIcons name={iconName} color={colors.themeColor} size={20} />
            <Text style={{ color: "#333", fontSize: texts.sm, lineHeight: 14 }}>
              {updateTxt}
            </Text>
          </View>
        </View>
      )}
      {indicatorShown && newPostsLength > 0 && topIndicatorShown && (
        <TouchableOpacity
          style={styles.newPostIndicator}
          activeOpacity={0.7}
          onPress={handleTopIndicatorPress}
        >
          <IonIcons name="arrow-up" color={"#fff"} size={15} />
          <Text style={{ color: "#fff", fontSize: texts.sm }}>new posts</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.iconColor,
  },
  headerInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  appName: {
    fontSize: texts.md,
    fontWeight: "700",
    fontFamily: "sans-serif",
  },
  postUploadView: {
    height: 40,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  infoBoxCont: {
    position: "absolute",
    bottom: 15,
    height: "auto",
    width: "100%",
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  infoBox: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#E5F1F6",
    borderRadius: 10,
    borderColor: colors.themeColor,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  newPostIndicator: {
    position: "absolute",
    alignSelf: "center",
    top: 70,
    borderRadius: 50,
    backgroundColor: colors.themeColor,
    height: 35,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  headerIconsCont: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
  },
  gettingPostCont: {
    paddingTop: 15,
    flex: 1,
  },
  spinnerCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postSeperator: {
    height: 0.5,
    width: "100%",
    backgroundColor: colors.iconColor,
  },
});
