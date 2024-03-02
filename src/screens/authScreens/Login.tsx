import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../utils/colors";
import { texts } from "../../utils/texts";
import { useNavigation } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { gql, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../redux/features/userDetails";
import { ADD_NEW_USER_LOGIN } from "../../utils/gqlSchemas";

const Login = () => {
  const navigation = useNavigation<any>();
  const [usernameErr, setUsernameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { data, loading, error }] = useMutation(ADD_NEW_USER_LOGIN);
  const dispatch = useDispatch();

  async function login() {
    if (username == "") {
      setUsernameErr(true);
      setTimeout(() => {
        setUsernameErr(false);
      }, 1000);
      return;
    }

    if (password == "") {
      setPasswordErr(true);
      setTimeout(() => {
        setPasswordErr(false);
      }, 1000);
      return;
    }

    await loginUser({ variables: { username: username, password: password } })
      .then((res) => {
        console.log(res.data.loginUser);
        if (res.data.loginUser !== (null || undefined)) {
          dispatch(updateUserDetails(res.data.loginUser));
        }
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} backgroundColor={colors.backgroundColor} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Text style={styles.appName}>SocialBox</Text>
          </View>
          <View style={[{ marginTop: 30, gap: 15, paddingHorizontal: 20 }]}>
            <View>
              <View
                style={[
                  styles.txtInputCont,
                  { backgroundColor: usernameErr ? "#FFB8B8" : "#f8f8f8" },
                ]}
              >
                <IonIcon
                  name="person-outline"
                  color={colors.iconColor}
                  size={16}
                />
                <TextInput
                  style={styles.txtInput}
                  placeholder="Username"
                  placeholderTextColor={colors.iconColor}
                  defaultValue={username}
                  onChangeText={(newTxt) => setUsername(newTxt)}
                />
              </View>
            </View>
            <View>
              <View
                style={[
                  styles.txtInputCont,
                  { backgroundColor: passwordErr ? "#FFB8B8" : "#f8f8f8" },
                ]}
              >
                <IonIcon
                  name="lock-closed-outline"
                  color={colors.iconColor}
                  size={16}
                />
                <TextInput
                  style={styles.txtInput}
                  placeholder="Password"
                  placeholderTextColor={colors.iconColor}
                  secureTextEntry={true}
                  defaultValue={password}
                  onChangeText={(newTxt) => setPassword(newTxt)}
                />
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "#4997EF",
                  fontSize: texts.sm,
                  fontWeight: "500",
                }}
              >
                Fogot password?
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={login}
              style={styles.btn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={30} color={"#fff"} />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: texts.md,
                    fontWeight: "500",
                  }}
                >
                  LOGIN
                </Text>
              )}
            </TouchableOpacity>
            <View style={styles.signupNav}>
              <Text style={{ color: "#222", fontSize: texts.sm }}>
                Already have an account?
              </Text>
              <Pressable onPress={() => navigation.navigate("Username")}>
                <Text style={styles.signupTxt}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
  errInfo: { color: "#ff0000", fontSize: 16, fontWeight: "500" },
  btn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor,
    borderRadius: 10,
    marginTop: 5,
  },
  signupNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 15,
  },
  signupTxt: {
    color: "#222",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
