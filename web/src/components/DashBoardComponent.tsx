"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import HeatMap from "./HeatMap";
import { TasksResponse } from "@/lib/types";
import { Trash2 } from "lucide-react";
function DashBoardComponent() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState<TasksResponse>([]);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get("/api/tasks");

      setData(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  async function CreateTasks() {
    if (!task.trim() || !description.trim()) return;
    try {
      await axios.post("/api/tasks", {
        taskName: task.trim(),
        taskDescriotion: description.trim(),
      });
      getData();
      setTask("");
      setDescription("");
    } catch (error) {
      console.error("error ctreating Tasks", error);
    }
  }
  const markTaskDone = useCallback(
    async (taskId: string) => {
      const date = new Date();
      const today = date.toLocaleString("en-CA").slice(0, 10);
      console.log(today);

      try {
        await axios.post("/api/taskActivity", { taskId, today });
        getData();
      } catch (error) {
        console.error("Error marking task done", error);
      }
    },
    [data]
  );

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete("/api/tasks", {
        data: { taskId },
      });
      getData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const { startDay, endDay } = useMemo(() => {
    const start = new Date();
    const end = new Date();
    start.setFullYear(end.getFullYear() - 1);
    return {
      startDay: start.toLocaleDateString("en-CA"),
      endDay: end.toLocaleDateString("en-CA"),
    };
  }, []);
  return (
    <div>
      <div className="pt-14 max-w-screen">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-4 justify-center">
          <Input
            className="md:text-lg text-center h-12 font-medium"
            name="Task"
            placeholder="Task Name"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <Input
            className="md:text-lg text-center h-12 font-medium"
            name="Description"
            placeholder="Task Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              CreateTasks();
            }}
            className="h-12 text-lg"
          >
            Create Task
          </Button>
        </div>

        {data.map((data) => {
          return (
            <div
              key={data.id}
              className={`max-w-screen-xl mx-auto p-5 mt-5 rounded-md border-2 border-blue-100`}
            >
              <div className=" flex justify-between items-center border-b-2 border-b-blue-100 pb-1">
                <div>
                  <h1 className="text-2xl font-bold">{data.taskName}</h1>
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <div
                    onClick={() => {
                      deleteTask(data.id);
                    }}
                  >
                    <Trash2 />
                  </div>
                  <Button
                    onClick={async () => {
                      markTaskDone(data.id);
                    }}
                  >
                    Task Done
                  </Button>
                </div>
              </div>
              <MemoizedHeatMap
                startDay={startDay}
                endDay={endDay}
                data={data.taskActivity}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
const MemoizedHeatMap = React.memo(HeatMap);

export default DashBoardComponent;
