import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { supabase } from "../initSupabase";
import { Session, User } from "@supabase/supabase-js";
type ContextProps = {
  user: null | User;
  session: Session | null;
  signIn: (phone: string) => Promise<void>;
  verify: (phone: string, token: string) => Promise<void>;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  // user null = loading
  const [user, setUser] = useState<null | User>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setSession(res.data.session);
      setUser(res.data.session?.user || null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  async function signIn(phone: string) {
    let {
      error,
      data: { user, session },
    } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    setSession(session);
    setUser(user);
  }

  async function verify(phone: string, token: string) {
    let {
      data: { session, user },
      error,
    } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    setSession(session);
    setUser(user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        verify,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
