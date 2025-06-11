// web\app\(core)\projects\page.tsx

import {JSX, Suspense} from "react";
import { ProjectsContent } from "./components/projects-content";
import { MinimalProjectsSkeleton } from "./components/minimal-projects-skeleton";

const ProjectsPage = (): JSX.Element => {
  return (
      <Suspense fallback={<MinimalProjectsSkeleton />}>
        <ProjectsContent />
      </Suspense>
  );
};

export default ProjectsPage;