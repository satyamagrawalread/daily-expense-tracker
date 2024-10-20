import { loginUser, registerUser } from "@/api-functions/auth.api";
import { useMutation } from "react-query";
// import { useToast } from "../use-toast";
import { setToken } from "@/helpers";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAuthContext } from "@/context/AuthContext";

export const usePostMutationRegister = () => {
  //   const { toast } = useToast();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      setToken(data.token);
      setUser({
        username: variables.username
      })
      message.success(`Welcome to your dashboard: ${variables.username}!`);
      //   toast({
      //     description: `Welcome to your dashboard: ${variables.username}!`,
      //   });
      navigate("/", { replace: true });
    },
    onError() {
      message.error("Unable to register");
      //   toast({
      //     variant: "destructive",
      //     description: "Unable to register",
      //   });
    },
  });
};
export const usePostMutationLogin = () => {
  //   const { toast } = useToast();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      setToken(data.token);
      setUser({
        username: variables.username
      })
      message.success(`Welcome Back: ${variables.username}!`);
      // toast({
      //   description: `Welcome Back: ${variables.username}!`,
      // });
      navigate("/", { replace: true });
    },
    onError() {
      message.error("Unable to login");

      //   toast({
      //     variant: "destructive",
      //     description: "Unable to login",
      //   });
    },
  });
};
