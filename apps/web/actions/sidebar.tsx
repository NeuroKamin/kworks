"use server";

import {
  IconCalendarMonthFilled,
  IconFolderFilled,
  IconLayoutKanbanFilled,
  IconLayoutListFilled,
  IconLockFilled,
  IconPlus,
  IconSettingsFilled,
  IconUserFilled,
} from "@tabler/icons-react";

import { auth } from "@/auth";

export interface SidebarItem {
  id: string;
  title?: string;
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
    trailingIcon?: React.ElementType;
    trailingUrl?: string;
  }[];
}

export async function getSidebarItems() {
  const session = await auth();

  const items: SidebarItem[] = [
    {
      id: "1",
      items: [
        {
          title: "Планировщик",
          url: "/",
          icon: IconCalendarMonthFilled,
        },
        {
          title: "Доска",
          url: "/board",
          icon: IconLayoutKanbanFilled,
        },
      ],
    },
    {
      id: "2",
      items: [
        {
          title: "Проекты",
          url: "/projects",
          icon: IconFolderFilled,
          trailingIcon: IconPlus,
          trailingUrl: "/projects/new",
        },
        {
          title: "Задачи",
          url: "/tasks",
          icon: IconLayoutListFilled,
          trailingIcon: IconPlus,
          trailingUrl: "/tasks/new",
        },
      ],
    },
    {
      id: "3",
      title: "Организация",
      items: [
        {
          title: "Пользователи",
          url: "/organization/users",
          icon: IconUserFilled,
        },
        {
          title: "Роли",
          url: "/organization/roles",
          icon: IconLockFilled,
        },
        {
          title: "Настройки",
          url: "/organization/settings",
          icon: IconSettingsFilled,
        },
      ],
    },
  ];

  return items;
}
