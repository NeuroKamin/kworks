"use client";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      <LogOut />
      Выйти
    </DropdownMenuItem>
  );
}
