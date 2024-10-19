import { BEARER } from "../constant";
import { getToken } from "../helpers";
import { axiosInstance } from "../lib/axios";


export const getCategories = async () => {
    const response  = await axiosInstance.get('/categories');
    return response.data;
};

export const getCurrentMonthCategoryData = async () => {
    const token = getToken();
    const response  = await axiosInstance.get('/current/month', {
        headers: { Authorization: `${BEARER} ${token}` },
    });
    return response.data;
}
export const getLastWeekCategoryData = async () => {
    const token = getToken();
    const response  = await axiosInstance.get('/lastweek', {
        headers: { Authorization: `${BEARER} ${token}` },
    });
    return response.data;
}