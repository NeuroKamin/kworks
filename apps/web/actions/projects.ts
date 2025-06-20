"use server";

import { z } from "zod";
import { db } from "@workspace/database";
import { projects } from "@workspace/database/models/projects";
import { usersToProjects } from "@workspace/database/models/users";
import { and, eq } from "drizzle-orm";
import { TProject } from "@workspace/database/types";

import { getSelectedSpace } from "./spaces";

import { FormResult } from "@/lib/types";
import { formError, okResult } from "@/lib/utils";
import { auth } from "@/auth";

const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Название проекта не может быть пустым" }),
  description: z.string().optional(),
  icon: z.string().optional(),
});

/**
 * Эта функция создает новый проект в базе данных.
 */
export const createProject = async (
  initialState: FormResult,
  formData: FormData,
): Promise<FormResult> => {
  const title = formData.get("title");
  const description = formData.get("description");
  const icon = formData.get("icon");

  const validatedFields = createProjectSchema.safeParse({
    title,
    description,
    icon,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.issues);
    return formError(validatedFields.error.issues);
  }

  try {
    // Получаем текущее выбранное пространство
    const selectedSpace = await getSelectedSpace();

    if (!selectedSpace) {
      return formError([
        {
          code: "custom",
          message: "Пространство не выбрано",
          path: ["space"],
        },
      ]);
    }

    // Создаем проект
    const [project] = await db
      .insert(projects)
      .values({
        name: validatedFields.data.title,
        description: validatedFields.data.description,
        icon: validatedFields.data.icon || "IconFolder",
        spaceId: selectedSpace.id,
      })
      .returning();

    return okResult(project);
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    return formError([
      {
        code: "custom",
        message: "Произошла ошибка при создании проекта",
        path: ["root"],
      },
    ]);
  }
};

/**
 * Эта функция получает все проекты, которые принадлежат текущему выбранному пространству.
 */
export async function getSpaceProjects(
  includeRelations: boolean = false,
): Promise<TProject[]> {
  const space = await getSelectedSpace();

  if (!space) {
    return [];
  }

  if (includeRelations) {
    // Загружаем проекты со всеми связанными данными
    return db.query.projects.findMany({
      where: eq(projects.spaceId, space.id),
      with: {
        space: true, // Информация о пространстве
        users: {
          // Пользователи проекта
          with: {
            user: true, // Данные пользователя
            role: true, // Роль пользователя
          },
        },
        tasks: true, // Задачи проекта
        boards: true, // Доски проекта
        projectRoles: true, // Роли в проекте
      },
    });
  }

  return db.query.projects.findMany({
    where: eq(projects.spaceId, space.id),
  });
}

/**
 * Эта функция находит и возвращает проект по его уникальному идентификатору.
 */
export async function getProjectById(
  projectId: string,
  includeRelations: boolean = false,
): Promise<TProject | null> {
  if (includeRelations) {
    // Загружаем проект со всеми связанными данными
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        space: true,
        users: {
          with: {
            user: true,
            role: true,
          },
        },
        tasks: true,
        boards: true,
        projectRoles: true,
      },
    });
    return project || null;
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  return project || null;
}

/**
 * Получает проект с участниками (пользователями)
 */
export async function getProjectWithUsers(projectId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      users: {
        with: {
          user: true, // Данные пользователя (имя, email и т.д.)
          role: true, // Роль пользователя в проекте
        },
      },
    },
  });
}

/**
 * Получает проект с задачами
 */
export async function getProjectWithTasks(projectId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      tasks: true, // Все задачи проекта
    },
  });
}

/**
 * Получает проект с досками
 */
export async function getProjectWithBoards(projectId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      boards: true, // Все доски проекта
    },
  });
}

/**
 * Получает полную информацию о проекте со всеми связанными данными
 */
export async function getFullProjectInfo(projectId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      space: true, // Пространство
      users: {
        // Участники
        with: {
          user: true, // Данные пользователя
          role: true, // Роль
        },
      },
      tasks: {
        // Задачи
      },
      boards: {
        // Доски
      },
      projectRoles: true, // Все роли проекта
    },
  });
}

/**
 * Эта функция обновляет информацию о существующем проекте.
 */
export async function updateProject(
  projectId: string,
  data: Partial<Omit<TProject, "updatedAt" | "id" | "createdAt">>,
): Promise<TProject | null> {
  const existingProject = await getProjectById(projectId);

  if (!existingProject) {
    return null;
  }

  const [updatedProject] = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))
    .returning();

  return updatedProject;
}

/**
 * Эта функция удаляет проект из базы данных.
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  const existingProject = await getProjectById(projectId);

  if (!existingProject) {
    return false;
  }

  await db.delete(projects).where(eq(projects.id, projectId));

  return true;
}

/**
 * Эта функция получает все проекты, к которым пользователь имеет доступ.
 */
export async function getUserProjects(
  includeProjectDetails: boolean = false,
): Promise<unknown[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  if (includeProjectDetails) {
    // Загружаем с подробной информацией о проектах
    return db.query.usersToProjects.findMany({
      where: eq(usersToProjects.userId, session.user.id),
      with: {
        project: {
          with: {
            space: true, // Пространство проекта
            tasks: true, // Задачи проекта
            boards: true, // Доски проекта
          },
        },
        role: true, // Роль пользователя в проекте
      },
    });
  }

  return db.query.usersToProjects.findMany({
    where: eq(usersToProjects.userId, session.user.id),
    with: {
      project: true,
      role: true,
    },
  });
}

/**
 * Получает количество участников проекта
 */
export async function getProjectMembersCount(
  projectId: string,
): Promise<number> {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      users: true,
    },
  });

  return project?.users?.length || 0;
}

/**
 * Получает статистику проекта
 */
export async function getProjectStats(projectId: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      users: true,
      tasks: true,
      boards: true,
    },
  });

  if (!project) {
    return null;
  }

  return {
    membersCount: project.users?.length || 0,
    tasksCount: project.tasks?.length || 0,
    boardsCount: project.boards?.length || 0,
    projectName: project.name,
    projectIcon: project.icon,
  };
}

/**
 * Эта функция добавляет пользователя к проекту (создает связь между ними).
 */
export async function addUserToProject(
  userId: string,
  projectId: string,
  roleId: string,
): Promise<boolean> {
  try {
    const existingConnection = await db.query.usersToProjects.findFirst({
      where: and(
        eq(usersToProjects.userId, userId),
        eq(usersToProjects.projectId, projectId),
      ),
    });

    if (existingConnection) {
      return true;
    }

    await db.insert(usersToProjects).values({
      userId: userId,
      projectId: projectId,
      roleId: roleId,
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Эта функция удаляет связь между пользователем и проектом.
 */
export async function removeUserFromProject(
  userId: string,
  projectId: string,
): Promise<boolean> {
  try {
    await db
      .delete(usersToProjects)
      .where(
        and(
          eq(usersToProjects.userId, userId),
          eq(usersToProjects.projectId, projectId),
        ),
      );

    return true;
  } catch {
    return false;
  }
}
