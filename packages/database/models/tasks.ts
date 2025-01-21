import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { columns } from './boards';
import { users } from './users';

// Таблица задач
export const tasks = pgTable('tasks', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    description: text('description'),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    columnId: text('column_id')
        .notNull()
        .references(() => columns.id, { onDelete: 'cascade' }),
    assigneeId: text('assignee_id').references(() => users.id), // Назначенный пользователь
    priority: text('priority').notNull().default('medium'), // Приоритет задачи
    dueDate: timestamp('due_date'), // Срок выполнения задачи
    order: integer('order').notNull(), // Порядок задачи в колонке
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

