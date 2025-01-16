"use client"

import { useState } from "react";
import DayColumn from "./day-column.js";
import TimeColumn from "./time-column.js";
import { Button } from "../button.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard, { SchedulerEvent } from "./event-card.js";
import { SchedulerProvider } from './SchedulerContext.js';

interface SchedulerProps {
    events: SchedulerEvent[];
    onAddEvent: (event: SchedulerEvent) => void;
    onRemoveEvent: (event: SchedulerEvent) => void;
    onUpdateEvent: (event: SchedulerEvent) => void;
}

const Scheduler = ({ events, onAddEvent, onRemoveEvent, onUpdateEvent }: SchedulerProps) => {

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

    const handleUpdateEvent = (event: SchedulerEvent) => {
        onUpdateEvent(event);
    }

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
                    <div className="flex w-full h-full relative">
                        {days.map((date, index) => (
                            <DayColumn key={index}
                                date={date}
                                totalTime={events.filter((event) => event.start.toDateString() === date.toDateString()).reduce((acc, event) => acc + (event.end.getTime() - event.start.getTime()), 0)}
                            />
                        ))}
                        <div className="absolute top-0 left-0 flex w-full h-full pt-[53px]">
                            {days.map((date, index) => (

                                <div className="relative w-full h-full overflow-hidden" key={date.toDateString()}>
                                    {
                                        events.filter((event) => event.start.toDateString() === date.toDateString()).map((event) => (
                                            <EventCard key={event.id} event={event} onUpdate={handleUpdateEvent} />
                                        ))
                                    }
                                </div>

                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </SchedulerProvider>
    )
}

export default Scheduler;