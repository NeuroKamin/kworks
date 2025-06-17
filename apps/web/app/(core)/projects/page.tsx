"use server";

// app/(core)/projects/projects-content.tsx

import { EmptyProjectsState } from "./components/empty-projects-state";
import { FullProjectsState } from "./components/full-projects-state.tsx";

import { getSpaceProjects } from "@/actions/projects";

export default async function ProjectsContent() {
  const projects = await getSpaceProjects();

  if (projects.length === 0) {
    return (
      <div className="container mx-auto py-6 h-full">
        <EmptyProjectsState />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <FullProjectsState />
    </div>
  );
}
