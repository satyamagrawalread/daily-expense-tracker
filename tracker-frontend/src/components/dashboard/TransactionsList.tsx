import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Transaction from "./Transaction";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useGetTransactionsQuery } from "../../hooks/api-hooks/useTransactionsQuery";
import { Skeleton } from "../ui/skeleton";
import { useGetCategories } from "../../hooks/api-hooks/useCategoryQuery";
import { ICategories } from "../../types/category.types";
import SelectComponent from "../ui/selectcomponent";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import advancedFormat from 'dayjs/plugin/advancedFormat'
// dayjs.extend(advancedFormat);
dayjs.extend(utc);

const SubcategoryItem = ({
  selectedSubCategories,
  handleSubCategoryToggle,
  category,
}: {
  selectedSubCategories: string[];
  handleSubCategoryToggle: (subcategoryId: string) => void;
  category: {
    description: string;
    categoryId: string;
  };
}) => {
  return (
    <Badge
      onClick={() => handleSubCategoryToggle(category.categoryId)}
      className={cn(
        selectedSubCategories.includes(category.categoryId)
          ? "bg-primary text-primary-foreground hover:bg-primary"
          : "bg-muted text-muted-foreground hover:bg-muted",
        "cursor-pointer hover:ring-1"
      )}
    >
      {category.description}
    </Badge>
  );
};

const TransactionsList = () => {
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<
    string[]
  >(["all"]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({
    subCategories: selectedSubcategories,
    category: selectedCategory,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories();
    const today = dayjs.utc().add(330, 'minutes').toISOString().split("T")[0];
  const yesterday = dayjs.utc().add(330, 'minutes').subtract(1, 'day')
    .toISOString()
    .split("T")[0];
  const categories = useMemo(() => {
    return (categoriesData?.data || []) as ICategories[];
  }, [categoriesData]);

  const selectCategoryOptions = useMemo(() => {
    return [
      {
        value: "all",
        label: "All",
      },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ];
  }, [categories]);

  const subcategories = useMemo(() => {
    if (selectedCategory === "all") {
      return [
        {
          name: "All",
          id: "all",
        },
        ...categories.reduce((acc, curr) => {
          return [...acc, ...curr.subCategories];
        }, [] as { name: string; id: string }[]),
      ];
    }

    return [
      {
        name: "All",
        id: "all",
      },
      ...(categories.find((category) => category.id === selectedCategory)
        ?.subCategories || []),
    ];
  }, [selectedCategory, categories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategories(["all"]);
  };

  const handleSubCategoryToggle = (subcategoryId: string) => {
    if (subcategoryId === "all") {
      setSelectedSubcategories(["all"]);
      return;
    }

    const isAllPresent = selectedSubcategories.includes("all");
    const isSubcategoryPresent = selectedSubcategories.includes(subcategoryId);

    if (!isSubcategoryPresent) {
      setSelectedSubcategories((prev) =>
        [...prev, subcategoryId].filter((categoryId) => categoryId !== "all")
      );
      return;
    }

    if (
      isSubcategoryPresent &&
      selectedSubcategories.length === 1 &&
      !isAllPresent
    ) {
      setSelectedSubcategories(["all"]);
      return;
    }

    setSelectedSubcategories((prev) => {
      return prev.filter((categoryId) => categoryId !== subcategoryId);
    });
  };

  const transactions = useMemo(() => {
    return transactionsData?.data || [];
  }, [transactionsData]);

  if (isLoading || isLoadingCategories) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between ">
            <CardTitle className=" text-xl ">Transactions</CardTitle>
            <SelectComponent
              className=" max-w-[120px] "
              options={selectCategoryOptions}
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            />
          </div>
          <div className=" flex items-center flex-wrap gap-2 ">
            {subcategories.map((subcategory) => (
              <SubcategoryItem
                key={subcategory.id}
                category={{
                  categoryId: subcategory.id,
                  description: subcategory.name,
                }}
                handleSubCategoryToggle={handleSubCategoryToggle}
                selectedSubCategories={selectedSubcategories}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className=" flex flex-col gap-4 ">
            {new Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 sm:w-[250px] w-[180px]" />
                  <Skeleton className="h-4 xs:w-[200px] w-[130px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactionsData?.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className=" flex items-center justify-between ">
            <CardTitle className=" text-xl ">Transactions</CardTitle>
            <SelectComponent
              className=" max-w-[120px] "
              options={selectCategoryOptions}
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            />
          </div>
          <div className=" flex items-center flex-wrap gap-2 ">
            {subcategories.map((subcategory) => (
              <SubcategoryItem
                key={subcategory.id}
                category={{
                  categoryId: subcategory.id,
                  description: subcategory.name,
                }}
                handleSubCategoryToggle={handleSubCategoryToggle}
                selectedSubCategories={selectedSubcategories}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className=" text-center text-muted-foreground ">
          No transactions found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className=" flex items-center justify-between flex-wrap ">
          <CardTitle className=" text-xl ">Transactions</CardTitle>
          <SelectComponent
            className=" max-w-[120px] "
            options={selectCategoryOptions}
            onValueChange={handleCategoryChange}
            value={selectedCategory}
          />
        </div>
        <div className=" flex items-center gap-2 flex-wrap ">
          {subcategories.map((subcategory) => (
            <SubcategoryItem
              key={subcategory.id}
              category={{
                categoryId: subcategory.id,
                description: subcategory.name,
              }}
              handleSubCategoryToggle={handleSubCategoryToggle}
              selectedSubCategories={selectedSubcategories}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pr-0">
        <div className=" flex flex-col gap-4 w-full h-full pr-6 overflow-y-auto ">
          {transactions.map((transaction, index) => {
            return (
              <div key={index}>
                <div>
                  {today == transaction.date
                    ? "Today"
                    : yesterday == transaction.date
                    ? "Yesterday"
                    : dayjs(transaction.date).format('Do MMM')}
                </div>
                {transaction.transactions.map((item, innerIndex) => {
                  return <Transaction key={innerIndex} transaction={item} />;
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
