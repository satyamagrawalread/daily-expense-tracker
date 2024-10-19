"use client";

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useGetCurrentMonthCategoryDataQuery } from "../../hooks/api-hooks/useTransactionsQuery";
import { Loader2Icon } from "lucide-react";

export const description = "A donut chart with text";

// const randomColorGenerator = () => {
//   // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
//   // return `#${randomColor}`;
//   var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += Math.floor(Math.random() * 10);
//     }
//     return color;
// };





const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  // console.log(cx, cy, midAngle, innerRadius, outerRadius, percent, index);
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const MonthExpenses = () => {
  const { data: categoriesData, isLoading } =
    useGetCurrentMonthCategoryDataQuery();
  // const totalExpense = React.useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  // }, []);
  const chartConfig = useMemo(() => {
    const chartConfig: ChartConfig = {
      amount: {
        label: "Amount",
      },
    };

    categoriesData?.data && categoriesData.data.forEach((category, index) => {
      chartConfig[category.categoryName.replace(/[-&\s]/g, '')] = {
        label: category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1),
        color: `hsl(var(--chart-${index+1}))`
      };
    })
    return chartConfig;
  }, [categoriesData])
  const categories = useMemo(() => {
    return categoriesData?.data
      ? categoriesData.data.map(category => ({
          category: category.categoryName.replace(/[-&\s]/g, ''),
          amount: category.totalAmount,
          fill: `var(--color-${category.categoryName.replace(/[-&\s]/g, '')})`
        }))
      : [];
  }, [categoriesData]);
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <div className="h-svh flex justify-center items-center">
          <Loader2Icon className=" animate-spin " />
        </div>
      </Card>
    );
  }
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>This Month</CardTitle>
      </CardHeader>
      {categories.length > 0 ? (<CardContent className="flex-1 flex items-center gap-10 flex-wrap">
        <ChartContainer
          config={chartConfig}
          className="aspect-square flex-1 min-w-60"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categories}
              dataKey="amount"
              nameKey="category"
              innerRadius={70}
              strokeWidth={10}
              label={renderCustomizedLabel}
              labelLine={false}
              width="99%"
              
            >
              {/* <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalExpense.toLocaleString("en-In", {
                            currency: "INR",
                            style: "currency",
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expense
                        </tspan>
                      </text>
                    );
                  }
                }}
              /> */}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className=" flex items-center justify-between flex-wrap gap-6 md:max-w-60 ">
          {categories.map((data) => (
            <div
              className=" flex items-center gap-4 min-w-28 "
              key={data.category}
            >
              <div
                className="w-4 h-4 md:w-8 md:h-8 rounded-md shadow-sm gap-2  "
                style={{
                  backgroundColor: (
                    chartConfig[data.category] as {
                      label: string;
                      color: string;
                    }
                  ).color,
                }}
              />
              <div>
                <p className="text-semibold text-base md:text-lg">
                  {chartConfig[data.category].label}
                </p>
                <p className=" text-sm md:text-base  ">{data.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>) 
      : (
        <div>
          No Categories Data Found
        </div>
      )}
    </Card>
  );
};

export default MonthExpenses;
