"use server";

import { db } from "@workspace/database";
import { organizations } from "@workspace/database/models/organizations";
import { roles } from "@workspace/database/models/roles";
import { usersToOrganizations, users } from "@workspace/database/models/users";
import { and, eq } from "drizzle-orm";
import { TInvitation, TOrganization, TUser } from "@workspace/database/types";
import { OrganizationPermission } from "@workspace/database/models/permissions";
import { invitations } from "@workspace/database/models/invitations";
import { sendInviteUserEmail } from "@workspace/mailer";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

/**
 * Получает список пользователей выбранной организации
 */
export async function getOrganizationUsers(): Promise<TUser[]> {
  const organization = await getSelectedOrganization();

  if (!organization) {
    return [];
  }

  const organizationUsers = await db.query.usersToOrganizations.findMany({
    where: eq(usersToOrganizations.organizationId, organization.id),
    with: {
      user: true,
    },
  });

  return organizationUsers.map((user) => user.user);
}

/**
 * Получает список приглашений в выбранную организацию
 */
export async function getOrganizationInvites(): Promise<TInvitation[]> {
  const organization = await getSelectedOrganization();

  if (!organization) {
    return [];
  }

  const invites = await db.query.invitations.findMany({
    where: eq(invitations.organizationId, organization.id),
  });

  return invites;
}

export async function inviteUsersToOrganization(data: FormData) {
  const organization = await getSelectedOrganization();
  const session = await auth();
  if (!organization) {
    return;
  }

  const emails = data.get("emails")?.toString().split("\n") || [];
  const origin = (await headers()).get("origin");
  for (const _email of emails) {
    const email = _email.trim();
    if (!email) {
      continue;
    }

    const existingInvite = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.email, email),
        eq(invitations.organizationId, organization.id),
      ),
    });

    let token;
    if (existingInvite) {
      token = existingInvite.token;
      await db
        .update(invitations)
        .set({
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          status: "Отправлено",
        })
        .where(eq(invitations.id, existingInvite.id));
    } else {
      token = crypto.randomUUID();
      await db.insert(invitations).values({
        email,
        token,
        organizationId: organization.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "Отправлено",
      });
    }

    await sendInviteUserEmail({
      email,
      inviteLink: `${origin}/invitations/accept/${token}`,
      invitedByUsername: session!.user!.name!,
      invitedByEmail: session!.user!.email!,
      organizationName: organization.name,
    });
  }
  redirect("/organization/users?tab=invites");
}
