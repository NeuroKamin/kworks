"use client";

import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useOrganisation } from "@/store/organistaion";

const className =
  "leading-none h-auto shadow-none ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-xl! p-0";

const SettingsForm = () => {
  const { currentOrganisation, updateOrganisation } = useOrganisation();

  return (
    <div className="flex flex-col gap-1 mt-2">
      <Input
        placeholder="Название организации"
        value={currentOrganisation.name}
        className={className}
        onChange={(e) => updateOrganisation({ name: e.target.value })}
      />
      <Input
        placeholder="Описание организации"
        value={currentOrganisation.description || ""}
        className={cn(className, "text-sm! font-normal text-muted-foreground")}
        onChange={(e) => updateOrganisation({ description: e.target.value })}
      />
    </div>
  );
};

export default SettingsForm;
