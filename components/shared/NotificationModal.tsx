"use client";

import { Dialog } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { Button } from "@/components/shared/Button";

type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmColor?: ComponentColor;
  loading?: boolean;
};

type ComponentColor = React.ComponentProps<typeof Button>["color"];

export function NotificationModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Dismiss",
  onConfirm,
  onCancel,
  confirmColor = "indigo",
  loading = false,
}: NotificationModalProps) {
  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        maxWidth="440px"
        className="relative overflow-hidden border border-white/10 bg-[#070b14] p-6 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_45%)]"
        />

        <div className="relative z-10">
          <div className="flex items-start gap-3">
            {icon && (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-indigo-500/15 text-indigo-200">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold tracking-tight text-white">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-2 text-sm leading-6 text-zinc-400">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              size="2"
              variant="soft"
              color="gray"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                size="2"
                color={confirmColor}
                onClick={onConfirm}
                disabled={loading}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
