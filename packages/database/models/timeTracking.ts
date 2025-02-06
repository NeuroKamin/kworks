import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { tasks } from './tasks';
import { spaces } from './spaces';

// Таблица для учета времени
export const timeTracking = pgTable('time_tracking', {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }), // Пользователь, который учитывает время
    taskId: text('task_id')
        .notNull()
        .references(() => tasks.id, { onDelete: 'cascade' }), // Задача, на которую учитывается время
    spaceId: text('space_id')
        .notNull()
        .references(() => spaces.id, { onDelete: 'cascade' }), // Организация, в которой ведется учет времени
    startTime: timestamp('start_time').notNull(), // Время начала работы
    endTime: timestamp('end_time'), // Время окончания работы (может быть null, если работа еще не завершена)
    status: text('status').default('in_progress'), // Статус задачи (например, "in_progress", "completed")
});

