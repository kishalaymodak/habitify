"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function Profile() {
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIcon, setPasswordIcon] = useState(false);

  if (!session.data) {
    redirect("/");
  }

  async function getData() {
    const data = await axios.get("/api/profile");
    setEmail(data.data.email);
    setPassword(data.data.password);
  }
  async function PasswordChanger() {
    if (!changePassword.trim() || !confirmPassword.trim()) {
      toast.warning("Change Password or Confirm Password fields are empty !!!");
      return;
    }
    if (changePassword.trim() != confirmPassword.trim()) {
      toast.warning("Password fields are not matching !!");
      return;
    }

    try {
      await axios.post("/api/profile", {
        changePassword,
        confirmPassword,
      });
      toast.success("Password change successfully done !!");
      getData();
      setChangePassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error in password chainging !!");
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="h-screen w-full bg-black">
        <div className=" p-4">
          <h1 className=" text-3xl font-semibold">Profile</h1>
        </div>
        <Separator className=" mb-4" />
        <div className=" p-4">
          <div className=" flex gap-4">
            <h2 className="text-xl">Email Address:</h2>
            <Input
              disabled
              defaultValue={email}
              className="w-3/5"
              type="text"
            />
          </div>
          <div className=" flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl">Current Password</h2>
              <div className="flex gap-4 items-center ">
                <Input
                  disabled
                  defaultValue={password}
                  type={passwordIcon ? "text" : "password"}
                  className="w-3/5"
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
              <h2 className="text-xl">New Password</h2>
              <Input
                type="password"
                value={changePassword}
                onChange={(e) => {
                  setChangePassword(e.target.value);
                }}
                className="w-3/5"
              />
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
          </div>
          <Button
            onClick={() => {
              PasswordChanger();
            }}
            className="mt-4 text-xl py-5"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
