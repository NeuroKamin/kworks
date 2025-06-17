"use client";

import React, { useActionState, useState, useEffect } from "react";
import { Textarea } from "@workspace/ui/components/textarea";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";
import { IconPicker } from "@workspace/ui/components/icon-picker";
import * as TablerIcons from "@tabler/icons-react";
import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";

import { createProject } from "@/actions/projects";

function NewProjectForm({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(createProject, {});
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Состояние для иконки проекта
  const [selectedIcon, setSelectedIcon] = useState("IconFolder");
  const [isTyping, setIsTyping] = useState(false);

  // Обработка успешного создания проекта
  useEffect(() => {
    if (state.data && !state.errors) {
      // Перенаправляем на страницу проектов или назад
      router.push("/projects");
      // Или если хотите на страницу созданного проекта:
      // router.push(`/projects/${state.data.id}`);
    }
  }, [state.data, state.errors, router]);

  // Функция для получения компонента иконки
  const getIconComponent = (iconName: string) => {
    const Icon = (TablerIcons as any)[iconName];
    return Icon || TablerIcons.IconFolder;
  };

  const CurrentIcon = getIconComponent(selectedIcon);

  const titleError = state.errors?.find((error) =>
    error.includes("Название проекта"),
  );
  const hasNameError = !!titleError && !isTyping;

  const handleNameChange = () => {
    setIsTyping(true);
  };

  return (
    <form
      action={formAction}
      className={cn("grid items-start gap-6", className)}
    >
      {!isDesktop && (
        <div className="flex justify-start">
          <IconPicker
            trigger={
              <button
                type="button"
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-accent hover:bg-accent/80 transition-colors"
              >
                <CurrentIcon className="h-10 w-10 text-accent-foreground" />
              </button>
            }
            onPick={(icon) => setSelectedIcon(icon)}
            asChild
          />
        </div>
      )}

      <div className={cn("flex gap-4", !isDesktop && "flex-col gap-2")}>
        {isDesktop && (
          <IconPicker
            trigger={
              <button
                type="button"
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-accent hover:bg-accent/80 transition-colors"
              >
                <CurrentIcon className="h-10 w-10 text-accent-foreground" />
              </button>
            }
            onPick={(icon) => setSelectedIcon(icon)}
            asChild
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex-1 flex items-center gap-2 relative">
            {hasNameError && (
              <AlertCircle className="h-5 w-5 text-destructive absolute left-0 z-10" />
            )}
            <Input
              id="name"
              name="title"
              maxLength={20}
              placeholder="Название проекта"
              onChange={handleNameChange}
              className={cn(
                className,
                "text-3xl! font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none p-0",
                hasNameError && "pl-8 placeholder:text-destructive",
              )}
            />
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Описание проекта"
            rows={1}
            className={cn(
              className,
              "border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none resize-none h-auto min-h-[1.5rem] overflow-y-auto p-0 break-all",
              isDesktop ? "max-h-[7.5rem]" : "max-h-[3rem]",
            )}
          />
        </div>
      </div>

      <input type="hidden" name="icon" value={selectedIcon} />

      <div>
        <h1 className={cn(className, "font-bold pb-1 text-gray-500")}>
          Соучастники:
        </h1>
        {children}
      </div>

      <SubmitButton className="w-full text-lg font-semibold py-3">
        Создать проект
      </SubmitButton>
    </form>
  );
}

export { NewProjectForm };
