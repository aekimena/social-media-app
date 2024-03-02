import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useContext } from "react";
import Home from "../screens/bottomTabs/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import Chats from "../screens/bottomTabs/Chats";
import UserPage from "../screens/bottomTabs/UserPage";
import Notifications from "../screens/bottomTabs/Notifications";
import { AppContext } from "../contexts/appContext";
import { useDispatch, useSelector } from "react-redux";
import {
  delCollection,
  showIndicator,
} from "../redux/features/postsFromSocket";

function MyTabBar({ state, descriptors, navigation }) {
  const { width } = useWindowDimensions();
  const { HomeFeedScrollRef } = useContext(AppContext);
  const newPostsLength = useSelector(
    (state) => state.postsFromSocket.collection.length
  );
  const indicatorShown = useSelector(
    (state) => state.postsFromSocket.showIndicator
  );
  const dispatch = useDispatch();
  return (
    <View style={[styles.bottomTabs, { width: width }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = route.name;
        let iconColor;
        let iconName;
        switch (label) {
          case "Home":
            iconName = isFocused ? "home" : "home-outline";
            iconColor = isFocused ? colors.textColor : colors.iconColor;
            break;
          case "Chats":
            iconName = isFocused ? "chatbubbles" : "chatbubbles-outline";
            iconColor = isFocused ? colors.textColor : colors.iconColor;
            break;
          case "Search":
            iconName = isFocused ? "search" : "search-outline";
            iconColor = isFocused ? colors.textColor : colors.iconColor;
            break;
          case "Notifications":
            iconName = isFocused ? "notifications" : "notifications-outline";
            iconColor = isFocused ? colors.textColor : colors.iconColor;
            break;
          case "UserPage":
            iconName = isFocused ? "person" : "person-outline";
            iconColor = isFocused ? colors.textColor : colors.iconColor;
            break;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          } else {
            if (label == "Home") {
              HomeFeedScrollRef.current.scrollToOffset({
                animated: true,
                offset: 0,
              });
              newPostsLength > 0 && dispatch(delCollection(null));
              indicatorShown && dispatch(showIndicator(false));
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
            }}
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {label == "Home" && newPostsLength > 0 && indicatorShown && (
              <View style={{ position: "absolute", top: 0, left: "65%" }}>
                <IonIcons name="ellipse" size={5} color={colors.themeColor} />
              </View>
            )}
            <IonIcons name={iconName} size={20} color={iconColor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const HomeRoute = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />

      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="UserPage"
        component={UserPage}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomTabs: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderTopWidth: 0.5,
    borderColor: colors.iconColor,
    backgroundColor: colors.backgroundColor,
  },
  addBtn: {
    height: 20,
    width: 20,
    borderRadius: 5,
    borderWidth: 1.3,
    justifyContent: "center",
    alignItems: "center",
  },
});
