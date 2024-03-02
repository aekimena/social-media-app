import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { colors } from "../utils/colors";

const RenderPostsMediaList = ({ data, Component }) => {
  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={(item: any) => item._id}
      renderItem={(item) => <Component {...item} />}
      contentContainerStyle={{ gap: 0, paddingBottom: 0 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 0.5,
            width: "100%",
            backgroundColor: colors.iconColor,
          }}
        ></View>
      )}
    />
  );
};

export default RenderPostsMediaList;

const styles = StyleSheet.create({});
