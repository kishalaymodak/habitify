"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import NavAvatar from "./NavAvatar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/habit-monk-logo.png";

function Navbar() {
  const session = useSession();
  const image = session.data?.user?.image;
  return (
    <div>
      <div className=" bg-muted">
        <nav className="h-16 bg-background border-b">
          <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link className="flex gap-4 items-center justify-center" href={"/"}>
              <Image
                className="rounded-4xl"
                src={logo}
                alt=""
                width={40}
                height={40}
              />
              <h1 className="text-2xl font-semibold hidden md:block">
                Habit Monk
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              {!session.data && (
                <Button
                  onClick={() => {
                    signIn();
                  }}
                >
                  Sign In
                </Button>
              )}
              {session.data && (
                <NavAvatar
                  image={image || ""}
                  name={session.data.user?.email?.at(0)?.toUpperCase() || ""}
                />

                // <Button
                //   onClick={() => {
                //     signOut();
                //   }}
                //   variant="outline"
                //   className="hidden sm:inline-flex"
                // >
                //   Log out
                // </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
