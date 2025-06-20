"use client";

import { Input } from "@workspace/ui/components/input";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { IconLoader2 } from "@tabler/icons-react";

import { sendPin, signIn } from "@/actions/auth";

const duration = 0.3;
const delay = 0.1;
const bounce = { type: "spring", bounce: 0.3 };

export const LoginForm = () => {
  const [show, setShow] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);

  const [name, setName] = useState("");

  const onSubmit = async (e: FormData) => {
    const email = e.get("email") as string;
    setMail(email);
    const exist = await sendPin(email);
    setIsEmailExist(exist);
    setShow(false);

    setTimeout(() => {
      setShowPin(true);
    }, 500);
  };

  const onPinComplete = async (value: string) => {
    setIsLoading(true);
    try {
      const result = await signIn({
        email: mail,
        pin: value,
        name,
        redirect: false,
      });

      if (result.error) {
        setError("Неверный код подтверждения");
        setIsLoading(false);

        return;
      }

      router.replace("/");
    } catch (error) {
      setError("Произошла ошибка при входе");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 700);
  }, []);

  return (
    <form action={onSubmit} className="w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
        >
          <GalleryVerticalEnd className="mx-auto size-14 p-3 bg-gradient-to-b from-primary to-primary/70 text-primary-foreground rounded-xl" />
        </motion.div>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, height: bounce }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <motion.h1
                  className="text-xl text-center font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration,
                    y: bounce,
                  }}
                >
                  Добро пожаловать
                </motion.h1>
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration,
                    delay,
                    y: bounce,
                  }}
                >
                  Введите email для входа в систему
                </motion.div>
              </div>

              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration,
                    delay: delay * 2,
                    y: bounce,
                  }}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration,
                    delay: delay * 3,
                    y: bounce,
                  }}
                >
                  <SubmitButton>Продолжить</SubmitButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, height: bounce }}
              className="flex flex-col gap-6 items-center"
            >
              <div className="flex flex-col gap-1">
                <motion.h1
                  className="text-xl text-center font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: delay * 2,
                    duration,
                    y: bounce,
                  }}
                >
                  Еще немного
                </motion.h1>
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration,
                    delay: delay * 3,
                    y: bounce,
                  }}
                >
                  {isEmailExist
                    ? "Введите код из письма"
                    : "Введите свое имя и код из письма"}
                </motion.div>
                {error && (
                  <motion.div
                    className="text-center text-sm text-destructive"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration,
                      delay: delay * 3,
                      y: bounce,
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </div>
              {!isEmailExist && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration,
                    delay: delay * 3,
                    y: bounce,
                  }}
                >
                  <Input
                    type="text"
                    name="name"
                    placeholder="Фамилия Имя"
                    className="w-full"
                    autoComplete="off"
                    required
                    value={name}
                    disabled={isLoading}
                    onChange={(e) => setName(e.target.value)}
                  />
                </motion.div>
              )}

              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
                  </motion.div>
                )}
                {!isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration,
                      delay: delay * 3,
                      y: bounce,
                    }}
                  >
                    <InputOTP
                      maxLength={6}
                      onComplete={onPinComplete}
                      onChange={() => {
                        setError("");
                      }}
                      autoFocus
                      disabled={isLoading || (!name && !isEmailExist)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};
