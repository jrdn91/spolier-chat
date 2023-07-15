import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Better put your these secret keys in .env file
export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl,
  Constants.expoConfig?.extra?.supabasePublicKey,
  {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false,
    },
  }
);
