import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./badge.module.css";

export interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  asChild?: boolean;
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  const variantClass = {
    default: styles.variantDefault,
    secondary: styles.variantSecondary,
    destructive: styles.variantDestructive,
    outline: styles.variantOutline,
  }[variant];

  return (
    <Comp
      data-slot="badge"
      className={`${styles.badge} ${variantClass} ${className || ""}`.trim()}
      {...props}
    />
  );
}

export { Badge };
