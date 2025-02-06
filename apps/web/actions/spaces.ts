"use server";

import { db } from "@workspace/database";
import { spaces } from "@workspace/database/models/spaces";
import { roles } from "@workspace/database/models/roles";
import { usersToSpaces, users } from "@workspace/database/models/users";
import { and, eq } from "drizzle-orm";
import { TInvitation, TSpace, TUser } from "@workspace/database/types";
import { SpacePermission } from "@workspace/database/models/permissions";
import { invitations } from "@workspace/database/models/invitations";
import { sendInviteUserEmail } from "@workspace/mailer";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type CreateSpaceParams = {
  name: string;
  description?: string;
  userId: string;
  setAsCurrent?: boolean;
};

export type CreateSpaceResult = {
  space: typeof spaces.$inferSelect;
  role: typeof roles.$inferSelect;
};

/**
 * Создает новое пространство и роль владельца, а также связывает их с пользователем
 * @param params Параметры для создания пространства
 */
export async function createSpace(
  params: CreateSpaceParams,
): Promise<CreateSpaceResult> {
  // Создаем пространство
  const [space] = await db
    .insert(spaces)
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
      spaceId: space.id,
      permissions: Object.values(SpacePermission),
    })
    .returning();

  // Связываем пользователя с пространством
  await db.insert(usersToSpaces).values({
    userId: params.userId,
    spaceId: space.id,
    roleId: ownerRole.id,
  });

  // Если нужно установить как текущее пространство
  if (params.setAsCurrent) {
    await db
      .update(users)
      .set({
        selectedSpaceId: space.id,
      })
      .where(eq(users.id, params.userId));
  }

  return {
    space,
    role: ownerRole,
  };
}

/**
 * Получает все пространства пользователя
 */
export async function getUserSpaces(userId: string): Promise<TSpace[]> {
  const userWithOrgs = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      spaces: {
        with: {
          space: true,
        },
      },
    },
  });

  return userWithOrgs?.spaces.map((org) => org.space) || [];
}

/**
 * Получает выбранное пространство пользователя
 */
export async function getSelectedSpace(): Promise<TSpace> {
  const session = await auth();

  const user = await db.query.users.findFirst({
    where: eq(users.id, session!.user!.id!),
    with: {
      selectedSpace: true,
    },
  });

  return user!.selectedSpace!;
}

/**
 * Обновляет выбранное пространство пользователя
 */
export async function updateSelectedSpace(userId: string, spaceId: string) {
  await db
    .update(users)
    .set({
      selectedSpaceId: spaceId,
    })
    .where(eq(users.id, userId));
}

/**
 * Обновляет данные пространства
 * @param data Обновляемые поля пространства
 */
export async function updateCurrentSpace(data: Partial<TSpace>) {
  const space = await getSelectedSpace();

  if (!space) {
    return;
  }

  const [updatedSpace] = await db
    .update(spaces)
    .set(data)
    .where(eq(spaces.id, space.id))
    .returning();

  return updatedSpace;
}

/**
 * Получает список пользователей выбранного пространства
 */
export async function getSpaceUsers(): Promise<TUser[]> {
  const space = await getSelectedSpace();

  if (!space) {
    return [];
  }

  const spaceUsers = await db.query.usersToSpaces.findMany({
    where: eq(usersToSpaces.spaceId, space.id),
    with: {
      user: true,
    },
  });

  return spaceUsers.map((user) => user.user);
}

/**
 * Получает список приглашений в выбранное пространство
 */
export async function getSpaceInvites(): Promise<TInvitation[]> {
  const space = await getSelectedSpace();

  if (!space) {
    return [];
  }

  const invites = await db.query.invitations.findMany({
    where: eq(invitations.spaceId, space.id),
  });

  return invites;
}

export async function inviteUsersToSpace(data: FormData) {
  const space = await getSelectedSpace();
  const session = await auth();
  if (!space) {
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
        eq(invitations.spaceId, space.id),
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
        spaceId: space.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "Отправлено",
      });
    }

    await sendInviteUserEmail({
      email,
      inviteLink: `${origin}/invitations/accept/${token}`,
      invitedByUsername: session!.user!.name!,
      invitedByEmail: session!.user!.email!,
      spaceName: space.name,
    });
  }
  redirect("/space/users?tab=invites");
}
