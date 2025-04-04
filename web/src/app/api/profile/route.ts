import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession();
//   try {
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         {
//           message: "you are not logedIn",
//         },
//         { status: 403 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         userEmail: session?.user?.email || "",
//       },
//     });
//     if (!user || user == null) {
//       return NextResponse.json(
//         {
//           message: "user not found. please LogIn or SignUp",
//         },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       message: "Authenticated",
//       email: user.userEmail,
//       password: user.password,
//     });
//   } catch (error) {
//     console.log("profile data fetching" + error);

//     return NextResponse.json(
//       {
//         message: "error while fetching user data",
//       },
//       { status: 404 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const {
    confirmPassword,
    changePassword,
  }: { confirmPassword: string; changePassword: string } = await req.json();
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

    const user = await prisma.user.findUnique({
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

    if (changePassword.trim() != confirmPassword.trim()) {
      return NextResponse.json(
        {
          message: "Change password and confirm password are not matching",
        },
        { status: 403 }
      );
    }

    const hashPassword = await bcrypt.hash(confirmPassword, 10);

    const data = await prisma.user.update({
      where: {
        userEmail: session.user.email,
      },
      data: {
        password: hashPassword,
      },
    });
    return NextResponse.json({
      message: "password change successfully",
      data: data.id,
    });
  } catch (error) {
    console.log("profile data fetching" + error);

    return NextResponse.json(
      {
        message: "error while updating password",
      },
      { status: 404 }
    );
  }
}
