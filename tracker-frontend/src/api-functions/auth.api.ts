import { axiosInstance } from "../lib/axios";


export const registerUser = async (formData: FormData) => {
    const response  = await axiosInstance.post('/auth/register', formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};

export const loginUser = async (formData: FormData) => {
    const response  = await axiosInstance.post('/auth/login', formData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};