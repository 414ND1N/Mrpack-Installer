"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/Toast/toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast
              key={id}
              {...props}
              open={props.open ?? true}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                // Only dismiss when clicking the toast container itself, not its children
                if (e.currentTarget === e.target) {
                  dismiss(id)
                }
              }}
            >
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose onClick={() => dismiss(id)} />
            </Toast>
          )
        })}
      </ToastViewport>
    </ToastProvider>
  )
}
