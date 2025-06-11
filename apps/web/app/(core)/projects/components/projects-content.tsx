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
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Проекты</h1>
                <p className="text-muted-foreground">
                    Управляйте своими проектами и отслеживайте прогресс
                </p>
            </div>

            <WIP />
        </div>
    );
}