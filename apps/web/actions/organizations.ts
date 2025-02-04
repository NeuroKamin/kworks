"use server";

import { db } from "@workspace/database";
import { organizations } from "@workspace/database/models/organizations";
import { roles } from "@workspace/database/models/roles";
import { usersToOrganizations, users } from "@workspace/database/models/users";
import { eq } from "drizzle-orm";
import { TOrganization } from "@workspace/database/types";
import { OrganizationPermission } from "@workspace/database/models/permissions";

import { auth } from "@/auth";

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

  // Создаем роль владельца со всеми разрешениями
  const [ownerRole] = await db
    .insert(roles)
    .values({
      name: "Владелец",
      organizationId: organization.id,
      permissions: Object.values(OrganizationPermission),
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
export async function getUserOrganizations(
  userId: string,
): Promise<TOrganization[]> {
  const userWithOrgs = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      organizations: {
        with: {
          organization: true,
        },
      },
    },
  });

  return userWithOrgs?.organizations.map((org) => org.organization) || [];
}

/**
 * Получает выбранную организацию пользователя
 */
export async function getSelectedOrganization(): Promise<TOrganization> {
  const session = await auth();

  const user = await db.query.users.findFirst({
    where: eq(users.id, session!.user!.id!),
    with: {
      selectedOrganization: true,
    },
  });

  return user!.selectedOrganization!;
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

/**
 * Обновляет данные организации
 * @param data Обновляемые поля организации
 */
export async function updateCurrentOrganization(data: Partial<TOrganization>) {
  const organization = await getSelectedOrganization();

  if (!organization) {
    return;
  }

  const [updatedOrganization] = await db
    .update(organizations)
    .set(data)
    .where(eq(organizations.id, organization.id))
    .returning();

  return updatedOrganization;
}
