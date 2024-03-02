import { StyleSheet } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import AppContextProvider from "./src/contexts/appContext";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AppContextProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </AppContextProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
