import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";
import { createStore } from "@xstate/store";

export const eventsStore = createStore({
  context: {
    events: [] as SchedulerEvent[],
  },
  on: {
    init: (context, event: { events: SchedulerEvent[] }) => ({
      events: event.events,
    }),
    add: (context, event: { event: SchedulerEvent }) => ({
      events: [...context.events, event.event],
    }),
    remove: (context, event: { event: SchedulerEvent }) => ({
      events: context.events.filter((e) => e.id !== event.event.id),
    }),
    update: (context, event: { event: SchedulerEvent }) => ({
      events: context.events.map((e) =>
        e.id === event.event.id ? event.event : e,
      ),
    }),
  },
});
