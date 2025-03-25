"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

function Navbar() {
  const session = useSession();

  return (
    <div>
      <div className=" bg-muted">
        <nav className="h-16 bg-background border-b">
          <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold">Habitify</h1>
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
                <Button
                  onClick={() => {
                    signOut();
                  }}
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  Log out
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
