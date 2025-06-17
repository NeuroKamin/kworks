"use server";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { ProjectsGrid } from "./projects-grid";
import { ProjectsGridSkeleton } from "./projects-grid-skeleton";

export async function FullProjectsState() {
  return (
    <div className="flex flex-col space-y-6 p-8 pt-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold">Проекты</h1>
          <Link
            href="/projects/new"
            scroll={false}
            prefetch={false}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition"
          >
            <Plus className="w-3 h-3" />
            Новый
          </Link>
        </div>
        <p className="text-muted-foreground">
          Управляйте своими проектами и отслеживайте прогресс
        </p>
      </div>

      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsGrid />
      </Suspense>
    </div>
  );
}
