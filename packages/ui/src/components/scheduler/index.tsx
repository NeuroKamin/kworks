"use client"

import { useState, useRef, useEffect } from "react";
import DayColumn from "./day-column.js";
import TimeColumn from "./time-column.js";
import { Button } from "../button.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard, { SchedulerEvent } from "./event-card.js";
import { SchedulerProvider, useScheduler } from './SchedulerContext.js';
import { getWeek } from "@workspace/ui/lib/utils.js";

interface SchedulerProps {
    events: SchedulerEvent[];
    onAddEvent?: (event: SchedulerEvent) => void;
    onRemoveEvent?: (event: SchedulerEvent) => void;
    onUpdateEvent?: (event: SchedulerEvent) => void;
    onWeekChange?: (start: Date, end: Date) => void;
}

const SchedulerContent = ({
    events,
    onUpdateEvent,
    onWeekChange
}: SchedulerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setColumnWidth } = useScheduler();

    useEffect(() => {
        const updateColumnWidth = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const newColumnWidth = Math.floor(containerWidth / 7);
                setColumnWidth(newColumnWidth);
            }
        };

        updateColumnWidth();
        window.addEventListener('resize', updateColumnWidth);
        return () => window.removeEventListener('resize', updateColumnWidth);
    }, [setColumnWidth]);

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
        onUpdateEvent?.(event);
    }

    const nextWeek = () => {
        setWeekOffset(weekOffset + 1);
        handleWeekChange(weekOffset + 1);
    }

    const prevWeek = () => {
        setWeekOffset(weekOffset - 1);
        handleWeekChange(weekOffset - 1);
    }

    const todayWeek = () => {
        setWeekOffset(0);
        handleWeekChange(0);
    }

    const handleWeekChange = (offset: number) => {
        const { startOfWeek, endOfWeek } = getWeek(offset);
        onWeekChange?.(startOfWeek, endOfWeek);
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-end px-4 gap-4">
                <div className="text-sm text-muted-foreground">
                    {`${startOfWeek.toLocaleDateString('ru-RU', { month: 'long' })} ${startOfWeek.getFullYear()} | Неделя ${weekNumber}`}
                </div>
                <div className="flex items-center gap-0 w-fit rounded-md">
                    <Button onClick={prevWeek} size={"sm"} variant={"ghost"} className="rounded-r-none">
                        <ChevronLeft />
                    </Button>
                    <Button size={"sm"} variant={"ghost"} onClick={todayWeek} className="rounded-none">
                        Сегодня
                    </Button>
                    <Button onClick={nextWeek} size={"sm"} variant={"ghost"} className="rounded-l-none">
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            <div className="flex items-start justify-center gap-0">
                <TimeColumn />
                <div ref={containerRef} className="flex w-full h-full relative">
                    {days.map((date, index) => (
                        <DayColumn key={index}
                            date={date}
                            totalTime={events.filter((event) => event.start.toDateString() === date.toDateString()).reduce((acc, event) => acc + (event.end.getTime() - event.start.getTime()), 0)}
                        />
                    ))}
                    <div className="absolute top-0 left-0 flex w-full h-full pt-[53px]">
                        <div className="z-10 relative w-full h-full overflow-y-hidden">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onUpdate={handleUpdateEvent}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Scheduler = ({ events, onAddEvent, onRemoveEvent, onUpdateEvent, onWeekChange }: SchedulerProps) => {
    return (
        <SchedulerProvider hoursFrom={7} hoursTo={20}>
            <SchedulerContent
                events={events}
                onUpdateEvent={onUpdateEvent}
                onWeekChange={onWeekChange}
            />
        </SchedulerProvider>
    )
}

export default Scheduler;