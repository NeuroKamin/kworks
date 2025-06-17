// TODO: Это только для теста, удалить после реализации

import { getSpaceUsers } from "@/actions/spaces";

async function SpaceUsers() {
  const users = await getSpaceUsers();

  // TODO: Для теста
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export { SpaceUsers };
