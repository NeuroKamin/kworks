"use client";

import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";

export interface ModalProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  backOnClose?: boolean;
  snapPoints?: Array<string | number>;
  activeSnapPoint?: string | number | null;
  snapToSequentialPoint?: boolean;
}

function Modal(props: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const onOpenChange = (open: boolean) => {
    props.onOpenChange?.(open);
    if (props.backOnClose) {
      router.back();
    }
  };

  if (isDesktop) {
    return (
      <Dialog
        open={props.open}
        onOpenChange={onOpenChange}
        defaultOpen={props.defaultOpen}
      >
        <DialogContent>
          <DialogHeader>
            {props.title ? (
              <DialogTitle>{props.title}</DialogTitle>
            ) : (
              <VisuallyHidden asChild>
                <DialogTitle>Диалоговое окно</DialogTitle>
              </VisuallyHidden>
            )}
            {props.description && (
              <DialogDescription>{props.description}</DialogDescription>
            )}
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={onOpenChange} {...props}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          {props.title ? (
            <DrawerTitle>{props.title}</DrawerTitle>
          ) : (
            <VisuallyHidden asChild>
              <DrawerTitle>Диалоговое окно</DrawerTitle>
            </VisuallyHidden>
          )}
          {props.description && (
            <DrawerDescription>{props.description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="px-4 pb-4">{props.children}</div>
      </DrawerContent>
    </Drawer>
  );
}

export { Modal };
