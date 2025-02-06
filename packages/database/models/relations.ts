import { relations } from 'drizzle-orm';
import { 
  users, 
  accounts, 
  sessions,
  usersToSpaces,
  usersToProjects 
} from './users';
import { spaces } from './spaces';
import { projects } from './projects';
import { roles, projectRoles } from './roles';
import { tasks } from './tasks';
import { boards, columns } from './boards';
import { timeTracking } from './timeTracking';
import { 
  availableFields, 
  fieldValues, 
  fieldPermissions 
} from './customFields';
import { invitations } from './invitations';

// Отношения для пользователей
export const usersRelations = relations(users, ({ one, many }) => ({
  selectedSpace: one(spaces, {
    fields: [users.selectedSpaceId],
    references: [spaces.id],
  }),
  spaces: many(usersToSpaces),
  projects: many(usersToProjects),
  assignedTasks: many(tasks),
  timeTracking: many(timeTracking)
}));

// Отношения для организаций
export const spacesRelations = relations(spaces, ({ many }) => ({
  users: many(usersToSpaces),
  projects: many(projects),
  roles: many(roles)
}));

// Отношения для проектов
export const projectsRelations = relations(projects, ({ one, many }) => ({
  space: one(spaces, {
    fields: [projects.spaceId],
    references: [spaces.id]
  }),
  users: many(usersToProjects),
  tasks: many(tasks),
  boards: many(boards),
  projectRoles: many(projectRoles)
}));

// Отношения для задач
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
  }),
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id]
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id]
  }),
  timeTracking: many(timeTracking)
}));

// Отношения для досок
export const boardsRelations = relations(boards, ({ one, many }) => ({
  project: one(projects, {
    fields: [boards.projectId],
    references: [projects.id]
  }),
  columns: many(columns)
}));

// Отношения для колонок
export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id]
  }),
  tasks: many(tasks)
}));

// Отношения для ролей
export const rolesRelations = relations(roles, ({ one, many }) => ({
  space: one(spaces, {
    fields: [roles.spaceId],
    references: [spaces.id]
  }),
  users: many(usersToSpaces),
  fieldPermissions: many(fieldPermissions)
}));

// Отношения для проектных ролей
export const projectRolesRelations = relations(projectRoles, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectRoles.projectId],
    references: [projects.id]
  }),
  users: many(usersToProjects)
}));

// Отношения для учета времени
export const timeTrackingRelations = relations(timeTracking, ({ one }) => ({
  user: one(users, {
    fields: [timeTracking.userId],
    references: [users.id]
  }),
  task: one(tasks, {
    fields: [timeTracking.taskId],
    references: [tasks.id]
  }),
  space: one(spaces, {
    fields: [timeTracking.spaceId],
    references: [spaces.id]
  })
}));

// Отношения для пользователей в организациях
export const usersToSpacesRelations = relations(usersToSpaces, ({ one }) => ({
  user: one(users, {
    fields: [usersToSpaces.userId],
    references: [users.id]
  }),
  space: one(spaces, {
    fields: [usersToSpaces.spaceId],
    references: [spaces.id]
  }),
  role: one(roles, {
    fields: [usersToSpaces.roleId],
    references: [roles.id]
  })
}));

// Отношения для пользователей в проектах
export const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
  user: one(users, {
    fields: [usersToProjects.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [usersToProjects.projectId],
    references: [projects.id]
  }),
  role: one(projectRoles, {
    fields: [usersToProjects.roleId],
    references: [projectRoles.id]
  })
}));

// Отношения для приглашений
export const invitationsRelations = relations(invitations, ({ one }) => ({
  space: one(spaces, {
    fields: [invitations.spaceId],
    references: [spaces.id]
  })
}));

// Отношения для доступных полей
export const availableFieldsRelations = relations(availableFields, ({ many }) => ({
    values: many(fieldValues),
    permissions: many(fieldPermissions)
}));

// Отношения для значений полей
export const fieldValuesRelations = relations(fieldValues, ({ one }) => ({
    field: one(availableFields, {
        fields: [fieldValues.fieldId],
        references: [availableFields.id],
    })
}));

// Отношения для разрешений полей
export const fieldPermissionsRelations = relations(fieldPermissions, ({ one }) => ({
    field: one(availableFields, {
        fields: [fieldPermissions.fieldId],
        references: [availableFields.id],
    }),
    role: one(roles, {
        fields: [fieldPermissions.roleId],
        references: [roles.id],
    })
}));