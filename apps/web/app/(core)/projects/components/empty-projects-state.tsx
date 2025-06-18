"use server";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Plus, FolderOpen } from "lucide-react";

export async function EmptyProjectsState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex aspect-square p-2 items-center justify-center rounded-lg bg-gradient-to-b from-primary to-primary/70 text-primary-foreground">
        <FolderOpen className="size-10" />
      </div>

      <div className="flex flex-col gap-3 items-center">
        <p className="font-extrabold text-xl">У вас пока нет проектов</p>

        <div className="flex flex-col gap-0 items-center text-sm text-muted-foreground">
          <p>Создайте свой первый проект, чтобы начать работу</p>
          <p>с задачами и командой</p>
        </div>

        <Link href="/projects/new" scroll={false}>
          <Button className="cursor-pointer">
            <Plus className="w-4 h-4" />
            <span className="pl-2">Создать&nbsp;проект</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
