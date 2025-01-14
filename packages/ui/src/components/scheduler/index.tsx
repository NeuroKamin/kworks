"use client"

import { useState } from "react";
import DayColumn from "./day-column.js";
import TimeColumn from "./time-column.js";
import { Button } from "../button.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SchedulerEvent } from "./event-card.js";
import { SchedulerProvider } from './SchedulerContext.js';


const events: SchedulerEvent[] = [
    { 
        id: "1", 
        title: "Event 1", 
        project: "Project 1", 
        start: new Date(2025, 0, 13, 8, 30, 0, 0), 
        end: new Date(2025, 0, 13, 12, 0, 0, 0), 
        color: "red" 
    },
    { 
        id: "2", 
        title: "Event 2", 
        project: "Project 2", 
        start: new Date(2025, 0, 14, 9, 0, 0, 0), 
        end: new Date(2025, 0, 14, 14, 0, 0, 0), 
        color: "blue" 
    },
    { 
        id: "3", 
        title: "Event 3", 
        project: "Project 3", 
        start: new Date(2025, 0, 15, 10, 0, 0, 0), 
        end: new Date(2025, 0, 15, 18, 30, 0, 0), 
        color: "green" 
    },
    { 
        id: "4", 
        title: "Event 4", 
        project: "Project 4", 
        start: new Date(2025, 0, 16, 10, 0, 0, 0), 
        end: new Date(2025, 0, 16, 18, 30, 0, 0), 
        color: "yellow" 
    },
    { 
        id: "5", 
        title: "Event 5", 
        project: "Project 5", 
        start: new Date(2025, 0, 17, 10, 0, 0, 0), 
        end: new Date(2025, 0, 17, 18, 30, 0, 0), 
        color: "purple" 
    },
];

const Scheduler = () => {

    const [weekOffset, setWeekOffset] = useState(0);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7));
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    const weekNumber = (() => {
        const firstDayOfYear = new Date(startOfWeek.getFullYear(), 0, 1);
        const pastDaysOfYear = (startOfWeek.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    })();


    return (
        <SchedulerProvider hoursFrom={7} hoursTo={20}>
            <div className="w-full">
                <div className="flex items-center justify-end px-4 gap-4">
                    <div className="text-sm text-muted-foreground">
                        {`${startOfWeek.toLocaleDateString('ru-RU', { month: 'long' })} ${startOfWeek.getFullYear()} | Неделя ${weekNumber}`}
                    </div>
                    <div className="flex items-center gap-0 w-fit rounded-md">
                        <Button onClick={() => setWeekOffset(weekOffset - 1)} size={"sm"} variant={"ghost"} className="rounded-r-none">
                            <ChevronLeft />
                        </Button>
                        <Button size={"sm"} variant={"ghost"} onClick={() => setWeekOffset(0)} className="rounded-none">
                            Сегодня
                        </Button>
                        <Button onClick={() => setWeekOffset(weekOffset + 1)} size={"sm"} variant={"ghost"} className="rounded-l-none">
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                <div className="flex items-start justify-center gap-0">
                    <TimeColumn />
                    {days.map((date, index) => (
                        <DayColumn key={index} 
                            date={date} 
                            events={events.filter((event) => event.start.toDateString() === date.toDateString())} />
                    ))}
                </div>
            </div>
        </SchedulerProvider>
    )
}

export default Scheduler;