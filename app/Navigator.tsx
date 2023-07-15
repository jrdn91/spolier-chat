import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useSignedIn from "./hooks/useSignedIn";
import List from "./screens/List";
import SignIn from "./screens/SignIn";
import Message from "./screens/Message";

export type RootStackParamList = {
  List: undefined;
  Message: { messageId: string };
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  const signedIn = useSignedIn();

  return (
    <Stack.Navigator>
      {signedIn ? (
        <>
          <Stack.Screen
            name="List"
            options={{
              title: "Messages",
            }}
            component={List}
          />
          <Stack.Screen
            name="Message"
            options={{
              title: "Message",
            }}
            component={Message}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            options={{
              headerShown: false,
            }}
            component={SignIn}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigator;
