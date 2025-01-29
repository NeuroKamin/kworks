"use server";

import { db } from "@workspace/database";
import { organizations } from "@workspace/database/models/organizations";
import { roles } from "@workspace/database/models/roles";
import { usersToOrganizations, users } from "@workspace/database/models/users";
import { eq } from "drizzle-orm";

export type CreateOrganizationParams = {
  name: string;
  description?: string;
  userId: string;
  setAsCurrent?: boolean;
};

export type CreateOrganizationResult = {
  organization: typeof organizations.$inferSelect;
  role: typeof roles.$inferSelect;
};

/**
 * Создает новую организацию и роль владельца, а также связывает их с пользователем
 * @param params Параметры для создания организации
 */
export async function createOrganization(
  params: CreateOrganizationParams,
): Promise<CreateOrganizationResult> {
  // Создаем организацию
  const [organization] = await db
    .insert(organizations)
    .values({
      name: params.name,
      description: params.description,
    })
    .returning();

  // Создаем роль владельца
  const [ownerRole] = await db
    .insert(roles)
    .values({
      name: "Владелец",
      organizationId: organization.id,
    })
    .returning();

  // Связываем пользователя с организацией
  await db.insert(usersToOrganizations).values({
    userId: params.userId,
    organizationId: organization.id,
    roleId: ownerRole.id,
  });

  // Если нужно установить как текущую организацию
  if (params.setAsCurrent) {
    await db
      .update(users)
      .set({
        selectedOrganizationId: organization.id,
      })
      .where(eq(users.id, params.userId));
  }

  return {
    organization,
    role: ownerRole,
  };
}

/**
 * Получает все организации пользователя
 */
export async function getUserOrganizations(userId: string) {
  const userWithOrgs = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      organizations: {
        with: {
          organization: true,
          role: true,
        },
      },
    },
  });

  return (
    userWithOrgs?.organizations.map((org) => ({
      id: org.organization.id,
      name: org.organization.name,
      description: org.organization.description,
    })) || []
  );
}

/**
 * Получает выбранную организацию пользователя
 */
export async function getSelectedOrganization(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      selectedOrganization: true,
    },
  });

  return user?.selectedOrganization;
}

/**
 * Обновляет выбранную организацию пользователя
 */
export async function updateSelectedOrganization(
  userId: string,
  organizationId: string,
) {
  await db
    .update(users)
    .set({
      selectedOrganizationId: organizationId,
    })
    .where(eq(users.id, userId));
}
