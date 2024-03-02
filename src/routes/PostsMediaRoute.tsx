import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Posts from "../screens/Posts";
import Media from "../screens/Media";

const Tab = createMaterialTopTabNavigator();

export function PostMediaRoute() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen name="Posts" component={Posts} />
      <Tab.Screen name="Media" component={Media} />
    </Tab.Navigator>
  );
}
