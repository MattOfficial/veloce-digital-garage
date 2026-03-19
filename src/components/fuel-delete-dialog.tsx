"use client";

import { useState, useTransition } from "react";
import { deleteFuelLog } from "@/app/actions/fuel";
import { useVehicleStore } from "@/store/vehicle-store";
import { toast } from "sonner";

import { Loader2, TriangleAlert } from "lucide-react";
import { ui } from "@/content/en/ui";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@mattofficial/veloce-ui";

interface FuelDeleteDialogProps {
  logId: string;
  vehicleId: string;
  logDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONFIRM_PHRASE = ui.fuel.deleteDialog.confirmPhrase;

export function FuelDeleteDialog({
  logId,
  vehicleId,
  logDate,
  open,
  onOpenChange,
}: FuelDeleteDialogProps) {
  const { fetchVehicles } = useVehicleStore();
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmText.trim().toLowerCase() === CONFIRM_PHRASE;

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setConfirmText("");
      setError(null);
    }
    onOpenChange(isOpen);
  }

  function handleDelete() {
    if (!isConfirmed) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteFuelLog(logId, vehicleId);
        if (result.success) {
          toast.success(ui.fuel.deleteDialog.deleted);
          fetchVehicles();
          handleClose(false);
        } else {
          setError(result.error || ui.fuel.deleteDialog.failed);
        }
      } catch {
        setError(ui.fuel.deleteDialog.unexpected);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-110 rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
            <TriangleAlert className="h-5 w-5" />
            {ui.fuel.deleteDialog.title}
          </DialogTitle>
          <DialogDescription>
            {ui.fuel.deleteDialog.description(logDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <p className="font-medium mb-1">
              {ui.fuel.deleteDialog.warningTitle}
            </p>
            <p className="text-destructive/80">
              {ui.fuel.deleteDialog.warningBody}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {ui.fuel.deleteDialog.confirmInstruction}{" "}
              <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
                {CONFIRM_PHRASE}
              </span>{" "}
              {ui.fuel.deleteDialog.confirmSuffix}
            </p>
            <Input
              className="rounded-xl"
              placeholder={CONFIRM_PHRASE}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onPaste={(e) => e.preventDefault()} // Force manual typing
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl text-sm font-medium bg-destructive/15 text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              {ui.common.actions.cancel}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-full"
              onClick={handleDelete}
              disabled={!isConfirmed || isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isPending
                ? ui.fuel.deleteDialog.deleting
                : ui.fuel.deleteDialog.deletePermanently}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
