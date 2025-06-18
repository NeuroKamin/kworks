"use client";

import { cn } from "@workspace/ui/lib/utils";

import HourCell from "./hour-cell";
import { useScheduler } from "./SchedulerContext";

const DayColumn = ({
  date,
  totalTime,
  onCreateStart,
}: {
  date: Date;
  totalTime: number;
  onCreateStart: (
    day: number,
    hour: number,
    hourPart: number,
    e: React.MouseEvent,
  ) => void;
}) => {
  const { hoursFrom, hoursTo, columnWidth } = useScheduler();
  const isToday = date.toDateString() === new Date().toDateString();
  const dayOfWeek = date.getDay();
  const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return (
    <div
      className="flex flex-col w-full"
      style={{ minWidth: `${columnWidth}px` }}
    >
      <div className="text-xs text-muted-foreground border-b border-border flex items-center gap-2 p-2 leading-none">
        <div
          className={cn(
            "text-3xl font-bold px-1 rounded-md",
            isToday ? "bg-blue-500/20" : "bg-transparent",
          )}
        >
          {date.getDate()}
        </div>
        <div className="flex flex-col">
          <div className="hidden @5xl:block">
            {date.toLocaleDateString("ru-RU", { weekday: "long" })}
          </div>
          <div className="block @5xl:hidden">
            {date.toLocaleDateString("ru-RU", { weekday: "short" })}
          </div>
          <div className="font-semibold">
            {Math.round((totalTime / (1000 * 60 * 60)) * 10) / 10}ч
          </div>
        </div>
      </div>
      <div className="relative flex flex-col border-border/40 border-l border-r">
        {Array.from({ length: hoursTo - hoursFrom }).map((_, index) => (
          <HourCell
            key={index}
            day={adjustedDayOfWeek}
            hour={hoursFrom + index}
            onDragStart={onCreateStart}
          />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
