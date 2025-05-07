import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { SendOnBoardingMail } from "../../../../actions/SendEmailService";

export async function POST(req: NextRequest) {
  const { email, password, userName } = await req.json();
  console.log(email);

  const emailSchima = z.string().email({ message: "invalide email" });
  try {
    if (!emailSchima.parse(email)) {
      return NextResponse.json({
        message: "email not valide",
      });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const res = await prisma.user.findUnique({
      where: {
        userEmail: email,
      },
    });
    if (res) {
      const userPassword = res.password || "";
      const matchPassword = await bcrypt.compare(password, userPassword);
      if (matchPassword) {
        return NextResponse.json({
          message: "user already exsist",
        });
      } else {
        return NextResponse.json(
          {
            message: "wrong password",
          },
          { status: 403 }
        );
      }
    }

    const user = await prisma.user.create({
      data: {
        userEmail: email,
        userName: userName,
        password: hasedPassword,
      },
    });
    if (userName)
      if (user) {
        const userFirstname = String(userName).split(" ");
        SendOnBoardingMail({
          userEmail: user.userEmail,
          userFirstname: userFirstname[0],
        });
      }

    return NextResponse.json({
      message: "user created",
      user: user.userEmail,
    });
  } catch (error) {
    console.log("sign Up error" + error);
    return NextResponse.json(
      {
        message: "error while creating user",
      },
      { status: 404 }
    );
  }
}
