const HourCell = ({ day, hour, onDragStart }: {
    day: number,
    hour: number,
    onDragStart: (day: number, hour: number, hourPart: number, e: React.MouseEvent) => void
}) => {
    return <div className="flex flex-col w-full">
        {Array.from({ length: 2 }).map((_, index) => (
            <div
                key={index}
                className="border-b border-border/40 h-7 even:border-border cursor-crosshair"
                data-day={day}
                data-hour={hour}
                data-hour-part={index}
                onMouseDown={(e) => onDragStart(day, hour, index, e)}
            />
        ))}
    </div>;
}

export default HourCell;