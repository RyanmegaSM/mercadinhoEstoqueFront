import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** função executada quando confirmar */
  onConfirm: () => Promise<void> | void;
  /** opcional: trigger que abre o dialogo (se não informado, você deve controlar via open/onOpenChange) */
  trigger?: React.ReactNode;
  /** controlado: open state */
  open?: boolean;
  /** controlado: change handler */
  onOpenChange?: (open: boolean) => void;
  /** opcional: desabilitar o botão de confirmar (por exemplo, enquanto onConfirm está em progresso) */
  confirmDisabled?: boolean;
}

/**
 * ConfirmDialog - modal de confirmação reutilizável.
 *
 * Uso:
 * 1) Não-controlado:
 *    <ConfirmDialog
 *      title="Remover item?"
 *      description="Tem certeza que deseja remover este item permanentemente?"
 *      onConfirm={handleDelete}
 *      trigger={<Button>Remover</Button>}
 *    />
 *
 * 2) Controlado:
 *    const [open, setOpen] = useState(false);
 *    <ConfirmDialog open={open} onOpenChange={setOpen} ... />
 */
export function ConfirmDialog({
  title = "Confirmar operação",
  description = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  confirmDisabled = false,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isControlled =
    typeof openProp === "boolean" && typeof onOpenChangeProp === "function";
  const open = isControlled ? (openProp as boolean) : internalOpen;
  const setOpen = isControlled
    ? (onOpenChangeProp as (v: boolean) => void)
    : setInternalOpen;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (err) {
      // opcional: tratar erro (toast)
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
          <Button
            className="ml-2"
            onClick={handleConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
