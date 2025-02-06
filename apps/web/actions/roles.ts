"use server";
import { db } from "@workspace/database";
import { roles, projectRoles } from "@workspace/database/models/roles";
import { eq } from "drizzle-orm";

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
  await db.delete(roles).where(eq(roles.id, roleId));
}

/**
 * Удаляет роль из проекта
 */
export async function deleteProjectRole(roleId: string) {
  await db.delete(projectRoles).where(eq(projectRoles.id, roleId));
}
