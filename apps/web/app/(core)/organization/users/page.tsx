import { OrganizationPermission } from "@workspace/database/models/permissions";
import { redirect } from "next/navigation";

import UsersTable from "./table";

import { hasOrganizationPermission } from "@/actions/permissions";
import { getOrganizationUsers, getOrganizationInvites } from "@/actions/organizations";

const UsersPage = async () => {
  const hasPermission = await hasOrganizationPermission(
    OrganizationPermission.MANAGE_MEMBERS,
  );

  if (!hasPermission) {
    redirect("/");
  }

  const users = await getOrganizationUsers();
  const invites = await getOrganizationInvites();

  return (
    <div className="p-4">
      <UsersTable users={users} invites={invites} />
    </div>
  );
};

export default UsersPage;
