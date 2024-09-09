"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdminGetUserChartData } from "@/serverlessActions/_adminActions";
import { useMutation } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartType {
  views: {
    label: string;
  };
  users: {
    label: string;
    color: string;
  };
}

const chartConfig: ChartConfig = {
  views: {
    label: "User Count",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
};

export default function UsersChart() {
  const { data: chartData, mutate: fetchChartData, isPending } = useMutation({
    mutationFn: () => AdminGetUserChartData(27),
  })

  React.useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  const total = React.useMemo(
    () => chartData?.reduce((acc, curr) => acc + curr.users, 0) || 0,
    [chartData]
  )

  const formatDateRange = (dateString: string) => {
    const startDate = new Date(dateString)
    const endDate = addDays(startDate, 6)
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
  }

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-[250px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )
    }

    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={formatDateRange}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={formatDateRange}
              />
            }
          />
          <Bar dataKey="users" fill={chartConfig.users.color} />
        </BarChart>
      </ChartContainer>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing total users for the last 27 weeks
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.users.label}
            </span>
            {isPending ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
