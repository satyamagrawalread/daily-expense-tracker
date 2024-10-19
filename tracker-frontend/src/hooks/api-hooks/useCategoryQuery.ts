import { useQuery } from "react-query"
import { ICategories } from "../../types/category.types"
import { getCategories } from "../../api-functions/categories.api"

export const useGetCategories = () => {
    return useQuery<{
        data: ICategories
    }>({
        queryKey: ["categories"],
        queryFn: getCategories
    })
}