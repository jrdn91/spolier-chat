import * as eva from "@eva-design/eva";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import Navigator from "./app/Navigator";
import { AuthProvider } from "./app/providers/AuthProvider";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
dayjs.extend(isToday);
dayjs.extend(isBetween);

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <ApplicationProvider
      {...eva}
      theme={colorScheme === "light" ? eva.light : eva.dark}
    >
      <StatusBar style="auto" />
      <AuthProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
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
