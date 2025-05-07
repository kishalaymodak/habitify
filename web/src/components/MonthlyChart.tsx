"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useState } from "react"; // Importing useState for state management

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
import { Button } from "./ui/button";
import { TasksResponse } from "@/lib/types";

// const chartData = [
//   { date: "2024-03-01", totalTaskActivityPerDay: 2 },
//   { date: "2024-03-02", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-03", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-04", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-05", totalTaskActivityPerDay: 2 },
//   { date: "2024-03-06", totalTaskActivityPerDay: 3 },
//   { date: "2024-03-10", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-11", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-12", totalTaskActivityPerDay: 1 },
//   { date: "2024-03-13", totalTaskActivityPerDay: 1 },
//   // Add more data to test multiple weeks...
// ];

const chartConfig = {
  totalTaskActivityPerDay: {
    label: "Task",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function Component({ tasks }: { tasks: TasksResponse }) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // State to track the current week

  const taskDatePairs = tasks.flatMap((task) =>
    task.taskActivity
      .filter((activity) => activity.taskDone) // Only include completed tasks
      .map((activity) => ({
        date: activity.date,
        taskId: task.id,
      }))
  );

  // Step 2: Group by date, and collect unique taskIds for that date
  const dateToTasksMap = taskDatePairs.reduce((acc, { date, taskId }) => {
    if (!acc[date]) {
      acc[date] = new Set<string>(); // initialize a Set for each date
    }
    acc[date].add(taskId); // add the taskId to the Set (avoids duplicates)
    return acc;
  }, {} as Record<string, Set<string>>);

  // Step 3: Convert the map into the desired output format
  const chartData = Object.entries(dateToTasksMap).map(([date, taskSet]) => ({
    date,
    totalTaskActivityPerDay: taskSet.size, // number of unique task IDs per date
  }));

  // Function to slice the chart data for the last 7 days
  const getWeekData = (weekIndex: number) => {
    const startOfWeek = weekIndex * 7;
    const endOfWeek = startOfWeek + 7;
    return chartData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(startOfWeek, endOfWeek); // Slice the data based on the current week
  };

  // Previous week button click handler
  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  // Next week button click handler
  const handleNextWeek = () => {
    if ((currentWeekIndex + 1) * 7 < chartData.length) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const weekData = getWeekData(currentWeekIndex); // Get the data for the current week

  return (
    <Card className=" h-2/5">
      <CardHeader>
        <CardTitle>Task Activity Chart</CardTitle>
        <CardDescription>Weekly Task Activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-44 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={weekData} // Display data for the current week
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
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="totalTaskActivityPerDay"
              type="linear"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex gap-4 justify-center mt-4">
          <Button
            onClick={handlePrevWeek}
            disabled={currentWeekIndex === 0}
            className="btn btn-secondary"
          >
            Previous Week
          </Button>
          <Button
            onClick={handleNextWeek}
            disabled={(currentWeekIndex + 1) * 7 >= chartData.length}
            className="btn btn-secondary"
          >
            Next Week
          </Button>
        </div>
      </CardContent>
      {/* Add buttons to navigate between weeks */}
    </Card>
  );
}
