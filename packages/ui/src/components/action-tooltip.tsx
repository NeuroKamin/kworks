interface ActionTooltipProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  trigger: React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  sideOffset?: number;
  alignOffset?: number;
  hotkey?: string;
}

export const ActionTooltip = ({
  title,
  description,
  trigger,
  asChild = false,
  side = "top",
  align = "center",
  className,
  sideOffset = 4,
  alignOffset = 0,
  hotkey,
}: ActionTooltipProps) => {
  const Wrapper = asChild ? "div" : "button";

  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        <Wrapper className={cn("outline-none", className)}>{trigger}</Wrapper>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="px-3 py-2 text-sm bg-background border shadow-md"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">{title}</p>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </div>
          {hotkey && (
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground opacity-100">
              {hotkey}
            </kbd>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
