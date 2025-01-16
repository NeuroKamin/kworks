"use server"

import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";

export const getEvents = async (startOfWeek: Date, endOfWeek: Date) => {
    
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
            start: new Date(2025, 0, 15, 14, 0, 0, 0), 
            end: new Date(2025, 0, 15, 18, 0, 0, 0), 
            color: "green" 
        },
        { 
            id: "4", 
            title: "Event 4", 
            project: "Project 4", 
            start: new Date(2025, 0, 16, 17, 0, 0, 0), 
            end: new Date(2025, 0, 16, 18, 0, 0, 0), 
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
        {
            id: "6",
            title: "Event 6",
            project: "Project 6",
            start: new Date(2025, 0, 18, 10, 0, 0, 0),
            end: new Date(2025, 0, 18, 18, 30, 0, 0),
            color: "orange"
        },
        {
            id: "7",
            title: "Event 7",
            project: "Project 7",
            start: new Date(2025, 0, 19, 10, 0, 0, 0),
            end: new Date(2025, 0, 19, 18, 30, 0, 0),
            color: "pink"
        },
        {
            id: "8",
            title: "Event 8",
            project: "Project 8",
            start: new Date(2025, 0, 20, 10, 0, 0, 0),
            end: new Date(2025, 0, 20, 18, 30, 0, 0),
            color: "red"
        },
        {
            id: "9",
            title: "Event 9",
            project: "Project 9",
            start: new Date(2025, 0, 21, 10, 0, 0, 0),
            end: new Date(2025, 0, 21, 18, 30, 0, 0),
            color: "blue"
        },
    ];

    return events.filter(event => {
        console.log(event.start, event.end);
        const eventDate = event.start.getDate();
        const startDate = startOfWeek.getDate();
        const endDate = endOfWeek.getDate();
        return eventDate >= startDate && eventDate <= endDate;
    });
}