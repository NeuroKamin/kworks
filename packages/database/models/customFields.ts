import { pgTable, uuid, text, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from './roles';
import { projectRoles } from './roles';

// Таблица доступных полей
export const availableFields = pgTable('available_fields', {
    id: uuid('id').defaultRandom().primaryKey(),
    entityType: text('entity_type').notNull(), // Тип сущности (например, "task", "user_project")
    fieldName: text('field_name').notNull(), // Название поля (например, "Оценка сложности")
    fieldType: text('field_type').notNull(), // Тип поля (например, "string", "number", "boolean", "date")
    isVisible: boolean('is_visible').notNull().default(true), // Видимость поля для всех ролей по умолчанию
    isEditable: boolean('is_editable').notNull().default(true), // Возможность редактирования поля для всех ролей по умолчанию
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Таблица значений полей
export const fieldValues = pgTable('field_values', {
    id: uuid('id').defaultRandom().primaryKey(),
    fieldId: uuid('field_id')
        .notNull()
        .references(() => availableFields.id, { onDelete: 'cascade' }), // Ссылка на доступное поле
    entityId: uuid('entity_id').notNull(), // ID сущности (например, ID задачи или ID пользователя в проекте)
    value: text('value').notNull(), // Значение поля (в виде строки, JSON или другого формата)
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Таблица для управления правами доступа к полям
export const fieldPermissions = pgTable(
    'field_permissions',
    {
        fieldId: uuid('field_id')
            .notNull()
            .references(() => availableFields.id, { onDelete: 'cascade' }), // Ссылка на доступное поле
        roleId: uuid('role_id')
            .notNull()
            .references(() => roles.id, { onDelete: 'cascade' }), // Ссылка на роль
        canView: boolean('can_view').notNull().default(false), // Может ли роль просматривать поле
        canEdit: boolean('can_edit').notNull().default(false), // Может ли роль редактировать поле
        
    },
    (table) => ({
        compoundKey: primaryKey({
            columns: [table.fieldId, table.roleId],
        }),
    }),
);

// Отношения для доступных полей
export const availableFieldsRelations = relations(availableFields, ({ many }) => ({
    values: many(fieldValues),
    permissions: many(fieldPermissions),
}));

// Отношения для значений полей
export const fieldValuesRelations = relations(fieldValues, ({ one }) => ({
    field: one(availableFields, {
        fields: [fieldValues.fieldId],
        references: [availableFields.id],
    }),
}));

// Отношения для прав доступа к полям
export const fieldPermissionsRelations = relations(fieldPermissions, ({ one }) => ({
    field: one(availableFields, {
        fields: [fieldPermissions.fieldId],
        references: [availableFields.id],
    }),
    role: one(roles, {
        fields: [fieldPermissions.roleId],
        references: [roles.id],
    }),
}));