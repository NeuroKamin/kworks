"use client"

import { eventsStore } from "@/store/events";
import SchedulerUI from "@workspace/ui/components/scheduler";
import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";
import { useSelector } from '@xstate/store/react';
import { useEffect } from "react";

export default function Scheduler({ events }: { events: SchedulerEvent[] }) {

    useEffect(() => {
        eventsStore.send({ type: 'init', events });
    }, [events]);


    const  storeEvents = useSelector(eventsStore, (state) =>state.context.events);

    const onAddEvent = (event: SchedulerEvent) => {
        console.log(event);
    }

    const onRemoveEvent = (event: SchedulerEvent) => {
        console.log(event);
    }

    const onUpdateEvent = (event: SchedulerEvent) => {
        console.log(event);
        eventsStore.send({ type: 'update', event });
    }

    return <SchedulerUI
        events={storeEvents}
        onAddEvent={onAddEvent}
        onRemoveEvent={onRemoveEvent}
        onUpdateEvent={onUpdateEvent}
    />;
}
