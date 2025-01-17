"use server"

import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";

export const getEvents = async (startOfWeek: Date, endOfWeek: Date) => {
    
    const events: SchedulerEvent[] = [
        { 
            id: "1", 
            title: "Встреча с клиентом: обсуждение требований", 
            project: "Проект CRM", 
            start: new Date(2025, 0, 13, 8, 30, 0, 0), 
            end: new Date(2025, 0, 13, 12, 0, 0, 0), 
            color: "red" 
        },
        { 
            id: "2", 
            title: "Код-ревью спринта", 
            project: "Проект E-commerce", 
            start: new Date(2025, 0, 14, 9, 0, 0, 0), 
            end: new Date(2025, 0, 14, 14, 0, 0, 0), 
            color: "blue" 
        },
        { 
            id: "3", 
            title: "Планирование спринта", 
            project: "Внутренний проект", 
            start: new Date(2025, 0, 15, 14, 0, 0, 0), 
            end: new Date(2025, 0, 15, 18, 0, 0, 0), 
            color: "green" 
        },
        { 
            id: "4", 
            title: "Дейли-митинг", 
            project: "Команда разработки", 
            start: new Date(2025, 0, 16, 17, 0, 0, 0), 
            end: new Date(2025, 0, 16, 18, 0, 0, 0), 
            color: "yellow" 
        },
        { 
            id: "5", 
            title: "Разработка API интеграции", 
            project: "Проект платформы", 
            start: new Date(2025, 0, 17, 10, 0, 0, 0), 
            end: new Date(2025, 0, 17, 18, 30, 0, 0), 
            color: "purple" 
        },
        {
            id: "6",
            title: "Тестирование новых функций",
            project: "QA отдел",
            start: new Date(2025, 0, 18, 10, 0, 0, 0),
            end: new Date(2025, 0, 18, 18, 30, 0, 0),
            color: "orange"
        },
        {
            id: "7",
            title: "Оптимизация производительности",
            project: "Техническая поддержка",
            start: new Date(2025, 0, 19, 10, 0, 0, 0),
            end: new Date(2025, 0, 19, 18, 30, 0, 0),
            color: "pink"
        },
        {
            id: "8",
            title: "Обучение новых сотрудников",
            project: "HR отдел",
            start: new Date(2025, 0, 20, 10, 0, 0, 0),
            end: new Date(2025, 0, 20, 18, 30, 0, 0),
            color: "red"
        },
        {
            id: "9",
            title: "Презентация проекта заказчику",
            project: "Отдел продаж",
            start: new Date(2025, 0, 21, 10, 0, 0, 0),
            end: new Date(2025, 0, 21, 18, 30, 0, 0),
            color: "blue"
        },
    ];

    return events.filter(event => {
        const eventDate = event.start.getDate();
        const startDate = startOfWeek.getDate();
        const endDate = endOfWeek.getDate();
        return eventDate >= startDate && eventDate <= endDate;
    });
}