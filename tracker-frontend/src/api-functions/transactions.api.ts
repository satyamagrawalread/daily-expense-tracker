import { BEARER } from "../constant";
import { getToken } from "../helpers";
import { axiosInstance } from "../lib/axios";
import { ITransaction } from "../types/transaction.types";

export const getTransactions = async ({
  subCategories,
  category  
}: {
  subCategories: string[];
  category: string
}) => {
  let url = "/transactions";
  const token = getToken();

  if (subCategories.length > 0 && !subCategories.find(item => item === "all")) {
    url = `${url}?subCategories=${subCategories.join(",")}`;
  }else if(category !== "all"){
    url = `${url}?categories=${category}`;
  }

  const response = await axiosInstance.get(url, {
    headers: { Authorization: `${BEARER} ${token}` },
  });
  return response.data;
};

export const createTransaction = async (transaction: ITransaction) => {
  const token = getToken();
  const response = await axiosInstance.post("/transaction/create", {
    ...transaction,
  }, 
  {
    headers: { Authorization: `${BEARER} ${token}` },
  });
  return response.data;
};
