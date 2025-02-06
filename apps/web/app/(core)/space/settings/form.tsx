"use client";

import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useSpace } from "@/store/space";
import { SpaceIcon } from "@/components/space-icon";

const className =
  "leading-none h-auto shadow-none ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-xl! p-0";

const SettingsForm = () => {
  const { currentSpace, updateSpace } = useSpace();

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-2">
        <SpaceIcon />
        <Input
          placeholder="Название пространства"
          value={currentSpace.name}
          className={cn(className, "text-3xl! font-bold")}
          onChange={(e) => updateSpace({ name: e.target.value })}
        />
      </div>
      <Input
        placeholder="Описание пространства"
        value={currentSpace.description || ""}
        className={cn(className, "text-sm! font-normal text-muted-foreground")}
        onChange={(e) => updateSpace({ description: e.target.value })}
      />
    </div>
  );
};

export default SettingsForm;
