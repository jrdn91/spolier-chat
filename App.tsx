import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import SignUpForm from "./app/forms/SignUpForm";
import * as eva from "@eva-design/eva";

import { SignedIn, SignedOut } from "./app/components/Auth";
import { AuthProvider } from "./app/providers/AuthProvider";
import { ApplicationProvider, Text } from "@ui-kitten/components";

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <ApplicationProvider
      {...eva}
      theme={colorScheme === "light" ? eva.light : eva.dark}
    >
      <AuthProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <SignedIn>
            <Text>Open up App.tsx to start working on your app!</Text>
          </SignedIn>
          <SignedOut>
            <SignUpForm />
          </SignedOut>
        </SafeAreaView>
      </AuthProvider>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
