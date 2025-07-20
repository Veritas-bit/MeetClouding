
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastPrimitivesProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast.tsx"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
     if (typeof window !== "undefined") {
        setMounted(true)
     }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ToastPrimitivesProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastPrimitivesProvider>
  )
}
