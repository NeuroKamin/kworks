"use server";

import { db } from "@workspace/database";
import { verificationTokens } from "@workspace/database/schema";
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
};

type SignInOptions = {
  email: string;
  pin: string;
  redirect?: boolean | undefined;
};

export const signIn = async ({
  email,
  pin,
  redirect = false,
}: SignInOptions) => {
  try {
    const result = await nextAuthSignIn("credentials", {
      email,
      pin,
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
