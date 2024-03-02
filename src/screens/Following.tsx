import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import { texts } from "../utils/texts";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import { Image } from "expo-image";
import { updateFollowersInView } from "../redux/features/followersInView";
import { updateFollowingInView } from "../redux/features/followingInView";
import RenderFollowersHeader from "../components/RenderFollowersHeader";
import { GET_FOLLOWING } from "../utils/gqlSchemas";
import RenderTxtInputForFollowers from "../components/RenderTxtInputForFollowers";

const FollowingList = ({ item }) => {
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const userId = useSelector((state: any) => state.followersInView.userId);
  const viewedUsers = useSelector((state: any) => state.viewedUsers.users);
  const isFollowingBack = user?.following.find((obj) => obj._id == item._id);

  ///
  const userInView = viewedUsers.find((obj) => obj._id == userId);
  const notMutuals =
    !isFollowingBack &&
    !userInView?.following.find((obj) => obj._id == user._id);
  return (
    <Pressable style={styles.followersCont}>
      <RenderFollowersHeader item={item} />
      {user._id == userId ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.followBtn, { backgroundColor: "#F1F1F1" }]}
        >
          <Text style={{ color: "#444", fontSize: texts.sm }}>Unfollow</Text>
        </TouchableOpacity>
      ) : isFollowingBack ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.followBtn, { backgroundColor: "#F1F1F1" }]}
        >
          <Text style={{ color: "#444", fontSize: texts.sm }}>Following</Text>
        </TouchableOpacity>
      ) : notMutuals ? (
        <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
          <Text style={{ color: "#fff", fontSize: texts.sm }}>Follow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
          <Text style={{ color: "#fff", fontSize: texts.sm }}>Follow back</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const Following = () => {
  const [inputTxt, setInputTxt] = useState("");
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const userId = useSelector((state: any) => state.followersInView.userId);
  const dispatch = useDispatch();
  const savedFollowing = useSelector(
    (state: any) => state.followingInView.following
  );
  const [followingLoading, setFollowingLoading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_FOLLOWING, {
    variables: { id: userId },
  });
  const [getError, setGetError] = useState(false);

  useEffect(() => {
    (async () => {
      setFollowingLoading(true);
      refetch()
        .then((res) => {
          dispatch(updateFollowingInView(res.data.following));
          setFollowingLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setGetError(true);
          setFollowingLoading(false);
        });
    })();
  }, []);
  return (
    <View style={styles.container}>
      {followingLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <RenderTxtInputForFollowers
            input={inputTxt}
            setInput={setInputTxt}
            placeholder={"Search following"}
          />

          {getError ? (
            <View style={styles.flex}>
              <Text>Error geting following...</Text>
            </View>
          ) : savedFollowing?.length < 1 ? (
            <View style={styles.flex}>
              <Text>This user isn't following anyone</Text>
            </View>
          ) : (
            <FlatList
              data={savedFollowing}
              keyExtractor={(item: any) => item._id}
              renderItem={(item: any) => <FollowingList {...item} />}
              style={{ marginTop: 15, paddingHorizontal: 15 }}
              contentContainerStyle={{ gap: 15 }}
            />
          )}
        </>
      )}
    </View>
  );
};

export default Following;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },

  followersCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  followBtn: {
    height: 40,
    width: 105,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.themeColor,
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
