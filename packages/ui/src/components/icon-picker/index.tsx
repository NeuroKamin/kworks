"use client";
import * as Icons from "@tabler/icons-react";
import { useState } from "react";

import { TooltipTrigger } from "../tooltip";
import { TooltipContent } from "../tooltip";
import { Tooltip } from "../tooltip";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { ScrollArea } from "../scroll-area";

import { availableIcons } from "./avalibale-icons";

interface IconPickerProps {
  trigger: React.ReactNode;
  onPick?: (icon: string) => void;
  asChild?: boolean;
}

export const IconPicker = ({ trigger, onPick, asChild }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-md flex flex-col gap-4">
        <Input
          placeholder="Найти иконку"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="h-72 w-full">
          {Object.keys(availableIcons).map((group) => {
            const icons = availableIcons[group as keyof typeof availableIcons];

            const filteredIcons = icons.filter((iconName) =>
              iconName.toLowerCase().includes(search.toLowerCase()),
            );

            if (filteredIcons.length === 0) {
              return null;
            }

            return (
              <div
                key={group}
                className="not-last:border-b border-border border-dashed pb-3 flex flex-col gap-1"
              >
                <div className="text-sm text-muted-foreground">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {filteredIcons.map((iconName, index) => {
                    // @ts-ignore
                    const Icon = Icons[iconName];

                    return (
                      <Tooltip key={iconName}>
                        <TooltipTrigger asChild>
                          <div
                            tabIndex={index}
                            className="flex flex-col items-center gap-2 p-1 rounded-md hover:bg-accent size-7 cursor-pointer"
                            onClick={() => onPick?.(iconName)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && onPick?.(iconName)
                            }
                            role="button"
                          >
                            <Icon />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{iconName}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
