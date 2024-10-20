import { IUserFormType } from "@/types/user.types";
import { axiosInstance } from "../lib/axios";


export const registerUser = async (formData: IUserFormType) => {
    const response  = await axiosInstance.post('/auth/register', formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};

export const loginUser = async (formData: IUserFormType) => {
    const response  = await axiosInstance.post('/auth/login', formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};