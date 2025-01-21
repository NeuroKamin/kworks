import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { tasks } from './tasks';

// Таблица досок
export const boards = pgTable('boards', {
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

// Таблица колонок
export const columns = pgTable('columns', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    boardId: text('board_id')
        .notNull()
        .references(() => boards.id, { onDelete: 'cascade' }),
    order: integer('order').notNull(), // Порядок колонки на доске
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
