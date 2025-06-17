"use client";

import React, { useActionState, useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";
import { IconPicker } from "@workspace/ui/components/icon-picker";
import * as TablerIcons from "@tabler/icons-react";
import { cn } from "@workspace/ui/lib/utils";

import { createProject } from "@/actions/projects";

function NewProjectForm({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(createProject, {});

  // Состояние для иконки проекта
  const [selectedIcon, setSelectedIcon] = useState("IconFolder");

  // Функция для получения компонента иконки
  const getIconComponent = (iconName: string) => {
    const Icon = (TablerIcons as any)[iconName];
    return Icon || TablerIcons.IconFolder;
  };

  const CurrentIcon = getIconComponent(selectedIcon);

  return (
    <form
      action={formAction}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="flex gap-4">
        <IconPicker
          trigger={
            <button
              type="button"
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <CurrentIcon className="h-8 w-8" />
            </button>
          }
          onPick={(icon) => setSelectedIcon(icon)}
          asChild
        />

        <div className="flex-1 grid gap-2">
          <Label htmlFor="title">Название проекта</Label>
          <Input
            id="title"
            name="title"
            placeholder="Мой новый проект"
            autoFocus
          />
        </div>
      </div>

      {/* Описание проекта */}
      <div className="grid gap-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Описание проекта"
          rows={3}
        />
      </div>

      <input type="hidden" name="icon" value={selectedIcon} />

      {children}

      <SubmitButton className="w-full">Создать проект</SubmitButton>
    </form>
  );
}

export { NewProjectForm };
