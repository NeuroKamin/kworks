"use client"

import { useScheduler } from "./SchedulerContext.js";

const TimeColumn = () => {
    const { hoursFrom, hoursTo } = useScheduler();
    return (
        <div className="flex flex-col pl-3">
            <div className="h-[48px]" />
            <div className="flex flex-col text-muted-foreground text-xs">
                {Array.from({ length: hoursTo - hoursFrom + 1 }).map((_, index) => (
                    <div key={index} className="h-10 flex items-start justify-end pr-3 leading-none">
                        {hoursFrom + index}:00
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimeColumn;