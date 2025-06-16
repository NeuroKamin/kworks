"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CreateProjectForm } from "@/app/(core)/projects/components/create-project-page";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/projects");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* Header with circular back arrow */}
      <div className="flex items-center mb-6">
        <ArrowLeft
          onClick={handleBack}
          className="h-8 w-8 p-1 rounded-full cursor-pointer
                                 border-0 hover:border hover:border-gray-300
                                 transition-colors"
        />
        <h1 className="text-3xl font-bold ml-3">Создать новый проект</h1>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <CreateProjectForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
