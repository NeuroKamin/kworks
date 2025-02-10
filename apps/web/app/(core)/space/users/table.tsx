"use client";

import { TInvitation, TUserWithRole } from "@workspace/database/types";
import useColumns from "@workspace/ui/hooks/use-columns";
import { DataTable } from "@workspace/ui/components/data-table";
import { Button } from "@workspace/ui/components/button";
import { IconPlus, IconTrash, IconRefresh } from "@tabler/icons-react";
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
import moment from "moment";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { toast } from "sonner";

import {
  inviteUsersToSpace,
  deleteInvitation,
  resendInvitation,
} from "@/actions/spaces";

const UsersTable = ({
  users,
  invites: initialInvites,
}: {
  users: TUserWithRole[];
  invites: TInvitation[];
}) => {
  const [tab, setTab] = useQueryState("tab");
  const [invites, setInvites] = useState(initialInvites);
  const [isOpen, setIsOpen] = useState(false);
  const { pending } = useFormStatus();

  const handleDeleteInvitation = async (id: string) => {
    return toast.promise(
      async () => {
        await deleteInvitation(id);
        setInvites((prev) => prev.filter((invite) => invite.id !== id));
      },
      {
        loading: "Удаление приглашения...",
        success: "Приглашение удалено",
        error: "Не удалось удалить приглашение",
      },
    );
  };

  const handleResendInvitation = async (id: string) => {
    return toast.promise(
      async () => {
        await resendInvitation(id);
        setInvites((prev) =>
          prev.map((invite) =>
            invite.id === id
              ? {
                  ...invite,
                  status: "Отправлено",
                  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                }
              : invite,
          ),
        );
      },
      {
        loading: "Отправка приглашения...",
        success: "Приглашение отправлено повторно",
        error: "Не удалось отправить приглашение",
      },
    );
  };

  const userColumn = useColumns<TUserWithRole>(
    {
      columns: [
        {
          header: "Имя",
          accessorKey: "name",
        },
        {
          header: "Роль",
          accessorKey: "role",
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
        {
          header: "Действует до",
          accessorKey: "expiresAt",
          cell: ({ row }) =>
            moment(row.original.expiresAt).format("DD.MM.YYYY HH:mm"),
        },
      ],
      hideSelection: true,
      actions: (props) => (
        <>
          <form
            action={async () => {
              await handleResendInvitation(props.row.original.id);
            }}
          >
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full">
                <IconRefresh size={16} className="mr-2" />
                Переотправить
              </button>
            </DropdownMenuItem>
          </form>

          <form
            action={async () => {
              await handleDeleteInvitation(props.row.original.id);
            }}
          >
            <DropdownMenuItem
              asChild
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <button type="submit" className="w-full">
                <IconTrash size={16} className="mr-2" />
                Удалить
              </button>
            </DropdownMenuItem>
          </form>
        </>
      ),
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
          <form action={inviteUsersToSpace} className="grid gap-4">
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
