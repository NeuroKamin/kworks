"use server";

import { SchedulerEvent } from "@workspace/ui/components/scheduler/event-card";

export const getEvents = async (startOfWeek: Date, endOfWeek: Date) => {
  const events: SchedulerEvent[] = [
    {
      id: "1",
      title: "Встреча с клиентом: обсуждение требований",
      project: "Проект CRM",
      start: new Date(2025, 1, 27, 8, 30, 0, 0),
      end: new Date(2025, 1, 27, 12, 0, 0, 0),
      color: "red",
    },
    {
      id: "2",
      title: "Код-ревью спринта",
      project: "Проект E-commerce",
      start: new Date(2025, 0, 28, 9, 0, 0, 0),
      end: new Date(2025, 0, 28, 14, 0, 0, 0),
      color: "blue",
    },
    {
      id: "3",
      title: "Планирование спринта",
      project: "Внутренний проект",
      start: new Date(2025, 0, 28, 14, 0, 0, 0),
      end: new Date(2025, 0, 28, 18, 0, 0, 0),
      color: "green",
    },
    {
      id: "4",
      title: "Дейли-митинг",
      project: "Команда разработки",
      start: new Date(2025, 0, 29, 17, 0, 0, 0),
      end: new Date(2025, 0, 29, 18, 0, 0, 0),
      color: "yellow",
    },
    {
      id: "5",
      title: "Разработка API интеграции",
      project: "Проект платформы",
      start: new Date(2025, 0, 29, 10, 0, 0, 0),
      end: new Date(2025, 0, 29, 18, 30, 0, 0),
      color: "purple",
    },
    {
      id: "6",
      title: "Тестирование новых функций",
      project: "QA отдел",
      start: new Date(2025, 0, 30, 10, 0, 0, 0),
      end: new Date(2025, 0, 30, 18, 30, 0, 0),
      color: "orange",
    },
    {
      id: "7",
      title: "Оптимизация производительности",
      project: "Техническая поддержка",
      start: new Date(2025, 0, 31, 10, 0, 0, 0),
      end: new Date(2025, 0, 31, 18, 30, 0, 0),
      color: "pink",
    },
    {
      id: "9",
      title: "Презентация проекта заказчику",
      project: "Отдел продаж",
      start: new Date(2025, 0, 27, 10, 0, 0, 0),
      end: new Date(2025, 0, 27, 18, 30, 0, 0),
      color: "blue",
    },
  ];

  return events.filter((event) => {
    const eventTime = event.start.getTime();
    const startTime = startOfWeek.getTime();
    const endTime = endOfWeek.getTime();
    return eventTime >= startTime && eventTime <= endTime;
  });
};
