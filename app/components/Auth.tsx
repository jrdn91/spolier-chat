import React, { ReactNode } from "react";
import { useAuth } from "../providers/AuthProvider";

function SignedIn({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth.session) {
    return null;
  }

  return <>{children}</>;
}

function SignedOut({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.session) {
    return null;
  }

  return <>{children}</>;
}

export { SignedIn, SignedOut };
