import { useAuth } from "../providers/AuthProvider";

function useSignedIn() {
  const { session } = useAuth();
  return session !== null;
}

export default useSignedIn;
