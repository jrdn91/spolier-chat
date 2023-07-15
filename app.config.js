import "dotenv/config";

export default {
  expo: {
    extra: {
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublicKey: process.env.SUPABASE_PUBLIC_KEY,
    },
  },
};
