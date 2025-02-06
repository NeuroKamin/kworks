import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"

import type { AdapterAccountType } from "next-auth/adapters"
import { spaces } from "./spaces"
import { projectRoles, roles } from "./roles"
import { projects } from "./projects"
  
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  selectedSpaceId: text("selected_space_id").references(() => spaces.id, { onDelete: "set null" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

// Таблица для связи пользователей и организаций
export const usersToSpaces = pgTable(
  'users_to_spaces',
  {
      userId: text('user_id')
          .notNull()
          .references(() => users.id, { onDelete: 'cascade' }),
      spaceId: text('space_id')
          .notNull()
          .references(() => spaces.id, { onDelete: 'cascade' }),
      roleId: text('role_id')
          .notNull()
          .references(() => roles.id, { onDelete: 'cascade' }),
      createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
      compoundKey: primaryKey({
          columns: [table.userId, table.spaceId],
      }),
  }),
);

// Таблица для связи пользователей и проектов
export const usersToProjects = pgTable(
  'users_to_projects',
  {
      userId: text('user_id')
          .notNull()
          .references(() => users.id, { onDelete: 'cascade' }),
      projectId: text('project_id')
          .notNull()
          .references(() => projects.id, { onDelete: 'cascade' }),
      roleId: text('role_id')
          .notNull()
          .references(() => projectRoles.id, { onDelete: 'cascade' }),
      createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
      compoundKey: primaryKey({
          columns: [table.userId, table.projectId],
      }),
  }),
);