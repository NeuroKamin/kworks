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
import { SpacePermission } from "@workspace/database/models/permissions";

import { getSpacePermissions } from "./permissions";

interface SidebarSubItem {
  title: string;
  url: string;
  icon: React.ElementType;
  trailingIcon?: React.ElementType;
  trailingUrl?: string;
  tooltip?: string;
}
export interface SidebarItem {
  id: string;
  title?: string;
  items: SidebarSubItem[];
}

export async function getSidebarItems() {
  const permissions = await getSpacePermissions();

  const canCreateProjects = permissions.includes(
    SpacePermission.MANAGE_PROJECTS,
  );

  const SpaceMenu: SidebarItem = {
    id: "3",
    title: "Пространство",
    items: [],
  };

  if (permissions.includes(SpacePermission.MANAGE_MEMBERS)) {
    SpaceMenu.items.push({
      title: "Пользователи",
      url: "/space/users",
      icon: IconUserFilled,
      tooltip: "Пользователи пространства",
    });
  }

  if (permissions.includes(SpacePermission.MANAGE_ROLES)) {
    SpaceMenu.items.push({
      title: "Роли",
      url: "/space/roles",
      icon: IconLockFilled,
      tooltip: "Роли пространства",
    });
  }

  if (permissions.includes(SpacePermission.MANAGE_SETTINGS)) {
    SpaceMenu.items.push({
      title: "Настройки",
      url: "/space/settings",
      icon: IconSettingsFilled,
      tooltip: "Настройки пространства",
    });
  }

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
          ...(canCreateProjects && {
            trailingIcon: IconPlus,
            trailingUrl: "/projects/new",
          }),
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
  ];

  if (SpaceMenu.items.length > 0) {
    items.push(SpaceMenu);
  }

  return items;
}
