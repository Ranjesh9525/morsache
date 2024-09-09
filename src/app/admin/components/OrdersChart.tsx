"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query";
import { addDays, format,parseISO,subMonths } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminGetOrderChartData } from "@/serverlessActions/_adminActions"


interface ChartDataPoint {
  date: string
  pending: number
  confirmed: number
  shipped: number
  delivered: number
  ready: number
  collected: number
}

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(var(--chart-2))",
  },
  shipped: {
    label: "Shipped",
    color: "hsl(var(--chart-3))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-4))",
  },
  ready: {
    label: "Ready",
    color: "hsl(var(--chart-5))",
  },
  collected: {
    label: "Collected",
    color: "hsl(var(--chart-6))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-7))",
  },
}

export default function OrdersChart() {
  const [timeRange, setTimeRange] = React.useState("3m")

  const { data: chartData, mutate: fetchChartData, isPending } = useMutation({
    mutationFn: () => AdminGetOrderChartData(52), // Fetch data for 1 year (52 weeks)
  })

  React.useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  const filteredData = React.useMemo(() => {
    if (!chartData) return []
    const now = new Date()
    const monthsToSubtract = timeRange === "1m" ? 1 : timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12
    const startDate = subMonths(now, monthsToSubtract)
    return chartData.filter(item => parseISO(item.date) >= startDate)
  }, [chartData, timeRange])

  const renderChart = () => {
    if (isPending) {
      return <Skeleton className="h-[250px] w-full" />
    }

    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            {Object.entries(chartConfig).map(([key, value]) => (
              <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={value.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={value.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => format(parseISO(value), 'MMM d')}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => format(parseISO(value), 'MMM d, yyyy')}
                indicator="dot"
              />
            }
          />
          {Object.keys(chartConfig).map((key) => (
            <Area
              key={key}
              dataKey={key}
              type="monotone"
              fill={`url(#fill${key})`}
              stroke={chartConfig[key as keyof typeof chartConfig].color}
              stackId="1"
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Showing total orders for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1m" className="rounded-lg">
              Last 1 month
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="12m" className="rounded-lg">
              Last 12 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {renderChart()}
      </CardContent>
    </Card>
  )
}
