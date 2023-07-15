declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLERK_PUBLISHABLE_KEY: string;
    }
  }
}

export {};
