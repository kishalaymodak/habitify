import DashBoardComponent from "@/components/DashBoardComponent";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function DashBoard() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <div className="">
        <Navbar />
        <DashBoardComponent />
      </div>
    </>
  );
}

export default DashBoard;
