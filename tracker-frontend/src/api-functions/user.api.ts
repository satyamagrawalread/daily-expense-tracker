import { axiosInstance } from "../lib/axios";
import { BEARER } from "../constant";


export const getProfile = async (token: String) => {
    const response = await axiosInstance.get('/user/profile', {
        headers: { Authorization: `${BEARER} ${token}` },
    });
    return response.data
};