"use server";

import { db } from "@workspace/database";
import { invitations } from "@workspace/database/models/invitations";
import {
  users,
  usersToSpaces,
  verificationTokens,
} from "@workspace/database/models/users";
import { eq } from "drizzle-orm";

import { getMemberRole } from "./roles";

import { auth, signOut, signIn } from "@/auth";

/**
 * Принимает приглашение в пространство
 * @param token Токен приглашения
 * @param name Имя пользователя (если пользователь новый)
 */
export async function acceptInvitation(token: string, name?: string) {
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, token),
    with: {
      space: true,
    },
  });

  if (!invitation) {
    throw new Error("Приглашение не найдено");
  }

  if (invitation.status !== "Отправлено") {
    throw new Error("Приглашение уже использовано или отменено");
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error("Срок действия приглашения истек");
  }

  const session = await auth();

  // Если пользователь авторизован, но email отличается
  if (session?.user && session.user.email !== invitation.email) {
    // Выходим из системы
    await signOut();
  }

  let userId = session?.user?.id;
  let needsAuth = false;

  // Если пользователь не авторизован
  if (!userId) {
    // Проверяем существует ли пользователь с таким email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, invitation.email),
    });

    if (existingUser) {
      userId = existingUser.id;
      needsAuth = true;
    } else {
      if (!name) {
        throw new Error("Необходимо указать имя для регистрации");
      }

      // Создаем нового пользователя
      const [newUser] = await db
        .insert(users)
        .values({
          email: invitation.email,
          name: name,
          emailVerified: new Date(),
          selectedSpaceId: invitation.spaceId,
        })
        .returning();

      userId = newUser.id;
      needsAuth = true;
    }
  }

  // Получаем роль участника пространства
  const memberRole = await getMemberRole(invitation.spaceId);

  if (!memberRole) {
    throw new Error("Не удалось найти роль для пространства");
  }

  // Проверяем не состоит ли пользователь уже в пространстве
  const existingMembership = await db.query.usersToSpaces.findFirst({
    where: eq(usersToSpaces.userId, userId),
  });

  await db
    .update(users)
    .set({
      selectedSpaceId: invitation.spaceId,
    })
    .where(eq(users.email, invitation.email));

  if (!existingMembership) {
    // Добавляем пользователя в пространство
    await db.insert(usersToSpaces).values({
      userId: userId,
      spaceId: invitation.spaceId,
      roleId: memberRole.id,
    });

    // Обновляем статус приглашения
    await db
      .update(invitations)
      .set({
        status: "Принято",
      })
      .where(eq(invitations.id, invitation.id));
  }

  // Если нужна авторизация
  if (needsAuth) {
    // Создаем временный токен для автоматического входа
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Сохраняем токен верификации
    await db.insert(verificationTokens).values({
      identifier: invitation.email,
      token: pin,
      expires: new Date(Date.now() + 1000 * 60 * 5), // 5 минут
    });

    // Выполняем вход
    await signIn("credentials", {
      email: invitation.email,
      pin,
      name,
      redirect: false,
    });
  }
}
