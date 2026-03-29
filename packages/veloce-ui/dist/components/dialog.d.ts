import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
declare function DialogOverlay({ className, overlayClassName, backdropBlur, backdropOpacity, zIndex, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay> & {
    overlayClassName?: string;
    backdropBlur?: "none" | "sm" | "md" | "lg";
    backdropOpacity?: string;
    zIndex?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogContent({ className, contentClassName, children, showCloseButton, closeButtonClassName, rounded, borderOpacity, zIndex, overlayZIndex, overlay, overlayProps, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    closeButtonClassName?: string;
    contentClassName?: string;
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    borderOpacity?: string;
    zIndex?: string;
    overlayZIndex?: string;
    overlay?: React.ComponentType<React.ComponentProps<typeof DialogOverlay>>;
    overlayProps?: React.ComponentProps<typeof DialogOverlay>;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({ className, showCloseButton, children, ...props }: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
//# sourceMappingURL=dialog.d.ts.map