"use client"

import { createContext, useContext, useState, ReactNode, isValidElement, cloneElement } from "react"
import './Dialog.css'

// Small helper to join classes (replacement for cn)
function clsx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ")
}

/* Dialog context to manage open state when using Dialog + DialogTrigger + DialogContent */
const DialogContext = createContext<{open: boolean; setOpen: (v: boolean) => void} | undefined>(undefined)

function Dialog({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: {
  children?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (v: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)
  const isControlled = typeof openProp === "boolean"
  const open = isControlled ? openProp! : internalOpen

  const setOpen = (v: boolean) => {
    if (isControlled) {
      if (typeof onOpenChange === "function") onOpenChange(v)
    } else {
      setInternalOpen(v)
    }
  }

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children }: { children?: ReactNode }) {
  const ctx = useContext(DialogContext)
  if (!ctx) return <>{children}</>
  return (
    <div onClick={() => ctx.setOpen(true)} className="dialog-trigger">
      {children}
    </div>
  )
}

function DialogOverlay({ className }: { className?: string }) {
  const ctx = useContext(DialogContext)
  if (!ctx || !ctx.open) return null
  return <div className={clsx("dialog-overlay", className)} />
}

function DialogContent({ children, className, showCloseButton = true }: { children?: ReactNode; className?: string; showCloseButton?: boolean }) {
  const ctx = useContext(DialogContext)
  if (!ctx || !ctx.open) return null

  return (
    <div className="dialog-portal">
      <DialogOverlay />
      <div className={clsx("dialog-content", className)} role="dialog" aria-modal="true">
        <div className="dialog-scroll">
          {children}
        </div>
        {showCloseButton && <DialogClose />}
      </div>
    </div>
  )
}

function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error("useDialog must be used within a Dialog")
  return ctx
}

function DialogClose({ children, className }: { children?: ReactNode; className?: string }) {
  const { setOpen } = useDialog()

  // If a child element is passed, clone it and attach a click handler that closes the dialog
  if (children && isValidElement(children)) {
    const child: any = children
    const childOnClick = child.props?.onClick
    const mergedOnClick = (e: any) => {
      if (typeof childOnClick === "function") childOnClick(e)
      setOpen(false)
    }
    return cloneElement(child, {
      onClick: mergedOnClick,
      className: clsx(child.props?.className, className),
    })
  }

  // Default button if no children provided
  return null
}

function DialogHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={clsx("dialog-header", className)}>{children}</div>
}

function DialogFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={clsx("dialog-footer", className)}>{children}</div>
}

function DialogTitle({ children, className }: { children?: ReactNode; className?: string }) {
  return <h1 className={clsx("dialog-title", className)}>{children}</h1>
}

function DialogDescription({ children, className }: { children?: ReactNode; className?: string }) {
  return <p className={clsx("dialog-description", className)}>{children}</p>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

export default Dialog
