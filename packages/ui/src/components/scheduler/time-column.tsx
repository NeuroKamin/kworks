"use client"

import { useScheduler } from "./SchedulerContext.js";

const TimeColumn = () => {
    const { hoursFrom, hoursTo } = useScheduler();
    return (
        <div className="flex flex-col pt-[53px] text-muted-foreground">
            {Array.from({ length: hoursTo - hoursFrom + 1 }).map((_, index) => (
                <div key={index} className="h-10 border-l border-border flex items-center justify-center w-20">
                    {hoursFrom + index}:00
                </div>
            ))}
        </div>
    );
}

export default TimeColumn;