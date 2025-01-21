import { relations } from 'drizzle-orm';
import { 
  users, 
  accounts, 
  sessions,
  usersToOrganizations,
  usersToProjects 
} from './users';
import { organizations } from './organizations';
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
export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(usersToOrganizations),
  projects: many(usersToProjects),
  assignedTasks: many(tasks),
  timeTracking: many(timeTracking)
}));

// Отношения для организаций
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(usersToOrganizations),
  projects: many(projects),
  roles: many(roles)
}));

// Отношения для проектов
export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id]
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
  organization: one(organizations, {
    fields: [roles.organizationId],
    references: [organizations.id]
  }),
  users: many(usersToOrganizations),
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
  })
}));

// Отношения для пользователей в организациях
export const usersToOrganizationsRelations = relations(usersToOrganizations, ({ one }) => ({
  user: one(users, {
    fields: [usersToOrganizations.userId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [usersToOrganizations.organizationId],
    references: [organizations.id]
  }),
  role: one(roles, {
    fields: [usersToOrganizations.roleId],
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
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id]
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