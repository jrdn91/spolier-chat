import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import { RootStackParamList } from "../Navigator";

type Props = NativeStackScreenProps<RootStackParamList, "Message">;

const Message = (props: Props) => {
  return (
    <Layout>
      <Text>Message</Text>
    </Layout>
  );
};

export default Message;
