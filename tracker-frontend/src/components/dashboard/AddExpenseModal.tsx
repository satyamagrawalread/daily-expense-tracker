import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SelectComponent from "../ui/selectcomponent";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { ICategories } from "../../types/category.types";
import { useGetCategories } from "../../hooks/api-hooks/useCategoryQuery";
import { Skeleton } from "../ui/skeleton";
import { usePostMutationCreateTransaction } from "../../hooks/api-hooks/useTransactionsQuery";

const AddExpenseModal = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<{
    description: string;
    categoryId: string;
    subCategoryId: string;
    amount: number;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: createTransaction, isLoading } =
    usePostMutationCreateTransaction();

  const selectedCategory = watch("categoryId");

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories();

  const categories = useMemo(() => {
    return (categoriesData?.data || []) as ICategories[];
  }, [categoriesData]);

  const categoriesOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [categories]);

  const subcategories = useMemo(() => {
    return (
      categories.find((category) => category.id === selectedCategory)
        ?.subCategories || []
    );
  }, [categories, selectedCategory]);

  const subcategoriesOptions = useMemo(() => {
    return subcategories.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory.id,
    }));
  }, [subcategories]);

  const onFormSubmit = (data: {
    description: string;
    categoryId: string;
    subCategoryId: string;
    amount: number;
  }) => {
    createTransaction({
      amount: Number(data.amount),
      category: data.categoryId,
      desc: data.description,
      subCategory: data.subCategoryId,
    });
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="rounded-full font-bold fixed bottom-10 right-10 "
        >
          <PlusIcon className=" w-8 h-8 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogHeader>
            <DialogTitle>New Expense</DialogTitle>
            <DialogDescription>
              Add a new expense to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name" className="text-right">
                What did you spend on?
              </Label>
              <Input placeholder="Enter description"
                {...register("description", {
                  required: {
                    value: true,
                    message: "Description is required",
                  },
                  maxLength: {
                    value: 100,
                    message: "Description must be less than 100 characters",
                  },
                  minLength: {
                    value: 3,
                    message: "Description must be at least 3 characters",
                  },
                })}
                className="col-span-3"
              />
              {errors.description && (
                <p className="text-xs mt-0.5 text-red-600">
                  {" "}
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input placeholder="Enter amount"
                {...register("amount", {
                  required: {
                    value: true,
                    message: "Amount is required",
                  },
                  validate: (value) =>
                    isNaN(Number(value)) ? "Amount must be a number" : true,
                  min: {
                    value: 1,
                    message: `Amount must be greater than 0`,
                  },
                  max: {
                    value: 1000000,
                    message: "Amount must be less than 1000000",
                  },
                })}
                className="col-span-3"
              />
              {errors.amount && (
                <p className="text-xs mt-0.5 text-red-600">
                  {" "}
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              {isLoadingCategories ? (
                <Skeleton className="w-full h-8" />
              ) : (
                <Controller
                  control={control}
                  name="categoryId"
                  rules={{
                    required: {
                      value: true,
                      message: "Category is required",
                    },
                  }}
                  render={({ field }) => (
                    <SelectComponent
                      placeholder="Select a category"
                      options={categoriesOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              )}
              {errors.categoryId && (
                <p className="text-xs mt-0.5 text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="username" className="text-right">
                Sub Category
              </Label>
              {isLoadingCategories ? (
                <Skeleton className="w-full h-8" />
              ) : (
                <Controller
                  control={control}
                  name="subCategoryId"
                  rules={{
                    required: {
                      value: true,
                      message: "Sub Category is required",
                    },
                  }}
                  render={({ field }) => (
                    <SelectComponent
                      placeholder="Select a sub category"
                      options={subcategoriesOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              )}
              {errors.subCategoryId && (
                <p className="text-xs mt-0.5 text-red-600">
                  {errors.subCategoryId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              Save changes
              {isLoading && <Loader2Icon className=" animate-spin " />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
