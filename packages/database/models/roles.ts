import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { projects } from './projects';
import { usersToOrganizations } from './users';
import { usersToProjects } from './users';

export const roles = pgTable('roles', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    organizationId: uuid('organization_id')
        .notNull()
        .references(() => organizations.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectRoles = pgTable('project_roles', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Отношения для ролей
export const rolesRelations = relations(roles, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [roles.organizationId],
        references: [organizations.id],
    }),
    users: many(usersToOrganizations),
}));

// Отношения для ролей в проектах
export const projectRolesRelations = relations(projectRoles, ({ one, many }) => ({
    project: one(projects, {
        fields: [projectRoles.projectId],
        references: [projects.id],
    }),
    users: many(usersToProjects),
}));