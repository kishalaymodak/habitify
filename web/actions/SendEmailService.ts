"use server";
import { Resend } from "resend";
import { OnBoardinigMail } from "../emails/OnboardingEmail";
import HabitMonkVerifyEmail from "../emails/VerificationCodeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendOnBoardingMail({
  userFirstname,
  userEmail,
}: {
  userFirstname: string;
  userEmail: string;
}) {
  if (!userFirstname) {
    return;
  }
  const { data, error } = await resend.emails.send({
    from: "HabitMonk <onboarding@habitmonk.kishalay.tech>",
    to: userEmail,
    subject: "Welcome To HabitMonk !!",
    react: OnBoardinigMail(userFirstname),
  });
  if (error) {
    console.log("mail srvice is down: " + error);
    return error;
  }
  return data;
}

export async function SendVerificationMail({
  userFirstname,
  userEmail,
  verifyCode,
}: {
  userFirstname: string;
  userEmail: string;
  verifyCode: string;
}) {
  if (!userFirstname || !verifyCode) {
    return;
  }

  const { data, error } = await resend.emails.send({
    from: "HabitMonk <noreply@habitmonk.kishalay.tech>",
    to: userEmail,
    subject: "Verification Code !!",
    react: HabitMonkVerifyEmail({ verificationCode: verifyCode }),
  });
  if (error) {
    console.log("mail srvice is down: " + error.message);
    return error;
  }
  return data;
}
