import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { projects } from './projects';
import { usersToOrganizations } from './users';
import { usersToProjects } from './users';

export const roles = pgTable('roles', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organizations.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectRoles = pgTable('project_roles', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

