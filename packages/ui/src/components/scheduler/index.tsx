"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeek } from "@workspace/ui/lib/utils";

import { Button } from "../button";
import { useSidebar } from "../sidebar";

import DayColumn from "./day-column";
import TimeColumn from "./time-column";
import EventCard, { SchedulerEvent } from "./event-card";
import { SchedulerProvider, useScheduler } from "./SchedulerContext";
import { minutesPerGrid } from "./constants";

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
  onWeekChange,
  onAddEvent,
}: SchedulerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setColumnWidth } = useScheduler();
  const [isCreating, setIsCreating] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState<SchedulerEvent | null>(
    null,
  );
  const [initialY, setInitialY] = useState(0);

  const { state } = useSidebar();

  const updateColumnWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const timeColumnWidth = 60; // Ширина колонки времени
      const availableWidth = containerWidth - timeColumnWidth;
      const newColumnWidth = Math.max(
        Math.min(Math.floor(availableWidth / 7), 200),
        100,
      ); // Минимум 100px, максимум 200px
      setColumnWidth(newColumnWidth);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      updateColumnWidth();
    }, 300);
  }, [state]);

  useEffect(() => {
    updateColumnWidth();
    window.addEventListener("resize", updateColumnWidth);
    return () => window.removeEventListener("resize", updateColumnWidth);
  }, [setColumnWidth]);

  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(
    today.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7,
    ),
  );

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const weekNumber = (() => {
    const firstDayOfYear = new Date(startOfWeek.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (startOfWeek.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  })();

  const handleUpdateEvent = (event: SchedulerEvent) => {
    onUpdateEvent?.(event);
  };

  const handleAddEvent = (event: SchedulerEvent) => {
    setCreatingEvent(null);
    onAddEvent?.(event);
  };

  const nextWeek = () => {
    setWeekOffset(weekOffset + 1);
    handleWeekChange(weekOffset + 1);
  };

  const prevWeek = () => {
    setWeekOffset(weekOffset - 1);
    handleWeekChange(weekOffset - 1);
  };

  const todayWeek = () => {
    setWeekOffset(0);
    handleWeekChange(0);
  };

  const handleWeekChange = (offset: number) => {
    const { startOfWeek, endOfWeek } = getWeek(offset);
    onWeekChange?.(startOfWeek, endOfWeek);
  };

  const handleCreateStart = (
    day: number,
    hour: number,
    hourPart: number,
    e: React.MouseEvent,
  ) => {
    const startDate = new Date(days[day]!);
    startDate.setHours(hour);
    startDate.setMinutes(hourPart * minutesPerGrid);

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + minutesPerGrid);

    const newEvent: SchedulerEvent = {
      id: `temp-${Date.now()}`,
      title: "",
      project: "",
      start: startDate,
      end: endDate,
      color: "slate",
    };

    setCreatingEvent(newEvent);
    setIsCreating(true);
    setInitialY(e.clientY);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end px-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {`${startOfWeek.toLocaleDateString("ru-RU", { month: "long" })} ${startOfWeek.getFullYear()} | Неделя ${weekNumber}`}
          </div>
          <div className="flex items-center gap-0 w-fit rounded-md">
            <Button
              onClick={prevWeek}
              size={"sm"}
              variant={"ghost"}
              className="rounded-r-none"
            >
              <ChevronLeft />
            </Button>
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={todayWeek}
              className="rounded-none"
            >
              Сегодня
            </Button>
            <Button
              onClick={nextWeek}
              size={"sm"}
              variant={"ghost"}
              className="rounded-l-none"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex w-full h-full relative overflow-x-auto"
      >
        <TimeColumn />
        <div className="flex-1 flex relative">
          <div className="absolute inset-0 flex">
            {days.map((date, index) => (
              <DayColumn
                key={index}
                date={date}
                totalTime={events
                  .filter(
                    (event) =>
                      event.start.toDateString() === date.toDateString(),
                  )
                  .reduce(
                    (acc, event) =>
                      acc + (event.end.getTime() - event.start.getTime()),
                    0,
                  )}
                onCreateStart={handleCreateStart}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none pt-[53px]">
            <div className="relative w-full h-full">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onUpdate={handleUpdateEvent}
                />
              ))}
              {creatingEvent && (
                <EventCard
                  event={creatingEvent}
                  onAdd={handleAddEvent}
                  autoResize={isCreating}
                  creatingY={initialY}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Scheduler = ({
  events,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
  onWeekChange,
}: SchedulerProps) => {
  return (
    <SchedulerProvider hoursFrom={7} hoursTo={22}>
      <SchedulerContent
        events={events}
        onUpdateEvent={onUpdateEvent}
        onWeekChange={onWeekChange}
        onAddEvent={onAddEvent}
      />
    </SchedulerProvider>
  );
};

export default Scheduler;
