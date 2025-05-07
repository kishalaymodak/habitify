import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const { email, password, verifyCode } = await req.json();
  const emailSchima = z.string().email({ message: "invalide email" });

  try {
    if (!emailSchima.parse(email)) {
      return NextResponse.json({
        message: "email not valide",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userEmail: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "user does not exsist",
        },
        { status: 403 }
      );
    }

    const isCodeValid = user.verifyCode == verifyCode;
    if (!isCodeValid) {
      return NextResponse.json(
        {
          message: "Unauthenticated !!",
        },
        { status: 403 }
      );
    }

    if (user.isVerified) {
      const hasedPassword = await bcrypt.hash(password, 10);
      const data = await prisma.user.update({
        where: { userEmail: email },
        data: { password: hasedPassword, isVerified: false },
      });
      if (!data) {
        return NextResponse.json(
          {
            message: "error while Updating password",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({
        isPasswordChanged: true,
        message: "Password Updated !!",
      });
    }
    return NextResponse.json(
      {
        message: "User not verified !!",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "error while Updating password " + error,
      },
      { status: 404 }
    );
  }
}
