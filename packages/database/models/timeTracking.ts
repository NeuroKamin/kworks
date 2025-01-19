import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { tasks } from './tasks';

// Таблица для учета времени
export const timeTracking = pgTable('time_tracking', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }), // Пользователь, который учитывает время
    taskId: uuid('task_id')
        .notNull()
        .references(() => tasks.id, { onDelete: 'cascade' }), // Задача, на которую учитывается время
    startTime: timestamp('start_time').notNull(), // Время начала работы
    endTime: timestamp('end_time'), // Время окончания работы (может быть null, если работа еще не завершена)
    status: text('status').default('in_progress'), // Статус задачи (например, "in_progress", "completed")
});

// Отношения для учета времени
export const timeTrackingRelations = relations(timeTracking, ({ one }) => ({
    user: one(users, {
        fields: [timeTracking.userId],
        references: [users.id],
    }),
    task: one(tasks, {
        fields: [timeTracking.taskId],
        references: [tasks.id],
    }),
}));