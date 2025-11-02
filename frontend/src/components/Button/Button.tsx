import React from "react"
import "./Button.css"

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type Size = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

function Button({ variant = "default", size = "default", asChild = false, className, children, ...props }: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(" ")

  if (asChild && React.isValidElement(children)) {
    // clone child and add classes/props
    return React.cloneElement(children as any, {
      className: [children.props.className, classes].filter(Boolean).join(" "),
      ...props,
    })
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export { Button }
