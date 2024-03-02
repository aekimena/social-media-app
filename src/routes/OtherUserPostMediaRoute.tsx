import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OtherUserPosts from "../screens/OtherUserPosts";
import OtherUserMedia from "../screens/OtherUserMedia";

const Tab = createMaterialTopTabNavigator();

export function OtherUserPostMediaRoute() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen
        name="OtherUserPosts"
        component={OtherUserPosts}
        options={{ title: "posts" }}
      />
      <Tab.Screen
        name="OtherUserMedia"
        component={OtherUserMedia}
        options={{ title: "media" }}
      />
    </Tab.Navigator>
  );
}
