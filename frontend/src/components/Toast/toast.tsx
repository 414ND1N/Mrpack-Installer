"use client"

import * as React from "react"
import "./toast.css"

const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // Un provider ligero: podría ampliarse para manejo global de toasts
    return <div>{children}</div>
}

const ToastViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={className ?? "toast-viewport"} data-testid="toast" {...props} />
    )
)
ToastViewport.displayName = "ToastViewport"

const Toast = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "destructive"
        open?: boolean
        onOpenChange?: (open: boolean) => void
    }
>(
    ({ className, variant = "default", children, open = true, onOpenChange, ...props }, ref) => {
        const classes = ["toast", variant === "destructive" ? "toast--destructive" : "", className]
            .filter(Boolean)
            .join(" ")

        // Notify consumer when `open` changes (used by use-toast to auto-dismiss)
        React.useEffect(() => {
            if (typeof onOpenChange === "function") {
                try {
                    onOpenChange(open)
                } catch (e) {
                    // swallow errors from consumer callback
                }
            }
        }, [open, onOpenChange])

        return (
            // `open` and `onOpenChange` are intentionally not forwarded to the DOM to avoid React warnings
            <div ref={ref} className={classes} data-testid="toast-item" {...props}>
                {children}
            </div>
        )
    }
)
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, children, ...props }, ref) => (
        <button ref={ref} className={["toast__action", className].filter(Boolean).join(" ")} {...props}>
            {children}
        </button>
    )
)
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => (
        <button ref={ref} className={["toast__close", className].filter(Boolean).join(" ")} {...props} aria-label="close" />
    )
)
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3 ref={ref} className={["toast__title", className].filter(Boolean).join(" ")} {...props}>
            {children}
        </h3>
    )
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => (
        <p ref={ref} className={["toast__description", className].filter(Boolean).join(" ")} {...props}>
            {children}
        </p>
    )
)
ToastDescription.displayName = "ToastDescription"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
    type ToastProps,
    type ToastActionElement,
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
}
