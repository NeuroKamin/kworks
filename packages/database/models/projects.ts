import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { spaces } from './spaces';
import { usersToProjects } from './users';

export const projects = pgTable('projects', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    spaceId: text('space_id')
        .notNull()
        .references(() => spaces.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),  
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

