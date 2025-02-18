"use client";

import { DynamicIcon } from "@workspace/ui/components/dynamic-icon";
import { IconPicker } from "@workspace/ui/components/icon-picker";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";

import { useSpace } from "@/store/space";

export const SpaceIcon = ({
  icon: initialIcon,
  pickable = false,
}: {
  icon?: string;
  pickable?: boolean;
}) => {
  const [icon, setIcon] = useState(initialIcon || "IconStack2");
  const { updateSpace } = useSpace();

  useEffect(() => {
    setIcon(initialIcon || "IconStack2");
  }, [initialIcon]);

  const updateIcon = (icon: string) => {
    setIcon(icon);
    updateSpace({ icon });
  };

  const IconElement = (
    <div
      className={cn(
        "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
        pickable && "cursor-pointer",
      )}
    >
      <DynamicIcon icon={icon} />
    </div>
  );

  if (!pickable) {
    return IconElement;
  }

  return (
    <IconPicker trigger={IconElement} onPick={(icon) => updateIcon(icon)} />
  );
};
