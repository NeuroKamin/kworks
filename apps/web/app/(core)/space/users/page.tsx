import { SpacePermission } from "@workspace/database/models/permissions";
import { redirect } from "next/navigation";

import UsersTable from "./table";

import { hasSpacePermission } from "@/actions/permissions";
import { getSpaceUsers, getSpaceInvites } from "@/actions/spaces";

const UsersPage = async () => {
  const hasPermission = await hasSpacePermission(
    SpacePermission.MANAGE_MEMBERS,
  );

  if (!hasPermission) {
    redirect("/");
  }

  const users = await getSpaceUsers();
  const invites = await getSpaceInvites();

  return (
    <div className="p-4">
      <UsersTable users={users} invites={invites} />
    </div>
  );
};

export default UsersPage;
