"use server";

import { db } from "@workspace/database";
import { eq, and } from "drizzle-orm";
import {
  usersToSpaces,
  usersToProjects,
} from "@workspace/database/models/users";
import {
  SpacePermission,
  ProjectPermission,
} from "@workspace/database/models/permissions";

import { getSelectedSpace } from "./spaces";

import { auth } from "@/auth";

/**
 * Получает роль пользователя в пространстве
 */
export async function getUserSpaceRole(spaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRole = await db.query.usersToSpaces.findFirst({
    where: and(
      eq(usersToSpaces.userId, session.user.id),
      eq(usersToSpaces.spaceId, spaceId),
    ),
    with: {
      role: true,
    },
  });

  return userRole?.role || null;
}

/**
 * Получает роль пользователя в проекте
 */
export async function getUserProjectRole(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRole = await db.query.usersToProjects.findFirst({
    where: and(
      eq(usersToProjects.userId, session.user.id),
      eq(usersToProjects.projectId, projectId),
    ),
    with: {
      role: true,
    },
  });

  return userRole?.role || null;
}

/**
 * Проверяет наличие разрешения у пользователя в пространстве
 */
export async function hasSpacePermission(
  permission: SpacePermission,
  spaceId?: string | undefined,
): Promise<boolean> {
  if (!spaceId) {
    spaceId = (await getSelectedSpace()).id;
  }

  const role = await getUserSpaceRole(spaceId);
  if (!role) return false;

  return role.permissions.includes(permission);
}

export async function getSpacePermissions(
  spaceId?: string | undefined,
): Promise<SpacePermission[]> {
  if (!spaceId) {
    spaceId = (await getSelectedSpace()).id;
  }

  const role = await getUserSpaceRole(spaceId);
  if (!role) return [];

  return role.permissions;
}

/**
 * Проверяет наличие разрешения у пользователя в проекте
 */
export async function hasProjectPermission(
  projectId: string,
  permission: ProjectPermission,
): Promise<boolean> {
  const role = await getUserProjectRole(projectId);
  if (!role) return false;

  return role.permissions.includes(permission);
}

/**
 * Проверяет наличие всех указанных разрешений у пользователя в пространстве
 */
export async function hasSpacePermissions(
  spaceId: string,
  permissions: SpacePermission[],
): Promise<boolean> {
  const role = await getUserSpaceRole(spaceId);
  if (!role) return false;

  return permissions.every((permission) =>
    role.permissions.includes(permission),
  );
}

/**
 * Проверяет наличие всех указанных разрешений у пользователя в проекте
 */
export async function hasProjectPermissions(
  projectId: string,
  permissions: ProjectPermission[],
): Promise<boolean> {
  const role = await getUserProjectRole(projectId);
  if (!role) return false;

  return permissions.every((permission) =>
    role.permissions.includes(permission),
  );
}
