import { HeatMapType } from "@/lib/types";
import React, { useMemo } from "react";

function HeatMap({ startDay, endDay, data }: HeatMapType) {
  const startingDay = new Date(startDay);
  const endingDay = new Date(endDay);

  const dayInYear = Math.ceil(
    (endingDay.getTime() - startingDay.getTime()) / (1000 * 60 * 60 * 24)
  );
  // console.log(dayInYear);
  // console.log(endingDay.toLocaleDateString("en-CA") + "ending");
  // console.log(startingDay);
  // console.log("loging data from heatmap");

  // console.log(data);

  const activityMap = useMemo(() => {
    const map = new Set<string>();
    data.forEach((item) => {
      map.add(item.date.slice(0, 10));
    });
    return map;
  }, [data]);
  // console.log("activity Map");

  // console.log(activityMap);

  const calanderGrid = useMemo(() => {
    return Array.from({ length: dayInYear + 1 }, (_, i) => {
      const date = new Date(startingDay);
      date.setDate(startingDay.getDate() + i);
      return date.toLocaleString("en-CA").slice(0, 10);
    });
  }, [startDay, endDay]);

  // console.log(startingDay.toISOString().slice(0, 10));
  // console.log(
  //   new Date(data[1]?.date).toLocaleString("en-CA").slice(0, 10) ==
  //     calanderGrid[365]
  // );
  // console.log("calanderGrid");

  // console.log(calanderGrid[365]);

  return (
    <div className="p-5">
      <div className=" grid grid-flow-col gap-1 grid-rows-7">
        {calanderGrid.map((day, index) => {
          return (
            <div
              key={index}
              title={`taskDone=${activityMap.has(day)} on date=${day}`}
              className={`h-4 w-4 cursor-pointer rounded ${
                activityMap.has(day) ? "bg-red-400" : "bg-blue-200"
              }`}
            >
              {activityMap.has(day)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HeatMap;
