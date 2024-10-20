import { ReactNode, useState, useEffect } from "react";
import { IUser } from "../types/user.types";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../helpers";
import { getProfile } from "../api-functions/user.api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authToken: string | null = getToken();
  // const { toast } = useToast();
  const fetchLoggedInUser = async (token: String) => {
    setIsLoading(true);
    try {
        const userData = await getProfile(token);
        setUser(userData);
    } catch (error) {
      console.error(error);
      message.error("Uh oh! Something went wrong.");
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

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
