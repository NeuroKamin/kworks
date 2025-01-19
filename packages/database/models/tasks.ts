import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { columns } from './boards';
import { users } from './users';

// Таблица задач
export const tasks = pgTable('tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    columnId: uuid('column_id')
        .notNull()
        .references(() => columns.id, { onDelete: 'cascade' }),
    assigneeId: uuid('assignee_id').references(() => users.id), // Назначенный пользователь
    priority: text('priority').notNull().default('medium'), // Приоритет задачи
    dueDate: timestamp('due_date'), // Срок выполнения задачи
    order: integer('order').notNull(), // Порядок задачи в колонке
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Отношения для задач
export const tasksRelations = relations(tasks, ({ one }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    column: one(columns, {
        fields: [tasks.columnId],
        references: [columns.id],
    }),
    assignee: one(users, {
        fields: [tasks.assigneeId],
        references: [users.id],
    }),
}));