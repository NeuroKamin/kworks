import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { getSpaceUsers } from "@/actions/spaces";

function SpaceUsersSkeleton() {
  return (
    <div className="border rounded-md p-2">
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-2">
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
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

  await new Promise((resolve) => setTimeout(resolve, 500));

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
    <ScrollArea className="max-h-48 border rounded-md p-2">
      <div className="space-y-2">
        {users.map((user) => (
          <label
            key={user.id}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
            htmlFor={`user-${user.id}`}
          >
            <Checkbox id={`user-${user.id}`} />
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-xs">
                {getUserInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.name || user.email}
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
          </label>
        ))}
      </div>
    </ScrollArea>
  );
}

export { SpaceUsersSkeleton, SpaceUsers };
