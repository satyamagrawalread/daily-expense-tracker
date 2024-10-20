"use client";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useGetLastWeekCategoryDataQuery } from "../../hooks/api-hooks/useTransactionsQuery";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
// import advancedFormat from 'dayjs/plugin/advancedFormat'
// dayjs.extend(advancedFormat);
dayjs.extend(utc);

export const description = "A stacked bar chart with a legend";

const WeekExpenses = () => {
  const { data: categoriesData } = useGetLastWeekCategoryDataQuery();
  const today = dayjs.utc().add(330, 'minutes').toISOString().split("T")[0];
  const yesterday = dayjs.utc().add(330, 'minutes').subtract(1, 'day')
    .toISOString()
    .split("T")[0];
  const chartConfig = useMemo(() => {

    return (categoriesData?.data &&
      categoriesData.data[0]?.categories?.reduce((acc, category, index) => {
        return {
          ...acc,
          [category.name.replace(/[-&\s]/g, '').toLowerCase()]: {
            label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
            color: `hsl(var(--chart-${index + 1}))`,
          }
        }
      }, {})) || {};
  }, [categoriesData]);
  const isAllDataZero = useMemo(() => {
    let isAllZero = true;
    categoriesData?.data && categoriesData.data.some(category => {
      return category.categories.some(element => {
        if(element.totalAmount!=0) {
          isAllZero = false;
          return true;
        }
        return false;
      })
    })
    return isAllZero;
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
              [current.name.replace(/[-&\s]/g, '').toLowerCase()]: current.totalAmount,
            }),
            {}
          ),
        }))
      : [];
  }, [categoriesData]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week</CardTitle>
      </CardHeader>
      {(categories.length==0 || isAllDataZero) && <div className="text-center">No Data Found</div>}
      {categories.length > 0 && <CardContent>
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
            <ChartLegend className="flex flex-wrap" content={<ChartLegendContent />} />
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
      </CardContent>}
    </Card>
  );
};

export default WeekExpenses;
