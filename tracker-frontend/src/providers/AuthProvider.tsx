import { ReactNode, useState, useEffect } from "react";
import { IUser } from "../types/user.types";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../helpers";
import { getProfile } from "../api-functions/user.api";
import { message } from "antd";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const authToken: string | null = getToken();
  // const { toast } = useToast();
  const fetchLoggedInUser = async (token: String) => {
    setIsLoading(true);
    try {
        const userData = await getProfile(token);
        setUser(userData);
    } catch (error) {
      message.error("Internal Server Error");
      setError(error as Error);
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      // });
    } finally {
        setIsLoading(false);
    }
  };


  useEffect(() => {
    const init = async () => {
      if (authToken) {
        fetchLoggedInUser(authToken);
      } else {
        setIsLoading(false);
      }
    };
    init();
  }, [authToken]);

  if(error) {
    throw error;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
