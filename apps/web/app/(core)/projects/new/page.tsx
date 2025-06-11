// web\app\(core)\projects\new\page.tsx
"use client";

import { CreateProjectForm } from "@/app/(core)/projects/components/create-project-page";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push("/projects");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="container max-w-2xl mx-auto py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Назад
                </Button>
                <h1 className="text-3xl font-bold">Создать новый проект</h1>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <CreateProjectForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
}