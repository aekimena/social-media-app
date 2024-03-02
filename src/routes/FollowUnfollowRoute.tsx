import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "../screens/Followers";
import Following from "../screens/Following";
import { colors } from "../utils/colors";

const Tab = createMaterialTopTabNavigator();

export function FollowUnfollowRoute() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen name="Followers" component={Followers} />
      <Tab.Screen name="Following" component={Following} />
    </Tab.Navigator>
  );
}
