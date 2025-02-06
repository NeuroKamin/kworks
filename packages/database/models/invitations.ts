import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { spaces } from './spaces';
import { relations } from 'drizzle-orm';

// Таблица приглашений
export const invitations = pgTable('invitations', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    spaceId: text('space_id')
        .notNull()
        .references(() => spaces.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('pending'), // Статус приглашения (например, "pending", "accepted", "expired")
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // Срок действия приглашения
});

