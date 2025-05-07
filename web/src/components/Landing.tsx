"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ChartLine, CheckSquare2, Clock1 } from "lucide-react";
import React, { useEffect } from "react";

export function Landing() {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    // if (session.data?.user) {
    //   // router.push("/dashboard");
    // }
  }, [session.status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <main className="text-center py-20 px-4">
        <h2 className="text-5xl font-extrabold text-blue-900 mb-6">
          Build Better Habits, One Day at a Time
        </h2>
        <p className="text-lg text-blue-800 max-w-xl mx-auto mb-10">
          Stay on track and achieve your goals with Habit Monk. Easily track
          your daily habits, visualize your progress, and make positive changes.
        </p>
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
          className="bg-blue-600 text-white px-8 py-3 text-lg rounded-full hover:bg-blue-700"
        >
          Start Tracking Now
        </Button>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<CheckSquare2 size={50} className="text-blue-700" />}
            title="Track Your Habits"
            description="Record daily habits effortlessly and stay consistent."
          />

          <FeatureCard
            icon={<ChartLine size={50} className="text-blue-700" />}
            title="Visualize Progress"
            description="See your streaks and milestones through interactive heatmaps."
          />

          <FeatureCard
            icon={<Clock1 size={50} className="text-blue-700" />}
            title="Stay Consistent"
            description="Set goals and reminders to keep yourself accountable."
          />
        </section>
      </main>

      <footer className="text-center py-10 text-blue-900">
        &copy; {new Date().getFullYear()} Habit Monk. All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col items-center">
      {icon}
      <h3 className="text-2xl text-blue-950 font-semibold mt-4 mb-2">
        {title}
      </h3>
      <p className="text-blue-800 text-center">{description}</p>
    </div>
  );
}
