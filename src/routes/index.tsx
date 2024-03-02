import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { AuthRoute } from "./AuthRoute";
import { HomeRoute } from "./HomeRoute";
import { Search } from "../screens/Search";
import { OtherUserRoute } from "./OtherUserRoute";
import ViewPostScreen from "../screens/ViewPostScreen";
import { FollowUnfollowRoute } from "./FollowUnfollowRoute";
import Comment from "../screens/Comment";
import NewPost from "../screens/NewPost";
import Images from "../screens/Images";
import EditProfile from "../screens/EditProfile";

const Routes = () => {
  const Stack = createNativeStackNavigator();
  const user = useSelector((state: any) => state.userDetails.user);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "card" }}
    >
      {user.length === 0 ? (
        <Stack.Screen name="AuthRoute" component={AuthRoute} />
      ) : (
        <>
          <Stack.Screen name="HomeRoute" component={HomeRoute} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="OtherUserRoute" component={OtherUserRoute} />
          <Stack.Screen name="ViewPost" component={ViewPostScreen} />
          <Stack.Screen
            name="FollowUnfollowRoute"
            component={FollowUnfollowRoute}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="NewPost" component={NewPost} />
          <Stack.Screen name="Images" component={Images} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routes;

const styles = StyleSheet.create({});
