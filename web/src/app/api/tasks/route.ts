import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const { taskName, taskDescriotion } = await req.json();
  console.log(taskDescriotion);

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "you are not logedIn",
        },
        { status: 403 }
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        userEmail: session?.user?.email || "",
      },
    });
    if (!user || user == null) {
      return NextResponse.json(
        {
          message: "user not found. please LogIn or SignUp",
        },
        { status: 403 }
      );
    }

    const res = await prisma.task.create({
      data: {
        taskName: taskName,
        taskDesctription: taskDescriotion,
        userId: user.id,
        totalActivity: 0,
      },
    });
    return NextResponse.json({
      message: "task created successfully",
      task: res,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        message: "task creation error",
      },
      {
        status: 404,
      }
    );
  }
}

export async function GET() {
  const session = await getServerSession();
  try {
    if (!session?.user?.email) {
      return NextResponse.json({
        message: "you are not logedIn",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        userEmail: session?.user?.email || "",
      },
    });
    if (!user || user == null) {
      return NextResponse.json({
        message: "user not found. please LogIn or SignUp",
      });
    }
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        taskActivity: true,
        taskName: true,
        taskDesctription: true,
        createDate: true,
      },
    });
    return NextResponse.json({
      message: "successfully fetched the tasks",
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "server is not resposing",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PUT(req: NextRequest) {
  // const session = await getServerSession();
  const { taskName, taskDescriotion, taskId, userId } = await req.json();

  try {
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     {
    //       message: "you are not logedIn",
    //     },
    //     { status: 403 }
    //   );
    // }
    // const user = await prisma.user.findFirst({
    //   where: {
    //     userEmail: session?.user?.email || "",
    //   },
    // });
    // if (!user || user == null) {
    //   return NextResponse.json(
    //     {
    //       message: "user not found. please LogIn or SignUp",
    //     },
    //     { status: 403 }
    //   );
    // }

    const res = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        taskName: taskName,
        taskDesctription: taskDescriotion,
        userId: userId,
      },
    });
    return NextResponse.json({
      message: "task updated successfully",
      task: res,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        message: "task upgradation error",
      },
      {
        status: 404,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const { taskId } = await req.json();
  console.log(taskId);

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "you are not logedIn",
        },
        { status: 403 }
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        userEmail: session?.user?.email || "",
      },
    });
    if (!user || user == null) {
      return NextResponse.json(
        {
          message: "user not found. please LogIn or SignUp",
        },
        { status: 403 }
      );
    }

    const res = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    return NextResponse.json({
      message: "task deleated successfully",
      task: res,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        message: "task deletion error",
      },
      {
        status: 404,
      }
    );
  }
}
