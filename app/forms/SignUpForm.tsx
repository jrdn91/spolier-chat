import React, { useState } from "react";
import { Animated, ImageProps, StyleSheet, Platform, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import {
  Button,
  Input,
  Layout,
  Spinner,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { Masks, formatWithMask } from "react-native-mask-input";
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

export const CELL_SIZE = 42;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = "#fff";
export const NOT_EMPTY_CELL_BG_COLOR = "#3557b7";
export const ACTIVE_CELL_BG_COLOR = "#f7fafe";

const styles = StyleSheet.create({
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  codeFieldRoot: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    ...Platform.select({ web: { lineHeight: 65 } }),
    fontSize: 30,
    textAlign: "center",
    borderRadius: CELL_BORDER_RADIUS,
    color: "#3759b8",
    backgroundColor: "#fff",

    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  // =======================

  root: {
    minHeight: 800,
    padding: 20,
  },
  title: {
    paddingTop: 50,
    color: "#000",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 40,
  },
  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: "auto",
    marginRight: "auto",
  },
  subTitle: {
    paddingTop: 30,
    color: "#000",
    textAlign: "center",
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: "#3557b7",
    justifyContent: "center",
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
});

const { Value, Text: AnimatedText } = Animated;

const LoadingIndicator = (props: ImageProps): React.ReactElement => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

const CELL_COUNT = 6;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({
  hasValue,
  index,
  isFocused,
}: {
  hasValue: boolean;
  index: number;
  isFocused: boolean;
}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      // duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const SignUpForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  const { masked, unmasked: unMaskedPhone } = formatWithMask({
    text: phoneNumber,
    mask: [...Masks.USA_PHONE],
  });

  const e164Phone = `+1${unMaskedPhone}`;

  const auth = useAuth();

  // start the sign up process.
  const onSignUpPress = async () => {
    try {
      setSubmitting(true);
      await auth?.signIn?.(e164Phone);

      // change the UI to our pending section.
      setPendingVerification(true);
      setSubmitting(false);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setSubmitting(false);
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    try {
      setSubmitting(true);
      await auth.verify?.(e164Phone, code);
      setSubmitting(false);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setSubmitting(false);
    }
  };

  const theme = useTheme();

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <Layout
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
      }}
    >
      {!pendingVerification && (
        <View style={{ width: "100%" }}>
          <Input
            keyboardType="phone-pad"
            placeholder="Phone Number"
            value={masked}
            onChangeText={(phone) => setPhoneNumber(phone)}
            style={{
              marginBottom: 16,
            }}
          />
          <Button
            onPress={onSignUpPress}
            disabled={submitting}
            // @ts-ignore
            accessoryLeft={submitting ? LoadingIndicator : undefined}
          >
            Sign Up
          </Button>
        </View>
      )}
      {pendingVerification && (
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          {/* <CodeField
            ref={ref}
            value={code}
            onChangeText={setCode}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
            rootStyle={styles.codeFieldRoot}
          /> */}
          <Input
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            placeholder="Auth Code"
            value={code}
            onChangeText={(value) => setCode(value)}
            style={{
              marginBottom: 16,
            }}
          />
          <Button
            onPress={onPressVerify}
            disabled={submitting}
            // @ts-ignore
            accessoryLeft={submitting ? LoadingIndicator : undefined}
          >
            Verify
          </Button>
        </View>
      )}
    </Layout>
  );
};

export default SignUpForm;
