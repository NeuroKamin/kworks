
export const SpaseBaseRoles = {
  OWNER: "Владелец",
  MEMBER: "Участник",
  PROJECT_MANAGER: "Руководитель проектов",
};

export enum SpacePermission {
    MANAGE_MEMBERS = 'SPACE_MANAGE_MEMBERS',
    MANAGE_ROLES = 'SPACE_MANAGE_ROLES',
    MANAGE_PROJECTS = 'SPACE_MANAGE_PROJECTS',
    MANAGE_SETTINGS = 'SPACE_MANAGE_SETTINGS'
}

export enum ProjectPermission {
    MANAGE_MEMBERS = 'PROJECT_MANAGE_MEMBERS',
    MANAGE_ROLES = 'PROJECT_MANAGE_ROLES',
    MANAGE_SETTINGS = 'PROJECT_MANAGE_SETTINGS',
    CREATE_TASKS = 'PROJECT_CREATE_TASKS',
    EDIT_TASKS = 'PROJECT_EDIT_TASKS',
    DELETE_TASKS = 'PROJECT_DELETE_TASKS',
    VIEW_TASKS = 'PROJECT_VIEW_TASKS',
    COMMENT_TASKS = 'PROJECT_COMMENT_TASKS',
    MANAGE_LABELS = 'PROJECT_MANAGE_LABELS'
}

export type Permission = SpacePermission | ProjectPermission; 