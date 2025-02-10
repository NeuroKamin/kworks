"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { acceptInvitation } from "@/actions/invitations";

interface AcceptInvitationFormProps {
  token: string;
  email: string;
  isExistingUser: boolean;
}

export function AcceptInvitationForm({
  token,
  email,
  isExistingUser,
}: AcceptInvitationFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await acceptInvitation(token, !isExistingUser ? name : undefined);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла ошибка при принятии приглашения");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      {!isExistingUser && (
        <div className="space-y-2">
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Фамилия Имя"
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive text-center">{error}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || (!isExistingUser && !name)}
      >
        {isLoading ? "Обработка..." : "Принять приглашение"}
      </Button>
    </form>
  );
}
