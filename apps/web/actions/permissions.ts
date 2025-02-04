"use server";

import { db } from "@workspace/database";
import { eq, and } from "drizzle-orm";
import {
  usersToOrganizations,
  usersToProjects,
} from "@workspace/database/models/users";
import {
  OrganizationPermission,
  ProjectPermission,
} from "@workspace/database/models/permissions";

import { getSelectedOrganization } from "./organizations";

import { auth } from "@/auth";

/**
 * Получает роль пользователя в организации
 */
export async function getUserOrganizationRole(organizationId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRole = await db.query.usersToOrganizations.findFirst({
    where: and(
      eq(usersToOrganizations.userId, session.user.id),
      eq(usersToOrganizations.organizationId, organizationId),
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
 * Проверяет наличие разрешения у пользователя в организации
 */
export async function hasOrganizationPermission(
  permission: OrganizationPermission,
  organizationId?: string | undefined,
): Promise<boolean> {
  if (!organizationId) {
    organizationId = (await getSelectedOrganization()).id;
  }

  const role = await getUserOrganizationRole(organizationId);
  if (!role) return false;

  return role.permissions.includes(permission);
}

export async function getOrganizationPermissions(
  organizationId?: string | undefined,
): Promise<OrganizationPermission[]> {
  if (!organizationId) {
    organizationId = (await getSelectedOrganization()).id;
  }

  const role = await getUserOrganizationRole(organizationId);
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
 * Проверяет наличие всех указанных разрешений у пользователя в организации
 */
export async function hasOrganizationPermissions(
  organizationId: string,
  permissions: OrganizationPermission[],
): Promise<boolean> {
  const role = await getUserOrganizationRole(organizationId);
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
