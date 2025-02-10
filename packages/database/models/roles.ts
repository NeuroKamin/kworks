import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { spaces } from './spaces';
import { projects } from './projects';
import { usersToSpaces } from './users';
import { usersToProjects } from './users';
import { SpacePermission, ProjectPermission } from './permissions';

export const roles = pgTable('roles', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    spaceId: text('space_id')
        .notNull()
        .references(() => spaces.id, { onDelete: 'cascade' }),
    permissions: text('permissions').array().$type<SpacePermission[]>().notNull().default([]),
    isBaseRole: boolean("is_base_role").default(false).notNull(),
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
    permissions: text('permissions').array().$type<ProjectPermission[]>().notNull().default([]),
    isBaseRole: boolean("is_base_role").default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

