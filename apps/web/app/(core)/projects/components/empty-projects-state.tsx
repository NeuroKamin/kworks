"use client";

import { Button } from "@workspace/ui/components/button";
import { Plus, FolderOpen } from "lucide-react";
import { useState, useCallback } from "react";
import { CreateProjectModal } from "./create-project-page";

export function EmptyProjectsState() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateProject = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback((open: boolean) => {
        setIsModalOpen(open);
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="flex aspect-square p-2 items-center justify-center rounded-lg bg-gradient-to-b from-primary to-primary/70 text-primary-foreground">
                    <FolderOpen className="size-10" />
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <p className="font-extrabold text-xl">У вас пока нет проектов</p>

                    <div className="flex flex-col gap-0 items-center">
                        <p className="text-sm text-muted-foreground">
                            Создайте свой первый проект, чтобы начать работу
                        </p>
                        <p className="text-sm text-muted-foreground">
                            с задачами и командой
                        </p>
                    </div>

                    <Button onClick={handleCreateProject}>
                        <Plus className="w-4 h-4 mr-2" />
                        Создать проект
                    </Button>
                </div>
            </div>

            <CreateProjectModal
                open={isModalOpen}
                onOpenChange={handleModalClose}
            />
        </>
    );
}