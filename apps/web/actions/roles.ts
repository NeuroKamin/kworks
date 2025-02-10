"use server";
import { db } from "@workspace/database";
import { roles, projectRoles } from "@workspace/database/models/roles";
import { eq, and, not } from "drizzle-orm";
import {
  SpacePermission,
  SpaseBaseRoles,
} from "@workspace/database/models/permissions";

export type CreateRoleParams = {
  name: string;
  spaceId: string;
};

export type CreateProjectRoleParams = {
  name: string;
  projectId: string;
};

/**
 * Создает новую роль в пространстве
 */
export async function createRole(params: CreateRoleParams) {
  const [role] = await db
    .insert(roles)
    .values({
      name: params.name,
      spaceId: params.spaceId,
      isBaseRole: false,
    })
    .returning();

  return role;
}

/**
 * Создает новую роль в проекте
 */
export async function createProjectRole(params: CreateProjectRoleParams) {
  const [role] = await db
    .insert(projectRoles)
    .values({
      name: params.name,
      projectId: params.projectId,
      isBaseRole: false,
    })
    .returning();

  return role;
}

/**
 * Получает все роли пространства
 */
export async function getSpaceRoles(spaceId: string) {
  return await db.query.roles.findMany({
    where: eq(roles.spaceId, spaceId),
    orderBy: (roles, { desc }) => [desc(roles.createdAt)],
  });
}

/**
 * Получает все пользовательские роли пространства
 */
export async function getCustomSpaceRoles(spaceId: string) {
  return await db.query.roles.findMany({
    where: and(eq(roles.spaceId, spaceId), not(eq(roles.isBaseRole, true))),
    orderBy: (roles, { desc }) => [desc(roles.createdAt)],
  });
}

/**
 * Получает все роли проекта
 */
export async function getProjectRoles(projectId: string) {
  return await db.query.projectRoles.findMany({
    where: eq(projectRoles.projectId, projectId),
    orderBy: (roles, { desc }) => [desc(roles.createdAt)],
  });
}

/**
 * Удаляет роль из пространства
 */
export async function deleteRole(roleId: string) {
  const role = await db.query.roles.findFirst({
    where: eq(roles.id, roleId),
  });

  if (!role || role.isBaseRole) {
    throw new Error("Невозможно удалить базовую роль");
  }

  await db.delete(roles).where(eq(roles.id, roleId));
}

/**
 * Удаляет роль из проекта
 */
export async function deleteProjectRole(roleId: string) {
  const role = await db.query.projectRoles.findFirst({
    where: eq(projectRoles.id, roleId),
  });

  if (!role || role.isBaseRole) {
    throw new Error("Невозможно удалить базовую роль");
  }

  await db.delete(projectRoles).where(eq(projectRoles.id, roleId));
}

/**
 * Создает базовые роли для пространства
 * @param spaceId ID пространства
 * @returns Роль владельца пространства
 */
export async function createBaseSpaceRoles(spaceId: string) {
  // Создаем роль владельца со всеми разрешениями
  const [ownerRole] = await db
    .insert(roles)
    .values({
      name: SpaseBaseRoles.OWNER,
      spaceId: spaceId,
      permissions: Object.values(SpacePermission),
      isBaseRole: true,
    })
    .returning();

  // Создаем роль участника с базовыми правами
  await db.insert(roles).values({
    name: SpaseBaseRoles.MEMBER,
    spaceId: spaceId,
    permissions: [],
    isBaseRole: true,
  });

  // Создаем роль менеджера проектов
  await db.insert(roles).values({
    name: SpaseBaseRoles.PROJECT_MANAGER,
    spaceId: spaceId,
    permissions: [SpacePermission.MANAGE_PROJECTS],
    isBaseRole: true,
  });

  return ownerRole;
}

/**
 * Получает роль участника пространства
 * @param spaceId ID пространства
 * @returns Роль участника или null
 */
export async function getMemberRole(spaceId: string) {
  const memberRole = await db.query.roles.findFirst({
    where: and(
      eq(roles.spaceId, spaceId),
      eq(roles.name, SpaseBaseRoles.MEMBER),
    ),
  });

  return memberRole;
}
