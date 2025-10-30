import React from "react"
import "./MC.css"

type Variant = "default" | "block" | "ghost" | "solid"
type Size = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

function MCButton({ variant = "default", size = "default", asChild = false, className, children, ...props }: ButtonProps) {
  const classes = ["btn", "mc-style", `variant-${variant}`, `size-${size}`, className].filter(Boolean).join(" ")

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
interface MCCodeProps {
  children: React.ReactNode
  variant?: Variant
}
function MCCode({ variant = "default", children }: MCCodeProps) {
  return (
    <code className={`mc-style variant-${variant}`}>
      {children}
    </code>
  )
}

interface MCSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: Variant
}
function MCSelect({ variant = "default", children, className, ...props }: MCSelectProps) {
  const classes = ["mc-select", "mc-style", `variant-${variant}`, className].filter(Boolean).join(" ")
  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}

interface MCInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant
}
function MCInput({ variant = "default", className, ...props }: MCInputProps) {
  const classes = ["mc-input", "mc-style", `variant-${variant}`, className].filter(Boolean).join(" ")
  return (
    <input className={classes} {...props} />
  )
}


interface MCAnchoredButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
}
function MCAnchoredButton({ variant = "default", href, children, className, ...props }: MCAnchoredButtonProps) {
  const classes = ["btn", "mc-style", `variant-${variant}`, className].filter(Boolean).join(" ")
  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  )
}

// Returns a div styled as a Minecraft slider
interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
function MCSlider({ variant = "default", checked, onChange, className, ...props  }: SliderProps) {
  const classes = ["mc-slider", "mc-style", `variant-${variant}`, className].filter(Boolean).join(" ")
  return (
    <div className={classes} {...props}>
      <label className="switch">
        <input
          type="checkbox"
          onChange={onChange}
          checked={checked}
        />
        <span className="slider"></span>
      </label>
    </div>
  )
}

// Returns a div styled as a Checkbox
interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  subtitle?: string
}
function MCCheckbox({ variant = "default", checked, onChange, className, subtitle, children, ...props }: CheckboxProps) {
  const classes = ["mc-checkbox", "mc-style", `variant-${variant}`, className].filter(Boolean).join(" ")
  return (
    <div className={classes} {...props}>
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      {
        subtitle ? <span className="subtitle">{subtitle}</span> : null
      }
      {children}
    </div>
  )
}

interface AskButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  icon?: React.ReactNode
}
function MCAskButton({ variant = "default", icon="?",...props }: AskButtonProps) {
  const classes = ["mc-ask-button", "mc-style", `variant-${variant}`].filter(Boolean).join(" ")
  return (
    <div className={classes} {...props}>
      <h1>{icon}</h1>
    </div>
  )
}

export {
  MCButton,
  MCCode,
  MCSelect,
  MCInput,
  MCAnchoredButton,
  MCSlider,
  MCCheckbox,
  MCAskButton
}
