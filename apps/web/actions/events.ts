"use server"

import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";

export const getEvents = async () => {
    
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

    return events;
}