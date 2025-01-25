"use server";

import { db } from "@workspace/database";
import { verificationTokens } from "@workspace/database/schema";
import { sendVerificationEmail } from "@workspace/mailer";
import { and, eq } from "drizzle-orm";

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
};

/**
 * Проверяет правильность PIN-кода для указанного email.
 * При успешной проверке удаляет использованный токен.
 * @param email - Email адрес для проверки
 * @param pin - PIN-код для проверки
 * @returns {Promise<boolean>} - true если PIN верный, false если нет
 */
export const verifyPin = async (email: string, pin: string) => {
  const token = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, pin),
    ),
  });

  if (token) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));
  }

  return token !== null;
};
