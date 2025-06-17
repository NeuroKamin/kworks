import { Modal } from "@workspace/ui/components/modal";

import NewProject from "@/app/(core)/projects/components/new-project";

export default function Page() {
  return (
    <Modal defaultOpen backOnClose>
      <NewProject />
    </Modal>
  );
}
