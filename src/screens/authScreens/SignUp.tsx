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
import { useNavigation, useRoute } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { gql, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../redux/features/userDetails";
import { ADD_NEW_USER_SIGNUP } from "../../utils/gqlSchemas";

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [email, setEmail] = useState("");
  const [inputName, setInputName] = useState("");
  const [password, setPassword] = useState("");
  const [nameErr, setInputNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const nameRegex = /^[a-zA-Z0-9_]+$/;
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{3,}$/;

  const [newUser, { data, loading, error }] = useMutation(ADD_NEW_USER_SIGNUP);
  const dispatch = useDispatch();

  async function signUp() {
    if (inputName == "") {
      setNameEmpty(true);
      setTimeout(() => {
        setNameEmpty(false);
      }, 1000);
      return;
    }
    if (email == "") {
      setEmailEmpty(true);
      setTimeout(() => {
        setEmailEmpty(false);
      }, 1000);
      return;
    }
    if (password == "") {
      setPasswordEmpty(true);
      setTimeout(() => {
        setPasswordEmpty(false);
      }, 1000);
      return;
    }

    if (!nameRegex.test(inputName)) {
      setInputNameErr(true);
      setTimeout(() => {
        setInputNameErr(false);
      }, 1000);
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailErr(true);
      setTimeout(() => {
        setEmailErr(false);
      }, 1000);
      return;
    }
    if (password.length < 6) {
      setPasswordErr(true);
      setTimeout(() => {
        setPasswordErr(false);
      }, 1000);
      return;
    }
    await newUser({
      variables: {
        name: inputName,
        username: route.params.username,
        email: email,
        password: password,
      },
    })
      .then((res) => {
        console.log(res.data.newUser);
        dispatch(updateUserDetails(res.data.newUser));
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
          <View style={[{ marginTop: 30, gap: 15, paddingHorizontal: 20 }]}>
            <View>
              <View
                style={[
                  styles.txtInputCont,
                  { backgroundColor: nameEmpty ? "#FFB8B8" : "#f8f8f8" },
                ]}
              >
                <IonIcon
                  name="person-outline"
                  color={colors.iconColor}
                  size={16}
                />
                <TextInput
                  style={styles.txtInput}
                  placeholder="Name"
                  placeholderTextColor={colors.iconColor}
                  defaultValue={inputName}
                  onChangeText={(newTxt) => setInputName(newTxt)}
                />
              </View>
              {nameErr && (
                <Text style={styles.errInfo}>
                  Name can only contain letters, numbers, underscores
                </Text>
              )}
            </View>
            <View>
              <View
                style={[
                  styles.txtInputCont,
                  { backgroundColor: emailEmpty ? "#FFB8B8" : "#f8f8f8" },
                ]}
              >
                <IonIcon
                  name="mail-outline"
                  color={colors.iconColor}
                  size={16}
                />
                <TextInput
                  style={styles.txtInput}
                  placeholder="Email"
                  placeholderTextColor={colors.iconColor}
                  defaultValue={email}
                  onChangeText={(newTxt) => setEmail(newTxt)}
                  keyboardType="email-address"
                />
              </View>
              {emailErr && (
                <Text style={styles.errInfo}>Invaild email address</Text>
              )}
            </View>
            <View>
              <View
                style={[
                  styles.txtInputCont,
                  { backgroundColor: passwordEmpty ? "#FFB8B8" : "#f8f8f8" },
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
              {passwordErr && (
                <Text style={styles.errInfo}>
                  Password must be atleast 6 characters long
                </Text>
              )}
            </View>
            <View style={{ alignItems: "flex-end" }}></View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={signUp}
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
                  SIGN UP
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundColor },
  headers: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
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
  errInfo: { color: "#ff0000", fontSize: texts.xs },
  btn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor,
    borderRadius: 10,
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
