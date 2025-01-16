"use client"

import { cn } from "@workspace/ui/lib/utils.js";
import HourCell from "./hour-cell.js";
import { useScheduler } from "./SchedulerContext.js";

const DayColumn = ({ date, totalTime }: { date: Date, totalTime: number }) => {
    const { hoursFrom, hoursTo, columnWidth } = useScheduler();
    const isToday = date.toDateString() === new Date().toDateString();
    const totalHours = Math.floor(totalTime / 60);
    const totalMinutes = totalTime % 60;
    return <div className="flex flex-col w-full" style={{ minWidth: `${columnWidth}px` }}>
        <div className="text-xs text-muted-foreground border-b border-border flex items-center gap-2 p-2 leading-none">
            <div className={cn("text-3xl font-bold px-1 rounded-md", isToday ? "bg-blue-500/20" : "bg-transparent")}>
                {date.getDate()}
            </div>
            <div className="flex flex-col">
                <div>
                    {date.toLocaleDateString('ru-RU', { weekday: 'long' })}
                </div>
                <div className="font-semibold">
                    {Math.round(totalTime / (1000 * 60 * 60) * 10) / 10}ч
                </div>
            </div>
        </div>
        <div className="relative flex flex-col border-border/40 border-l border-r">
            {Array.from({ length: hoursTo - hoursFrom }).map((_, index) => (
                <HourCell key={index} day={date.getDate()} hour={hoursFrom + index} />
            ))}
            
        </div>
        
        
    </div>;
}

export default DayColumn;