"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { colors, hoverColors } from "@workspace/ui/colors";

import { useScheduler } from "./SchedulerContext";
import { gridSize, minutesPerGrid } from "./constants";

export type SchedulerEvent = {
  id: string;
  title: string;
  project: string;
  start: Date;
  end: Date;
  color: string;
};

const EventCard = ({
  event,
  onUpdate,
  onAdd,
  autoResize,
  creatingY,
}: {
  event: SchedulerEvent;
  onUpdate?: (event: SchedulerEvent) => void;
  onAdd?: (event: SchedulerEvent) => void;
  autoResize?: boolean;
  creatingY?: number;
}) => {
  const { hoursFrom, columnWidth } = useScheduler();

  const [isResizing, setIsResizing] = useState(false);
  const [resizingDirection, setResizingDirection] = useState<
    "top" | "bottom" | null
  >(null);
  const [initialY, setInitialY] = useState(0);
  const [initialTop, setInitialTop] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const bottomResizeRef = useRef<HTMLDivElement>(null);

  const [eventState, setEventState] = useState(event);

  const [top, setTop] = useState(
    (event.start.getHours() - hoursFrom) * 2 * gridSize +
      (event.start.getMinutes() / 30) * gridSize,
  );
  const [height, setHeight] = useState(
    (event.end.getHours() - event.start.getHours()) * 2 * gridSize +
      ((event.end.getMinutes() - event.start.getMinutes()) / 30) * gridSize,
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialPosition, setInitialPosition] = useState({ top: 0, left: 0 });

  const calculateInitialLeft = () => {
    const dayOfWeek = event.start.getDay();
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return adjustedDayOfWeek * columnWidth;
  };

  const [left, setLeft] = useState(calculateInitialLeft());

  useEffect(() => {
    setLeft(calculateInitialLeft());
  }, [columnWidth]);

  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: "top" | "bottom",
  ) => {
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

    if (resizingDirection === "top") {
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
      const newHeight =
        Math.round((initialHeight + diff) / gridSize) * gridSize;
      if (newHeight >= gridSize) {
        setHeight(newHeight);

        // Обновляем время окончания
        const minutesDiff =
          ((newHeight - initialHeight) / gridSize) * minutesPerGrid;
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
      left: left,
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    const diffY = e.clientY - dragStartY;
    const diffX = e.clientX - dragStartX;

    const newTop =
      Math.round((initialPosition.top + diffY) / gridSize) * gridSize;
    const newLeft =
      Math.round((initialPosition.left + diffX) / columnWidth) * columnWidth;
    const boundedLeft = Math.max(0, Math.min(newLeft, columnWidth * 6));

    setTop(newTop);
    setLeft(boundedLeft);

    // Вычисляем новый день недели
    const newDayOfWeek = Math.floor(boundedLeft / columnWidth);

    // Создаем новую дату начала
    const newStartDate = new Date(event.start);
    const currentDayOfWeek = newStartDate.getDay();
    const adjustedCurrentDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
    const daysDiff = newDayOfWeek - (adjustedCurrentDay - 1);
    newStartDate.setDate(newStartDate.getDate() + daysDiff);

    // Обновляем время в соответствии с новой позицией по вертикали
    const hoursFromTop = newTop / (gridSize * 2);
    const minutesFromTop = ((newTop % (gridSize * 2)) / gridSize) * 30;

    newStartDate.setHours(hoursFrom + Math.floor(hoursFromTop));
    newStartDate.setMinutes(Math.floor(minutesFromTop));

    // Создаем новую дату окончания, сохраняя длительность события
    const newEndDate = new Date(newStartDate);
    newEndDate.setMinutes(newStartDate.getMinutes() + (height / gridSize) * 30);

    setEventState({
      ...eventState,
      start: newStartDate,
      end: newEndDate,
    });
  };

  useEffect(() => {
    if (autoResize) {
      bottomResizeRef.current?.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientY: creatingY,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (isResizing) {
      const handleMouseUp = () => {
        setIsResizing(false);
        setResizingDirection(null);
        if (autoResize) {
          onAdd?.(eventState);
        } else {
          onUpdate?.(eventState);
        }
      };
      const handleMouseMove = (e: MouseEvent) => {
        handleResize({
          clientY: e.clientY,
        } as React.MouseEvent<HTMLDivElement>);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, eventState, onUpdate, autoResize]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDrag(e);
      const handleMouseUp = () => {
        setIsDragging(false);
        onUpdate?.(eventState);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, eventState, onUpdate]);

  const hours =
    Math.round(
      ((eventState.end.getTime() - eventState.start.getTime()) /
        (1000 * 60 * 60)) *
        10,
    ) / 10;
  return (
    <div
      key={event.id}
      className={cn(
        "event-card",
        "text-xs group flex flex-col justify-between absolute top-0 left-0",
        "rounded-sm p-3 select-none transition-colors overflow-hidden",
        "hover:shadow-md z-20 pointer-events-auto",
        colors[event.color as keyof typeof colors],
        hoverColors[event.color as keyof typeof hoverColors],
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        height: `${height}px`,
        width: `${columnWidth - 1}px`,
      }}
      onMouseDown={handleDragStart}
    >
      <div
        className="hidden group-hover:flex absolute top-0 py-1 left-0 w-full items-center justify-center cursor-row-resize"
        onMouseDown={(e) => handleResizeStart(e, "top")}
      >
        <div className="w-16 h-1 bg-white/40 rounded-full" />
      </div>
      <div
        ref={bottomResizeRef}
        className="hidden group-hover:flex absolute bottom-0 py-1 left-0 w-full items-center justify-center cursor-row-resize"
        onMouseDown={(e) => handleResizeStart(e, "bottom")}
      >
        <div className="w-16 h-1 bg-white/40 rounded-full" />
      </div>

      <div className="flex h-full flex-col gap-1 justify-between">
        <div className="flex flex-col gap-1">
          {hours > 1 && (
            <span className="text-xs font-semibold">{event.project}</span>
          )}
          <span className="">{event.title}</span>
        </div>
        <span className="text-xs opacity-75 flex items-center justify-between">
          <div>
            {format(eventState.start, "HH:mm")} -{" "}
            {format(eventState.end, "HH:mm")}
          </div>
          <div className="font-bold">{hours}ч</div>
        </span>
      </div>
    </div>
  );
};

export default EventCard;
