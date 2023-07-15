import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import SignUpForm from "../forms/SignUpForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigator";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

const SignIn = (props: Props) => {
  return (
    <Layout>
      <SignUpForm />
    </Layout>
  );
};

export default SignIn;
