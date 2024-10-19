"use client";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useGetLastWeekCategoryDataQuery } from "../../hooks/api-hooks/useTransactionsQuery";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat);

export const description = "A stacked bar chart with a legend";

// const chartData = [
//   { day: "Monday", essentials: 186, nonessentials: 80, miscellaneous: 0 },
//   { day: "Tuesday", essentials: 305, nonessentials: 200, miscellaneous: 0 },
//   { day: "Wednesday", essentials: 237, nonessentials: 120, miscellaneous: 0 },
//   { day: "Thursday", essentials: 73, nonessentials: 190, miscellaneous: 0 },
//   { day: "Friday", essentials: 209, nonessentials: 130, miscellaneous: 0 },
//   { day: "Saturday", essentials: 214, nonessentials: 140, miscellaneous: 0 },
//   { day: "Sunday", essentials: 214, nonessentials: 140, miscellaneous: 0 },
// ];

// const chartConfig = {
//   miscellaneous: {
//     label: "Miscellaneous",
//     color: "hsl(var(--chart-3))",
//   },
//   essentials: {
//     label: "Essentials",
//     color: "hsl(var(--chart-1))",
//   },
//   nonessentials: {
//     label: "Non-essentials",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig;

const WeekExpenses = () => {
  const { data: categoriesData, isLoading } = useGetLastWeekCategoryDataQuery();
  const today = dayjs().add(330, 'minutes').toISOString().split("T")[0];
  const yesterday = dayjs().add(330, 'minutes').subtract(1, 'day')
    .toISOString()
    .split("T")[0];
  console.log(today);
  const chartConfig = useMemo(() => {

    return (categoriesData?.data &&
      categoriesData.data[0]?.categories?.reduce((acc, category, index) => {
        return {
          ...acc,
          [category.name.replace('-', '').toLowerCase()]: {
            label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
            color: `hsl(var(--chart-${index + 1}))`,
          }
        }
      }, {})) || {};
  }, [categoriesData]);

  const categories = useMemo(() => {
    return categoriesData?.data
      ? categoriesData.data.map((category) => ({
          date:
            today == category.date
              ? "Today"
              : yesterday == category.date
              ? "Yesterday"
              : dayjs(category.date).format('Do MMM'),
          ...category.categories.reduce(
            (acc, current) => ({
              ...acc,
              [current.name.replace('-', '').toLowerCase()]: current.totalAmount,
            }),
            {}
          ),
        }))
      : [];
  }, [categoriesData]);
  console.log(chartConfig, categories);
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={categories}>
            <CartesianGrid vertical={false} />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className=" capitalize ">
                      {name}:{" "}
                      {value.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {
              Object.keys(chartConfig).map(key => (<Bar key={key} 
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={[0, 0, 4, 4]}
              />))
            }
            {/* <Bar
              dataKey="essentials"
              stackId="a"
              fill="var(--color-essentials)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="nonessentials"
              stackId="a"
              fill="var(--color-nonessentials)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="miscellaneous"
              stackId="a"
              fill="var(--color-miscellaneous)"
              radius={[4, 4, 0, 0]}
            /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeekExpenses;
