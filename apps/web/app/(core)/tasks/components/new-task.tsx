import { Suspense } from "react";

import { NewTaskForm } from "./new-task-form";
import { SpaceUsers } from "./space-users";

export default function NewTask() {
  return (
    <NewTaskForm>
      <Suspense fallback={<div>Загрузка пользователей...</div>}>
        <SpaceUsers />
      </Suspense>
    </NewTaskForm>
  );
}
