import { db } from "@workspace/database";
import { invitations } from "@workspace/database/models/invitations";
import { users } from "@workspace/database/models/users";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

import { AcceptInvitationForm } from "./form";

interface AcceptInvitationPageProps {
  params: {
    token: string;
  };
}

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, params.token),
    with: {
      space: true,
    },
  });

  if (!invitation) {
    notFound();
  }

  if (invitation.status !== "Отправлено") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Приглашение недействительно</h1>
        <p className="text-muted-foreground">
          Это приглашение уже было использовано или отменено
        </p>
      </div>
    );
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Приглашение просрочено</h1>
        <p className="text-muted-foreground">
          Срок действия этого приглашения истек
        </p>
      </div>
    );
  }

  // Проверяем, существует ли пользователь
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, invitation.email),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex aspect-square size-14 items-center justify-center rounded-xl bg-gradient-to-b from-primary to-primary/70 text-primary-foreground">
        <GalleryVerticalEnd className="size-8" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Приглашение в пространство</h1>
        <p className="text-muted-foreground text-center">
          {existingUser ? (
            <>
              Для присоединения к пространству{" "}
              <span className="font-medium text-foreground">
                {invitation.space.name}
              </span>{" "}
              нажмите кнопку ниже
            </>
          ) : (
            <>
              Для присоединения к пространству{" "}
              <span className="font-medium text-foreground">
                {invitation.space.name}
              </span>{" "}
              укажите ваше имя
            </>
          )}
        </p>
      </div>
      <AcceptInvitationForm
        token={params.token}
        email={invitation.email}
        isExistingUser={!!existingUser}
      />
    </div>
  );
}
