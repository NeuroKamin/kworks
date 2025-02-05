"use client";

import { TInvitation, TUser } from "@workspace/database/types";
import useColumns from "@workspace/ui/hooks/use-columns";
import { DataTable } from "@workspace/ui/components/data-table";
import { Button } from "@workspace/ui/components/button";
import { IconPlus } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Textarea } from "@workspace/ui/components/textarea";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";
import { useFormStatus } from "react-dom";
import { useQueryState } from "nuqs";

import { inviteUsersToOrganization } from "@/actions/organizations";

const UsersTable = ({
  users,
  invites,
}: {
  users: TUser[];
  invites: TInvitation[];
}) => {
  const [tab, setTab] = useQueryState("tab");

  const [isOpen, setIsOpen] = useState(false);
  const { pending } = useFormStatus();

  const userColumn = useColumns<TUser>(
    {
      columns: [
        {
          header: "Имя",
          accessorKey: "name",
        },
        {
          header: "Email",
          accessorKey: "email",
        },
      ],
      hideSelection: true,
    },
    [],
  );

  const inviteColumn = useColumns<TInvitation>(
    {
      columns: [
        { header: "Статус", accessorKey: "status" },
        { header: "Email", accessorKey: "email" },
      ],
      hideSelection: true,
    },
    [],
  );

  const actionBar = () => (
    <div className="flex items-center gap-2">
      <Button size={"sm"} onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2" />
        Добавить
      </Button>

      <Tabs value={tab ?? "users"} className="w-[400px]" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="invites">Приглашения</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  let table = null;

  if (tab === "users" || !tab) {
    table = <DataTable columns={userColumn} data={users} actions={actionBar} />;
  } else {
    table = (
      <DataTable columns={inviteColumn} data={invites} actions={actionBar} />
    );
  }

  return (
    <>
      {table}
      <Dialog open={isOpen} onOpenChange={pending ? undefined : setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавление участников</DialogTitle>
            <DialogDescription>
              Укажите email участников, которых вы хотите добавить
            </DialogDescription>
          </DialogHeader>
          <form action={inviteUsersToOrganization} className="grid gap-4">
            <Textarea
              name="emails"
              placeholder="Email участников, разделенные новой строчкой"
              className="h-40"
              required
            />
            <DialogFooter>
              <SubmitButton>Отправить приглашение</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTable;
