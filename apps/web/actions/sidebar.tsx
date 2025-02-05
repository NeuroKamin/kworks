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
import { OrganizationPermission } from "@workspace/database/models/permissions";

import { getOrganizationPermissions } from "./permissions";

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
  const permissions = await getOrganizationPermissions();

  const canCreateProjects = permissions.includes(
    OrganizationPermission.MANAGE_PROJECTS,
  );

  const OrganizationMenu: SidebarItem = {
    id: "3",
    title: "Организация",
    items: [],
  };

  if (permissions.includes(OrganizationPermission.MANAGE_MEMBERS)) {
    OrganizationMenu.items.push({
      title: "Пользователи",
      url: "/organization/users",
      icon: IconUserFilled,
      tooltip: "Пользователи организации",
    });
  }

  if (permissions.includes(OrganizationPermission.MANAGE_ROLES)) {
    OrganizationMenu.items.push({
      title: "Роли",
      url: "/organization/roles",
      icon: IconLockFilled,
      tooltip: "Роли организации",
    });
  }

  if (permissions.includes(OrganizationPermission.MANAGE_SETTINGS)) {
    OrganizationMenu.items.push({
      title: "Настройки",
      url: "/organization/settings",
      icon: IconSettingsFilled,
      tooltip: "Настройки организации",
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

  if (OrganizationMenu.items.length > 0) {
    items.push(OrganizationMenu);
  }

  return items;
}
