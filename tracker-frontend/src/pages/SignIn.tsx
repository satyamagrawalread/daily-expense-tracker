import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { setToken } from "../helpers";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api-functions/auth.api";
import { useToast } from "../hooks/use-toast";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

type UserInputs = {
  username: string;
  password: string;
};

const SignIn = () => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>();

  const onSubmit: SubmitHandler<UserInputs> = async (data, event) => {
    event?.preventDefault();
    setError("");
    try {
      const userData = new FormData();
      userData.append("username", data.username);
      userData.append("password", data.password);

      const result = await loginUser(userData);
      setToken(result.token);
      // setUser(value);
      toast({
        description: `Welcome back: ${data.username}!`,
      });

      navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message || "An error occurred";
  
        if ([404, 401, 500].includes(statusCode)) {
          setError(errorMessage);
        } else {
          setError(errorMessage);
        }
      } else {
        console.error(error);
      }
    }
  };
  if (isLoading) {
    return (
      <div className="h-svh flex justify-center items-center">
        <Loader2Icon className=" animate-spin " />
      </div>
    );
  }
  return (
    <>
      {!user && <div className="flex h-svh flex-1 flex-col justify-center px-6 py-12 overflow-y-auto lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/expense.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="text-red-600 flex justify-center">{error}</div>
          )}
          <form
            action="handle"
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  //   id="email"
                  //   name="email"
                  type="username"
                  autoComplete="off"
                  onChange={() => {
                    setError("");
                  }}
                  //   required
                  //   autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.username && (
                  <p className="text-red-600" role="alert">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                      message:
                        "Password must be at least 6 characters long, contain 1 uppercase letter, 1 number, and 1 symbol",
                    },
                  })}
                  //   id="password"
                  //   name="password"
                  type={viewPassword ? "text" : "password"}
                  autoComplete="off"
                  onChange={() => {
                    setError("");
                  }}
                  //   required
                  //   autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setViewPassword(!viewPassword)}
                >
                  {viewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <p className="text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not an account?{" "}
            <Link
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              to="/signup"
              replace={true}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>}
    </>
  );
};

export default SignIn;
