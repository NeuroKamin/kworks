const HourCell = ({ day, hour }: { day: number, hour: number }) => {
    return <div className="flex flex-col w-full">
        {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="border-b border-border/40 h-5 even:border-border hover:bg-blue-500/10 transition-colors"
                data-day={day}
                data-hour={hour}
                data-hour-part={index} />
        ))}
    </div>;
}

export default HourCell;