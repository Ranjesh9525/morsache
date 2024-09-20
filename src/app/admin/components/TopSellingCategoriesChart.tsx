"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { AdminGetTopCategories } from "@/serverlessActions/_adminActions";
import { Skeleton } from "@/components/ui/skeleton";
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

interface CategoryData {
  label: string;
  value: number;
}

function TopSellingCategoriesChart() {
  const id = "pie-interactive-2";
  const {
    data: topCategories,
    isLoading,
    error,
  } = useQuery<CategoryData[]>({
    queryKey: ["topCategories"],
    queryFn: () => AdminGetTopCategories(),
  });

  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (topCategories && topCategories.length > 0 && !activeCategory) {
      setActiveCategory(topCategories[0].label);
    }
  }, [topCategories, activeCategory]);

  const activeIndex = React.useMemo(
    () =>
      topCategories?.findIndex((item) => item.label === activeCategory) ?? 0,
    [topCategories, activeCategory]
  );

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    topCategories?.forEach((category, index) => {
      config[category.label] = {
        label: category.label,
        color: chartColors[index],
      };
    });
    return config;
  }, [topCategories]);

  if (isLoading) {
    return (
      <Card data-chart={id} className="flex flex-col h-full">
        <ChartStyle id={id} config={chartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Top Selling Categories</CardTitle>
            <CardDescription>
              Top 3 most occurring categories among most selling products
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-center p-3">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-40 ">
        <CardContent className="text-center">Error loading data</CardContent>
      </Card>
    );
  }

  if (!topCategories || topCategories.length === 0) {
    return (
      <Card className="h-40 ">
        <CardContent className="text-center">No data available</CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Top Selling Categories</CardTitle>
          <CardDescription>
            Top 3 most occurring categories among most selling products
          </CardDescription>
        </div>
        <Select
          value={activeCategory || undefined}
          onValueChange={setActiveCategory}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[180px] rounded-lg pl-2.5"
            aria-label="Select a category"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {topCategories.map((category) => (
              <SelectItem
                key={category.label}
                value={category.label}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: chartConfig[category.label]?.color,
                    }}
                  />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={topCategories}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                cx,
                cy,
                innerRadius,
                outerRadius,
                startAngle,
                endAngle,
                fill,
              }: any) => (
                <g>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                </g>
              )}
            >
              {topCategories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeCategory = topCategories[activeIndex];
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {" "}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeCategory.label.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm "
                        >
                          {"In" + " "}
                          {activeCategory.value.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export default TopSellingCategoriesChart;
