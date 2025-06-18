import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Check } from "lucide-react";

import { getSpaceUsers } from "@/actions/spaces";
import { auth } from "@/auth";

function SpaceUsersSkeleton() {
  return (
    <div className="h-[250px] border rounded-md p-2">
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function SpaceUsers() {
  const users = await getSpaceUsers();
  const session = await auth();

  const getUserInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email ? email.slice(0, 2).toUpperCase() : "OO";
  };

  if (users.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Нет доступных пользователей
      </div>
    );
  }

  return (
    <ScrollArea className="h-[250px] border rounded-md p-2">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .user-selector input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }
          .user-selector input[type="checkbox"]:checked ~ .user-content .user-avatar {
            box-shadow: 0 0 0 2px hsl(var(--primary)), 0 0 0 4px hsl(var(--background));
          }
          .user-selector input[type="checkbox"]:checked ~ .user-content .check-indicator {
            display: flex;
          }
          .check-indicator {
            display: none;
          }
        `,
        }}
      />
      <div className="space-y-2">
        {users.map((user) => {
          const isCurrentUser = session?.user?.id === user.id;

          return (
            <label
              key={user.id}
              className="user-selector flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors relative"
            >
              <input
                type="checkbox"
                name="selectedUsers"
                value={user.id}
                defaultChecked={isCurrentUser}
                disabled={isCurrentUser}
              />
              <div className="user-content flex items-center space-x-3 w-full">
                <div className="relative">
                  <Avatar className="user-avatar h-8 w-8 transition-all">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="check-indicator absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name || user.email}
                    {isCurrentUser && " (Вы)"}
                  </p>
                  {user.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </label>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export { SpaceUsersSkeleton, SpaceUsers };
