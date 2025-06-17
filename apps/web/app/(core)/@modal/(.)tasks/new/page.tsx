import { Modal } from "@workspace/ui/components/modal";

import NewTask from "@/app/(core)/tasks/components/new-task";

export default function Page() {
  return (
    <Modal title="Создание задачи" defaultOpen backOnClose>
      <NewTask />
    </Modal>
  );
}
