"use client"

import { useState, useEffect } from "react";
import { useScheduler } from "./SchedulerContext.js";
import { format } from 'date-fns';
import { cn } from "@workspace/ui/lib/utils.js";

export type SchedulerEvent = {
    id: string;
    title: string;
    project: string;
    start: Date;
    end: Date;
    color: string;
}

const EventCard = ({ event, onUpdate }: { event: SchedulerEvent, onUpdate: (event: SchedulerEvent) => void }) => {
    const { hoursFrom } = useScheduler();

    const [isResizing, setIsResizing] = useState(false);
    const [resizingDirection, setResizingDirection] = useState<'top' | 'bottom' | null>(null);
    const [initialY, setInitialY] = useState(0);
    const [initialTop, setInitialTop] = useState(0);
    const [initialHeight, setInitialHeight] = useState(0);

    const [eventState, setEventState] = useState(event);

    const [top, setTop] = useState((event.start.getHours() - hoursFrom) * 40 + (event.start.getMinutes() / 30) * 20);
    const [height, setHeight] = useState((event.end.getHours() - event.start.getHours()) * 40 + ((event.end.getMinutes() - event.start.getMinutes()) / 30) * 20);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragStartX, setDragStartX] = useState(0);
    const [initialPosition, setInitialPosition] = useState({ top: 0, left: 0 });

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, direction: 'top' | 'bottom') => {
        setIsResizing(true);
        setResizingDirection(direction);
        setInitialY(e.clientY);
        setInitialTop(top);
        setInitialHeight(height);
        e.stopPropagation();
    };

    const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizing) return;

        const diff = e.clientY - initialY;
        const gridSize = 20; // 20px grid
        const minutesPerGrid = 30; // 30 minutes per 20px

        if (resizingDirection === 'top') {
            const newTop = Math.round((initialTop + diff) / gridSize) * gridSize;
            const newHeight = initialHeight - (newTop - initialTop);
            
            if (newHeight >= gridSize) {
                setTop(newTop);
                setHeight(newHeight);
                
                // Обновляем время начала
                const minutesDiff = ((newTop - initialTop) / gridSize) * minutesPerGrid;
                const newStartTime = new Date(event.start);
                newStartTime.setMinutes(newStartTime.getMinutes() + minutesDiff);
                

                setEventState({
                    ...eventState,
                    start: newStartTime,
                });
            }
        } else {
            const newHeight = Math.round((initialHeight + diff) / gridSize) * gridSize;
            if (newHeight >= gridSize) {
                setHeight(newHeight);
                
                // Обновляем время окончания
                const minutesDiff = ((newHeight - initialHeight) / gridSize) * minutesPerGrid;
                const newEndTime = new Date(event.end);
                newEndTime.setMinutes(newEndTime.getMinutes() + minutesDiff);
                

                setEventState({
                    ...eventState,
                    end: newEndTime,
                });
            }
        }
    };

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStartY(e.clientY);
        setDragStartX(e.clientX);
        setInitialPosition({ 
            top: top,
            left: e.currentTarget.getBoundingClientRect().left 
        });
    };

    const handleDrag = (e: MouseEvent) => {
        if (!isDragging) return;

        const diffY = e.clientY - dragStartY;
        const diffX = e.clientX - dragStartX;
        
        // Привязка к сетке по вертикали (30 минут = 20px)
        const gridSize = 20;
        const newTop = Math.round((initialPosition.top + diffY) / gridSize) * gridSize;
        
        // Обновляем позицию
        setTop(newTop);
        
        // Обновляем время начала события
        const minutesDiff = ((newTop - initialPosition.top) / gridSize) * 30;
        const newStartTime = new Date(event.start);
        newStartTime.setMinutes(newStartTime.getMinutes() + minutesDiff);

        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newStartTime.getMinutes() + ((height) / gridSize) * 30);
        
        setEventState({
            ...eventState,
            start: newStartTime,
            end: newEndTime,
        });
    };

    useEffect(() => {
        if (isResizing) {
            const handleMouseUp = () => {
                setIsResizing(false);
                setResizingDirection(null);
                onUpdate(eventState);
            };
            const handleMouseMove = (e: MouseEvent) => {
                handleResize({ clientY: e.clientY } as React.MouseEvent<HTMLDivElement>);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, eventState, onUpdate]);

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: MouseEvent) => handleDrag(e);
            const handleMouseUp = () => {
                setIsDragging(false);
                onUpdate(eventState);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, eventState, onUpdate]);

    return (
        <div 
            key={event.id} 
            className={cn(
                "text-xs group flex flex-col justify-between absolute top-0 left-0 w-[99%]",
                "rounded-sm p-3 select-none transition-all",
                "hover:shadow-xl",
                `bg-${event.color}-500/50`,
                `hover:bg-${event.color}-500/60`,
                isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{
                top: `${top}px`,
                height: `${height}px`,
            }}
            onMouseDown={handleDragStart}
        >

            <div className="hidden group-hover:flex absolute top-0 py-1 left-0 w-full items-center justify-center cursor-row-resize"
                onMouseDown={(e) => handleResizeStart(e, 'top')}
            >
                <div className="w-16 h-1 bg-white/40 rounded-full" />
            </div>
            <div className="hidden group-hover:flex absolute bottom-0 py-1 left-0 w-full items-center justify-center cursor-row-resize"
                onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            >
                <div className="w-16 h-1 bg-white/40 rounded-full" />
            </div>

            <div className="flex h-full flex-col gap-1 justify-between">
                <div className="flex flex-col gap-0">
                    <span className="font-bold">{event.title}</span>
                    <span className="text-xs opacity-75">{event.project}</span>
                </div>
                <span className="text-xs opacity-75">
                    {format(eventState.start, 'HH:mm')} - {format(eventState.end, 'HH:mm')}
                </span>
            </div>
        </div>
    );
}

export default EventCard;