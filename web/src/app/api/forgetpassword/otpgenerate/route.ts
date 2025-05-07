import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SendVerificationMail } from "../../../../../actions/SendEmailService";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const emailSchima = z.string().email({ message: "invalide email" });

  try {
    if (!emailSchima.parse(email)) {
      return NextResponse.json({
        message: "email not valide !!",
      });
    }
    const res = await prisma.user.findUnique({
      where: {
        userEmail: email,
      },
    });

    if (!res) {
      return NextResponse.json({
        message: "user does not exsist !!",
      });
    }

    //generate otp
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpairy = new Date(Date.now() + 120000);
    const responseVerificationCodeExpairy = new Date(
      res.verifyCodeExpairy || ""
    );

    const currentTime = new Date();

    //cant genetate another otp till the valide time
    if (
      !res.verifyCodeExpairy ||
      responseVerificationCodeExpairy < currentTime
    ) {
      //store genarated opt and its time
      const data = await prisma.user.update({
        where: { userEmail: res.userEmail },
        data: { verifyCode: verifyCode, verifyCodeExpairy: verifyCodeExpairy },
      });

      //send otp through email
      if (data)
        SendVerificationMail({
          userEmail: email,
          userFirstname: res.userName || "there",
          verifyCode: verifyCode,
        });

      return NextResponse.json({
        isOtpGenerate: true,
        message: "Verification code sent To your Email !!",
      });
    }

    return NextResponse.json({
      isOtpGenerate: true,
      message: "Verification code already sent To your Email !!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while generating Verification code " + error,
      },
      { status: 404 }
    );
  }
}
