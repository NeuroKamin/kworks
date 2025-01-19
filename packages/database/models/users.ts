import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    uuid,
  } from "drizzle-orm/pg-core"
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { projects } from './projects';
import { roles } from './roles';
import { projectRoles } from './roles';


export const users = pgTable("user", {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  })
   
  export const accounts = pgTable(
    "account",
    {
      userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").notNull(),
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
    sessionToken: uuid("sessionToken").defaultRandom().primaryKey(),
    userId: uuid("userId")
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
      userId: uuid("userId")
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
export const usersToOrganizations = pgTable(
    'users_to_organizations',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        roleId: uuid('role_id')
            .notNull()
            .references(() => roles.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => ({
        compoundKey: primaryKey({
            columns: [table.userId, table.organizationId],
        }),
    }),
);

// Таблица для связи пользователей и проектов
export const usersToProjects = pgTable(
    'users_to_projects',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        projectId: uuid('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        roleId: uuid('role_id')
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

// Отношения для пользователей
export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    organizations: many(usersToOrganizations),
    projects: many(usersToProjects),
}));

// Отношения для аккаунтов
export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

// Отношения для сессий
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

// Отношения для usersToOrganizations
export const usersToOrganizationsRelations = relations(usersToOrganizations, ({ one }) => ({
    user: one(users, {
        fields: [usersToOrganizations.userId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [usersToOrganizations.organizationId],
        references: [organizations.id],
    }),
    role: one(roles, {
        fields: [usersToOrganizations.roleId],
        references: [roles.id],
    }),
}));

// Отношения для usersToProjects
export const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
    user: one(users, {
        fields: [usersToProjects.userId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [usersToProjects.projectId],
        references: [projects.id],
    }),
    role: one(projectRoles, {
        fields: [usersToProjects.roleId],
        references: [projectRoles.id],
    }),
}));