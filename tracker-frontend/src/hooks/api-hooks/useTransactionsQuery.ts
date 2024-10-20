import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createTransaction,
  getTransactions,
} from "../../api-functions/transactions.api";
import {
  CurrentMonthCategoryDataType,
  LastWeekCategoryDataType,
  OTransaction,
} from "../../types/transaction.types";
// import { useToast } from "../use-toast";
import {
  getCurrentMonthCategoryData,
  getLastWeekCategoryData,
} from "../../api-functions/categories.api";

export const useGetTransactionsQuery = ({
  subCategories,
  category,
}: {
  subCategories: string[];
  category: string;
}) => {
  return useQuery<{
    data: OTransaction[];
  }>({
    queryKey: ["transactions", ...subCategories, category],
    queryFn: () =>
      getTransactions({
        subCategories,
        category,
      }),
  });
};

export const useGetCurrentMonthCategoryDataQuery = () => {
  return useQuery<{
    data: CurrentMonthCategoryDataType[];
  }>({
    queryKey: ["monthTransaction"],
    queryFn: () => getCurrentMonthCategoryData(),
  });
};

export const useGetLastWeekCategoryDataQuery = () => {
  return useQuery<{
    data: LastWeekCategoryDataType[];
  }>({
    queryKey: ["lastWeekTransaction"],
    queryFn: () => getLastWeekCategoryData(),
  });
};

export const usePostMutationCreateTransaction = () => {
  // const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess() {
      message.success("Transaction created Successfully");

      // toast({
      //   description: "Transaction created successfully",
      // });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["monthTransaction"] });
      queryClient.invalidateQueries({ queryKey: ["lastWeekTransaction"] });
    },
    onError() {
      message.error("Unable to create transaction");
      // toast({
      //   variant: "destructive",
      //   description: "Unable to create transaction",
      // });
    },
  });
};
