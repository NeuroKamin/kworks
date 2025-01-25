"use client";

import { Input } from "@workspace/ui/components/input";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

import { sendPin } from "@/actions/auth";

const duration = 0.3;
const delay = 0.1;
const bounce = { type: "spring", bounce: 0.3 };

export const LoginForm = () => {
  const [show, setShow] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const onSubmit = async (e: FormData) => {
    const email = e.get("email") as string;
    await sendPin(email);
    setShowPin(true);
    setShow(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 700);
  }, []);

  return (
    <form action={onSubmit}>
      <div className="flex flex-col gap-3">
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
              exit={{ height: 0 }}
              transition={{ duration: 0.3, height: bounce }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <motion.h1
                  className="text-xl text-center font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                  transition={{
                    duration,
                    delay,
                    y: bounce,
                  }}
                >
                  Введите ваш email для входа в систему
                </motion.div>
              </div>

              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration,
                    delay: delay * 2,
                    y: bounce,
                  }}
                >
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
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
            <motion.div>
              <InputOTP maxLength={6}>
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
      </div>
    </form>
  );
};
