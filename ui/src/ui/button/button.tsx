import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import styles from "./button.module.css"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"

  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "icon-sm"
    | "icon-lg"

  asChild?: boolean
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Comp
      data-slot="button"
      className={buttonClassName}
      {...props}
    />
  )
}