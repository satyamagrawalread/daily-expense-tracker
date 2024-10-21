import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2Icon } from "lucide-react";
import { usePostMutationRegister } from "@/hooks/api-hooks/useAuthQuery";

type UserInputs = {
  username: string;
  password: string;
  cpassword: string;
};

const SignUp = () => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();
  const {
    mutate: registerUser,
    isLoading: isRegisterLoading,
    error: errorMessage,
    isError,
  } = usePostMutationRegister();
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);
  useEffect(() => {
    if (isError && axios.isAxiosError(errorMessage) && errorMessage.response) {
      setError(errorMessage.response.data.message || "An error occurred");
    }
  }, [errorMessage]);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>();

  const onSubmit: SubmitHandler<UserInputs> = async (data, event) => {
    event?.preventDefault();
    try {
      registerUser({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-svh flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="text-gray-500">May take some time</div>
          <Loader2Icon className=" animate-spin " />
        </div>
      </div>
    );
  }
  return (
    <>
      {!user && (
        <div className="flex h-svh overflow-y-auto flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/expense.png"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign Up to your account
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
                    //   id="username"
                    //   name="username"
                    type="text"
                    //   required
                    //   autoComplete="username"
                    onChange={() => {
                      setError("");
                    }}
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
                <div className="mt-2">
                  <div className="relative">
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
                      //   required
                      //   autoComplete="new-password"
                      onChange={() => {
                        setError("");
                      }}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={() => setViewPassword(!viewPassword)}
                    >
                      {viewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-600" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      {...register("cpassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === getValues("password") ||
                          "Passwords do not match",
                      })}
                      //   id="c-password"
                      //   name="cpassword"
                      type={viewConfirmPassword ? "text" : "password"}
                      //   required
                      //   autoComplete="confirm-password"
                      onChange={() => {
                        setError("");
                      }}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={() =>
                        setViewConfirmPassword(!viewConfirmPassword)
                      }
                    >
                      {viewConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.cpassword && (
                    <p className="text-red-600" role="alert">
                      {errors.cpassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isRegisterLoading && (
                    <Loader2Icon className=" animate-spin " />
                  )}
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already an account?{" "}
              <Link
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                to="/signin"
                replace={true}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
