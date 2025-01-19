import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { tasks } from './tasks';

// Таблица досок
export const boards = pgTable('boards', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Таблица колонок
export const columns = pgTable('columns', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    boardId: uuid('board_id')
        .notNull()
        .references(() => boards.id, { onDelete: 'cascade' }),
    order: integer('order').notNull(), // Порядок колонки на доске
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Отношения для досок
export const boardsRelations = relations(boards, ({ one, many }) => ({
    project: one(projects, {
        fields: [boards.projectId],
        references: [projects.id],
    }),
    columns: many(columns),
}));

// Отношения для колонок
export const columnsRelations = relations(columns, ({ one, many }) => ({
    board: one(boards, {
        fields: [columns.boardId],
        references: [boards.id],
    }),
    tasks: many(tasks),
}));