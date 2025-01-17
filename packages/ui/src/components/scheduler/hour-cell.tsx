const HourCell = ({ day, hour }: { day: number, hour: number }) => {
    return <div className="flex flex-col w-full">
        {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="border-b border-border/40 h-7 even:border-border"
                data-day={day}
                data-hour={hour}
                data-hour-part={index} />
        ))}
    </div>;
}

export default HourCell;