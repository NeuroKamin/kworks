"use client";

import SchedulerUI from "@workspace/ui/components/scheduler";
import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";
import { getWeek } from "@workspace/ui/lib/utils";
import { useSelector } from "@xstate/store/react";
import { useEffect, useState } from "react";

import { eventsStore } from "@/store/events";
import { getEvents } from "@/actions/events";

export default function Scheduler({ events }: { events: SchedulerEvent[] }) {
  const { startOfWeek: initialStartOfWeek, endOfWeek: initialEndOfWeek } =
    getWeek();
  const [startOfWeek, setStartOfWeek] = useState(initialStartOfWeek);
  const [endOfWeek, setEndOfWeek] = useState(initialEndOfWeek);

  useEffect(() => {
    eventsStore.send({ type: "init", events });
  }, [events]);

  const storeEvents = useSelector(eventsStore, (state) => state.context.events);

  const onAddEvent = (event: SchedulerEvent) => {
    eventsStore.send({ type: "add", event });
  };

  const onRemoveEvent = (event: SchedulerEvent) => {
    console.log(event);
  };

  const onUpdateEvent = (event: SchedulerEvent) => {
    eventsStore.send({ type: "update", event });
  };

  const onWeekChange = async (start: Date, end: Date) => {
    const newEvents = await getEvents(start, end);
    eventsStore.send({ type: "init", events: newEvents });
  };

  return (
    <SchedulerUI
      events={storeEvents}
      onAddEvent={onAddEvent}
      onRemoveEvent={onRemoveEvent}
      onUpdateEvent={onUpdateEvent}
      onWeekChange={onWeekChange}
    />
  );
}
