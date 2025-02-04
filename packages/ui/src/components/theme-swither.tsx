"use client";
import { IconSun, IconMoon, IconDeviceLaptop } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { cn } from "../lib/utils";

import { Button } from "./button";
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const buttons = [
    {
      label: "light",
      icon: <IconSun size={16} strokeWidth={2} aria-hidden="true" />,
      onClick: () => setTheme("light"),
    },
    {
      label: "dark",
      icon: <IconMoon size={16} strokeWidth={2} aria-hidden="true" />,
      onClick: () => setTheme("dark"),
    },
    {
      label: "system",
      icon: <IconDeviceLaptop size={16} strokeWidth={2} aria-hidden="true" />,
      onClick: () => setTheme("system"),
    },
  ];

  return (
    <div className="inline-flex justify-center items-center rounded-lg  w-full">
      {buttons.map((button) => (
        <Button
          key={button.label}
          className={cn(
            "rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 w-full",
            button.label === theme &&
              "bg-sidebar-accent/60 text-sidebar-accent-foreground",
          )}
          variant="ghost"
          size="icon"
          aria-label={button.label}
          onClick={button.onClick}
        >
          {button.icon}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
