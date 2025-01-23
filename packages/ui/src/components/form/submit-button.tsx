'use client'

import { useFormStatus } from "react-dom";
import { Button } from "../button";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function SubmitButton({ children, className, tabIndex, autoFocus }: { children?: ReactNode, className?: string, tabIndex?: number, autoFocus?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={cn("w-full justify-center", className)} loading={pending} tabIndex={tabIndex} autoFocus={autoFocus}>
      {children}
    </Button>
  );
}