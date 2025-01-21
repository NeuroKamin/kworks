import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { usersToProjects } from './users';

export const projects = pgTable('projects', {
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

