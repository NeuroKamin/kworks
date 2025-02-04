"use client";

import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useOrganization } from "@/store/organistaion";
import { OrganizationIcon } from "@/components/organization-icon";

const className =
  "leading-none h-auto shadow-none ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-xl! p-0";

const SettingsForm = () => {
  const { currentOrganization, updateOrganization } = useOrganization();

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-2">
        <OrganizationIcon />
        <Input
          placeholder="Название организации"
          value={currentOrganization.name}
          className={cn(className, "text-3xl! font-bold")}
          onChange={(e) => updateOrganization({ name: e.target.value })}
        />
      </div>
      <Input
        placeholder="Описание организации"
        value={currentOrganization.description || ""}
        className={cn(className, "text-sm! font-normal text-muted-foreground")}
        onChange={(e) => updateOrganization({ description: e.target.value })}
      />
    </div>
  );
};

export default SettingsForm;
