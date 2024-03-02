import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../utils/colors";
import { texts } from "../../utils/texts";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useDebounce } from "use-debounce";
import { CHECK_USERNAME } from "../../utils/gqlSchemas";

const Username = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [value] = useDebounce(username, 1000);
  const [inputErr, setInputErr] = useState("");
  const [proceed, setProceed] = useState(false);
  const [checkUsername, { data, loading, error }] = useMutation(CHECK_USERNAME);
  const usernameRegex = /^[a-z0-9_]+$/;

  function usernameCheck() {
    if (!usernameRegex.test(username)) {
      setProceed(false);
      setInputErr(
        "username must contain only lowercase letters, numbers or underscores"
      );
      return;
    }

    checkUsername({
      variables: { username: username },
    })
      .then((res) => {
        console.log(res.data.checkUsername);
        if (res.data.checkUsername) {
          setProceed(false);
          setInputErr("This username is taken");
        } else {
          setProceed(true);
          setInputErr("This username is available");
        }
      })
      .catch((err) => {
        console.log("error", err);
        setProceed(false);
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      });
  }
  useEffect(() => {
    username !== "" && usernameCheck();
  }, [value]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headers}>
        <Text style={styles.appName}>SocialBox</Text>
        <Pressable
          style={{ position: "absolute", left: 20 }}
          onPress={() => navigation.goBack()}
        >
          <IonIcon
            name="arrow-back-outline"
            color={colors.iconColor}
            size={20}
          />
        </Pressable>
      </View>
      <View style={[{ marginTop: 30, gap: 4, paddingHorizontal: 20 }]}>
        <View>
          <View style={styles.txtInputCont}>
            <IonIcon name="person-outline" color={colors.iconColor} size={16} />
            <TextInput
              style={styles.txtInput}
              placeholder="Enter a unique username"
              placeholderTextColor={colors.iconColor}
              defaultValue={username}
              onChangeText={(newTxt) => setUsername(newTxt)}
            />
          </View>
          <Text
            style={[styles.errInfo, { color: proceed ? "green" : "#ff0000" }]}
          >
            {username == "" ? "" : inputErr}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("SignUp", { username: value })}
          style={styles.btn}
          disabled={!proceed || value == "" || loading}
        >
          <Text
            style={{ color: "#fff", fontSize: texts.md, fontWeight: "500" }}
          >
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Username;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  appName: {
    color: colors.textColor,
    fontSize: texts.lg,
    fontWeight: "700",
  },
  txtInputCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f8f8",
    height: 50,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  txtInput: {
    flex: 1,
    height: "100%",
    width: "100%",
    color: colors.textColor,
    fontSize: texts.sm,
  },
  errInfo: { fontSize: texts.xs },
  btn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor,
    borderRadius: 10,
  },
  headers: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
