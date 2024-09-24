"use client";

import * as React from "react";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
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
import { AdminGetTopProducts } from "@/serverlessActions/_adminActions";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];
interface ProductData {
  label: string;
  value: number;
}
function TopSellingProductsChart() {
  const id = "pie-interactive";
  const {
    data: topProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topProducts"],
    queryFn: () => AdminGetTopProducts(),
  });

  // const [activeProduct, setActiveProduct] = React.useState<string | null>(null);
  const processedData = React.useMemo(() => {
    // console.log(topProducts)
    if (!topProducts?.data || topProducts.success ==false) return [];
    return topProducts?.data
      .map((product:any, index:number) => ({
        ...product,
        uniqueLabel: `${product.label}_${index}`, // Add a unique identifier
      }))
      .sort((a:any, b:any) => b.value - a.value); // Sort by value in descending order
  }, [topProducts]);

  const [activeProduct, setActiveProduct] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (processedData.length > 0) {
      setActiveProduct(processedData[0].uniqueLabel); // Set the highest selling product as active
    }
  }, [processedData]);

  const activeIndex = React.useMemo(
    () =>
      processedData.findIndex((item:any) => item.uniqueLabel === activeProduct) ??
      0,
    [processedData, activeProduct]
  );

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    processedData.forEach((product:any, index:number) => {
      config[product.uniqueLabel] = {
        label: product.label,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [processedData]);

  const totalValue = React.useMemo(
    () => processedData.reduce((sum:any, product:any) => sum + product.value, 0),
    [processedData]
  );

  if (isLoading) {
    return (
      <Card data-chart={id} className="flex flex-col">
        <ChartStyle id={id} config={chartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Top best-selling products</CardDescription>
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

  if (!processedData || processedData.length === 0) {
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
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Top {processedData.length} best-selling products
          </CardDescription>
        </div>
        <Select
          value={activeProduct || undefined}
          onValueChange={setActiveProduct}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[180px] rounded-lg pl-2.5"
            aria-label="Select a product"
          >
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {processedData.map((product:any) => (
              <SelectItem
                key={product.uniqueLabel}
                value={product.uniqueLabel}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: chartConfig[product.uniqueLabel]?.color,
                    }}
                  />
                  {product.label} ({product.value})
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
              data={processedData}
              dataKey="value"
              nameKey="uniqueLabel"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
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
              {processedData.map((entry:any, index:number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeProduct = processedData[activeIndex];
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeProduct.value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Sold
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

export default TopSellingProductsChart;
