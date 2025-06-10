import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@workspace/database";
import {
  sessions,
  users,
  verificationTokens,
  authenticators,
} from "@workspace/database/models/users";
import { accounts } from "@workspace/database/models/users";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { createSpace } from "./actions/spaces";

const credentialsSchema = z.object({
  email: z.string().email("Неверный формат email"),
  pin: z
    .string()
    .length(6, "PIN-код должен состоять из 6 цифр")
    .regex(/^\d+$/, "PIN-код должен содержать только цифры"),
  name: z.string().optional(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        pin: { label: "PIN", type: "text" },
        name: { label: "Имя", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.pin) {
          return null;
        }

        try {
          const validatedData = credentialsSchema.parse({
            email: credentials.email,
            pin: credentials.pin,
            name: credentials.name,
          });

          // Сначала проверяем код верификации
          const verificationToken = await db.query.verificationTokens.findFirst(
            {
              where: and(
                eq(verificationTokens.identifier, validatedData.email),
                eq(verificationTokens.token, validatedData.pin),
              ),
            },
          );

          if (!verificationToken) {
            return null;
          }

          // Проверяем, не истек ли срок действия кода
          if (verificationToken.expires < new Date()) {
            // Удаляем просроченный токен
            await db
              .delete(verificationTokens)
              .where(
                and(
                  eq(verificationTokens.identifier, validatedData.email),
                  eq(verificationTokens.token, validatedData.pin),
                ),
              );
            return null;
          }

          // Удаляем использованный токен
          await db
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, validatedData.email),
                eq(verificationTokens.token, validatedData.pin),
              ),
            );

          // Проверяем существование пользователя
          let user = await db.query.users.findFirst({
            where: eq(users.email, validatedData.email),
          });

          // Если пользователя нет, создаем его
          if (!user) {
            // Создаем пользователя
            const [newUser] = await db
              .insert(users)
              .values({
                email: validatedData.email,
                emailVerified: new Date(),
                name: validatedData.name,
              })
              .returning();

            // Создаем организацию и связываем с пользователем
            const { space } = await createSpace({
              name: "Мое пространство",
              description: "Владелец " + validatedData.name,
              userId: newUser.id,
              setAsCurrent: true,
            });

            user = {
              ...newUser,
              selectedSpaceId: space.id,
            };
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: unknown) {
          if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
          } else {
            console.error("Unexpected error during validation:", error);
          }
          return null;
        }
      },
    }),
  ],
});
