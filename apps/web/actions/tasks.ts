"use server";

import { z } from "zod";

import { FormResult } from "@/lib/types";
import { formError, okResult } from "@/lib/utils";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Заголовок задачи не может быть пустым" }),
  description: z.string().optional(),
});

/**
 * Создает новую задачу в выбранном пространстве
 * @param initialState Начальное состояние формы
 * @param formData Данные формы с полями title и description
 * @returns Результат операции с данными созданной задачи или ошибкой
 */
export const createTask = async (
  initialState: FormResult,
  formData: FormData,
): Promise<FormResult> => {
  const title = formData.get("title");
  const description = formData.get("description");

  const validatedFields = createTaskSchema.safeParse({
    title,
    description,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.issues);
    return formError(validatedFields.error.issues);
  }

  // TODO: create task

  return okResult();
};
