"use client"

import * as React from "react"
import "./separator.css"

type Orientation = "horizontal" | "vertical"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation
  decorative?: boolean
  borderless?: boolean
}

function Separator({ className, orientation = "horizontal", decorative = true, borderless = false, ...props }: SeparatorProps) {
  const cls = ["sep", `sep--${orientation}`, borderless == true ? 'borderless' : '', className].filter(Boolean).join(" ")

  // Use role=separator for accessibility; decorative separators can be aria-hidden
  const role = decorative ? "separator" : undefined

  // aria-orientation is valid when role=separator
  const ariaOrientation = role === "separator" ? orientation : undefined

  return <div {...props} role={role} aria-orientation={ariaOrientation} className={cls} />
}

export { Separator }
