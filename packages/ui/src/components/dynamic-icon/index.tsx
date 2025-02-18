import { cn } from "@workspace/ui/lib/utils";
import * as Icons from "@tabler/icons-react";

export const DynamicIcon = ({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) => {
  // @ts-ignore
  const Icon = Icons[icon];

  if (!Icon) {
    return (
      <div
        className={cn("text-md flex items-center justify-center", className)}
      >
        {icon}
      </div>
    );
  }

  return <Icon className={cn("size-4", className)} />;
};
