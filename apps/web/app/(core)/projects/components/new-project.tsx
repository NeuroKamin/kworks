import { Suspense } from "react";

import { SpaceUsersSkeleton, SpaceUsers } from "@/components/space-users";
import { NewProjectForm } from "@/app/(core)/projects/components/new-project-form";

export default function NewProject() {
  return (
    <NewProjectForm>
      <Suspense fallback={<SpaceUsersSkeleton />}>
        <SpaceUsers />
      </Suspense>
    </NewProjectForm>
  );
}
