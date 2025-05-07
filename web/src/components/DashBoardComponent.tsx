"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import HeatMap from "./HeatMap";
import { TasksResponse } from "@/lib/types";
import { PlusIcon, Trash2 } from "lucide-react";
import { Component } from "./MonthlyChart";

import { toast } from "sonner";

function DashBoardComponent() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [taskData, setTaskData] = useState<TasksResponse>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get("/api/tasks");

      setTaskData(res.data.tasks);
    } catch (error) {
      toast.error("Error in Featching Tasks !!");
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    getData();
    toast.message("Welcome To Habitify !!");
  }, [getData]);

  async function CreateTasks() {
    if (!task.trim() || !description.trim()) {
      toast.error("Task Name or Description is Empty !!");
      return;
    }

    try {
      await axios.post("/api/tasks", {
        taskName: task.trim(),
        taskDescriotion: description.trim(),
      });
      toast.success("Task Created !!");
      getData();
      setTask("");
      setDescription("");
    } catch (error) {
      toast.error("Error In Task Creation !!");
      console.error("error ctreating Tasks", error);
    }
  }
  const markTaskDone = useCallback(
    async (taskId: string) => {
      const date = new Date();
      const today = date.toLocaleString("en-CA").slice(0, 10);
      console.log(today);

      try {
        const res = await axios.post("/api/taskActivity", { taskId, today });
        getData();

        toast.success(res.data.message);
      } catch (error) {
        toast.error("Error in Marking Task Done");
        console.error("Error marking task done", error);
      }
    },
    [taskData]
  );

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete("/api/tasks", {
        data: { taskId },
      });
      toast.success("Task Deleted !!");
      getData();
    } catch (error) {
      toast.error("Error in Deleting Task !!");
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
      <div className="relative pt-14 max-w-screen ">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-4 justify-center">
          <MemoizedChart tasks={taskData} />
          {/* <div className=" fixed z-[999] bottom-2/15 right-2/15">
            <Button className="md:h-15 h-12 w-12 md:w-15">
              <PlusIcon size={24} className="h-10 text-3xl w-10" />
            </Button>
          </div> */}

          <Dialog>
            <DialogTrigger asChild>
              <div className="fixed z-[999] bottom-2/15 right-2/15">
                <Button className="md:h-15 text-5xl text-center font-light h-12 w-12 md:w-15 bg-purple-300">
                  <PlusIcon />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Habbit</DialogTitle>
                <DialogDescription>
                  Create task and track them to create a habbit.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  CreateTasks();
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Task Name
                    </Label>
                    <Input
                      id="name"
                      name="Task"
                      placeholder="Task Name"
                      value={task}
                      onChange={(e) => {
                        setTask(e.target.value);
                      }}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="username"
                      name="Description"
                      placeholder="Task Description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {taskData.map((data) => {
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
              <div
                ref={containerRef}
                className="w-full overflow-x-auto scroll-smooth"
              >
                <div className=" min-w-max">
                  <div className="">
                    <MemoizedHeatMap
                      startDay={startDay}
                      endDay={endDay}
                      data={data.taskActivity}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const MemoizedChart = React.memo(Component);
const MemoizedHeatMap = React.memo(HeatMap);

export default DashBoardComponent;
