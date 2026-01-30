"use client"

import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const toastStore = {
  toasts: [] as ToastProps[],
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },

  addToast(toast: Omit<ToastProps, "id">) {
    const id = Math.random().toString(36).substr(2, 9)
    this.toasts = [{ ...toast, id }, ...this.toasts].slice(0, TOAST_LIMIT)
    this.listeners.forEach((listener) => listener())

    setTimeout(() => {
      this.removeToast(id)
    }, TOAST_REMOVE_DELAY)

    return id
  },

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.listeners.forEach((listener) => listener())
  },
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>(toastStore.toasts)

  React.useEffect(() => {
    return toastStore.subscribe(() => {
      setToasts([...toastStore.toasts])
    })
  }, [])

  return {
    toasts,
    toast: (props: Omit<ToastProps, "id">) => toastStore.addToast(props),
    dismiss: (id: string) => toastStore.removeToast(id),
  }
}

export { type ToastProps }
