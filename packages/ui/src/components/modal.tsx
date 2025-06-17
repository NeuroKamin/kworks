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
import React from "react";

export interface ModalProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  backOnClose?: boolean;
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
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
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
    <Drawer
      open={props.open}
      onOpenChange={onOpenChange}
      defaultOpen={props.defaultOpen}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          {props.title && <DrawerTitle>{props.title}</DrawerTitle>}
          {props.description && (
            <DrawerDescription>{props.description}</DrawerDescription>
          )}
        </DrawerHeader>
        {props.children}
      </DrawerContent>
    </Drawer>
  );
}

export { Modal };
