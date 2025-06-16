"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useState, useCallback, useEffect } from "react";
import { TUserWithRole } from "@workspace/database/types";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import { cn } from "@workspace/ui/lib/utils";
import { IconPicker } from "@workspace/ui/components/icon-picker";
import * as TablerIcons from "@tabler/icons-react";

import { getMemberRole } from "@/actions/roles";
import { getSpaceUsers, getSelectedSpace } from "@/actions/spaces";
import { createProject, addUserToProject } from "@/actions/projects";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange?.(newOpen);
    },
    [onOpenChange],
  );

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать новый проект</DialogTitle>
          </DialogHeader>
          <CreateProjectForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Создать новый проект</DrawerTitle>
        </DrawerHeader>
        <CreateProjectForm className="px-4" onSuccess={handleClose} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Отмена</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function CreateProjectForm({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  // Объединяем состояния формы в один объект
  const [formData, setFormData] = useState({
    name: "",
    icon: "IconFolder",
    selectedUsers: [] as string[],
  });

  // Объединяем состояния загрузки и ошибок
  const [status, setStatus] = useState({
    isLoading: true,
    isCreating: false,
    error: null as string | null,
  });

  // Данные пространства
  const [spaceData, setSpaceData] = useState({
    users: [] as TUserWithRole[],
    memberRoleId: null as string | null,
  });

  // Функция для получения компонента иконки
  const getIconComponent = (iconName: string) => {
    const Icon = (TablerIcons as any)[iconName];
    return Icon || TablerIcons.IconFolder;
  };

  // Загружаем пользователей и роль участника при открытии
  useEffect(() => {
    const loadData = async () => {
      try {
        const [spaceUsers, selectedSpace] = await Promise.all([
          getSpaceUsers(),
          getSelectedSpace(),
        ]);

        let memberRoleId = null;
        if (selectedSpace) {
          const memberRole = await getMemberRole(selectedSpace.id);
          memberRoleId = memberRole?.id || null;
        }

        setSpaceData({
          users: spaceUsers,
          memberRoleId,
        });

        setStatus((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setStatus((prev) => ({
          ...prev,
          isLoading: false,
          error: "Не удалось загрузить данные",
        }));
      }
    };

    loadData();
  }, []);

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus((prev) => ({
        ...prev,
        error: "Название проекта не может быть пустым",
      }));
      return;
    }

    setStatus((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const project = await createProject(formData.name.trim(), formData.icon);

      if (
        formData.selectedUsers.length > 0 &&
        project?.id &&
        spaceData.memberRoleId
      ) {
        await Promise.all(
          formData.selectedUsers.map((userId) =>
            addUserToProject(userId, project.id, spaceData.memberRoleId!),
          ),
        );
      }

      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
      setStatus((prev) => ({
        ...prev,
        error: "Произошла ошибка при создании проекта. Попробуйте еще раз.",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, isCreating: false }));
    }
  };

  const getUserInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email.slice(0, 2).toUpperCase() : "OO";
  };

  const CurrentIcon = getIconComponent(formData.icon);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      {/* Иконка и название проекта */}
      <div className="flex gap-4">
        <IconPicker
          trigger={
            <button
              type="button"
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 hover:bg-muted/70 transition-colors"
              disabled={status.isCreating}
            >
              <CurrentIcon className="h-8 w-8" />
            </button>
          }
          onPick={(selectedIcon) =>
            setFormData((prev) => ({ ...prev, icon: selectedIcon }))
          }
          asChild
        />

        <div className="flex-1 grid gap-2">
          <Label htmlFor="projectName">Название проекта</Label>
          <Input
            id="projectName"
            placeholder="Мой новый проект"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={status.isCreating}
            autoFocus
          />
        </div>
      </div>

      {/* Выбор участников */}
      <div className="grid gap-3">
        <Label>Участники проекта</Label>
        {status.isLoading ? (
          <div className="border rounded-md p-2">
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : spaceData.users.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Нет доступных пользователей
          </div>
        ) : (
          <ScrollArea className="max-h-48 border rounded-md p-2">
            <div className="space-y-2">
              {spaceData.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox
                    checked={formData.selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                    disabled={status.isCreating}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.name || user.email}
                    </p>
                    {user.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {formData.selectedUsers.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Выбрано участников: {formData.selectedUsers.length}
          </div>
        )}
      </div>

      {status.error && (
        <p className="text-sm text-destructive">{status.error}</p>
      )}

      <Button
        type="submit"
        disabled={
          !formData.name.trim() || status.isCreating || status.isLoading
        }
        className="w-full"
      >
        {status.isCreating ? "Создание..." : "Добавить"}
      </Button>
    </form>
  );
}
