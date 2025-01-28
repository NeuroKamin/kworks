"use server";

import { db } from "@workspace/database";
import { users, verificationTokens } from "@workspace/database/schema";
import { sendVerificationEmail } from "@workspace/mailer";
import { eq } from "drizzle-orm";

import { signIn as nextAuthSignIn } from "@/auth";

/**
 * Генерирует и отправляет 6-значный PIN-код на указанный email.
 * Удаляет предыдущие токены верификации для этого email.
 * PIN действителен в течение 24 часов.
 * @param email - Email адрес получателя
 */
export const sendPin = async (email: string) => {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, email));

  await db.insert(verificationTokens).values({
    identifier: email,
    token: pin,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  await sendVerificationEmail(email, pin);

  return emailExist(email);
};

/**
 * Проверяет существование пользователя с указанным email в базе данных
 * @param email - Email адрес для проверки
 * @returns true если пользователь существует, false в противном случае
 */
export const emailExist = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user.length > 0;
};

/**
 * Тип параметров для функции входа
 */
type SignInOptions = {
  email: string;
  pin: string;
  name?: string | undefined;
  redirect?: boolean | undefined;
};

/**
 * Выполняет вход пользователя с использованием email и PIN-кода
 * @param options - Параметры для входа (email, pin, redirect)
 * @returns Объект с результатом входа: {error?: string, ok: boolean}
 */
export const signIn = async ({
  email,
  pin,
  name,
  redirect = false,
}: SignInOptions) => {
  try {
    const result = await nextAuthSignIn("credentials", {
      email,
      pin,
      name,
      redirect,
    });

    return {
      error: result?.error,
      ok: !result?.error,
    };
  } catch (error) {
    return {
      error: "Произошла ошибка при входе",
      ok: false,
    };
  }
};
