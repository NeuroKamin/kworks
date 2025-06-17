"use server";

import Link from "next/link";
import { Plus } from "lucide-react";

export async function FullProjectsState() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Проекты</h1>
        <p className="text-muted-foreground">
          Управляйте своими проектами и отслеживайте прогресс
        </p>
      </div>

      <Link
        href="/projects/new"
        scroll={false} // не сбрасываем позицию прокрутки
        prefetch={false} // (опция) можно отключить префетч
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
      >
        <Plus className="w-4 h-4" />
        Новый&nbsp;проект
      </Link>
    </div>
  );
}
