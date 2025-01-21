import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersToOrganizations } from './users';

export const organizations = pgTable('organizations', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
