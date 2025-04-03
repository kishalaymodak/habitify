import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
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

    return NextResponse.json({
      message: "Authenticated",
      email: user.userEmail,
      password: user.password,
    });
  } catch (error) {
    console.log("profile data fetching" + error);

    return NextResponse.json(
      {
        message: "error while fetching user data",
      },
      { status: 404 }
    );
  }
}
