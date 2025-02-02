import SettingsForm from "./form";

import { OrganisationIcon } from "@/components/organisation-icon";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrganisationIcon />
      <SettingsForm />
    </div>
  );
}
