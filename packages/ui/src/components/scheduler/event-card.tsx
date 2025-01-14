"use client"

import { useScheduler } from "./SchedulerContext.js";

export type SchedulerEvent = {
    id: string;
    title: string;
    project: string;
    start: Date;
    end: Date;
    color: string;
}

const EventCard = ({ event }: { event: SchedulerEvent }) => {
    const { hoursFrom } = useScheduler();
    return (
        <div key={event.id} className="text-xs flex flex-col justify-between text-muted-foreground hover:text-foreground absolute top-0 left-0 w-[99%] bg-blue-500/40 rounded-sm p-2 cursor-pointer hover:bg-blue-500/50 transition-colors"
            style={{
                top: `${(event.start.getHours() - hoursFrom) * 40 + (event.start.getMinutes() / 30) * 20}px`,
                height: `${(event.end.getHours() - event.start.getHours()) * 40 + ((event.end.getMinutes() - event.start.getMinutes()) / 30) * 20}px`,
            }}>
        
            <div>
                <div className="text-sm font-bold">
                    {event.title}
                </div>
                <div>
                    {event.project}
                </div>
            </div>
            <div>
                {event.start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}

export default EventCard;