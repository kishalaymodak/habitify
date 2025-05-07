"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/inputotp";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function ChangePassswordComponent() {
  const [email, setEmail] = useState("");
  const [emailValide, setEmailValide] = useState(false);
  const [isOtpValidate, setIsOtpValidate] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIcon, setPasswordIcon] = useState(false);
  const router = useRouter();

  const generateOtp = async () => {
    if (!email.trim()) {
      toast.warning("Email field is empty !!!");
      return;
    }
    try {
      const res = await axios.post("/api/forgetpassword/otpgenerate", {
        email: email.trim(),
      });
      toast.message(res.data.message);
      if (res.data.isOtpGenerate) {
        setEmailValide(true);
      }
    } catch (error) {
      console.log(error);

      toast.error("Error While Generating OTP !!");
    }
  };

  const validateOtp = async () => {
    if (!otpValue.trim()) {
      toast.warning("OTP field is empty !!!");
      return;
    }

    try {
      const res = await axios.post("/api/forgetpassword/otpvalidate", {
        email: email.trim(),
        verifyCode: otpValue.trim(),
      });

      toast.message(res.data.message);
      if (res.data.isOtpVerified) {
        setIsOtpValidate(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while OTP validation !!");
    }
  };

  const PasswordChanger = async () => {
    if (!changePassword.trim() || !confirmPassword.trim()) {
      toast.warning("Change Password or Confirm Password fields are empty !!!");
      return;
    }
    if (changePassword.trim() != confirmPassword.trim()) {
      toast.warning("Password fields are not matching !!");
      return;
    }
    try {
      const res = await axios.post("/api/forgetpassword", {
        email: email.trim(),
        verifyCode: otpValue.trim(),
        password: changePassword.trim(),
      });
      toast.success("Password Changed !!");
      if (res.data.isPasswordChanged) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error While Changing the Password !!");
    }
  };

  return (
    <div>
      <div className="h-screen w-full bg-slate-800">
        <div className=" p-4">
          <h1 className=" text-3xl font-semibold">Change Password</h1>
        </div>
        <Separator className=" mb-4" />
        <div className=" p-4">
          <h2 className="text-xl pb-2"> Enter your Email:</h2>
          <div className=" flex flex-col md:flex-row gap-4">
            <Input
              disabled={emailValide}
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="md:w-3/5 w-full"
              type="text"
              placeholder="hello@gamil.com"
            />
            <Button
              className=" text-lg py-2"
              onClick={() => {
                generateOtp();
              }}
            >
              Send OTP
            </Button>
          </div>
        </div>
        {emailValide && !isOtpValidate && (
          <div className=" px-4 md:flex items-center gap-4">
            <div className="space-y-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(otpValue) => setOtpValue(otpValue)}
              >
                <InputOTPGroup className="">
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={0}
                  />
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={1}
                  />
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={2}
                  />
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={3}
                  />
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={4}
                  />
                  <InputOTPSlot
                    className="md:h-12 md:w-16 md:text-lg"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
              <div className=" text-sm">
                {otpValue === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {otpValue}</>
                )}
              </div>
            </div>
            <Button
              className="md:mb-6 mt-4 md:mt-0 text-lg py-2"
              onClick={() => {
                validateOtp();
              }}
            >
              Verify OTP
            </Button>
          </div>
        )}

        {isOtpValidate && (
          <div className=" flex flex-col gap-4 pt-4 px-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl">New Password</h2>
              <div className="flex gap-4 items-center ">
                <Input
                  defaultValue={changePassword}
                  type={passwordIcon ? "text" : "password"}
                  className="w-3/5"
                  onChange={(e) => {
                    setChangePassword(e.target.value);
                  }}
                />
                <span
                  onClick={() => {
                    setPasswordIcon(!passwordIcon);
                  }}
                >
                  {passwordIcon ? <Eye /> : <EyeOff />}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl">Confirm New Password</h2>
              <Input
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                type="text"
                className="w-3/5"
              />
            </div>
            <Button
              onClick={() => {
                PasswordChanger();
              }}
              className="mt-2 text-xl py-5 md:w-1/5"
            >
              Change Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePassswordComponent;
