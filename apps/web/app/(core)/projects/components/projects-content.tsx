// app/(core)/projects/projects-content.tsx
import Link from "next/link";
import { Plus } from "lucide-react";           // иконка по желанию
import WIP from "@/components/wip";
import { getSpaceProjects } from "@/actions/projects";
import { EmptyProjectsState } from "./empty-projects-state";

export async function ProjectsContent() {
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Проекты</h1>
                    <p className="text-muted-foreground">
                        Управляйте своими проектами и отслеживайте прогресс
                    </p>
                </div>

                {/* новая кнопка — открывает /projects/new как модалку */}
                <Link
                    href="/projects/new"
                    scroll={false}          // не сбрасываем позицию прокрутки
                    prefetch={false}        // (опция) можно отключить префетч
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4" />
                    Новый&nbsp;проект
                </Link>
            </div>

            <WIP />
        </div>
    );
}
