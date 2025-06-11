// app\(core)\projects\@modal\(.)new\page.tsx
"use client";

import { CreateProjectModal } from "@/app/(core)/projects/components/create-project-page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InterceptedNewProjectPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            router.back();
        }
    };

    // Убедимся, что модальное окно открывается при монтировании
    useEffect(() => {
        setIsOpen(true);
    }, []);

    return (
        <CreateProjectModal
            open={isOpen}
            onOpenChange={handleOpenChange}
        />
    );
}