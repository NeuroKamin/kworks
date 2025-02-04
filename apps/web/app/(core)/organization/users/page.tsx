import { OrganizationPermission } from "@workspace/database/models/permissions";
import { redirect } from "next/navigation";

import WIP from "@/components/wip";
import { hasOrganizationPermission } from "@/actions/permissions";
const UsersPage = async () => {
  const hasPermission = await hasOrganizationPermission(
    OrganizationPermission.MANAGE_MEMBERS,
  );

  if (!hasPermission) {
    redirect("/");
  }

  return <WIP />;
};

export default UsersPage;
