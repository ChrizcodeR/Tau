import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500",
        secondary:
          "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        destructive:
          "border-red-200 bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500",
        success:
          "border-green-200 bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500",
        warning:
          "border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-200 focus:ring-orange-500",
        info:
          "border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-purple-500",
        outline: 
          "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
