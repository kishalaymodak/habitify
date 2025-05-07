"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");
  const router = useRouter();
  async function createUser() {
    try {
      const res = await axios.post("api/signup", { email, password, userName });
      if (res.status == 200) {
        toast.success("user created successfully Please login !!");
        return true;
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      // Ensure 'error' is an Axios error
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return false;
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle> Create your account</CardTitle>
          <CardDescription>
            Enter your email below to Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await createUser();

              if (res) router.push("/login");
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Jhon Doh"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Sign Up with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                LogIn
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
