import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimiter } from "@/lib/ratelimiter";

export async function POST(req: NextRequest) {
  const { email, verifyCode } = await req.json();
  const ip =
    req.headers.get(["x-forwarded-for"]?.toString()) ||
    req.headers.get(["x-real-ip"]?.toString()) ||
    req.headers.get(["cf-connecting-ip"]?.toString()) ||
    req.headers.get(["client-ip"]?.toString()) ||
    "unknown";

  console.log(ip);

  const { success, reset } = await rateLimiter.limit(ip);
  console.log(success);

  if (!success) {
    return NextResponse.json({
      message: "Too many requests, please try again later !!",
      retryAfter: reset,
    });
  }

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
      return NextResponse.json({
        message: "user does not exsist",
      });
    }
    //chechk the verifycode is valide or not
    if (!user.verifyCodeExpairy || !user.verifyCode) {
      return NextResponse.json({
        message: "Verification Code is not generated",
      });
    }
    const isCodeValid = user.verifyCode == verifyCode;
    if (!isCodeValid) {
      return NextResponse.json({
        message: "wrong Verification Code Entered !!",
      });
    }
    const isCodeNotExpired = new Date(user.verifyCodeExpairy) > new Date();
    //validate the verifycode
    if (isCodeValid && isCodeNotExpired) {
      const data = await prisma.user.update({
        where: { userEmail: user.userEmail },
        data: { isVerified: true },
      });
      if (!data) {
        return NextResponse.json(
          {
            message: "error while Verification",
          },
          { status: 402 }
        );
      }
      return NextResponse.json({
        isOtpVerified: true,
        message: "Email is verified !!",
      });
    }

    return NextResponse.json({
      message: "Verification code Expired !!",
    });
    //ratelimite
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error while Verification " + error,
      },
      { status: 404 }
    );
  }
}
