
import { useSmokeLog } from "@/hooks/useSmokeLog";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SmokeType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  "🚬 Tobacco Mix": {
    label: "Tobacco Mix",
    color: "hsl(var(--chart-1))",
  },
  "🌿 Herbal Mix": {
    label: "Herbal Mix",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Insights = () => {
  const { logs, loading } = useSmokeLog();

  const hourlyData = useMemo(() => {
    const dataByHour: { [key: string]: { [key in SmokeType]: number } } = {};
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      dataByHour[`${hour}:00`] = { "🚬 Tobacco Mix": 0, "🌿 Herbal Mix": 0 };
    }

    logs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      const hourKey = hour.toString().padStart(2, "0") + ":00";
      if (dataByHour[hourKey]) {
        dataByHour[hourKey][log.type]++;
      }
    });

    return Object.entries(dataByHour).map(([hour, counts]) => ({
      hour,
      ...counts,
    }));
  }, [logs]);

  const triggerData = useMemo(() => {
    const triggerCounts: { [key: string]: number } = {};

    logs.forEach((log) => {
      if (log.trigger && log.trigger.trim() !== "") {
        triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
      }
    });

    return Object.entries(triggerCounts)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Discover your patterns.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-72" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Discover your patterns.</p>
        <div className="mt-8 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
          <p className="text-muted-foreground">Log some smokes to see your insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Discover your patterns.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smoking by Hour of Day</CardTitle>
          <CardDescription>
            Your smoking patterns throughout the day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={hourlyData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 2)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="🚬 Tobacco Mix"
                fill="var(--color-🚬 Tobacco Mix)"
                radius={4}
                stackId="a"
              />
              <Bar
                dataKey="🌿 Herbal Mix"
                fill="var(--color-🌿 Herbal Mix)"
                radius={4}
                stackId="a"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Triggers</CardTitle>
          <CardDescription>
            The most common reasons you've logged for smoking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {triggerData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trigger</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {triggerData.map(({ trigger, count }) => (
                  <TableRow key={trigger}>
                    <TableCell className="font-medium">{trigger}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center">No triggers logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;

