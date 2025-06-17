"use server";

import Link from "next/link";
import * as TablerIcons from "@tabler/icons-react";
import { Calendar } from "lucide-react";

import { getSpaceProjects } from "@/actions/projects";

export async function ProjectsGrid() {
  const projects = await getSpaceProjects();

  // Функция для получения компонента иконки
  const getIconComponent = (iconName: string) => {
    const Icon = (TablerIcons as any)[iconName];
    return Icon || TablerIcons.IconFolder;
  };

  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project) => {
        const IconComponent = getIconComponent(project.icon || "IconFolder");

        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group block p-6 bg-card border rounded-lg hover:shadow-md hover:border-primary/50 transition-all duration-200"
          >
            <div className="flex flex-col gap-3">
              {/* Шапка: иконка + название в одну строку */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-2 bg-accent rounded-lg group-hover:bg-primary/10 transition-colors">
                  <IconComponent className="w-5 h-5 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors flex-1 min-w-0">
                  {project.name}
                </h3>
              </div>

              {/* Бейдж с датой создания */}
              <div className="flex items-center gap-1.5" title="Создан">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Описание (может быть многострочным или отсутствовать) */}
              {project.description && (
                <p className="text-sm text-muted-foreground leading-relaxed break-all">
                  {project.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
