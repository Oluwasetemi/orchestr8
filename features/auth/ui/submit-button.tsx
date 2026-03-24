"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  label: string
  pendingLabel: string
}

export function SubmitButton({ label, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="h-11 w-full rounded-xl font-semibold tracking-wide transition-opacity disabled:opacity-60"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
