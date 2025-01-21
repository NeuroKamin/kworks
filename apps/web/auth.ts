import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Nodemailer from "next-auth/providers/nodemailer"
import { db } from "@workspace/database"
import { authConfig } from "./auth.config"
import { sessions, users, verificationTokens } from "@workspace/database/models/users"
import { accounts } from "@workspace/database/models/users"


export const { handlers, signIn, signOut, auth } = NextAuth({

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  ...authConfig,
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
})