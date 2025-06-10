import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { spaces } from './spaces';
import { relations } from 'drizzle-orm';

export const invitationStatusEnum = pgEnum('invitation_status', ['Отправлено', 'Принято', 'Истекло']);

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
    status: invitationStatusEnum('status').notNull().default('Отправлено'), // Статус приглашения (например, "pending", "accepted", "expired")
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // Срок действия приглашения
});

