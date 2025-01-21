import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { relations } from 'drizzle-orm';

// Таблица приглашений
export const invitations = pgTable('invitations', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organizations.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('pending'), // Статус приглашения (например, "pending", "accepted", "expired")
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // Срок действия приглашения
});

