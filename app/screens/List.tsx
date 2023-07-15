import FeatherIcon from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { ListItem, Text } from "@ui-kitten/components";
import dayjs from "dayjs";
import React from "react";
import { View } from "react-native";
import { RootStackParamList } from "../Navigator";

const MESSAGES = [
  {
    messageName: "The Mandalorian",
    recentMessage: {
      text: "This is the way.",
      timestamp: dayjs().subtract(1, "hour").toISOString(),
    },
  },
  {
    messageName: "Openheimer",
    recentMessage: {
      text: "I can't wait to see this!!!",
      timestamp: dayjs().subtract(2, "day").toISOString(),
    },
  },
  {
    messageName: "Asteroid City",
    recentMessage: {
      text: "It was amazing!",
      timestamp: dayjs().subtract(8, "day").toISOString(),
    },
  },
];

const MessageTime = ({
  children,
}: {
  children: string;
}): React.ReactElement => {
  const time = dayjs(children);
  if (time.isToday()) {
    return <Text>{time.format("h:mm A")}</Text>;
  }
  if (time.isBetween(dayjs().startOf("week"), dayjs().endOf("week"))) {
    return <Text>{time.format("dddd")}</Text>;
  }
  return <Text>{time.format("M/D/YY")}</Text>;
};

const ItemImage = (): React.ReactElement => (
  <View
    style={{
      borderRadius: 40,
      height: 40,
      width: 40,
      backgroundColor: "#cecece",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <FeatherIcon name="user" color="#fff" size={24} />
  </View>
);

type Props = NativeStackScreenProps<RootStackParamList, "List">;

const List = ({ navigation }: Props) => {
  return (
    <FlashList
      data={MESSAGES}
      renderItem={({ item }) => (
        <ListItem
          style={{ height: 60 }}
          title={item.messageName}
          description={item.recentMessage.text}
          accessoryLeft={ItemImage}
          accessoryRight={() => (
            <MessageTime>{item.recentMessage.timestamp}</MessageTime>
          )}
          onPress={() =>
            navigation.navigate("Message", {
              messageId: "some-id",
            })
          }
        />
      )}
      estimatedItemSize={200}
    />
  );
};

export default List;
