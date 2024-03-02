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
import RenderFollowersHeader from "../components/RenderFollowersHeader";
import { GET_FOLLOWERS } from "../utils/gqlSchemas";
import RenderTxtInputForFollowers from "../components/RenderTxtInputForFollowers";

const FollowersList = ({ item }) => {
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const userId = useSelector((state: any) => state.followersInView.userId);
  const viewedUsers = useSelector((state: any) => state.viewedUsers.users);
  const userInView = viewedUsers.find((obj) => obj._id == userId);
  const isFollowingBack = user.following.find((obj) => obj._id == item._id);
  const notMutuals =
    !isFollowingBack &&
    !userInView?.following.find((obj) => obj._id == user._id);
  return (
    <Pressable style={styles.followersCont}>
      <RenderFollowersHeader item={item} />
      {user._id !== item._id && (
        <View>
          {isFollowingBack ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.followBtn, { backgroundColor: "#F1F1F1" }]}
            >
              <Text style={{ color: "#444", fontSize: texts.sm }}>
                Following
              </Text>
            </TouchableOpacity>
          ) : notMutuals ? (
            <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
              <Text style={{ color: "#fff", fontSize: texts.sm }}>Follow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
              <Text style={{ color: "#fff", fontSize: texts.sm }}>
                Follow back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Pressable>
  );
};

const Followers = () => {
  const [inputTxt, setInputTxt] = useState("");
  const user = useSelector((state: any) => state.userDetails.user[0]);
  const userId = useSelector((state: any) => state.followersInView.userId);
  const dispatch = useDispatch();
  const savedFollowers = useSelector(
    (state: any) => state.followersInView.followers
  );
  const [followersLoading, setFollowersLoading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_FOLLOWERS, {
    variables: { id: userId },
  });
  const [getError, setGetError] = useState(false);

  useEffect(() => {
    (async () => {
      setFollowersLoading(true);
      refetch()
        .then((res) => {
          dispatch(updateFollowersInView(res.data.followers));
          setFollowersLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setGetError(true);
          setFollowersLoading(false);
        });
    })();
  }, []);
  return (
    <View style={styles.container}>
      {followersLoading ? (
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
            placeholder={"Search followers"}
          />
          {getError ? (
            <View style={styles.flex}>
              <Text>Error geting followers...</Text>
            </View>
          ) : savedFollowers?.length < 1 ? (
            <View style={styles.flex}>
              <Text>This user has 0 followers</Text>
            </View>
          ) : (
            <FlatList
              data={savedFollowers}
              keyExtractor={(item: any) => item._id}
              renderItem={(item: any) => <FollowersList {...item} />}
              style={{ marginTop: 15, paddingHorizontal: 15 }}
              contentContainerStyle={{ gap: 15 }}
            />
          )}
        </>
      )}
    </View>
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  followBtn: {
    height: 40,
    width: 105,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.themeColor,
  },
  followersCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
