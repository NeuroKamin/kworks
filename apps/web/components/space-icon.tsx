import { DynamicIcon } from "@workspace/ui/components/dynamic-icon";
export const SpaceIcon = ({ icon }: { icon: string }) => {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
      <DynamicIcon icon={icon} />
    </div>
  );
};
