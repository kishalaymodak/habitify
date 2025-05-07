import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  console.log(session);

  const { taskId, today } = await req.json();
  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "you are not logedIn",
        },
        { status: 403 }
      );
    }
    // const day = new Date();
    // const today = day.toLocaleString("en-CA").slice(0, 10);
    console.log(today);

    const tasks = await prisma.taskActivity.findFirst({
      where: {
        taskId: taskId,
        date: today,
      },
    });

    if (tasks) {
      const taskDone = !tasks.taskDone;

      const updatedTask = await prisma.taskActivity.update({
        where: {
          id: tasks.id,
        },
        data: {
          taskDone: taskDone,
        },
      });
      if (updatedTask.taskDone == false) {
        const deleatedActivity = await prisma.taskActivity.delete({
          where: {
            id: updatedTask.id,
          },
        });
        return NextResponse.json({
          message: "Task Marked Undone",
          task: deleatedActivity,
        });
      }

      return NextResponse.json({
        message: "Task Marked Undone",
        task: updatedTask,
      });
    }

    const res = await prisma.taskActivity.create({
      data: {
        taskDone: true,
        taskId: taskId,
        date: today,
      },
    });
    return NextResponse.json({
      message: "Task Marked Done",
      activity: res,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "activity creation error",
      },
      {
        status: 404,
      }
    );
  }
}
