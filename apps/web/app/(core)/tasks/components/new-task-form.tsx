"use client";

import { useActionState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";

import { createTask } from "@/actions/tasks";
import { FormErrors } from "@/components/form-errors";

function NewTaskForm({ children }: { children?: React.ReactNode }) {
  const [state, formAction] = useActionState(createTask, {});

  return (
    <form action={formAction}>
      <FormErrors title="Не удалось создать задачу" errors={state.errors} />

      <Input name="title" placeholder="Заголовок" />
      <Textarea name="description" placeholder="Описание" />
      {children}

      <SubmitButton className="w-full">Создать задачу</SubmitButton>
    </form>
  );
}

export { NewTaskForm };
